import React, { useState } from "react";
import { motion } from "framer-motion";

const ActionButton = ({ children, href, className }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      className={`
        relative inline-block px-8 py-3 rounded-2xl 
        bg-gradient-to-r from-yellow-400 to-yellow-600 
        text-white dark:text-black font-semibold
        overflow-hidden group
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.8,
        ease: [0.175, 0.885, 0.32, 1.275],
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.span
        className="absolute inset-0 bg-white/20 dark:bg-black/20"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "100%" : "-100%" }}
        transition={{ duration: 0.5 }}
      />
      {children}
    </motion.a>
  );
};

export default ActionButton;
