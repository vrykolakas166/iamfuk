"use client";

import "../../../game.css";
import CoverLayout from "@/app/game/cover";
import GamingPlayer from "@/components/gaming-player";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

type RoundResult = {
  playerName: string;
  point: number;
  isDealer: boolean;
  amount: number;
  status: 'win' | 'lose' | 'tie' | 'dealer';
  rankWhenEqual?: number;
};

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

// Function to calculate multiplier based on point
const getPointMultiplier = (point: number) => {
  switch (point) {
    case 10: return 2;
    case 11: return 3;
    case 12: return 4;
    default: return 1;
  }
};

const GameBaCayStartPage = () => {
  const router = useRouter();
  const [roomData, setRoomData] = useState<Room | null>(null);
  const constraintsRef = useRef(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Add animation keyframes
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes highlight {
        0% { 
          background-color: transparent;
          transform: scale(1);
          box-shadow: none;
        }
        30% { 
          background-color: rgba(255, 0, 255, 0.05);
          transform: scale(1.01);
          box-shadow: 0 0 8px rgba(255, 0, 255, 0.15);
        }
        100% { 
          background-color: transparent;
          transform: scale(1);
          box-shadow: none;
        }
      }
      .dark @keyframes highlight {
        0% { 
          background-color: transparent;
          transform: scale(1);
          box-shadow: none;
        }
        30% { 
          background-color: rgba(255, 0, 255, 0.1);
          transform: scale(1.01);
          box-shadow: 0 0 8px rgba(255, 0, 255, 0.2);
        }
        100% { 
          background-color: transparent;
          transform: scale(1);
          box-shadow: none;
        }
      }
      .animate-highlight {
        animation: highlight 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [moveDistance, setMD] = useState(window.innerWidth * 0.25);
  const [positions, setPositions] = useState<any>();
  const [simpleMode, setSimpleMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bacay-simple-mode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [detailIsVisible, setDetailIsVisible] = useState<boolean>(false);
  const [isPopupVisible, setPopupVisible] = useState<boolean>(false);
  const [popupData, setPopupData] = useState<any>();
  const [isDraggableView, setIsDraggableView] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bacay-draggable-view');
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });
  const [isOrderPopupVisible, setIsOrderPopupVisible] = useState<boolean>(false);
  const [samePointPlayers, setSamePointPlayers] = useState<Player[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<number>(0);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);

  const logPlayerInfo = () => {
    if (!roomData?.players) return;

    console.log('=== Player Information ===');
    const currentGame = roomData.games?.at(-1);
    const dealer = roomData.players.find(p => p.isDealer);
    const dealerGameDetail = currentGame?.gameDetails.find(
      (gd) => gd.playerId === dealer?.id
    );
    const dealerPoint = Number(dealerGameDetail?.point) || 0;
    const dealerRank = Number(dealerGameDetail?.rankWhenEqual) || 0;
    const betAmount = Number(roomData.betAmount) || 0;

    // Store round results
    const roundResults: RoundResult[] = [];
    let dealerTotalAmount = 0;

    // Process each player
    roomData.players.forEach((player) => {
      if (player.isDealer) return;

      const gameDetail = currentGame?.gameDetails.find(
        (gd) => gd.playerId === player.id
      );
      const playerPoint = Number(gameDetail?.point) || 0;
      const playerRank = Number(gameDetail?.rankWhenEqual) || 0;

      if (!playerPoint) return;

      // Calculate multiplier based on highest point between player and dealer
      const highestPoint = Math.max(playerPoint, dealerPoint);
      const multiplier = getPointMultiplier(highestPoint);
      const amount = betAmount * multiplier;

      let result: RoundResult = {
        playerName: player.name,
        point: playerPoint,
        isDealer: false,
        amount: 0,
        status: 'lose',
        rankWhenEqual: playerRank
      };

      // Compare points and ranks
      if (playerPoint > dealerPoint) {
        // Player wins
        player.wallet += amount;
        if (dealer) dealer.wallet -= amount;
        result.amount = amount;
        result.status = 'win';
        dealerTotalAmount -= amount;
      } else if (playerPoint < dealerPoint) {
        // Dealer wins
        player.wallet -= amount;
        if (dealer) dealer.wallet += amount;
        result.amount = -amount;
        result.status = 'lose';
        dealerTotalAmount += amount;
      } else {
        // Equal points, compare ranks
        if (playerRank < dealerRank) {
          // Player wins (lower rank = higher position)
          player.wallet += amount;
          if (dealer) dealer.wallet -= amount;
          result.amount = amount;
          result.status = 'win';
          dealerTotalAmount -= amount;
        } else if (playerRank > dealerRank) {
          // Dealer wins
          player.wallet -= amount;
          if (dealer) dealer.wallet += amount;
          result.amount = -amount;
          result.status = 'lose';
          dealerTotalAmount += amount;
        }
      }

      roundResults.push(result);
    });

    // Add dealer result
    if (dealer) {
      roundResults.push({
        playerName: dealer.name,
        point: dealerPoint,
        isDealer: true,
        amount: dealerTotalAmount,
        status: dealerTotalAmount > 0 ? 'win' : 'lose',
        rankWhenEqual: dealerRank
      });
    }

    // Save current game state to localStorage
    localStorage.setItem("on-going", JSON.stringify(roomData));

    // Create new game round
    const now = new Date();
    const newGame: Game = {
      id: `game_${Date.now()}`,
      roomId: roomData.id,
      seq: roomData.games.length + 1,
      gameDetails: [], // Empty array for new round
      createdAt: now,
      updatedAt: now
    };
    roomData.games.push(newGame);

    // Set calculated flag to true
    setIsCalculated(true);

    // Force re-render
    setRoomData({ ...roomData });
  };

  // Save states to localStorage when they change
  useEffect(() => {
    localStorage.setItem('bacay-simple-mode', JSON.stringify(simpleMode));
  }, [simpleMode]);

  useEffect(() => {
    localStorage.setItem('bacay-draggable-view', JSON.stringify(isDraggableView));
  }, [isDraggableView]);

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
          // Check if current game has gameDetails
          const currentGame = data.games?.at(-1);
          if (currentGame?.gameDetails?.length > 0) {
            // Create new game round
            const now = new Date();
            const newGame: Game = {
              id: `game_${Date.now()}`,
              roomId: data.id,
              seq: data.games.length + 1,
              gameDetails: [], // Empty array for new round
              createdAt: now,
              updatedAt: now
            };
            data.games.push(newGame);
            setIsCalculated(true);
          }
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

  const handlePointSelection = (point: number) => {
    // Check if player already has this point
    const currentGameDetail = roomData?.games?.at(-1)?.gameDetails.find(
      (gd) => gd.playerId === popupData?.player?.id
    );
    if (currentGameDetail?.point === point) {
      return; // Don't allow selecting the same point
    }

    // Get the old point before changing
    const oldPoint = currentGameDetail?.point;

    // If the player had a point before, reindex other players with the same point
    if (oldPoint) {
      const playersWithOldPoint = roomData?.games?.at(-1)?.gameDetails.filter(
        (gd) => gd.point === oldPoint && gd.playerId !== popupData?.player?.id
      ) || [];

      // Reindex the remaining players
      playersWithOldPoint.forEach((gd, index) => {
        gd.rankWhenEqual = index + 1;
      });
    }

    // Check for players with the new point
    if (!checkSamePointPlayers(point)) {
      createOrUpdateGd(point);
    }
  };

  const checkSamePointPlayers = (point: number) => {
    if (!roomData?.players) return false;

    const currentGame = roomData.games?.at(-1);
    const dealer = roomData.players.find(p => p.isDealer);
    const dealerGameDetail = currentGame?.gameDetails.find(
      (gd) => gd.playerId === dealer?.id
    );
    const dealerPoint = Number(dealerGameDetail?.point) || 0;

    // Get all players who have the same point as the one being selected
    const playersWithSamePoint = roomData.players.filter(player => {
      // Skip the current player
      if (player.id === popupData?.player?.id) return false;

      const gameDetail = currentGame?.gameDetails.find(
        (gd) => gd.playerId === player.id
      );
      const playerPoint = Number(gameDetail?.point) || 0;
      return playerPoint === point;
    });

    // Show popup if:
    // 1. There are other players with the same point AND
    // 2. Either the current player is dealer OR one of the players with same point is dealer
    const shouldShowPopup = playersWithSamePoint.length > 0 &&
      (popupData?.player?.isDealer || playersWithSamePoint.some(p => p.isDealer));

    if (shouldShowPopup) {
      // Include current player in the list
      const playersToShow = [popupData?.player, ...playersWithSamePoint].filter((p): p is Player => p !== undefined);

      // Sort players by their current rankWhenEqual
      const sortedPlayers = [...playersToShow].sort((a, b) => {
        const aGameDetail = currentGame?.gameDetails.find(
          (gd) => gd.playerId === a.id
        );
        const bGameDetail = currentGame?.gameDetails.find(
          (gd) => gd.playerId === b.id
        );
        const aRank = Number(aGameDetail?.rankWhenEqual) || 0;
        const bRank = Number(bGameDetail?.rankWhenEqual) || 0;

        // If one of them is the current player and they don't have a rank yet
        if (a.id === popupData?.player?.id && !aRank) return 1;
        if (b.id === popupData?.player?.id && !bRank) return -1;

        return aRank - bRank;
      });

      setSamePointPlayers(sortedPlayers);
      setSelectedPoint(point);
      setIsOrderPopupVisible(true);
      return true;
    }

    return false;
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

    // Get players with the same point as dealer
    const dealer = roomData.players.find(p => p.isDealer);
    const dealerGameDetail = currentGame?.gameDetails.find(
      (gd) => gd.playerId === dealer?.id
    );
    const dealerPoint = Number(dealerGameDetail?.point) || 0;

    // Only check for same point if it matches dealer's point
    if (point === dealerPoint) {
      const playersWithSamePoint = gameDetails.filter(
        (gd) => gd.point === point
      );

      // If this is a new point for the player, find their position in the order popup
      if (!existingGameDetail?.rankWhenEqual) {
        const currentPlayerIndex = samePointPlayers.findIndex(p => p.id === player?.id);
        if (currentPlayerIndex !== -1 && existingGameDetail) {
          // Get the rank of the player at the current position
          const targetRank = currentPlayerIndex + 1;

          // Only update ranks if this is the first time setting ranks for this point
          const hasExistingRanks = playersWithSamePoint.some(gd => gd.rankWhenEqual);

          if (!hasExistingRanks) {
            // Set initial ranks for all players with this point
            playersWithSamePoint.forEach((gd, index) => {
              if (gd.playerId === player?.id) {
                gd.rankWhenEqual = targetRank;
              } else {
                gd.rankWhenEqual = index + 1;
              }
            });
          } else {
            // If ranks already exist, just set the current player's rank
            existingGameDetail.rankWhenEqual = targetRank;
          }
        }
      }
    }

    setPopupData(getPopupData(popupData.player.name));
    closePlayerInfoPopup();
  };

  const handleOrderSubmit = (orderedPlayers: Player[]) => {
    if (!roomData?.games?.at(-1)) return;

    const currentGame = roomData.games[roomData.games.length - 1];

    // First, reset all ranks for players with the same point
    const playersWithSamePoint = currentGame.gameDetails.filter(
      gd => gd.point === selectedPoint
    );
    playersWithSamePoint.forEach(gd => {
      gd.rankWhenEqual = 0;
    });

    // Then assign new ranks in order (first player gets rank 1, second gets 2, etc.)
    orderedPlayers.forEach((player, index) => {
      const gameDetail = currentGame.gameDetails.find(
        (gd) => gd.playerId === player.id
      );
      console.log(index);
      if (gameDetail) {
        gameDetail.rankWhenEqual = index;
      } else {
        // If gameDetail doesn't exist yet, create it
        currentGame.gameDetails.push({
          id: `${currentGame.id}${player.id}`,
          gameId: currentGame.id,
          playerId: player.id,
          point: selectedPoint,
          rankWhenEqual: index,
        });
      }
    });

    createOrUpdateGd(selectedPoint);
    setIsOrderPopupVisible(false);
    setSamePointPlayers([]);
    setSelectedPoint(0);
  };

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

  const canCalculate = () => {
    if (!roomData?.players || !roomData?.games?.at(-1)) return false;

    const currentGame = roomData.games[roomData.games.length - 1];
    const allPlayersHavePoints = roomData.players.every(player => {
      const gameDetail = currentGame.gameDetails.find(gd => gd.playerId === player.id);
      return gameDetail && Number(gameDetail.point) > 0;
    });

    return allPlayersHavePoints;
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
          <div className="gradient-border-100 gb-full w-11/12 h-auto min-h-[320px] p-4 mt-4 flex flex-col items-start gap-2 bacaycard">
            <div className="flex flex-row justify-between w-full">
              <p className="text-md">
                Tổng số người chơi: {roomData?.players.length}
              </p>
              <div className="flex flex-row gap-2 items-center">
                <div
                  className="relative w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ease-in-out"
                  style={{
                    backgroundColor: isDraggableView
                      ? 'rgb(31 41 55)' // dark:bg-gray-800
                      : 'rgb(59 130 246)' // blue-500
                  }}
                  onClick={() => setIsDraggableView(!isDraggableView)}
                >
                  <div className="absolute left-1 w-3 h-3 text-white/50">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 12h18M3 6h18M3 18h18" />
                    </svg>
                  </div>
                  <div className="absolute right-1 w-3 h-3 text-white/50">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                  </div>
                  <div
                    className="absolute bg-white dark:bg-gray-200 w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ease-in-out"
                    style={{
                      transform: isDraggableView ? 'translateX(0)' : 'translateX(20px)',
                    }}
                  />
                </div>
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
                      d="M20.817 11.186a8.9 8.9 0 0 0-1.355-3.219a9 9 0 0 0-2.43-2.43a9 9 0 0 0-3.219-1.355a9 9 0 0 0-1.838-.18V2L8 5l3.975 3V6.002c.484-.002.968.044 1.435.14a7 7 0 0 1 2.502 1.053a7 7 0 0 1 1.892 1.892A6.97 6.97 0 0 1 19 13a7 7 0 0 1-.55 2.725a7 7 0 0 1-.644 1.188a7 7 0 0 1-.858 1.039a7 7 0 0 1-3.536 1.907a7.1 7.1 0 0 1-2.822 0a7 7 0 0 1-2.503-1.054a7 7 0 0 1-1.89-1.89A7 7 0 0 1 5 13H3a9 9 0 0 0 1.539 5.034a9.1 9.1 0 0 0 2.428 2.428A8.95 8.95 0 0 0 12 22a9 9 0 0 0 1.814-.183a9 9 0 0 0 3.218-1.355a9 9 0 0 0 1.331-1.099a9 9 0 0 0 1.1-1.332A8.95 8.95 0 0 0 21 13a9 9 0 0 0-.183-1.814"
                    />
                  </svg>
                </div>
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
              className={`flex ${isDraggableView ? "flex-col" : "flex-row gap-3 flex-wrap"} justify-start items-center w-full z-20`}
            >
              {roomData?.players.length === 0
                ? ""
                : roomData?.players.map((player: Player, index: number) => (
                  isDraggableView ? (
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
                      {isDraggableView && (
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
                      )}
                    </motion.div>
                  ) : (
                    <div key={`${player.name}-${positions?.[index]?.x}-${positions?.[index]?.y}`}><GamingPlayer
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
                    /></div>
                  )
                ))}

              <div
                className={`${isDraggableView ? "absolute" : ""} top-[50%] text-center text-white rounded-lg px-4 py-2 ${canCalculate()
                    ? "btn-primary hover:shadow-lg hover:shadow-cyan-500/50"
                    : "bg-gray-500/50 dark:bg-gray-600/50 border border-gray-400/30 dark:border-gray-500/30"
                  }`}
                onClick={canCalculate() ? logPlayerInfo : undefined}
              >
                Tính
              </div>

              {isPopupVisible && (
                <div
                  ref={popupRef}
                  className="absolute top-0 left-0 w-full h-full bg-white dark:bg-gray-800 border border-[#FF00FF] rounded-md p-4 z-20"
                >
                  <div
                    onClick={closePlayerInfoPopup}
                    className="absolute top-5 right-5 h-[20px] w-[20px] flex flex-col justify-center items-center rotate-[45deg] hover:scale-[1.2] cursor-pointer"
                  >
                    <div className="absolute w-full h-[5px] bg-red-700"></div>
                    <div className="absolute h-full w-[5px] bg-red-700"></div>
                  </div>
                  <div className="flex flex-col text-black dark:text-white justify-center w-full h-full gap-2">
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
                          " ": popupData.player.wallet <= 0,
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
                      {points.map((point) => {
                        const currentGameDetail = roomData?.games?.at(-1)?.gameDetails.find(
                          (gd) => gd.playerId === popupData?.player?.id
                        );
                        const isSelected = point.value === currentGameDetail?.point;

                        return (
                          <div
                            key={point.value}
                            className={`cursor-pointer btn-point ${point.special ? "btn-point-special" : ""} ${isSelected ? "marked" : ""
                              } ${point.value === 11 ? "col-span-2" : ""} ${point.value === 12 ? "col-span-3" : ""
                              }`}
                            onClick={() => handlePointSelection(point.value)}
                          >
                            {point.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {isOrderPopupVisible && (
                <div
                  ref={popupRef}
                  className="absolute top-0 left-0 w-full h-full bg-white dark:bg-gray-800 border border-[#FF00FF] rounded-md p-4 z-30"
                >
                  <div
                    onClick={() => {
                      setIsOrderPopupVisible(false);
                      setSamePointPlayers([]);
                      setSelectedPoint(0);
                    }}
                    className="absolute top-5 right-5 h-[20px] w-[20px] flex flex-col justify-center items-center rotate-[45deg] hover:scale-[1.2] cursor-pointer"
                  >
                    <div className="absolute w-full h-[5px] bg-red-700"></div>
                    <div className="absolute h-full w-[5px] bg-red-700"></div>
                  </div>
                  <div className="flex flex-col text-black dark:text-white justify-center w-full h-full gap-2">
                    <div className="font-semibold text-lg text-center mb-4">
                      Sắp xếp thứ tự người chơi có {selectedPoint} điểm
                    </div>
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto px-2">
                      {samePointPlayers.map((player, index) => (
                        <div
                          id={`player-${player.id}`}
                          key={player.id}
                          className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out cursor-move group animate-highlight"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', index.toString());
                            e.currentTarget.classList.add('opacity-50');
                          }}
                          onDragEnd={(e) => {
                            e.currentTarget.classList.remove('opacity-50');
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.add('border-t-2', 'border-blue-500');
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.classList.remove('border-t-2', 'border-blue-500');
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('border-t-2', 'border-blue-500');
                            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                            const toIndex = index;
                            const newPlayers = [...samePointPlayers];
                            const [movedPlayer] = newPlayers.splice(fromIndex, 1);
                            newPlayers.splice(toIndex, 0, movedPlayer);
                            setSamePointPlayers(newPlayers);
                            // Add highlight effect
                            const element = document.getElementById(`player-${movedPlayer.id}`);
                            if (element) {
                              element.classList.add('animate-highlight');
                              setTimeout(() => {
                                element.classList.remove('animate-highlight');
                              }, 800);
                            }
                          }}
                        >
                          <div className="flex items-center justify-center w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full text-xs font-medium transition-transform duration-300">
                            {index + 1}
                          </div>
                          <div className="flex-1 font-medium text-sm">
                            {player.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                if (index > 0) {
                                  const newPlayers = [...samePointPlayers];
                                  [newPlayers[index], newPlayers[index - 1]] = [newPlayers[index - 1], newPlayers[index]];
                                  setSamePointPlayers(newPlayers);
                                  // Add highlight effect
                                  const element = document.getElementById(`player-${player.id}`);
                                  if (element) {
                                    element.classList.add('animate-highlight');
                                    setTimeout(() => {
                                      element.classList.remove('animate-highlight');
                                    }, 800);
                                  }
                                }
                              }}
                              className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={index === 0}
                              title="Move up"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 15l-6-6-6 6" />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                if (index < samePointPlayers.length - 1) {
                                  const newPlayers = [...samePointPlayers];
                                  [newPlayers[index], newPlayers[index + 1]] = [newPlayers[index + 1], newPlayers[index]];
                                  setSamePointPlayers(newPlayers);
                                  // Add highlight effect
                                  const element = document.getElementById(`player-${player.id}`);
                                  if (element) {
                                    element.classList.add('animate-highlight');
                                    setTimeout(() => {
                                      element.classList.remove('animate-highlight');
                                    }, 800);
                                  }
                                }
                              }}
                              className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={index === samePointPlayers.length - 1}
                              title="Move down"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 9l6 6 6-6" />
                              </svg>
                            </button>
                            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                            <button
                              onClick={() => {
                                if (index > 0) {
                                  const newPlayers = [...samePointPlayers];
                                  const [movedPlayer] = newPlayers.splice(index, 1);
                                  newPlayers.unshift(movedPlayer);
                                  setSamePointPlayers(newPlayers);
                                  // Add highlight effect
                                  const element = document.getElementById(`player-${player.id}`);
                                  if (element) {
                                    element.classList.add('animate-highlight');
                                    setTimeout(() => {
                                      element.classList.remove('animate-highlight');
                                    }, 800);
                                  }
                                }
                              }}
                              className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={index === 0}
                              title="Move to top"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 15l-6-6-6 6" />
                                <path d="M18 9l-6-6-6 6" />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                if (index < samePointPlayers.length - 1) {
                                  const newPlayers = [...samePointPlayers];
                                  const [movedPlayer] = newPlayers.splice(index, 1);
                                  newPlayers.push(movedPlayer);
                                  setSamePointPlayers(newPlayers);
                                  // Add highlight effect
                                  const element = document.getElementById(`player-${player.id}`);
                                  if (element) {
                                    element.classList.add('animate-highlight');
                                    setTimeout(() => {
                                      element.classList.remove('animate-highlight');
                                    }, 800);
                                  }
                                }
                              }}
                              className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={index === samePointPlayers.length - 1}
                              title="Move to bottom"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 9l6 6 6-6" />
                                <path d="M6 15l6 6 6-6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        className="px-6 py-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
                        onClick={() => {
                          setIsOrderPopupVisible(false);
                          setSamePointPlayers([]);
                          setSelectedPoint(0);
                        }}
                      >
                        Hủy
                      </button>
                      <button
                        className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                        onClick={() => handleOrderSubmit(samePointPlayers)}
                      >
                        Xác nhận
                      </button>
                    </div>
                  </div>
                </div>
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
        {detailIsVisible && isCalculated ? (
          <div className="max-h-[500px] overflow-y-auto border border-blue-500/70 rounded-lg w-full">
            <div className="m-4 flex flex-col justify-center items-center">
              <div>Hoạt động</div>
              {roomData.games
                .filter(game => game.gameDetails.length > 0) // Show all completed rounds except current round
                .map((game, index) => {
                  const dealer = roomData.players.find(p => p.isDealer);
                  const dealerGameDetail = game.gameDetails.find(gd => gd.playerId === dealer?.id);
                  const dealerPoint = Number(dealerGameDetail?.point) || 0;
                  const dealerRank = Number(dealerGameDetail?.rankWhenEqual) || 0;
                  let dealerTotalAmount = 0;

                  const roundResults = roomData.players.map(player => {
                    if (player.isDealer) return null;

                    const gameDetail = game.gameDetails.find(gd => gd.playerId === player.id);
                    const playerPoint = Number(gameDetail?.point) || 0;
                    const playerRank = Number(gameDetail?.rankWhenEqual) || 0;

                    let amount = 0;
                    let status: 'win' | 'lose' | 'draw' = 'draw';

                    // Calculate multiplier based on highest point between player and dealer
                    const highestPoint = Math.max(playerPoint, dealerPoint);
                    const multiplier = getPointMultiplier(highestPoint);
                    const betAmount = roomData.betAmount * multiplier;

                    if (playerPoint > dealerPoint) {
                      // Player wins with higher point
                      amount = betAmount;
                      status = 'win';
                    } else if (playerPoint < dealerPoint) {
                      // Player loses with lower point
                      amount = -betAmount;
                      status = 'lose';
                    } else {
                      // Equal points, compare ranks
                      if (playerRank < dealerRank) {
                        // Player wins with lower rank (higher position)
                        amount = betAmount;
                        status = 'win';
                      } else if (playerRank > dealerRank) {
                        // Player loses with higher rank (lower position)
                        amount = -betAmount;
                        status = 'lose';
                      } else {
                        // Equal ranks, it's a draw
                        amount = 0;
                        status = 'draw';
                      }
                    }

                    dealerTotalAmount -= amount;

                    return {
                      playerName: player.name,
                      point: playerPoint,
                      isDealer: false,
                      amount,
                      status,
                      rankWhenEqual: playerRank
                    };
                  }).filter((result): result is NonNullable<typeof result> => result !== null);

                  // Add dealer result
                  if (dealer) {
                    roundResults.push({
                      playerName: dealer.name,
                      point: dealerPoint,
                      isDealer: true,
                      amount: dealerTotalAmount,
                      status: dealerTotalAmount > 0 ? 'win' : dealerTotalAmount < 0 ? 'lose' : 'draw',
                      rankWhenEqual: dealerRank
                    });
                  }

                  return (
                    <div key={game.id} className="flex flex-col justify-start items-start w-full p-2">
                      <p className="text-md border-b-2 border-white/30">
                        Ván thứ {game.seq + 1}
                      </p>
                      <div className="text-sm grid grid-cols-2 w-full">
                        <ul>
                          {roundResults.map((result, idx) => {
                            const showRank = dealer && result.point === dealerPoint &&
                              roundResults.some(r => r.point === dealerPoint && !r.isDealer); // Only show rank if there are other players with same point
                            return (
                              <li key={idx}>
                                - {result.playerName}{result.isDealer ? '(cầm chương)' : ''}: {result.point} điểm{showRank ? ` (top${(result.rankWhenEqual || 0)})` : ''}
                              </li>
                            );
                          })}
                        </ul>
                        <ul>
                          {roundResults.map((result, idx) => (
                            <li key={idx} className={clsx({
                              'text-green-400': result.status === 'win',
                              'text-red-400': result.status === 'lose',
                              'text-yellow-400': result.status === 'draw',
                            })}>
                              - {result.playerName}: {
                                result.status === 'win' ? 'thắng' : result.status === 'lose' ? 'thua' : 'hòa'
                              }
                              {`, ${result.status === 'win' ? 'được' : 'mất'} ${Math.abs(result.amount)}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : null}
      </div>
    </CoverLayout>
  );
};

export default GameBaCayStartPage;
