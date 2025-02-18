"use client";

import "../../../game.css";
import CoverLayout from "@/app/game/cover";
import GamingPlayer from "@/components/gaming-player";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

const points = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
  { value: 9, label: "9" },
  { value: 10, label: "10" },
  { value: 11, label: "Sáp", special: true },
  { value: 12, label: "Đồng hoa", special: true },
];

const GameBaCayStartPage = () => {
  const router = useRouter();
  const [roomData, setRoomData] = useState<Room | null>(null);
  const constraintsRef = useRef(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const [moveDistance, setMD] = useState(window.innerWidth * 0.25);
  const [positions, setPositions] = useState<any>();
  const [simpleMode, setSimpleMode] = useState<boolean>(false);
  const [detailIsVisible, setDetailIsVisible] = useState<boolean>(false);
  const [isPopupVisible, setPopupVisible] = useState<boolean>(false);
  const [popupData, setPopupData] = useState<any>();

  useEffect(() => {
    if (roomData?.players) {
      const initialPositions = roomData.players.map((_, index) => ({
        x: index % 2 === 0 ? -moveDistance : moveDistance,
        y: 0,
      }));
      setPositions(initialPositions);
    }
  }, [roomData, moveDistance]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        // Close if clicking outside
        setPopupVisible(false);
        setPopupData(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside); // Desktop
    document.addEventListener("touchstart", handleClickOutside); // Mobile

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

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

  if (!roomData) {
    return (
      <CoverLayout>
        <div className="w-screen h-auto flex justify-center items-center">
          <p>Loading...</p>
        </div>
      </CoverLayout>
    );
  }

  const resetPosition = () => {
    setMD(moveDistance / 2);
    setTimeout(() => {
      setMD(moveDistance);
    }, 10);
  };

  /// Gameplay START
  const openPlayerInfoPopup = (playerName: string) => {
    setPopupVisible(true);
    setPopupData(getPopupData(playerName));
  };

  const getPopupData = (playerName: string) => {
    const currentGame = roomData.games?.at(-1);
    const player = roomData.players?.find((p) => p.name === playerName);
    const gameDetails = currentGame?.gameDetails ?? [];

    const gameDetail = gameDetails.find(
      (gd) => gd.gameId === currentGame?.id && gd.playerId === player?.id
    ) || {
      id: `${currentGame?.id}${player?.id}`,
      gameId: currentGame?.id ?? "undefined",
      playerId: player?.id ?? "undefined",
      point: 0,
      rankWhenEqual: 0,
    };

    return { gameDetail, player };
  };

  const closePlayerInfoPopup = () => {
    setPopupVisible(false);
    setPopupData(null);
  };

  const createOrUpdateGd = (point: number) => {
    if (!popupData?.gameDetail) return;

    const updatedGameDetail = { ...popupData.gameDetail, point };
    const currentGame = roomData.games?.at(-1);
    const player = roomData.players?.find(
      (p) => p.id === updatedGameDetail.playerId
    );
    const gameDetails = currentGame?.gameDetails ?? [];

    const existingGameDetail = gameDetails.find(
      (gd) => gd.gameId === currentGame?.id && gd.playerId === player?.id
    );

    if (existingGameDetail) {
      Object.assign(existingGameDetail, updatedGameDetail);
    } else {
      gameDetails.push(updatedGameDetail);
    }

    setPopupData(getPopupData(popupData.player.name));
    closePlayerInfoPopup();
  };

  // assign value to game detail in current game
  // log activities

  // click Tinh
  // create new game and push to games

  /// Gameplay END

  const endGame = () => {
    if (confirm("Bạn muốn nghỉ game?")) {
      localStorage.removeItem("on-going");
      const theGame = { day: Date.now(), room: roomData };

      const dbFromLocal = localStorage.getItem("db");
      const updatedDb = dbFromLocal ? JSON.parse(dbFromLocal) : [];
      updatedDb.push(theGame);

      localStorage.setItem("db", JSON.stringify(updatedDb));
      router.push("/game");
    }
  };

  return (
    <CoverLayout>
      <div className="w-full h-auto flex flex-col justify-center items-center">
        {/* Information */}
        <h2 className="text-xl font-bold mt-6">Thông tin</h2>

        <div className="w-full">
          <div className="gradient-border-100 gb-full w-11/12 h-auto p-4 mt-4 flex flex-col justify-center items-start gap-2 bacaycard">
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

        {/* Game order */}
        <h2 className="text-xl font-bold mt-4">
          Ván thứ {roomData.games.length}
        </h2>

        <div className="w-full">
          <div className="gradient-border-100 gb-full w-11/12 h-auto p-4 mt-4 flex flex-col justify-center items-start gap-2 bacaycard">
            <div className="flex flex-row justify-between w-full">
              <p className="text-md">
                Tổng số người chơi: {roomData?.players.length}
              </p>
              <div
                className="cursor-pointer hover:scale-[1.2] z-10"
                title="Đặt lại vị trí"
                onClick={resetPosition}
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

            <div className="flex flex-row w-full justify-start items-center gap-1 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
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

            <div className="flex flex-row w-full justify-start items-center gap-1 text-sm z-10">
              <input
                id="simpleMode"
                type="checkbox"
                checked={simpleMode ?? false}
                onChange={() => setSimpleMode(!simpleMode)}
              />
              <label htmlFor="simpleMode" className="text-md">
                Đơn giản
              </label>
            </div>

            <motion.div
              ref={constraintsRef}
              className="flex flex-col justify-start items-center w-full z-20"
            >
              {roomData?.players.length === 0
                ? ""
                : roomData?.players.map((player: Player, index: number) => (
                    <motion.div
                      drag
                      dragConstraints={constraintsRef}
                      key={`${player.name}-${positions?.[index]?.x}-${positions?.[index]?.y}`}
                      animate={positions?.[index] || { x: 0, y: 0 }}
                      className="flex flex-row justify-between z-10"
                    >
                      <GamingPlayer
                        gameDetail={{
                          ...roomData?.games
                            .at(-1)
                            ?.gameDetails.find(
                              (gd) => gd.playerId === player.id
                            ),
                        }}
                        player={player}
                        simpleView={simpleMode}
                        onClick={() => openPlayerInfoPopup(player.name)}
                      />
                      <motion.div className="cursor-grab opacity-30 hover:opacity-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 48 48"
                        >
                          <g
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="4"
                          >
                            <path
                              fill="currentColor"
                              d="M22 43c-4.726-1.767-8.667-7.815-10.64-11.357c-.852-1.53-.403-3.408.964-4.502a3.83 3.83 0 0 1 5.1.283L19 29V17.5a2.5 2.5 0 0 1 5 0v6a2.5 2.5 0 0 1 5 0v2a2.5 2.5 0 0 1 5 0v2a2.5 2.5 0 0 1 5 0v7.868c0 1.07-.265 2.128-.882 3.003C37.095 39.82 35.256 42.034 33 43c-3.5 1.5-6.63 1.634-11 0"
                            />
                            <path d="M10 8h22m-18 4l-4-4l4-4m14 0l4 4l-4 4" />
                          </g>
                        </svg>
                      </motion.div>
                    </motion.div>
                  ))}

              <div className="absolute top-[50%] btn-primary text-center text-white hover:shadow-lg hover:shadow-cyan-500/50">
                Tính
              </div>

              {isPopupVisible ? (
                <div
                  ref={popupRef}
                  className="absolute top-0 left-0 w-full h-full bg-white border border-[#FF00FF] rounded-md p-4 z-20"
                >
                  <div
                    onClick={closePlayerInfoPopup}
                    className="absolute top-5 right-5 h-[20px] w-[20px] flex flex-col justify-center items-center rotate-[45deg] hover:scale-[1.2] cursor-pointer"
                  >
                    <div className="absolute w-full h-[5px] bg-red-700"></div>
                    <div className="absolute h-full w-[5px] bg-red-700"></div>
                  </div>
                  <div className="flex flex-col text-black justify-center w-full h-full gap-2">
                    <div className="font-semibold">
                      Tên người chơi: {popupData.player.name}
                    </div>
                    <div>
                      Thu nhập:
                      <span
                        className={clsx({
                          "text-green-500": popupData.player.wallet > 0,
                          "text-red-500": popupData.player.wallet < 0,
                          "text-black": popupData.player.wallet === 0,
                        })}
                      >
                        {clsx({
                          " +": popupData.player.wallet > 0,
                          " -": popupData.player.wallet < 0,
                          " ": popupData.player.wallet === 0,
                        })}
                        {popupData.player.wallet}
                      </span>
                    </div>
                    <hr />
                    <div className="font-semibold text-lg">
                      Điểm:{" "}
                      {
                        points.find(
                          (obj) => obj.value === popupData.gameDetail.point
                        )?.label
                      }
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      {points.map((point) => (
                        <div
                          key={point.value}
                          className={`cursor-pointer btn-point ${point.special ? "btn-point-special" : ""} ${
                            point.value === popupData.gameDetail.point
                              ? "marked"
                              : ""
                          } ${point.value === 11 ? "col-span-2" : ""} ${
                            point.value === 12 ? "col-span-3" : ""
                          }`}
                          onClick={() => createOrUpdateGd(point.value)}
                        >
                          {point.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </motion.div>
          </div>
        </div>

        {/* Function group */}
        <div className="w-full flex flex-row justify-between items-center py-5">
          <div
            onClick={() =>
              router.push(`/game/bacay/${roomData.id}/lobby/change`)
            }
            className="btn-warning md:max-w-[120px] hover:shadow-lg hover:shadow-yellow-500/50 text-center"
          >
            Thay đổi
          </div>
          <div
            onClick={() => setDetailIsVisible(!detailIsVisible)}
            className="btn-info md:max-w-[120px] hover:shadow-lg hover:shadow-blue-500/50 text-center"
          >
            Chi tiết
          </div>
          <div
            onClick={endGame}
            className="btn-danger md:max-w-[120px] hover:shadow-lg hover:shadow-red-500/50 text-center"
          >
            Kết thúc
          </div>
        </div>

        {/* detail display */}
        {detailIsVisible ? (
          <div className="max-h-[500px] overflow-y-auto border border-blue-500/70 rounded-lg w-full">
            <div className="m-4 flex flex-col justify-center items-center">
              <div>Hoạt động</div>
              {Array.from({ length: 100 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-start items-start w-full p-2"
                >
                  <p className="text-md border-b-2 border-white/30">
                    Ván thứ n
                  </p>
                  <div className="text-sm grid grid-cols-2 w-full">
                    <ul>
                      <li>- Adam: 10 điểm</li>
                      <li>- Elizabeth: 7 điểm</li>
                      <li>- Bruce Lee(cầm chương): 2 điểm</li>
                    </ul>
                    <ul>
                      <li className="text-green-400">
                        - Adam: thắng, được 10000, chuyển chương
                      </li>
                      <li className="text-green-400">
                        - Elizabeth: thắng, được 5000
                      </li>
                      <li className="text-red-400">
                        - Bruce Lee: thua, mất 15000
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </CoverLayout>
  );
};

export default GameBaCayStartPage;
