"use client";

import { motion } from "framer-motion";

const CoverLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full"
    >
      <div className="max-w-7xl h-auto w-full">{children}</div>
    </motion.div>
  );
};

export default CoverLayout;
