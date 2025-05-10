"use client";

import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import UserMenu from "./user-menu";

export default function MyNavbar({ user }: { user: {} | any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Hamburger Button */}
      <button
        className="sm:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Menu */}
      <div className="hidden sm:flex gap-2 items-center sm:gap-4">
        <Link 
          href="/gtavi" 
          className="relative group px-2 py-1"
        >
          <span className="relative z-10">GTA VI</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <Link 
          href="/game" 
          className="relative group px-2 py-1"
        >
          <span className="relative z-10">Game</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <Link 
          href="/projects" 
          className="relative group px-2 py-1"
        >
          <span className="relative z-10">Projects</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link 
          href="/about" 
          className="relative group px-2 py-1"
        >
          <span className="relative z-10">About</span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
        </Link>
        {user ? (
          <UserMenu />
        ) : (
          <Button 
            asChild 
            size="sm" 
            variant="outline"
            className="hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-colors duration-300"
          >
            <Link href="/access">Access</Link>
          </Button>
        )}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md sm:hidden flex flex-col items-start p-4 gap-2 dark:bg-gray-800">
          <Link
            className="w-full py-2 px-4 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-300"
            href="/gtavi"
            onClick={() => setIsOpen(false)}
          >
            GTA VI
          </Link>
          <Link
            className="w-full py-2 px-4 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-300"
            href="/game"
            onClick={() => setIsOpen(false)}
          >
            Game
          </Link>
          <Link
            className="w-full py-2 px-4 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-300"
            href="/projects"
            onClick={() => setIsOpen(false)}
          >
            Projects
          </Link>
          <Link
            className="w-full py-2 px-4 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-300"
            href="/about"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          {user ? (
            <UserMenu isMobile onClose={() => setIsOpen(false)} />
          ) : (
            <Button 
              asChild 
              size="sm" 
              variant="outline" 
              className="w-full hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-colors duration-300"
            >
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
