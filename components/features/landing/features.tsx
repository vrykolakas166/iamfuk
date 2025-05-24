'use client';

import { motion } from "framer-motion";
import { 
  Code2, 
  Palette, 
  Smartphone, 
  Server, 
  Shield, 
  Zap 
} from "lucide-react";

const features = [
  {
    id: 1,
    name: "Full-Stack Development",
    description: "End-to-end development solutions from frontend to backend, ensuring seamless integration and optimal performance.",
    icon: Code2,
  },
  {
    id: 2,
    name: "UI/UX Design",
    description: "Creating intuitive and engaging user interfaces with a focus on user experience and modern design principles.",
    icon: Palette,
  },
  {
    id: 3,
    name: "Mobile Development",
    description: "Native and cross-platform mobile applications that deliver exceptional user experiences across all devices.",
    icon: Smartphone,
  },
  {
    id: 4,
    name: "Backend Solutions",
    description: "Robust and scalable backend systems built with modern technologies and best practices.",
    icon: Server,
  },
  {
    id: 5,
    name: "Security First",
    description: "Implementing industry-standard security measures to protect your applications and user data.",
    icon: Shield,
  },
  {
    id: 6,
    name: "Performance Optimization",
    description: "Optimizing applications for speed and efficiency, ensuring the best possible user experience.",
    icon: Zap,
  },
];

export default function Features() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="gold-gradient">Services</span>{" "}
            <span className="metal-gradient">I Offer</span>
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Comprehensive software development solutions tailored to your needs,
            delivered with expertise and passion.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl bg-foreground/5 border border-foreground/10 hover:border-foreground/20 transition-colors"
            >
              <div className="p-3 rounded-lg bg-foreground/5 w-fit mb-4">
                <feature.icon className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.name}</h3>
              <p className="text-foreground/60">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 