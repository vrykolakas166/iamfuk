"use client";
import React from "react";
import { motion } from "framer-motion";

function HeaderContainer({
  children,
  classNameParam,
}: {
  children: React.ReactNode;
  classNameParam: string;
}) {
  return (
    <motion.div
      className={`${classNameParam}`}
      initial={{
        width: 0,
        opacity: 0,
        maxWidth: "80rem",
      }}
      animate={{
        opacity: 1,
        width: "100%",
      }}
      transition={{
        duration: 0.75,
      }}
    >
      {children}
    </motion.div>
  );
}

export { HeaderContainer };
