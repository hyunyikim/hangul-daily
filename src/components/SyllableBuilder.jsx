import { motion } from 'framer-motion'
import { composeHangul, COMPOUND_VOWELS } from '../utils/hangul.js'

function getLivePreview(placed, jungseong, hasJongsung) {
  const cho      = placed['초성']
  const compound = COMPOUND_VOWELS[jungseong]

  if (!cho) return null

  let jung
  if (compound) {
    // Compound vowel: need both parts before we can compose
    const V = placed['중성_V'], H = placed['중성_H']
    if (!V || !H) return cho  // show consonant alone until both parts placed
    jung = jungseong           // use the full compound vowel character
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
        className="w-28 h-28 rounded-3xl flex items-center justify-center border-2 bg-slate-50 border-slate-100"
      >
        {preview ? (
          <motion.span
            key={preview}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="text-6xl font-black text-slate-900"
            style={{ fontFamily: 'var(--font-korean)' }}
          >
            {preview}
          </motion.span>
        ) : (
          <span className="text-4xl text-slate-200">？</span>
        )}
      </motion.div>
      <span className="text-xs text-slate-400">미리보기 · Preview</span>
    </div>
  )
}
