import React, { useEffect, useState } from "react";

const JobTitle = () => {
  const phrases = ["Creative", "Software", ".NET", "Over-stack"];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [letterIndex, setLetterIndex] = useState(0);

  useEffect(() => {
    let interval;

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

    return () => clearInterval(interval);
  }, [currentPhraseIndex, letterIndex, isDeleting, phrases]);

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
