"use client";

import { motion } from "framer-motion";

const NoData = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-64 text-gray-500"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-12 h-12 text-gray-400 animate-bounce"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 9l6 6m0-6l-6 6"
        />
      </svg>
      <p className="mt-4 text-sm font-medium">No data available</p>
      <p className="text-xs">
        If you are administrator, please check superbase server
      </p>
    </motion.div>
  );
};

export default NoData;
