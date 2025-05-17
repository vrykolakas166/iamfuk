'use client';

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import LoadingSpinner from "./loading-spinner";

interface PageLayoutProps {
  title: string;
  icon: string;
  children: ReactNode;
  loading?: boolean;
  error?: string | null;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
  headerAction?: ReactNode;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
};

export function PageLayout({
  title,
  icon,
  children,
  loading = false,
  error = null,
  maxWidth = '3xl',
  headerAction,
}: PageLayoutProps) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className={`w-full ${maxWidthClasses[maxWidth]} mx-auto p-6`}>
        <div className="bg-accent/50 backdrop-blur-sm border border-foreground/10 rounded-xl p-6">
          <div className="flex items-center justify-center min-h-[200px] text-red-500">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full ${maxWidthClasses[maxWidth]} mx-auto p-6`}
    >
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-foreground/5">
            <Icon icon={icon} className="w-8 h-8 text-foreground" />
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        {headerAction}
      </div>
      {children}
    </motion.div>
  );
} 