"use client";

import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function MyNavbar({ user }: { user: {} | any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Hamburger Button */}
      <button
        className="sm:hidden p-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />} {/* Toggle icons */}
      </button>

      {/* Desktop Menu */}
      <div className="hidden sm:flex gap-2 items-center sm:gap-4">
        <Link href="/projects">Projects</Link>
        <Link href="/game">Game</Link>
        <Link href="/about">About</Link>
        {user ? (
          <form action={signOutAction}>
            <Button type="submit" variant="outline">
              Sign out
            </Button>
          </form>
        ) : (
          <Button asChild size="sm" variant="outline">
            <Link href="/sign-in">Access</Link>
          </Button>
        )}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md sm:hidden flex flex-col items-start p-4 gap-2 w-screen">
          <Link
            style={{ color: "black", padding: "4px 0px" }}
            href="/projects"
            onClick={() => setIsOpen(false)}
          >
            Projects
          </Link>
          <Link
            style={{ color: "black", padding: "4px 0px" }}
            href="/game"
            onClick={() => setIsOpen(false)}
          >
            Game
          </Link>
          <Link
            style={{ color: "black", padding: "4px 0px" }}
            href="/about"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          {user ? (
            <form action={signOutAction} className="w-full">
              <Button type="submit" variant="outline" className="w-full">
                Sign out
              </Button>
            </form>
          ) : (
            <Button asChild size="sm" variant="outline" className="w-full">
              <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                Access
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
