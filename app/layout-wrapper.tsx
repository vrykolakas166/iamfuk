"use client";

import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname() || "";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // render server-side

  const isGradientBg = pathname.startsWith("/game") && theme === "dark";

  return (
    <div
      className="bg-background text-foreground"
      style={
        isGradientBg
          ? {
              background: "linear-gradient(135deg, #2B0F33, #1A1A1A)",
              opacity: 1,
            }
          : {}
      }
    >
      {children}
    </div>
  );
}
