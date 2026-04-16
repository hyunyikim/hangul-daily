// Hangul syllable composition using Unicode math:
// syllable = 0xAC00 + (choIdx × 21 + jungIdx) × 28 + jongIdx

const CHOSUNG = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const JUNGSUNG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const JONGSUNG = [
  '',
  'ㄱ',
  'ㄲ',
  'ㄳ',
  'ㄴ',
  'ㄵ',
  'ㄶ',
  'ㄷ',
  'ㄹ',
  'ㄺ',
  'ㄻ',
  'ㄼ',
  'ㄽ',
  'ㄾ',
  'ㄿ',
  'ㅀ',
  'ㅁ',
  'ㅂ',
  'ㅄ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

/**
 * Compound vowels — each decomposes into [vertical-component, horizontal-component].
 * Vertical part sits below the consonant; horizontal part sits to the right.
 * e.g. ㅘ → ㅗ (below) + ㅏ (right)
 */
export const COMPOUND_VOWELS = {
  ㅘ: ['ㅗ', 'ㅏ'],
  ㅙ: ['ㅗ', 'ㅐ'],
  ㅚ: ['ㅗ', 'ㅣ'],
  ㅝ: ['ㅜ', 'ㅓ'],
  ㅞ: ['ㅜ', 'ㅐ'],
  ㅟ: ['ㅜ', 'ㅣ'],
  ㅢ: ['ㅡ', 'ㅣ'],
};

/** Vowels whose primary direction is below the consonant (not to the right). */
export const VERTICAL_VOWELS = new Set(['ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ']);

/**
 * Returns the visual layout type for a given jungseong character:
 * - 'horizontal' : consonant left, vowel right  (ㅏ ㅓ ㅣ …)
 * - 'vertical'   : consonant top, vowel below   (ㅗ ㅜ ㅡ …)
 * - 'compound'   : consonant top-left, vert-vowel below, horiz-vowel right (ㅘ ㅝ …)
 */
export function vowelLayout(vowel) {
  if (COMPOUND_VOWELS[vowel]) return 'compound';
  if (VERTICAL_VOWELS.has(vowel)) return 'vertical';
  return 'horizontal';
}

/**
 * Compose a Korean syllable block from its jamo components.
 * Returns just the 초성 character when 중성 is absent (partial preview).
 */
export function composeHangul(cho, jung, jong = null) {
  const choIdx = CHOSUNG.indexOf(cho);
  const jungIdx = JUNGSUNG.indexOf(jung);
  if (choIdx === -1 || jungIdx === -1) return cho ?? '';

  const jongIdx = jong ? Math.max(0, JONGSUNG.indexOf(jong)) : 0;
  return String.fromCharCode(0xac00 + (choIdx * 21 + jungIdx) * 28 + jongIdx);
}

/** Fisher-Yates shuffle — returns a new array */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
