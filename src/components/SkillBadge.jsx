import React from 'react';
import { motion } from 'framer-motion';

const SkillBadge = ({ skill, index }) => {
  return (
    <motion.span
      key={skill}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="px-4 py-2 bg-gradient-to-r from-neutral-200 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-full text-sm font-medium shadow-sm"
    >
      {skill}
    </motion.span>
  );
};

export default SkillBadge;