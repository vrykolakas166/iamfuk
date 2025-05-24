'use client';

import { motion } from "framer-motion";
import { ReactNode } from "react";
import LoadingSpinner from "./loading-spinner";
import * as LucideIcons from "lucide-react";

// Create a mapping of icon names to Lucide components
const iconMap: { [key: string]: React.ComponentType<any> } = {
  'mdi:account': LucideIcons.User,
  'mdi:bell': LucideIcons.Bell,
  'mdi:bookmark': LucideIcons.Bookmark,
  'mdi:calendar': LucideIcons.Calendar,
  'mdi:chart-bar': LucideIcons.BarChart,
  'mdi:chart-line': LucideIcons.LineChart,
  'mdi:chart-pie': LucideIcons.PieChart,
  'mdi:check': LucideIcons.Check,
  'mdi:chevron-down': LucideIcons.ChevronDown,
  'mdi:chevron-left': LucideIcons.ChevronLeft,
  'mdi:chevron-right': LucideIcons.ChevronRight,
  'mdi:chevron-up': LucideIcons.ChevronUp,
  'mdi:close': LucideIcons.X,
  'mdi:cog': LucideIcons.Settings,
  'mdi:database': LucideIcons.Database,
  'mdi:delete': LucideIcons.Trash,
  'mdi:document': LucideIcons.FileText,
  'mdi:dots-horizontal': LucideIcons.MoreHorizontal,
  'mdi:dots-vertical': LucideIcons.MoreVertical,
  'mdi:download': LucideIcons.Download,
  'mdi:edit': LucideIcons.Pencil,
  'mdi:email': LucideIcons.Mail,
  'mdi:eye': LucideIcons.Eye,
  'mdi:eye-off': LucideIcons.EyeOff,
  'mdi:file': LucideIcons.File,
  'mdi:filter': LucideIcons.Filter,
  'mdi:folder': LucideIcons.Folder,
  'mdi:help': LucideIcons.HelpCircle,
  'mdi:home': LucideIcons.Home,
  'mdi:image': LucideIcons.Image,
  'mdi:information': LucideIcons.Info,
  'mdi:key': LucideIcons.Key,
  'mdi:link': LucideIcons.Link,
  'mdi:lock': LucideIcons.Lock,
  'mdi:logout': LucideIcons.LogOut,
  'mdi:menu': LucideIcons.Menu,
  'mdi:message': LucideIcons.MessageSquare,
  'mdi:minus': LucideIcons.Minus,
  'mdi:plus': LucideIcons.Plus,
  'mdi:refresh': LucideIcons.RefreshCw,
  'mdi:search': LucideIcons.Search,
  'mdi:send': LucideIcons.Send,
  'mdi:share': LucideIcons.Share,
  'mdi:shield': LucideIcons.Shield,
  'mdi:star': LucideIcons.Star,
  'mdi:tag': LucideIcons.Tag,
  'mdi:trash': LucideIcons.Trash,
  'mdi:upload': LucideIcons.Upload,
  'mdi:user': LucideIcons.User,
  'mdi:warning': LucideIcons.AlertTriangle,
};

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
  maxWidth = '7xl',
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

  const IconComponent = iconMap[icon] || LucideIcons.HelpCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full ${maxWidthClasses[maxWidth]} mx-auto p-6`}
    >
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-foreground/5">
            <IconComponent className="w-8 h-8 text-foreground" />
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        {headerAction}
      </div>
      {children}
    </motion.div>
  );
} 