import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AudioButton from './AudioButton.jsx';

const RATINGS = [
  { max: 0, emoji: '🌟', label: 'Perfect', message: 'Flawless!' },
  { max: 1, emoji: '⭐', label: 'Excellent', message: 'Almost perfect!' },
  { max: 2, emoji: '👍', label: 'Great', message: 'Well done!' },
  { max: 3, emoji: '🙂', label: 'Good', message: 'Good effort!' },
  { max: 4, emoji: '💪', label: 'Keep Going', message: "You're learning!" },
  {
    max: Infinity,
    emoji: '🌱',
    label: 'Just Starting',
    message: 'Every expert was once a beginner!',
  },
];

function getRating(mistakes) {
  return RATINGS.find((r) => mistakes <= r.max) ?? RATINGS[RATINGS.length - 1];
}

function SyllableBreakdown({ syllable }) {
  const { components, block } = syllable;
  const parts = ['초성', '중성', '종성'].map((k) => components[k]).filter(Boolean);

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {parts.map((part, i) => (
        <span key={i} className="flex items-center gap-2">
          <span
            className="text-2xl font-bold leading-none"
            style={{
              fontFamily: 'var(--font-korean)',
              color: 'var(--color-ink)',
            }}>
            {part}
          </span>
          {i < parts.length - 1 && (
            <span className="text-base font-light select-none" style={{ color: 'var(--color-blue-soft)' }}>
              +
            </span>
          )}
        </span>
      ))}
      <span className="text-base font-light select-none mx-0.5" style={{ color: 'var(--color-blue-soft)' }}>
        =
      </span>
      <span className="text-2xl font-bold leading-none" style={{ fontFamily: 'var(--font-korean)', color: 'var(--color-blue)' }}>
        {block}
      </span>
    </div>
  );
}

export default function ResultScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { word, mistakes = 0 } = state ?? {};

  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!word) navigate('/', { replace: true });
  }, [word, navigate]);

  useEffect(() => {
    if (!word) return;
    if (navigator.vibrate) navigator.vibrate([80, 40, 80, 40, 150]);
  }, [word]);

  if (!word) return null;

  const rating = getRating(mistakes);

  function handlePlayAgain() {
    if (navigator.vibrate) navigator.vibrate(30);
    navigate('/', { replace: true });
  }

  return (
    <motion.div
      className="absolute inset-0 overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #E9F0FB 0%, #F2F6FC 50%, #FAFBFE 100%)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'tween', ease: 'easeOut', duration: 0.35 }}>
      <div className="flex flex-col items-center w-full max-w-md mx-auto px-5 pt-12 pb-12 gap-0">
        {/* Checkmark */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 380,
            damping: 18,
            delay: 0.25,
          }}
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
          style={{ background: 'var(--color-jade-soft)' }}>
          <svg
            viewBox="0 0 40 40"
            className="w-10 h-10"
            style={{ color: 'var(--color-jade)' }}
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <motion.path
              d="M8 20 L17 29 L32 12"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.55, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.45 }}
          className="text-lg font-semibold mb-8 tracking-tight"
          style={{ color: 'var(--color-ink)' }}>
          Today's word complete!
        </motion.h1>

        {/* Word card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.55 }}
          className="w-full rounded-3xl bg-white p-6 flex flex-col items-center gap-4 mb-8"
          style={{ boxShadow: '0 2px 16px rgba(91,143,212,0.08)' }}>
          {!imgError ? (
            <img src={word.image} alt={word.english} onError={() => setImgError(true)} className="w-32 h-32 rounded-2xl object-cover" />
          ) : (
            <div className="w-32 h-32 rounded-2xl flex items-center justify-center" style={{ background: 'var(--color-blue-pale)' }}>
              <span className="text-5xl">{word.emoji}</span>
            </div>
          )}

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
              <span
                className="text-5xl font-bold leading-none"
                style={{
                  fontFamily: 'var(--font-korean)',
                  color: 'var(--color-ink)',
                }}>
                {word.korean}
              </span>
              <AudioButton text={word.korean} size="sm" />
            </div>
            <p className="text-base font-medium mt-1" style={{ color: 'var(--color-ink-muted)' }}>
              {word.english}
              {word.emoji && <span className="ml-2">{word.emoji}</span>}
            </p>
          </div>
        </motion.div>

        {/* Rating */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 22,
            delay: 0.72,
          }}
          className="flex flex-col items-center gap-1 mb-8">
          <span className="text-4xl leading-none mb-1">{rating.emoji}</span>
          <p className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-ink)' }}>
            {rating.label}
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.95 }}
            className="text-sm"
            style={{ color: 'var(--color-ink-muted)' }}>
            {rating.message}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.05 }}
            className="text-xs mt-0.5"
            style={{ color: 'var(--color-blue-soft)' }}>
            {mistakes === 0 ? 'No mistakes' : `${mistakes} mistake${mistakes === 1 ? '' : 's'}`}
          </motion.p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.9 }}
          className="w-full h-px mb-8 origin-left"
          style={{ background: 'var(--color-paper-deep)' }}
        />

        {/* Syllable breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 1.0 }}
          className="w-full flex flex-col items-center gap-3 mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-ink-muted)' }}>
            Syllable breakdown
          </p>
          <div className="flex flex-col items-center gap-2.5 w-full">
            {word.syllables.map((syl, i) => (
              <SyllableBreakdown key={i} syllable={syl} />
            ))}
          </div>
        </motion.div>

        {/* Play Again */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 1.12 }}
          whileTap={{ scale: 0.96 }}
          onClick={handlePlayAgain}
          className="w-full py-4 rounded-2xl text-white text-lg font-bold
            transition-colors cursor-pointer"
          style={{
            background: 'var(--color-blue)',
            boxShadow: '0 4px 16px rgba(91,143,212,0.25)',
          }}>
          Play Again
        </motion.button>
      </div>
    </motion.div>
  );
}
