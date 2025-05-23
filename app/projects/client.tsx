"use client";

import { motion } from "framer-motion";
import { ProjectCard } from "@/components/ui/project-card";
import NoData from "@/components/layout/no-data";

const ProjectPageClient = ({ projects }: { projects: any[] }) => {
  if (projects.length === 0) {
    return <NoData />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-6 sm:pt-12 md:pt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-12 text-center"
        >
          Featured Projects
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectPageClient;
