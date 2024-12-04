import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import About from "./pages/About";
import ThemeToggle from "./components/theme/ThemeToggle";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-900 dark:to-neutral-800 text-gray-900 dark:text-white transition-colors duration-300">
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
      <ThemeToggle className={"fixed left-4 bottom-4"} />
    </ThemeProvider>
  );
}

export default App;
