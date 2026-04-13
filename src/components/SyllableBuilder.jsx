import { motion } from 'framer-motion'
import { composeHangul, COMPOUND_VOWELS } from '../utils/hangul.js'

function getLivePreview(placed, jungseong, hasJongsung) {
  const cho      = placed['초성']
  const compound = COMPOUND_VOWELS[jungseong]

  if (!cho) return null

  let jung
  if (compound) {
    const V = placed['중성_V'], H = placed['중성_H']
    if (!V || !H) return cho
    jung = jungseong
  } else {
    jung = placed['중성']
    if (!jung) return cho
  }

  return composeHangul(cho, jung, hasJongsung ? placed['종성'] : null)
}

export default function SyllableBuilder({ placed, jungseong, hasJongsung }) {
  const preview = getLivePreview(placed, jungseong, hasJongsung)

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className="w-28 h-28 rounded-3xl flex items-center justify-center"
        style={{
          background: '#fff',
          border: '2px solid var(--color-paper-deep)',
          boxShadow: '0 2px 12px rgba(91,143,212,0.06)',
        }}
      >
        {preview ? (
          <motion.span
            key={preview}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="text-6xl font-bold"
            style={{ fontFamily: 'var(--font-korean)', color: 'var(--color-ink)' }}
          >
            {preview}
          </motion.span>
        ) : (
          <span className="text-4xl" style={{ color: 'var(--color-blue-soft)' }}>？</span>
        )}
      </motion.div>
      <span className="text-xs" style={{ color: 'var(--color-ink-muted)' }}>미리보기 · Preview</span>
    </div>
  )
}
