import { useEffect, useState } from "react";

interface GamingPlayerProps {
  gameDetail?: any;
  player: Player;
  simpleView: boolean | undefined;
  onClick?: () => void;
}

const GamingPlayer = ({
  gameDetail,
  player,
  simpleView = true,
  onClick,
}: GamingPlayerProps) => {
  const { name, wallet, isDealer } = player;

  const formatPointText = () => {
    if (gameDetail?.point?.toString() === "11") {
      return "Sáp";
    } else if (gameDetail?.point?.toString() === "12") {
      return "Đồng hoa";
    } else {
      return gameDetail?.point?.toString() || "N/A";
    }
  };

  const [point, setPoint] = useState<string>(formatPointText());

  useEffect(() => {
    setPoint(formatPointText());
  }, [gameDetail]); // Log when gameDetail changes

  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center gap-2 cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 2a5 5 0 1 1-5 5l.005-.217A5 5 0 0 1 12 2m2 12a5 5 0 0 1 5 5v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-1a5 5 0 0 1 5-5z"
        />
        {isDealer && (
          <path
            fill="#00dd10"
            fillRule="evenodd"
            d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z"
            clipRule="evenodd"
            transform="scale(0.5) translate(12, 1)"
          />
        )}
      </svg>

      {simpleView ? (
        <div className="flex flex-col items-center gap-1">
          <p className="font-semibold">{name}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <p className="font-semibold">Tên: {name}</p>
          <p className="font-semibold">Điểm: {point}</p>
          <p className="font-semibold">Thu nhập: {wallet}</p>
        </div>
      )}
    </div>
  );
};

export default GamingPlayer;
