"use client";
import { motion } from "framer-motion";
import { JobTitle } from "./ui/job-title";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-16"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-8xl font-bold mb-6"
            >
              <JobTitle />
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-400 mb-8"
            >
              Crafting elegant digital experiences
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button>
                <Link href="https://www.linkedin.com/in/iamfuk/">
                  Let's connect
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
