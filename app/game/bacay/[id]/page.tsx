"use client";

import "../../game.css";
import CoverLayout from "../../cover";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

const GameBaCayPage = () => {
  const router = useRouter();
  const { id } = useParams(); // Get the ID from the dynamic route
  const [roomName, setRoomName] = useState(`Room ${Math.floor(Math.random() * 1000)}`);
  const [betAmount, setBetAmount] = useState<number | "">(1000); // Default bet amount is 1000
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);

  const generatePlayerId = (): string =>
    "player" +
    Date.now().toString(36) +
    Math.random().toString(36).substring(2);
  const generateGameId = (): string =>
    "game" +
    Date.now().toString(36) +
    Math.random().toString(10).substring(2) +
    id;

  const addNewPlayer = (name: string) => {
    if (name === "") {
      alert("Tên người chơi không được để trống");
      return;
    }

    if (players.some((p) => p.name === name)) {
      alert("Người chơi đã tồn tại");
      return;
    }

    players.push({
      id: generatePlayerId(),
      name: name,
      isDealer: false,
      wallet: 0,
    });

    setPlayerName("");
    console.log("players", players);
  };

  const removePlayer = (name: string) => {
    if (players.some((p) => p.name === name)) {
      setPlayers((prevPlayers) => prevPlayers.filter((p) => p.name !== name));
    }
  };

  const setDealer = (name: string) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((p) => ({
        ...p,
        isDealer: p.name === name,
      }))
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addNewPlayer(playerName);
    }
  };

  const createRoom = () => {
    // check name
    if (roomName === "") {
      alert("Tên phòng không được để trống");
      return;
    }
    // check bet
    if (betAmount === "" || Number(betAmount) < 1) {
      alert("Mức cược phải lớn hơn 0");
      return;
    }
    // check player
    if (players.length < 2) {
      alert("Vui lòng thêm ít nhất 2 người chơi");
      return;
    }
    // check dealer
    if (!players.some((p) => p.isDealer)) {
      alert("Chưa chọn người cầm chương");
      return;
    }

    // Create new room
    const newRoom: Room = {
      id: Number(id),
      betAmount: betAmount,
      name: roomName,
      players: players,
      games: [
        {
          id: generateGameId(),
          roomId: Number(id),
          seq: 0,
          gameDetails: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    // save info to localStorage
    localStorage.setItem("on-going", JSON.stringify(newRoom));
    console.log("ok");

    // move to lobby page
    router.push(`/game/bacay/${id}/lobby`);
  };

  return (
    <CoverLayout>
      <div className="w-full h-auto flex flex-col justify-center items-center">
        <h2 className="text-xl font-bold mt-6">Thông tin cơ bản</h2>

        <div className="min-w-[85vw] w-full">
          <div className="gradient-border-100 gb-full w-11/12 h-auto p-4 mt-4 flex flex-col justify-center items-start gap-2">
            <div className="flex flex-row justify-between w-full">
              <p className="text-md">ID: {id}</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                >
                  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0m.6-3h16.8M3.6 15h16.8" />
                  <path d="M11.5 3a17 17 0 0 0 0 18m1-18a17 17 0 0 1 0 18" />
                </g>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Tên phòng"
              className="m-textbox"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Mức cược"
              className="m-textbox"
              value={betAmount}
              onChange={(e) =>
                setBetAmount(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              } // Convert to number}
            />
          </div>
        </div>

        <h2 className="text-xl font-bold mt-4">Thông tin người chơi</h2>

        <div className="min-w-[85vw]">
          <div className="gradient-border-100 gb-full w-11/12 h-auto p-4 mt-4 flex flex-col justify-center items-start gap-2">
            <div className="flex flex-row justify-between w-full">
              <p className="text-md">Tổng số người chơi: {players.length}</p>
            </div>

            <div className="flex flex-col justify-start items-center w-full z-10">
              {players.length === 0
                ? ""
                : players.map((player, index) => (
                    <div
                      key={player.name}
                      className="flex flex-row justify-between w-full"
                    >
                      <div className="text-md flex flex-row justify-start gap-2">
                        <button onClick={() => removePlayer(player.name)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="none"
                              stroke="#d00"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1"
                              d="M18 6L6 18M6 6l12 12"
                            />
                          </svg>
                        </button>
                        <p>
                          {index + 1}. {player.name}
                        </p>
                      </div>
                      <div
                        className="icon-set-dealer"
                        onClick={(e) => setDealer(player.name)}
                      >
                        {player.isDealer ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#00dd10"
                              fillRule="evenodd"
                              d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <g fill="none" stroke="gray" strokeWidth="1">
                              <circle cx="12" cy="12" r="9" />
                              <path d="m8 12l3 3l5-6" />
                            </g>
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
            </div>

            <div className="flex flex-row justify-between w-full gap-2 items-center">
              <input
                type="text"
                placeholder="Tên người chơi"
                className="m-textbox"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <input
                type="submit"
                className="btn-primary text-center text-white"
                value={"Thêm"}
                onClick={(e) => addNewPlayer(playerName)}
              />
            </div>

            <div className="flex flex-row w-full justify-start items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#00dd10"
                  fillRule="evenodd"
                  d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-md">Cầm chương</p>
            </div>
          </div>
        </div>

        <input
          type="submit"
          className="btn-primary w-[150px] h-[40px] mt-4 text-white text-center"
          value={"TẠO PHÒNG"}
          onClick={createRoom}
        />
      </div>
    </CoverLayout>
  );
};

export default GameBaCayPage;
