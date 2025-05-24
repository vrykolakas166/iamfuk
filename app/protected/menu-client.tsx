'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { getUserAccessiblePages } from '@/app/actions';
import { 
  Home, 
  FileText, 
  BarChart, 
  Monitor, 
  HelpCircle, 
  User, 
  Settings, 
  Bell, 
  MessageSquare, 
  Shield 
} from 'lucide-react';

// Define menu items with their access requirements
const menuItems = [
  { 
    icon: Monitor, 
    label: 'Desktop', 
    route: '/protected/desktop',
    accessKey: 'RESTRICTED'
  },
  { 
    icon: User, 
    label: 'Profile', 
    route: '/protected/profile',
    accessKey: 'DEFAULT' // All roles can access
  },
  { 
    icon: BarChart, 
    label: 'Analytics', 
    route: '/protected/analytics',
    accessKey: 'MANAGEMENT' // Admin and Manager can access
  },
  { 
    icon: Settings, 
    label: 'Settings', 
    route: '/protected/settings',
    accessKey: 'DEFAULT'
  },
  { 
    icon: Bell, 
    label: 'Notifications', 
    route: '/protected/notifications',
    accessKey: 'DEFAULT'
  },
  { 
    icon: MessageSquare, 
    label: 'Messages', 
    route: '/protected/messages',
    accessKey: 'DEFAULT'
  },
  { 
    icon: FileText, 
    label: 'Documents', 
    route: '/protected/documents',
    accessKey: 'RESTRICTED' // Only Admin can access
  },
  { 
    icon: Shield, 
    label: 'Security', 
    route: '/protected/security',
    accessKey: 'DEFAULT'
  },
  { 
    icon: HelpCircle, 
    label: 'Help', 
    route: '/protected/help',
    accessKey: 'DEFAULT'
  }
] as const;

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
  const [accessiblePages, setAccessiblePages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccessiblePages = async () => {
      try {
        const pages = await getUserAccessiblePages();
        setAccessiblePages(pages);
      } catch (error) {
        console.error('Failed to load accessible pages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAccessiblePages();
  }, []);

  // Filter menu items based on user's role
  const filteredMenuItems = menuItems.filter(item => 
    accessiblePages.includes(item.accessKey)
  );

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-7xl">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl p-6
                bg-accent/20 backdrop-blur-sm border border-foreground/10
                animate-pulse"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 bg-foreground/10 rounded-lg" />
                <div className="w-24 h-6 bg-foreground/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-7xl"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {filteredMenuItems.map((menuItem, index) => (
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
                    {React.createElement(menuItem.icon, { className: 'w-6 h-6' })}
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