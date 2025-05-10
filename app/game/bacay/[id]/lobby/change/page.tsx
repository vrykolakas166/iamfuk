"use client";

import React from "react";
import "../../../../game.css";
import CoverLayout from "../../../../cover";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const GameBaCayEditPage = () => {
  const router = useRouter();
  const [roomData, setRoomData] = useState<Room | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const ongame = localStorage.getItem("on-going");
    if (ongame) {
      try {
        const data = JSON.parse(ongame);
        if (data?.id) {
          setRoomData(data);
        } else {
          router.back(); // Go back if data is invalid
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        router.back(); // Go back if JSON is invalid
      }
    } else {
      router.back(); // Go back if no data
    }
  }, [router]);

  useEffect(() => {
    if (roomData) {
      setPlayers([...roomData.players]);
    }
  }, [roomData]);

  const generatePlayerId = (): string =>
    "player" +
    Date.now().toString(36) +
    Math.random().toString(36).substring(2);

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
  };

  const removePlayer = (name: string) => {
    if (players.some((p) => p.name === name)) {
      setPlayers(players.filter((p) => p.name !== name));
    }
  };

  const setDealer = (name: string) => {
    setPlayers(
      players.map((p) => ({
        ...p,
        isDealer: p.name === name,
      }))
    );
  };

  const restorePlayers = () => {
    if (roomData) {
      setPlayers(roomData?.players);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addNewPlayer(playerName);
    }
  };

  const updateRoom = () => {
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
    // Update current room
    if (roomData) {
      roomData.players = players;

      // save info to localStorage
      localStorage.setItem("on-going", JSON.stringify(roomData));

      // move to lobby page
      router.push(`/game/bacay/${roomData.id}/lobby`);
    }
  };

  return (
    <CoverLayout>
      <div className="w-full h-auto flex flex-col justify-center items-center">
        <h2 className="text-xl font-bold mt-6">Thông tin cơ bản</h2>

        <div className="min-w-[85vw]">
          <div className="gradient-border-100 gb-full w-11/12 h-auto p-4 mt-4 flex flex-col justify-center items-start gap-2">
            <div className="flex flex-row justify-between w-full">
              <p className="text-md">ID: {roomData?.id}</p>
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
            <p>Tên phòng: {roomData?.name}</p>
            <p>Mức cược: {roomData?.betAmount}</p>
          </div>
        </div>

        <h2 className="text-xl font-bold mt-4">Thông tin người chơi</h2>

        <div className="min-w-[85vw]">
          <div className="gradient-border-100 gb-full w-11/12 h-auto p-4 mt-4 flex flex-col justify-center items-start gap-2">
            <div className="flex flex-row justify-between w-full">
              <p className="text-md">Tổng số người chơi: {players.length}</p>
              <div
                className="cursor-pointer hover:scale-[1.2] z-10"
                title="Cài lại"
                onClick={restorePlayers}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 16c1.671 0 3-1.331 3-3s-1.329-3-3-3s-3 1.331-3 3s1.329 3 3 3"
                  />
                  <path
                    fill="currentColor"
                    d="M20.817 11.186a8.9 8.9 0 0 0-1.355-3.219a9 9 0 0 0-2.43-2.43a9 9 0 0 0-3.219-1.355a9 9 0 0 0-1.838-.18V2L8 5l3.975 3V6.002c.484-.002.968.044 1.435.14a7 7 0 0 1 2.502 1.053a7 7 0 0 1 1.892 1.892A6.97 6.97 0 0 1 19 13a7 7 0 0 1-.55 2.725a7 7 0 0 1-.644 1.188a7 7 0 0 1-.858 1.039a7.03 7.03 0 0 1-3.536 1.907a7.1 7.1 0 0 1-2.822 0a7 7 0 0 1-2.503-1.054a7 7 0 0 1-1.89-1.89A7 7 0 0 1 5 13H3a9 9 0 0 0 1.539 5.034a9.1 9.1 0 0 0 2.428 2.428A8.95 8.95 0 0 0 12 22a9 9 0 0 0 1.814-.183a9 9 0 0 0 3.218-1.355a9 9 0 0 0 1.331-1.099a9 9 0 0 0 1.1-1.332A8.95 8.95 0 0 0 21 13a9 9 0 0 0-.183-1.814"
                  />
                </svg>
              </div>
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

        <div className="flex flex-row gap-2 w-full justify-center mt-4">
          <div
            onClick={() => roomData && router.push(`/game/bacay/${roomData.id}/lobby`)}
            className="w-[120px] sm:w-[130px] md:w-[140px] lg:w-[150px] h-[40px] bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 rounded-lg flex items-center justify-center text-sm sm:text-base cursor-pointer border border-gray-300 dark:border-gray-600"
          >
            Hủy bỏ
          </div>
          <div
            onClick={updateRoom}
            className="w-[120px] sm:w-[130px] md:w-[140px] lg:w-[150px] h-[40px] bg-yellow-500 hover:bg-yellow-600 text-white transition-colors duration-200 rounded-lg flex items-center justify-center text-sm sm:text-base cursor-pointer border border-yellow-600"
          >
            CẬP NHẬT
          </div>
        </div>
      </div>
    </CoverLayout>
  );
};

export default GameBaCayEditPage;
