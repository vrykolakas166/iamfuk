'use client';

import { motion } from "framer-motion";
import { Code2, Users, Star, Award } from "lucide-react";

const stats = [
  {
    id: 1,
    name: "Projects Completed",
    value: "50+",
    icon: Code2,
    description: "Successfully delivered projects across various domains"
  },
  {
    id: 2,
    name: "Happy Clients",
    value: "30+",
    icon: Users,
    description: "Satisfied clients from different industries"
  },
  {
    id: 3,
    name: "Years Experience",
    value: "2+",
    icon: Star,
    description: "Professional experience in software development"
  },
  {
    id: 4,
    name: "Awards Won",
    value: "5+",
    icon: Award,
    description: "Recognition for outstanding work and innovation"
  }
];

export default function Stats() {
  return (
    <section className="py-24 bg-accent/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative p-6 rounded-xl bg-foreground/5 border border-foreground/10 hover:border-foreground/20 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-foreground/5">
                  <stat.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-lg font-semibold">{stat.name}</h3>
              </div>
              <div className="text-3xl font-bold mb-2 gold-gradient">{stat.value}</div>
              <p className="text-sm text-foreground/60">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 