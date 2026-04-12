import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useDailyWord from '../hooks/useDailyWord.js'
import AudioButton from './AudioButton.jsx'

const LEVELS = [
  { id: 'beginner',     label: '🌱 Beginner' },
  { id: 'intermediate', label: '🔥 Intermediate' },
  { id: 'advanced',     label: '⭐ Advanced' },
]

const THEME_GRADIENTS = {
  food:           'from-orange-400 to-red-400',
  body:           'from-blue-400 to-cyan-400',
  nature:         'from-green-400 to-teal-400',
  home:           'from-amber-400 to-orange-400',
  numbers:        'from-purple-400 to-violet-400',
  education:      'from-indigo-400 to-blue-400',
  people:         'from-pink-400 to-rose-400',
  music:          'from-violet-400 to-purple-400',
  emotion:        'from-rose-400 to-pink-400',
  technology:     'from-slate-400 to-gray-500',
  places:         'from-teal-400 to-emerald-400',
  animals:        'from-lime-400 to-green-400',
  transportation: 'from-sky-400 to-blue-400',
}

export default function IntroScreen() {
  const navigate = useNavigate()
  const [level, setLevel] = useState('beginner')
  const [imgError, setImgError] = useState(false)
  const word = useDailyWord(level)

  const syllableCount = word?.syllables.length ?? 0
  const gradient = THEME_GRADIENTS[word?.theme] ?? 'from-violet-400 to-indigo-400'

  function handleStart() {
    if (navigator.vibrate) navigator.vibrate(50)
    navigate('/game', { state: { word, level } })
  }

  function handleLevelChange(id) {
    setLevel(id)
    setImgError(false)
  }

  return (
    <motion.div
      className="absolute inset-0 overflow-y-auto bg-linear-to-b from-violet-50 via-white to-white"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
    >
      <div className="flex flex-col items-center min-h-full w-full max-w-md mx-auto px-5 pb-10">

        {/* Header */}
        <header className="w-full flex flex-col items-center pt-12 pb-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl">한</span>
            <h1 className="text-2xl font-bold tracking-tight text-violet-700">
              Hangul Daily
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">Learn one Korean word a day</p>
        </header>

        {/* Level Selector */}
        <div className="w-full flex gap-1 p-1 bg-slate-100 rounded-2xl mb-8">
          {LEVELS.map(l => (
            <button
              key={l.id}
              onClick={() => handleLevelChange(l.id)}
              className={`flex-1 py-2 px-1 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer
                ${level === l.id
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {word ? (
          <>
            {/* Word Image */}
            <motion.div
              key={word.korean}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              {!imgError ? (
                <img
                  src={word.image}
                  alt={word.english}
                  onError={() => setImgError(true)}
                  className="w-44 h-44 rounded-3xl object-cover shadow-lg"
                />
              ) : (
                <div className={`w-44 h-44 rounded-3xl bg-linear-to-br ${gradient}
                  flex items-center justify-center shadow-lg`}>
                  <span
                    className="text-6xl font-black text-white drop-shadow"
                    style={{ fontFamily: 'var(--font-korean)' }}
                  >
                    {word.korean}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Korean Word */}
            <motion.div
              key={`word-${word.korean}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="flex flex-col items-center gap-3 mb-6"
            >
              <h2
                className="text-7xl font-black text-slate-900 leading-none"
                style={{ fontFamily: 'var(--font-korean)' }}
              >
                {word.korean}
              </h2>

              {/* English + Romanisation */}
              <p className="text-xl font-medium text-slate-600">
                {word.english}
                <span className="text-slate-300 mx-2">·</span>
                <span className="text-violet-500 font-normal italic">{word.romanisation}</span>
              </p>

              {/* Audio Button */}
              <AudioButton text={word.korean} size="md" />
            </motion.div>

            {/* Syllable Count */}
            <motion.p
              key={`count-${word.korean}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-sm text-slate-400 mb-10"
            >
              This word has{' '}
              <span className="font-semibold text-slate-600">{syllableCount}</span>{' '}
              {syllableCount === 1 ? 'syllable' : 'syllables'}
            </motion.p>

            {/* Start Button */}
            <motion.button
              onClick={handleStart}
              whileTap={{ scale: 0.96 }}
              className="w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-700
                text-white text-lg font-bold shadow-lg shadow-violet-200
                transition-colors cursor-pointer"
            >
              Start →
            </motion.button>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-400 text-sm">No word available for today.</p>
          </div>
        )}

      </div>
    </motion.div>
  )
}
