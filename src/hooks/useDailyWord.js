import words from '../data/words.json'

/**
 * Returns today's word for the given difficulty level.
 * Word rotates daily using: daysSinceEpoch % filteredWords.length
 */
export default function useDailyWord(level) {
  const filtered = words.filter(w => w.level === level)
  if (filtered.length === 0) return null

  const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
  const index = daysSinceEpoch % filtered.length

  return filtered[index]
}
