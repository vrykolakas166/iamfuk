'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content: "Working with this developer was an absolute pleasure. The attention to detail and commitment to quality was impressive. Our project was delivered on time and exceeded our expectations.",
    author: "Sarah Johnson",
    role: "CEO at TechStart",
    image: "/assets/testimonials/avatar-1.jpg",
  },
  {
    id: 2,
    content: "The level of expertise and professionalism shown throughout our project was outstanding. They not only delivered a great product but also provided valuable insights and suggestions.",
    author: "Michael Chen",
    role: "CTO at InnovateCorp",
    image: "/assets/testimonials/avatar-2.jpg",
  },
  {
    id: 3,
    content: "I was impressed by the developer's ability to understand our needs and translate them into a beautiful, functional application. The communication was clear and the results were exceptional.",
    author: "Emily Rodriguez",
    role: "Product Manager at DesignHub",
    image: "/assets/testimonials/avatar-3.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-accent/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="gold-gradient">Client</span>{" "}
            <span className="metal-gradient">Testimonials</span>
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Don't just take my word for it. Here's what my clients have to say about working together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative p-6 rounded-xl bg-foreground/5 border border-foreground/10 hover:border-foreground/20 transition-colors"
            >
              <Quote className="w-8 h-8 text-foreground/20 absolute top-6 right-6" />
              <p className="text-foreground/80 mb-6 relative z-10">{testimonial.content}</p>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-foreground/60">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 