"use client";

import "./game.css";
import Image from "next/image";
import CoverLayout from "./cover";
import { useRouter } from "next/navigation";

const GamePageClient = () => {
  const router = useRouter();
  const generateId = (): number =>
    Number(`${Date.now()}${Math.floor(10 + Math.random() * 90)}`);

  const letsPlay = () => {
    alert("This section is under development.");

    // check current localstorage to get save id
    var ongame = localStorage.getItem("on-going");
    if (ongame) {
      var data = JSON.parse(ongame);
      if (data.id) {
        router.push(`/game/bacay/${data.id}/lobby`);
        return;
      }
    }

    //else
    router.push(`/game/bacay/${generateId()}`);
  };

  return (
    <CoverLayout>
      <div className="relative">
        <Image
          src="/assets/games/bacay/hero.jpg"
          alt="hero game"
          width={1920}
          height={1920}
          style={{ maxWidth: "100%" }}
          blurDataURL="/assets/games/bacay/hero.jpg"
          placeholder="blur"
          className="object-contain h-auto md:w-[35vw] mx-auto rounded-lg shadow-lg shadow-pink-500/30 my-3"
        />
        <div className="absolute bottom-0 mb-3 w-full text-center text-[2rem] font-bold text-white">
          Có chơi có chịu
        </div>
      </div>
      <div className="border border-pink-500/30 rounded-lg mt-5">
        <h1 className="text-2xl font-bold text-center my-4">Danh sách</h1>
        <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2 place-items-center py-3">
          <div onClick={letsPlay} className="gradient-border-100 gb-flex">
            <div
              className="rounded-lg p-4 relative game-box"
              style={{ height: 100, width: 100 }}
            >
              <Image
                src="/assets/games/bacay/bacay.png"
                alt="ba cay"
                fill
                sizes="(max-width: 768px) 100%, (max-width: 1200px) 50%, 33%"
                className="object-contain"
              />
              <div
                className="absolute w-full h-full color-white bg-black/25 
                top-0 left-0 flex justify-center items-center 
                opacity-0 hover:opacity-100 transition-opacity duration-300 select-none cursor-pointer"
              >
                Ba cây
              </div>
            </div>
          </div>
        </div>
      </div>
    </CoverLayout>
  );
};

export default GamePageClient;
