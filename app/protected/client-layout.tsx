'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { ArrowLeft } from "lucide-react";

interface ClientLayoutProps {
  children: React.ReactNode;
  user: User;
}

export default function ClientLayout({ children, user }: ClientLayoutProps) {
  const pathname = usePathname();
  const [isDashboard, setIsDashboard] = useState(false);

  useEffect(() => {
    setIsDashboard(pathname === '/protected');
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex-1 w-full flex flex-col" style={{ scrollBehavior: 'smooth' }}>
      {isDashboard ? (
        <div className="bg-accent sm:mt-6 text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center mb-2">
          Welcome back, {user.email}
        </div>
      ) : (
        <Link href="/protected" className="w-[100px] mx-5 bg-accent hover:bg-accent/80 md:mt-6 text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>
      )}
      {children}
    </div>
  );
} 