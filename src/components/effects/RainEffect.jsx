import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import "./RainEffect.css";

const RainEffect = () => {
  const { isDark, weather } = useTheme();

  const frontRowRef = useRef(null);
  const backRowRef = useRef(null);

  const rainDetection = [
    "rain",
    "drizzle",
    "shower",
    "downpour",
    "storm",
    "deluge",
    "sprinkle",
    "mist",
    "precipitation",
    "rainfall",
    "cloudburst",
    "monsoon",
    "squall",
    "torrent",
    "spitting",
    "wet weather",
    "raindrops",
    "pluvial",
    "pelting",
    "rainstorm",
  ];

  useEffect(() => {
    const makeItRain = () => {
      // Clear out everything
      if (frontRowRef.current && backRowRef.current) {
        frontRowRef.current.innerHTML = "";
        backRowRef.current.innerHTML = "";
      }

      let increment = 0;
      let drops = "";
      let backDrops = "";

      while (increment < 100) {
        // Couple random numbers to use for various randomizations
        const randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1); // Random number between 98 and 1
        const randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2); // Random number between 5 and 2
        increment += randoFiver;

        // Add in a new raindrop with various randomizations to certain CSS properties
        const drop = `
          <div class="drop" style="left: ${increment}%; bottom: ${
          randoFiver + randoFiver - 1 + 100
        }%; animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;">
            <div class="stem ${
              isDark ? "dark" : ""
            }" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
            <div class="splat ${
              isDark ? "dark" : ""
            }" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
          </div>`;

        const backDrop = `
          <div class="drop" style="right: ${increment}%; bottom: ${
          randoFiver + randoFiver - 1 + 100
        }%; animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;">
            <div class="stem ${
              isDark ? "dark" : ""
            }" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
            <div class="splat ${
              isDark ? "dark" : ""
            }" style="animation-delay: 0.${randoHundo}s; animation-duration: 0.5${randoHundo}s;"></div>
          </div>`;

        drops += drop;
        backDrops += backDrop;
      }

      if (frontRowRef.current && backRowRef.current) {
        frontRowRef.current.innerHTML = drops;
        backRowRef.current.innerHTML = backDrops;
      }
    };

    if (
      rainDetection.some((de) =>
        weather?.current?.condition?.text
          ?.toLowerCase()
          .includes(de.toLowerCase())
      )
    ) {
      makeItRain();
    }
    return () => {
      const container = document.querySelector(".rain");
      if (container) {
        container.innerHTML = ""; // Clear rain effect on unmount
      }
    };
  }, [isDark, weather]);

  return (
    <div className="rain-container">
      <div className="rain front-row" ref={frontRowRef}></div>
      <div className="rain back-row" ref={backRowRef}></div>
    </div>
  );
};

export default RainEffect;
