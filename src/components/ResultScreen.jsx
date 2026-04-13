import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AudioButton from './AudioButton.jsx';

// ── Accuracy rating table (PRD §7) ────────────────────────────────────────────
const RATINGS = [
  { max: 0, emoji: '🌟', label: 'Perfect', message: 'Flawless!' },
  { max: 1, emoji: '⭐', label: 'Excellent', message: 'Almost perfect!' },
  { max: 2, emoji: '👍', label: 'Great', message: 'Well done!' },
  { max: 3, emoji: '🙂', label: 'Good', message: 'Good effort!' },
  { max: 4, emoji: '💪', label: 'Keep Going', message: "You're learning!" },
  { max: Infinity, emoji: '🌱', label: 'Just Starting', message: 'Every expert was once a beginner!' },
];

// Matches THEME_GRADIENTS in IntroScreen
const THEME_GRADIENTS = {
  food: 'from-orange-400 to-red-400',
  body: 'from-blue-400 to-cyan-400',
  nature: 'from-green-400 to-teal-400',
  home: 'from-amber-400 to-orange-400',
  numbers: 'from-purple-400 to-violet-400',
  education: 'from-indigo-400 to-blue-400',
  people: 'from-pink-400 to-rose-400',
  music: 'from-violet-400 to-purple-400',
  emotion: 'from-rose-400 to-pink-400',
  technology: 'from-slate-400 to-gray-500',
  places: 'from-teal-400 to-emerald-400',
  animals: 'from-lime-400 to-green-400',
  transportation: 'from-sky-400 to-blue-400',
};

function getRating(mistakes) {
  return RATINGS.find((r) => mistakes <= r.max) ?? RATINGS[RATINGS.length - 1];
}

// ── Syllable breakdown row ─────────────────────────────────────────────────────
function SyllableBreakdown({ syllable }) {
  const { components, block } = syllable;
  const parts = ['초성', '중성', '종성'].map((k) => components[k]).filter(Boolean);

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {parts.map((part, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-700 leading-none" style={{ fontFamily: 'var(--font-korean)' }}>
            {part}
          </span>
          {i < parts.length - 1 && <span className="text-slate-300 text-base font-light select-none">+</span>}
        </span>
      ))}
      <span className="text-slate-300 text-base font-light select-none mx-0.5">=</span>
      <span className="text-2xl font-black text-violet-600 leading-none" style={{ fontFamily: 'var(--font-korean)' }}>
        {block}
      </span>
    </div>
  );
}

// ── Main screen ────────────────────────────────────────────────────────────────
export default function ResultScreen() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { word, mistakes = 0 } = state ?? {};

  const [imgError, setImgError] = useState(false);

  // Redirect to intro if navigated directly without state
  useEffect(() => {
    if (!word) navigate('/', { replace: true });
  }, [word, navigate]);

  // Vibration feedback on completion (PRD §8)
  useEffect(() => {
    if (!word) return;
    if (navigator.vibrate) navigator.vibrate([80, 40, 80, 40, 150]);
  }, [word]);

  if (!word) return null;

  const rating = getRating(mistakes);
  const gradient = THEME_GRADIENTS[word.theme] ?? 'from-violet-400 to-indigo-400';

  function handlePlayAgain() {
    if (navigator.vibrate) navigator.vibrate(30);
    navigate('/', { replace: true });
  }

  return (
    <motion.div
      className="absolute inset-0 overflow-y-auto bg-linear-to-b from-violet-50 via-white to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'tween', ease: 'easeOut', duration: 0.35 }}>
      <div className="flex flex-col items-center w-full max-w-md mx-auto px-5 pt-12 pb-12 gap-0">
        {/* ── Checkmark — spring pop (PRD §8) ── */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 380, damping: 18, delay: 0.25 }}
          className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5 shadow-sm">
          <svg
            viewBox="0 0 40 40"
            className="w-10 h-10 text-green-500"
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

        {/* ── Title ── */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.45 }}
          className="text-lg font-semibold text-slate-700 mb-8 tracking-tight">
          Today's word complete!
        </motion.h1>

        {/* ── Word card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.55 }}
          className="w-full flex flex-col items-center gap-4 mb-8">
          {/* Image */}
          <div className="relative">
            {!imgError ? (
              <img src={word.image} alt={word.english} onError={() => setImgError(true)} className="w-36 h-36 rounded-3xl object-cover shadow-lg" />
            ) : (
              <div
                className={`w-36 h-36 rounded-3xl bg-linear-to-br ${gradient}
                flex items-center justify-center shadow-lg`}>
                <span className="text-5xl font-black text-white drop-shadow" style={{ fontFamily: 'var(--font-korean)' }}>
                  {word.korean}
                </span>
              </div>
            )}
          </div>

          {/* Korean + meaning */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
              <span className="text-5xl font-black text-slate-900 leading-none" style={{ fontFamily: 'var(--font-korean)' }}>
                {word.korean}
              </span>
              <AudioButton text={word.korean} size="sm" />
            </div>
            <p className="text-base font-medium text-slate-500 mt-1">
              {word.english}
              {word.emoji && <span className="ml-2">{word.emoji}</span>}
            </p>
          </div>
        </motion.div>

        {/* ── Divider ── */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.65 }}
          className="w-full h-px bg-slate-100 mb-8 origin-left"
        />

        {/* ── Rating ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.72 }}
          className="flex flex-col items-center gap-1 mb-8">
          <span className="text-4xl leading-none mb-1">{rating.emoji}</span>
          <p className="text-xl font-bold text-slate-800 tracking-tight">{rating.label}</p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.95 }} className="text-sm text-slate-500">
            {rating.message}
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 1.05 }} className="text-xs text-slate-300 mt-0.5">
            {mistakes === 0 ? 'No mistakes' : `${mistakes} mistake${mistakes === 1 ? '' : 's'}`}
          </motion.p>
        </motion.div>

        {/* ── Divider ── */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.9 }}
          className="w-full h-px bg-slate-100 mb-8 origin-left"
        />

        {/* ── Syllable breakdown ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 1.0 }}
          className="w-full flex flex-col items-center gap-3 mb-10">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Syllable breakdown</p>
          <div className="flex flex-col items-center gap-2.5 w-full">
            {word.syllables.map((syl, i) => (
              <SyllableBreakdown key={i} syllable={syl} />
            ))}
          </div>
        </motion.div>

        {/* ── Play Again CTA ── */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 1.12 }}
          whileTap={{ scale: 0.96 }}
          onClick={handlePlayAgain}
          className="w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-700
            text-white text-lg font-bold shadow-lg shadow-violet-200
            transition-colors cursor-pointer">
          Play Again
        </motion.button>
      </div>
    </motion.div>
  );
}
