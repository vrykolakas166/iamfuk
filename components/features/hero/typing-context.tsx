'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface TypingContextType {
  isTyping: boolean;
  isDeleting: boolean;
  currentPhraseIndex: number;
  displayedText: string;
  letterIndex: number;
}

const TypingContext = createContext<TypingContextType | undefined>(undefined);

export function TypingProvider({ children }: { children: React.ReactNode }) {
  const phrases = [
    ".NET", 
    "Creative", 
    "Software", 
    "Over-stack",  
    "Dedicated", 
    "Passionate"
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [letterIndex, setLetterIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isDeleting) {
      interval = setInterval(() => {
        setDisplayedText((prev) => prev.slice(0, letterIndex - 1));
        setLetterIndex((prev) => prev - 1);
        if (letterIndex <= 0) {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }, 100);
    } else {
      interval = setInterval(() => {
        setDisplayedText((prev) =>
          phrases[currentPhraseIndex].slice(0, letterIndex + 1)
        );
        setLetterIndex((prev) => prev + 1);
        if (letterIndex === phrases[currentPhraseIndex].length) {
          setTimeout(() => setIsDeleting(true), 1000);
        }
      }, 200);
    }

    setIsTyping(!isDeleting && letterIndex < phrases[currentPhraseIndex].length);

    return () => clearInterval(interval);
  }, [currentPhraseIndex, letterIndex, isDeleting, phrases]);

  return (
    <TypingContext.Provider
      value={{
        isTyping,
        isDeleting,
        currentPhraseIndex,
        displayedText,
        letterIndex,
      }}
    >
      {children}
    </TypingContext.Provider>
  );
}

export function useTyping() {
  const context = useContext(TypingContext);
  if (context === undefined) {
    throw new Error('useTyping must be used within a TypingProvider');
  }
  return context;
} 