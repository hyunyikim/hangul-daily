import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useDailyWord from '../hooks/useDailyWord.js';
import AudioButton from './AudioButton.jsx';

const LEVELS = [
  { id: 'beginner', label: '🌱 Beginner' },
  { id: 'intermediate', label: '🔥 Intermediate' },
  { id: 'advanced', label: '⭐ Advanced' },
];

const THEME_COLORS = {
  food: 'bg-orange-100 text-orange-700',
  body: 'bg-sky-100 text-sky-700',
  nature: 'bg-emerald-100 text-emerald-700',
  home: 'bg-amber-100 text-amber-700',
  numbers: 'bg-indigo-100 text-indigo-700',
  education: 'bg-blue-100 text-blue-700',
  people: 'bg-pink-100 text-pink-700',
  music: 'bg-fuchsia-100 text-fuchsia-700',
  emotion: 'bg-rose-100 text-rose-700',
  technology: 'bg-slate-100 text-slate-700',
  places: 'bg-teal-100 text-teal-700',
  animals: 'bg-lime-100 text-lime-700',
  transportation: 'bg-cyan-100 text-cyan-700',
};

export default function IntroScreen() {
  const navigate = useNavigate();
  const [level, setLevel] = useState('beginner');
  const [imgError, setImgError] = useState(false);
  const word = useDailyWord(level);

  const syllableCount = word?.syllables.length ?? 0;
  const themeColor = THEME_COLORS[word?.theme] ?? 'bg-blue-100 text-blue-700';

  function handleStart() {
    if (navigator.vibrate) navigator.vibrate(50);
    navigate('/game', { state: { word, level } });
  }

  function handleLevelChange(id) {
    setLevel(id);
    setImgError(false);
  }

  return (
    <motion.div
      className="absolute inset-0 overflow-y-auto"
      style={{ background: 'linear-gradient(180deg, #E9F0FB 0%, #F2F6FC 50%, #FAFBFE 100%)' }}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}>
      <div className="flex flex-col items-center min-h-full w-full max-w-md mx-auto px-5 pb-10">
        {/* Header */}
        <header className="w-full flex flex-col items-center pt-12 pb-6">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-ink)' }}>
              Hangul Daily
            </h1>
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--color-ink-muted)' }}>
            Learn one Korean word a day
          </p>
        </header>

        {/* Level Selector */}
        <div className="w-full flex gap-1 p-1 rounded-2xl mb-8" style={{ background: 'var(--color-paper-deep)' }}>
          {LEVELS.map((l) => (
            <button
              key={l.id}
              onClick={() => handleLevelChange(l.id)}
              className={`flex-1 py-2.5 px-1 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer
                ${level === l.id ? 'bg-white shadow-sm' : 'hover:bg-white/40'}`}
              style={{ color: level === l.id ? 'var(--color-blue)' : 'var(--color-ink-muted)' }}>
              {l.label}
            </button>
          ))}
        </div>

        {word ? (
          <>
            {/* Word Card */}
            <motion.div
              key={word.korean}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full rounded-3xl bg-white p-6 mb-6 flex flex-col items-center gap-4"
              style={{ boxShadow: '0 2px 16px rgba(91,143,212,0.08)' }}>
              {/* Image or fallback */}
              {!imgError ? (
                <img src={word.image} alt={word.english} onError={() => setImgError(true)} className="w-36 h-36 rounded-2xl object-cover" />
              ) : (
                <div className="w-36 h-36 rounded-2xl flex items-center justify-center" style={{ background: 'var(--color-blue-pale)' }}>
                  <span className="text-5xl">{word.emoji}</span>
                </div>
              )}

              {/* Korean Word */}
              <h2 className="text-7xl font-bold leading-none" style={{ fontFamily: 'var(--font-korean)', color: 'var(--color-ink)' }}>
                {word.korean}
              </h2>

              {/* English + Romanisation */}
              <p className="text-lg font-medium" style={{ color: 'var(--color-ink-light)' }}>
                {word.english}
                <span className="mx-2" style={{ color: 'var(--color-blue-soft)' }}>
                  ·
                </span>
                <span className="font-normal italic" style={{ color: 'var(--color-blue)' }}>
                  {word.romanisation}
                </span>
              </p>

              {/* Audio Button */}
              <AudioButton text={word.korean} size="md" />

              {/* Theme badge */}
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${themeColor}`}>
                {word.emoji} {word.theme}
              </span>
            </motion.div>

            {/* Syllable Count */}
            <motion.p
              key={`count-${word.korean}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-sm mb-8"
              style={{ color: 'var(--color-ink-muted)' }}>
              This word has{' '}
              <span className="font-semibold" style={{ color: 'var(--color-ink)' }}>
                {syllableCount}
              </span>{' '}
              {syllableCount === 1 ? 'syllable' : 'syllables'}
            </motion.p>

            {/* Start Button */}
            <motion.button
              onClick={handleStart}
              whileTap={{ scale: 0.96 }}
              className="w-full py-4 rounded-2xl text-white text-lg font-bold
                transition-colors cursor-pointer"
              style={{
                background: 'var(--color-blue)',
                boxShadow: '0 4px 16px rgba(91,143,212,0.25)',
              }}>
              Start →
            </motion.button>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm" style={{ color: 'var(--color-ink-muted)' }}>
              No word available for today.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
