import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Logo from "./navigation/Logo";
import NavLink from "./navigation/NavLink";

const Navbar = () => {
  const location = useLocation();
  const routes = ["/", "/projects", "/about"];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      className="fixed w-full z-50 px-4 sm:px-6 lg:px-8 top-4"
      onMouseLeave={() => setIsMenuOpen(false)}
    >
      <nav className="max-w-7xl mx-auto bg-white/70 dark:bg-neutral-900/50 backdrop-blur-md rounded-2xl border border-gray-200/20 dark:border-white/5 shadow-lg">
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Logo />
            {/* Desktop and larger screen navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {routes.map((path) => (
                <NavLink
                  key={path}
                  path={path}
                  isActive={location.pathname === path}
                />
              ))}
            </div>

            {/* Hamburger menu for small screens */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 dark:text-white focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`${
              isMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 h-0 translate-y-[-100%]"
            } md:hidden`}
            style={{ transition: "0.35s ease" }}
          >
            <div className="flex flex-col items-center space-y-4 py-4">
              {routes.map((path) => (
                <NavLink
                  key={path}
                  path={path}
                  isActive={location.pathname === path}
                />
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
