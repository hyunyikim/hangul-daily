import beginner from '../data/words.beginner.json'
import intermediate from '../data/words.intermediate.json'
import advanced from '../data/words.advanced.json'

const wordsByLevel = { beginner, intermediate, advanced }

/**
 * Returns today's word for the given difficulty level.
 * Word rotates daily using: daysSinceEpoch % filteredWords.length
 */
export default function useDailyWord(level) {
  const filtered = wordsByLevel[level] ?? []
  if (filtered.length === 0) return null

  const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24))
  const index = daysSinceEpoch % filtered.length

  return filtered[index]
}
