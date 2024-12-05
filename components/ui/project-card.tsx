import React from "react";
import { motion } from "framer-motion";

// Define the props for the component
interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
    >
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 gold-gradient">
          {project.title}
        </h3>
        <p className="text-gray-400 mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.techtags.split(",").map((tech) => (
            <span
              key={tech?.trim()}
              className="px-3 py-1 bg-neutral-800 rounded-full text-sm text-gray-300"
            >
              {tech?.trim()}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export { ProjectCard };
