import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import WordGrid from './WordGrid.jsx'
import SyllableBuilder from './SyllableBuilder.jsx'
import TileBank from './TileBank.jsx'
import AudioButton from './AudioButton.jsx'
import { shuffle, vowelLayout, COMPOUND_VOWELS } from '../utils/hangul.js'

const EMPTY_PLACED = { '초성': null, '중성': null, '중성_V': null, '중성_H': null, '종성': null }

export default function GameScreen() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { word, level } = state ?? {}

  const [currentIdx,     setCurrentIdx]     = useState(0)
  const [selectedSlot,   setSelectedSlot]   = useState('초성')
  const [placed,         setPlaced]         = useState(EMPTY_PLACED)
  const [completedCount, setCompletedCount] = useState(0)
  const [mistakes,       setMistakes]       = useState(0)
  const [shakingSlots,   setShakingSlots]   = useState([])
  const [isCompleting,   setIsCompleting]   = useState(false)
  const [bouncing,       setBouncing]       = useState(false)

  useEffect(() => {
    if (!word) navigate('/', { replace: true })
  }, [word, navigate])

  if (!word) return null

  const currentSyllable = word.syllables[currentIdx]
  const jungseong       = currentSyllable?.components['중성']
  const vLayout         = vowelLayout(jungseong)
  const isCompound      = vLayout === 'compound'
  const hasJongsung     = currentSyllable?.components['종성'] !== null

  // Active slots depend on vowel layout type
  const activeSlots = useMemo(() => {
    const slots = ['초성']
    if (isCompound) {
      slots.push('중성_V', '중성_H')
    } else {
      slots.push('중성')
    }
    if (hasJongsung) slots.push('종성')
    return slots
  }, [isCompound, hasJongsung])

  const TILE_LIMIT = level === 'beginner' ? 4 : level === 'intermediate' ? 6 : 8

  // Combined tile bank — correct tiles always included; decoys fill up to TILE_LIMIT.
  const tiles = useMemo(() => {
    const syl = word.syllables[currentIdx]
    if (!syl) return []
    const compound = COMPOUND_VOWELS[syl.components['중성']]
    const corrects = []
    const allDecoys = []
    for (const slot of activeSlots) {
      let correct, decoys
      if (slot === '중성_V') {
        correct = compound?.[0]
        decoys  = syl.decoys?.['중성_V'] ?? []
      } else if (slot === '중성_H') {
        correct = compound?.[1]
        decoys  = syl.decoys?.['중성_H'] ?? []
      } else {
        correct = syl.components[slot]
        decoys  = syl.decoys?.[slot] ?? []
      }
      if (correct !== null && correct !== undefined) {
        corrects.push(correct)
        allDecoys.push(...decoys)
      }
    }
    const decoysNeeded = Math.max(0, TILE_LIMIT - corrects.length)
    const selectedDecoys = shuffle(allDecoys).slice(0, decoysNeeded)
    return shuffle([...corrects, ...selectedDecoys])
  }, [currentIdx, word, activeSlots, TILE_LIMIT])

  // ── Slot selection ──────────────────────────────────────────────────────
  function handleSlotSelect(slot) {
    if (isCompleting || !activeSlots.includes(slot)) return
    if (navigator.vibrate) navigator.vibrate(20)
    if (placed[slot] !== null) {
      setPlaced(p => ({ ...p, [slot]: null }))
    }
    setSelectedSlot(slot)
  }

  // ── Tile tap ────────────────────────────────────────────────────────────
  function handleTileTap(tile) {
    if (isCompleting) return
    if (navigator.vibrate) navigator.vibrate(30)

    const newPlaced = { ...placed, [selectedSlot]: tile }
    setPlaced(newPlaced)

    const allFilled = activeSlots.every(s => newPlaced[s] !== null)
    if (allFilled) {
      validateSyllable(newPlaced)
    } else {
      const nextEmpty = activeSlots.find(s => newPlaced[s] === null)
      if (nextEmpty) setSelectedSlot(nextEmpty)
    }
  }

  // ── Final-step validation ───────────────────────────────────────────────
  function validateSyllable(newPlaced) {
    const components = currentSyllable.components
    const compound   = COMPOUND_VOWELS[components['중성']]
    const wrong = activeSlots.filter(s => {
      if (s === '중성_V') return newPlaced[s] !== compound?.[0]
      if (s === '중성_H') return newPlaced[s] !== compound?.[1]
      return newPlaced[s] !== components[s]
    })

    if (wrong.length === 0) {
      handleSyllableComplete(currentSyllable.block, mistakes)
    } else {
      setMistakes(m => m + 1)
      setShakingSlots(wrong)
      setTimeout(() => {
        setShakingSlots([])
        setPlaced(p => {
          const cleared = { ...p }
          wrong.forEach(s => { cleared[s] = null })
          return cleared
        })
        setSelectedSlot(wrong[0])
      }, 480)
    }
  }

  // ── Syllable complete ───────────────────────────────────────────────────
  function handleSyllableComplete(block, currentMistakes) {
    if (navigator.vibrate) navigator.vibrate([40, 20, 80])
    setIsCompleting(true)
    const newCount = completedCount + 1

    if (newCount < word.syllables.length) {
      setTimeout(() => {
        setIsCompleting(false)
        setCompletedCount(newCount)
        setCurrentIdx(i => i + 1)
        setPlaced(EMPTY_PLACED)
        setSelectedSlot('초성')
      }, 700)
    } else {
      setCompletedCount(newCount)
      if (navigator.vibrate) navigator.vibrate([80, 40, 80, 40, 150])
      setBouncing(true)
      setTimeout(() => {
        navigate('/result', { state: { word, level, mistakes: currentMistakes } })
      }, 1600)
    }
  }

  return (
    <motion.div
      className="absolute inset-0 overflow-y-auto bg-white"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
    >
      <div className="flex flex-col items-center w-full max-w-md mx-auto px-5 pt-10 pb-10 gap-6">

        {/* ── Word image ── */}
        {word.image && (
          <img
            src={word.image}
            alt={word.english}
            className="w-24 h-24 object-cover rounded-2xl shadow-sm"
          />
        )}

        {/* ── Word Grid ── */}
        <WordGrid
          word={word}
          completedCount={completedCount}
          currentIdx={currentIdx}
          placed={placed}
          selectedSlot={selectedSlot}
          shakingSlots={shakingSlots}
          bouncing={bouncing}
          onSlotSelect={handleSlotSelect}
        />

        {/* ── Audio + progress ── */}
        <div className="flex items-center gap-3">
          <AudioButton text={word.korean} size="sm" />
          <p className="text-xs text-slate-400">
            Syllable{' '}
            <span className="font-semibold text-slate-600">{currentIdx + 1}</span>
            {' '}of{' '}
            <span className="font-semibold text-slate-600">{word.syllables.length}</span>
          </p>
        </div>

        {/* ── Live preview (hidden during completion pause) ── */}
        {!isCompleting && (
          <SyllableBuilder
            placed={placed}
            jungseong={jungseong}
            hasJongsung={hasJongsung}
          />
        )}

        {/* ── Combined tile bank (hidden during completion pause) ── */}
        {!isCompleting && (
          <TileBank tiles={tiles} onTileTap={handleTileTap} />
        )}

      </div>
    </motion.div>
  )
}
