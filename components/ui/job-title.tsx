'use client';

import React from "react";
import { useTyping } from "../typing-context";

const JobTitle = () => {
  const { displayedText } = useTyping();

  return (
    <div>
      <div className="typing-container">
        {displayedText.split("").map((letter, index) => (
          <span
            key={index}
            className="letter gold-gradient"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {letter}
          </span>
        ))}
        <span className="metal-gradient"> Developer</span>
      </div>
    </div>
  );
};

export { JobTitle };
