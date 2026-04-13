import { useState } from 'react'
import { motion } from 'framer-motion'

export default function AudioButton({ text, size = 'md' }) {
  const [playing, setPlaying] = useState(false)

  function handlePlay() {
    if (!('speechSynthesis' in window)) return
    if (navigator.vibrate) navigator.vibrate(30)

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ko-KR'
    utterance.rate = 0.8

    utterance.onstart = () => setPlaying(true)
    utterance.onend = () => setPlaying(false)
    utterance.onerror = () => setPlaying(false)

    window.speechSynthesis.speak(utterance)
  }

  const sizeClasses = {
    sm: 'w-9 h-9 text-base',
    md: 'w-12 h-12 text-xl',
    lg: 'w-14 h-14 text-2xl',
  }

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
      aria-label="Play pronunciation"
    >
      🔊
    </motion.button>
  )
}
