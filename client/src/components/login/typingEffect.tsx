import React, { useState, useEffect } from 'react';
import './typingEffect.css'

interface TypingEffectProps {
  messages: string[];
}

const typingEffect: React.FC<TypingEffectProps> = ({ messages }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(100); // Typing and deleting speed in ms

  useEffect(() => {
    const handleTyping = () => {
      const currentMessage = messages[currentMessageIndex];

      if (isDeleting) {
        setDisplayedText((prev) => prev.slice(0, -1)); // Remove one character
        setSpeed(50); // Faster speed when deleting
      } else {
        setDisplayedText((prev) => currentMessage.slice(0, prev.length + 1)); // Add one character
        setSpeed(100); // Slower speed when typing
      }

      // If typing is complete, start deleting after a short delay
      if (!isDeleting && displayedText === currentMessage) {
        setTimeout(() => setIsDeleting(true), 1000); // Wait before deleting
      }

      // If deleting is complete, move to the next message
      if (isDeleting && displayedText === '') {
        setIsDeleting(false);
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length); // Cycle through messages
      }
    };

    const timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer); // Clear timeout to avoid memory leaks
  }, [displayedText, isDeleting, messages, currentMessageIndex, speed]);

  return (
    <div className='typping' >
      {displayedText}
      <span className="cursor" style={{ animation: 'blink 0.7s infinite' }}>|</span>
    </div>
  );
};

export default typingEffect;
