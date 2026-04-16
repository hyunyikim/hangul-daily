import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AudioButton({ text, size = 'md' }) {
  const [playing, setPlaying] = useState(false);

  function handlePlay() {
    if (!('speechSynthesis' in window)) return;
    if (navigator.vibrate) navigator.vibrate(30);

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.8;

    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);

    window.speechSynthesis.speak(utterance);
  }

  const sizeClasses = {
    sm: 'w-9 h-9 text-base',
    md: 'w-12 h-12 text-xl',
    lg: 'w-14 h-14 text-2xl',
  };

  return (
    <motion.button
      onClick={handlePlay}
      whileTap={{ scale: 0.88 }}
      animate={playing ? { scale: [1, 1.12, 1] } : { scale: 1 }}
      transition={playing ? { repeat: Infinity, duration: 0.6 } : {}}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-colors cursor-pointer`}
      style={{
        background: 'var(--color-blue-pale)',
        color: 'var(--color-blue)',
      }}
      aria-label="Play pronunciation">
      <svg viewBox="0 0 75 75" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-1/2 h-1/2" aria-hidden="true">
        {/* Speaker body */}
        <polygon points="0,25 0,50 15,50 37.5,62.5 37.5,12.5 15,25" />
        {/* Sound waves */}
        <path d="M43,28 Q53,37.5 43,47" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M50,19 Q66,37.5 50,56" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M57,10 Q78,37.5 57,65" fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />
      </svg>
    </motion.button>
  );
}
