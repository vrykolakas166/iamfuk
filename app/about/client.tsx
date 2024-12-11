"use client";

import { motion } from "framer-motion";
import { SkillBadge } from "@/components/ui/skill-badge";
import LoadingSpinner from "@/components/loading-spinner";

const AboutPageClient = ({ techstacks }: { techstacks: any[] }) => {
  if (techstacks.length === 0) {
    return <LoadingSpinner />; // Show loading spinner if no projects
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-6 sm:pt-12 md:pt-24 pb-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              <span className="gold-gradient">About</span>{" "}
              <span className="metal-gradient">Me</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              I'm a passionate full-stack developer with over 2 years of
              experience in creating elegant, user-centric digital solutions. My
              journey in technology is driven by a constant desire to learn and
              innovate.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              I specialize in building scalable website and desktop applications
              and have a strong foundation in both front-end and back-end
              development. My approach combines technical expertise with
              creative problem-solving.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {techstacks?.map((skill, index) => (
                <SkillBadge key={skill.id} skill={skill} index={index} />
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="card p-8 rounded-2xl relative z-10">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2 gold-gradient">
                    Experience
                  </h3>
                  <p className="text-gray-700 dark:text-gray-400">
                    3 years in software development
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 gold-gradient">
                    Education
                  </h3>
                  <p className="text-gray-700 dark:text-gray-400">
                    2018 - 2022
                  </p>
                  <p className="text-gray-700 dark:text-gray-400">
                    Engineer Degree of Information Technology in University of
                    Industry, Ha Noi
                  </p>
                  <br />
                  <p className="text-gray-700 dark:text-gray-400">2024 - now</p>
                  <p className="text-gray-700 dark:text-gray-400">
                    Master Degree of Software Engineering in University of
                    Engineering and Technology, Vietnam National University, Ha
                    Noi
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 gold-gradient">
                    Location
                  </h3>
                  <p className="text-gray-700 dark:text-gray-400 flex gap-2 justify-start items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 36 36"
                    >
                      <path
                        fill="#da251d"
                        d="M32 5H4a4 4 0 0 0-4 4v18a4 4 0 0 0 4 4h28a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4"
                      />
                      <path
                        fill="#ff0"
                        d="M19.753 16.037L18 10.642l-1.753 5.395h-5.672l4.589 3.333l-1.753 5.395L18 21.431l4.589 3.334l-1.753-5.395l4.589-3.333z"
                      />
                    </svg>
                    Hanoi, Vietnam
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 blur-3xl -z-10 transform rotate-12 scale-75"></div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AboutPageClient;
