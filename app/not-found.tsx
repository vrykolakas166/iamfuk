"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl w-[80vw] h-[80vh] flex justify-center items-center">
      <div className="w-full flex flex-col items-center gap-4">
        <div className="text-9xl font-bold select-none">404</div>
        <div className="text-2xl font-bold">Page Not Found</div>
        <div className="text-sm text-foreground/60">The page you are looking for does not exist.</div>
        <Link href="/" className="text-sm text-foreground/60">
          <Button variant="outline" >Go Back
          </Button>
        </Link>
      </div>
    </div >
  );
}
