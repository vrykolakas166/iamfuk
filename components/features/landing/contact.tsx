'use client';

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactInfo = [
  {
    id: 1,
    icon: Mail,
    title: "Email",
    content: "contact@iamfuk.io.vn",
    link: "mailto:contact@iamfuk.io.vn",
  },
  {
    id: 2,
    icon: Phone,
    title: "Phone",
    content: "+84 123 456 789",
    link: "tel:+84123456789",
  },
  {
    id: 3,
    icon: MapPin,
    title: "Location",
    content: "Ho Chi Minh City, Vietnam",
    link: "https://maps.google.com/?q=Ho+Chi+Minh+City,+Vietnam",
  },
];

export default function Contact() {
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
            <span className="gold-gradient">Get in</span>{" "}
            <span className="metal-gradient">Touch</span>
          </h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Have a project in mind? Let's discuss how we can work together to bring your ideas to life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl bg-foreground/5 border border-foreground/10"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-lg bg-foreground/5 border border-foreground/10 focus:border-foreground/20 focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-lg bg-foreground/5 border border-foreground/10 focus:border-foreground/20 focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 rounded-lg bg-foreground/5 border border-foreground/10 focus:border-foreground/20 focus:outline-none"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-foreground/5 border border-foreground/10 focus:border-foreground/20 focus:outline-none"
                  placeholder="Your message..."
                />
              </div>
              <Button className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.id}
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-6 rounded-xl bg-foreground/5 border border-foreground/10 hover:border-foreground/20 transition-colors"
              >
                <div className="p-3 rounded-lg bg-foreground/5">
                  <info.icon className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{info.title}</h3>
                  <p className="text-foreground/60">{info.content}</p>
                </div>
              </motion.a>
            ))}

            {/* Additional Info */}
            <div className="p-6 rounded-xl bg-foreground/5 border border-foreground/10">
              <h3 className="font-semibold mb-2">Business Hours</h3>
              <p className="text-foreground/60">
                Monday - Friday: 9:00 AM - 6:00 PM (GMT+7)
              </p>
              <p className="text-foreground/60 mt-1">
                Available for freelance and full-time opportunities
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 