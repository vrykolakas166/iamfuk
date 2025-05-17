'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const menuItems = [
  { icon: 'mdi:account', label: 'Profile', route: '/protected/profile' },
  { icon: 'mdi:chart-line', label: 'Analytics', route: '/protected/analytics' },
  { icon: 'mdi:cog', label: 'Settings', route: '/protected/settings' },
  { icon: 'mdi:bell', label: 'Notifications', route: '/protected/notifications' },
  { icon: 'mdi:message', label: 'Messages', route: '/protected/messages' },
  { icon: 'mdi:file', label: 'Documents', route: '/protected/documents' },
  { icon: 'mdi:shield', label: 'Security', route: '/protected/security' },
  { icon: 'mdi:help', label: 'Help', route: '/protected/help' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function MenuClient() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full flex items-center justify-center p-4">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-7xl"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {menuItems.map((menuItem, index) => (
          <motion.div
            key={menuItem.label}
            variants={item}
            className="relative group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link href={menuItem.route}>
              <div className={`
                relative overflow-hidden rounded-xl p-6 cursor-pointer
                bg-accent/50 backdrop-blur-sm border border-foreground/10
                transition-all duration-300 ease-out
                ${hoveredIndex === index ? 'scale-105 shadow-lg bg-accent/80' : 'shadow-md'}
              `}>
                {/* Hover effect overlay */}
                <div className={`
                  absolute inset-0 bg-foreground/5
                  transition-transform duration-300 ease-out
                  ${hoveredIndex === index ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
                `} />
                
                {/* Content */}
                <div className="relative flex flex-col items-center gap-3">
                  <div className={`
                    p-3 rounded-lg
                    transition-transform duration-300
                    ${hoveredIndex === index ? 'scale-110 rotate-3' : ''}
                  `}>
                    <Icon icon={menuItem.icon} className="w-8 h-8 text-foreground" />
                  </div>
                  <span className="text-foreground font-medium text-lg">
                    {menuItem.label}
                  </span>
                </div>

                {/* Decorative elements */}
                <div className={`
                  absolute -bottom-2 -right-2 w-24 h-24
                  bg-foreground/5 rounded-full
                  transition-transform duration-300
                  ${hoveredIndex === index ? 'scale-150' : 'scale-0'}
                `} />
                <div className={`
                  absolute -top-2 -left-2 w-16 h-16
                  bg-foreground/5 rounded-full
                  transition-transform duration-300
                  ${hoveredIndex === index ? 'scale-150' : 'scale-0'}
                `} />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 