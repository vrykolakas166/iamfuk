import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NavLink = ({ path, isActive }) => {
  return (
    <Link to={path} className="relative py-2">
      <span className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
        {path === "/" ? "HOME" : path.slice(1).toUpperCase()}
      </span>
      {isActive && (
        <motion.div
          layoutId="underline"
          className="absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 30,
          }}
        />
      )}
    </Link>
  );
};

export default NavLink;
