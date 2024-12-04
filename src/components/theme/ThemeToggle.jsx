import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import WeatherForecast from "../effects/WeatherForecase";

const ThemeToggle = ({ className }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div
      style={{ zIndex: 11 }}
      className={`flex flex-col justify-center ${className} gap-2`}
    >
      <WeatherForecast />
      <motion.button
        onClick={toggleTheme}
        className={`
        p-2 rounded-full 
        bg-neutral-200/50 
        dark:bg-white/10 
        backdrop-blur-sm 
        border 
        max-w-9
        max-h-9
        border-black/50 
        dark:border-white/10`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isDark ? (
          <SunIcon className="w-5 h-5 text-yellow-400" />
        ) : (
          <MoonIcon className="w-5 h-5 text-black" />
        )}
      </motion.button>
    </div>
  );
};

export default ThemeToggle;
