"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchWeather } from "@/app/actions";

interface WeatherWidgetProps {
  classNameParam: string | null;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  classNameParam = "",
}) => {
  const [weather, setWeather] = useState<any>({});
  const [isNormalSize, setIsNormalSize] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchWeather();
      setWeather(data);
    };
    getData();
  }, []);

  return (
    <motion.div
      initial={{
        zIndex: 11,
        width: "36px",
        height: "36px",
      }}
      className={`${classNameParam} rounded-2xl p-1 hover:bg-neutral-100 dark:hover:bg-neutral-900 border-2 border-gray-400 dark:border-white/50 text-black dark:text-white text-center flex justify-center items-center`}
      transition={{
        duration: 0.5,
        delay: 0,
      }}
      whileHover={{
        width: "200px",
        height: "200px",
      }}
      whileTap={{
        width: "200px",
        height: "200px",
      }}
      onHoverStart={() => setIsNormalSize(true)}
      onHoverEnd={() => setIsNormalSize(false)}
      onPointerDown={() => setIsNormalSize(true)}
      onPointerUp={() => setIsNormalSize(false)}
    >
      {weather?.current ? (
        isNormalSize ? (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.5,
              delay: 0.25,
            }}
          >
            <h2 className="text-sm mb-2">
              {weather.location?.name && weather.location?.name.trim() !== ""
                ? weather.location.name + ", "
                : ""}
              {weather.location?.region &&
              weather.location?.region.trim() !== ""
                ? weather.location.region + ", "
                : ""}
              {weather.location?.country}
            </h2>
            <p className="text-sm mb-2">
              {new Date(weather.location?.localtime).toLocaleDateString(
                "en-us",
                {
                  month: "long",
                  weekday: "short",
                  day: "2-digit",
                }
              )}
            </p>
            <p className="text-sm mb-2">
              {new Date(weather.location?.localtime).toLocaleTimeString(
                "en-us",
                {
                  timeStyle: "short",
                }
              )}
            </p>
            <div className="flex justify-center items-center gap-2">
              <div className="flex flex-col justify-center items-center">
                <img
                  className="w-auto h-auto"
                  src={
                    process.env.NEXT_PUBLIC_APP_ENV === "dev"
                      ? `http:${weather.current?.condition.icon}`
                      : `https:${weather.current?.condition.icon}`
                  }
                  alt={weather.current?.condition.text}
                />
                <p className="capitalize">{weather.current?.condition.text}</p>
              </div>
              <p className="text-3xl mb-1">{weather.current?.temp_c}°C</p>
            </div>
          </motion.div>
        ) : (
          <img
            className="w-auto h-auto mx-auto"
            src={
              process.env.NEXT_PUBLIC_APP_ENV === "dev"
                ? `http:${weather.current?.condition.icon}`
                : `https:${weather.current?.condition.icon}`
            }
            alt={weather.current?.condition.text}
          />
        )
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <circle cx="18" cy="12" r="0" fill="currentColor">
            <animate
              attributeName="r"
              begin=".67"
              calcMode="spline"
              dur="1.5s"
              keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
              repeatCount="indefinite"
              values="0;2;0;0"
            />
          </circle>
          <circle cx="12" cy="12" r="0" fill="currentColor">
            <animate
              attributeName="r"
              begin=".33"
              calcMode="spline"
              dur="1.5s"
              keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
              repeatCount="indefinite"
              values="0;2;0;0"
            />
          </circle>
          <circle cx="6" cy="12" r="0" fill="currentColor">
            <animate
              attributeName="r"
              begin="0"
              calcMode="spline"
              dur="1.5s"
              keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
              repeatCount="indefinite"
              values="0;2;0;0"
            />
          </circle>
        </svg>
      )}
    </motion.div>
  );
};

export { WeatherWidget };
