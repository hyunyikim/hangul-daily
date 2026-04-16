# 한글 Daily — Product Requirements Document

**Version:** 1.2  
**Status:** Draft  
**Platform:** Web App (React)  
**Last Updated:** April 2026

---

## 1. Product Overview

**Hangul Daily** is a daily Korean learning puzzle web app targeted at absolute beginners. It keeps the quick, satisfying feel of a daily puzzle game while adding real educational value: teaching users how Korean syllable blocks (글자) are constructed from individual consonants (자음) and vowels (모음).

Each day, the app presents one beginner-level Korean word. The user learns its meaning, then builds each syllable of the word by selecting the correct 자음 and 모음 tiles — like assembling pieces of a puzzle. Once all syllables are built, they are placed into the word grid to complete the puzzle.

**Wordle meets Duolingo, specifically designed to teach Korean literacy from the ground up.** It is not just a word game — it is a micro-lesson delivered in under two minutes a day.

---

## 2. Problem Statement

Most Korean learning apps (Duolingo, Drops, etc.) teach vocabulary by showing whole words and asking users to recognise or match them. Very few apps teach the underlying structure of Hangul — the fact that every Korean syllable is a block composed of 2–3 phonetic components. Without this knowledge, beginners struggle to read or write new words on their own.

Hangul Daily addresses this gap by making the act of building syllables the core game mechanic, so users learn the system — not just the words.

---

## 3. Target Users

- A complete beginner who is starting to learn Korean
- Has little or no prior knowledge of 자음/모음 (the beginner level covers this)
- Engages with short, daily micro-learning content (similar to Wordle or Duolingo habits)
- Uses a phone or desktop browser — no app download required

---

## 4. Core Game Concept

### 4.1 How Korean Syllables Work (Context)

Every Korean syllable block is composed of:

- **초성** — Initial consonant (e.g. ㅂ)
- **중성** — Vowel (e.g. ㅏ)
- **종성** — Optional final consonant (e.g. ㅂ)

**Example:** ㅂ + ㅏ + ㅂ = 밥 (rice)

The game teaches this construction process interactively, making it memorable through repetition and immediate feedback.

### 4.2 The Two-Layer Puzzle

The game has two distinct puzzle layers, played in sequence:

**Layer 1 — Build the Syllable**

The user is presented with a set of individual tiles (자음 and 모음) and must tap them into the correct slots (초성 / 중성 / 종성) to assemble the syllable block.

- Each tile shows only **one single character** — either one 자음 or one 모음, never a combination
- All tiles for the current syllable (자음 and 모음 combined) are shown at once in a single shuffled bank — the user is not guided toward specific slots
- Decoy tiles are carefully chosen to teach common mix-ups (e.g. ㅏ vs ㅓ, ㅂ vs ㅍ)
- When the user first enters the game screen, 초성 is selected by default
- The user can tap any slot in the word grid to switch selection; tapping a filled slot clears it for re-entry
- A live preview renders the syllable block in real time as tiles are placed
- **The syllable is validated only when all required slots are fully filled.** If any slot is incorrect, the wrong cells shake and clear — one mistake is recorded per failed submission, not per tile

**Layer 2 — Place the Syllable into the Word**

Once a syllable is correctly built, it animates into its correct position in the word grid at the top of the screen. The user repeats Layer 1 for each syllable in the word until the full word is assembled.

### 4.3 Daily Word

Each day features one word chosen from a curated list of common vocabulary grouped by theme (food, body, nature, numbers, colours, etc.). The English meaning, an image, and audio pronunciation are shown before the game starts — the user always knows what word they are building. The challenge is purely about the construction, not guessing.

---

## 5. Difficulty Levels

The user selects a difficulty level on Screen 1 before starting. The level affects word complexity only — the core mechanic stays the same across all levels.

| Level           | Description                                  | 종성 Included | Example Words    |
| --------------- | -------------------------------------------- | ------------- | ---------------- |
| 🌱 Beginner     | Single-syllable words, simple 자음/모음      | Yes           | 밥, 물, 손, 눈   |
| 🔥 Intermediate | Two-syllable words, wider vocabulary         | Yes           | 사과, 학교, 친구 |
| ⭐ Advanced     | Three-syllable words, less common vocabulary | Yes           | 바나나, 컴퓨터   |

- Within the same level, word order is randomised — there is no fixed sequence
- The beginner level is designed to be accessible to users with zero prior knowledge of Hangul

---

## 6. User Flow

### Screen 1 — Intro / Word Reveal

1. Show the app name and level selector (Beginner / Intermediate / Advanced)
2. Display today's Korean word in large type
3. Show the word image (static asset, e.g. `/assets/images/밥.png`)
4. Show the English meaning and romanisation (e.g. "Rice · bap")
5. Play button to hear the pronunciation via Web Speech API
6. Show the syllable count (e.g. "This word has 1 syllable")
7. A prominent **Start** button begins the game

> **Note:** Romanisation is shown on Screen 1 only, to encourage learning the actual script during gameplay.

### Screen 2 — Syllable Builder

1. At the top: the word grid showing every syllable as a structured jamo grid
   - Each syllable group has **초성 | 중성** in the top row; if 종성 is present, it spans the full width in a second row below (matching the visual structure of a Korean syllable block as shown in the reference diagram)
   - Completed syllables show their placed jamo; the current syllable shows filled/empty cells; future syllables are dimmed
   - The user taps a cell to select that slot; tapping a filled cell clears it for re-entry
2. In the centre: a live preview renders the composed syllable block in real time as jamo are placed
3. Below the preview: all tiles for the current syllable shown at once in a single shuffled bank
   - 자음 and 모음 tiles are mixed together — the user must identify and route them correctly
   - Each tile shows one single 자음 or 모음 character only
   - Includes carefully chosen decoy tiles to teach common mix-ups
4. A sound button to replay the word pronunciation at any time
5. 초성 is selected by default when the screen first loads
6. On correct syllable completion → grid cells animate to completed style, next syllable loads
7. On incorrect syllable submission (all slots filled but some wrong) → wrong cells shake and clear, one mistake is recorded silently
8. **Syllable correctness is checked only when all required slots are fully filled** — individual tile placements are not validated
9. Vibration feedback on tile selection, slot selection, and puzzle completion

### Screen 3 — Result

1. Checkmark animation and message: "Today's word complete!"
2. Show the full word with its image and meaning
3. Syllable breakdown (e.g. ㅂ + ㅏ + ㅂ = 밥)
4. Accuracy rating with encouraging message shown below (see Section 7)
5. CTA: **Play Again**

---

## 7. Accuracy Rating System

No lives or punishment during gameplay — mistakes are tracked silently and shown only at the end. Every rating is framed positively to encourage the learner.

| Rating           | Condition   | Message                             |
| ---------------- | ----------- | ----------------------------------- |
| 🌟 Perfect       | 0 mistakes  | "Flawless!"                         |
| ⭐ Excellent     | 1 mistake   | "Almost perfect!"                   |
| 👍 Great         | 2 mistakes  | "Well done!"                        |
| 🙂 Good          | 3 mistakes  | "Good effort!"                      |
| 💪 Keep Going    | 4 mistakes  | "You're learning!"                  |
| 🌱 Just Starting | 5+ mistakes | "Every expert was once a beginner!" |

The rating is displayed prominently, with the encouraging message shown directly below it.

---

## 8. Animations

Animations are a core part of the experience — they make the app feel polished and provide meaningful feedback to the learner.

| Trigger                      | Animation                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------- |
| Tap a tile from the bank     | Tile **scales down** on tap and the target grid cell fills with a spring-pop animation      |
| Correct tile placed in slot  | Cell shows the jamo with a **green tint**; live preview updates instantly                   |
| Incorrect syllable submitted | Wrong grid cells **shake** horizontally and clear — tiles remain in the bank for retry      |
| Syllable fully completed     | Completed syllable block **flies** from the builder area into its position in the word grid |
| All syllables complete       | Word grid **bounces** as a whole, triggering the result screen transition                   |
| Slot selected / switched     | Selected slot **scales up** slightly with a highlight border                                |
| Screen 1 → Screen 2          | Smooth **slide-in** transition                                                              |
| Screen 2 → Screen 3          | **Fade + scale** transition into the result screen                                          |
| Result screen loads          | Checkmark animates in with a **spring pop**, rating fades in below                          |
| Vibration                    | On tile tap, slot tap, and puzzle completion (Web Vibration API, silent on desktop)         |

---

## 9. Feature Requirements

| Feature                   | Description                                                                 | Priority     |
| ------------------------- | --------------------------------------------------------------------------- | ------------ |
| Daily Word System         | One new word per day, auto-rotated by date index                            | Must Have    |
| Difficulty Level Selector | Beginner / Intermediate / Advanced, chosen on Screen 1                      | Must Have    |
| Word Intro Screen         | Word, image, English meaning, romanisation, audio, syllable count           | Must Have    |
| Audio Pronunciation       | Web Speech API, available on Screen 1 and Screen 2                          | Must Have    |
| Word Image                | Static image asset shown on Screen 1 and result screen                      | Must Have    |
| Syllable Builder UI       | Jamo cell grid per syllable (초성\|중성 top row, 종성 bottom row)           | Must Have    |
| Curated Tile Bank         | All tiles shown at once — 자음 and 모음 mixed in one bank                   | Must Have    |
| Default Slot Selection    | 초성 auto-selected on game screen load                                      | Must Have    |
| Live Syllable Preview     | Renders syllable block in real time as tiles are placed                     | Must Have    |
| Word Grid                 | Jamo cell structure visible for all syllables; interactive for current      | Must Have    |
| Final-step Validation     | Correctness checked only when all slots filled; wrong cells shake and clear | Must Have    |
| Syllable → Grid Animation | Correct syllable cells animate to completed style on submission             | Must Have    |
| Accuracy Rating System    | 6-tier rating shown on result screen with message                           | Must Have    |
| Syllable Breakdown        | Shows components on result screen (e.g. ㅂ+ㅏ+ㅂ=밥)                        | Must Have    |
| Replay Allowed            | User can replay even if already played today                                | Must Have    |
| Mobile Responsive         | Fully playable on phone viewports                                           | Must Have    |
| Vibration Feedback        | On tile selection, slot selection, and completion                           | Must Have    |
| Full Animation Suite      | All animations listed in Section 8                                          | Must Have    |
| Progress History          | Calendar view of past played days                                           | Nice to Have |
| Login / Sync              | Persist history across devices via Supabase                                 | Nice to Have |

---

## 10. Word Content Strategy

### 10.1 Word Selection Criteria

- **Beginner:** Single-syllable words with common 자음/모음 combinations. Includes 종성.
- **Intermediate:** Two-syllable words from everyday vocabulary.
- **Advanced:** Three-syllable words with less common vocabulary.
- All words come from common, recognisable vocabulary that beginners would encounter in daily life or K-pop/K-drama culture.

### 10.2 Theme Groups

| Theme      | Example Words      | English                          |
| ---------- | ------------------ | -------------------------------- |
| 🍚 Food    | 밥, 물, 국, 빵, 차 | Rice, Water, Soup, Bread, Tea    |
| 👁 Body    | 눈, 손, 발, 귀, 코 | Eye, Hand, Foot, Ear, Nose       |
| 🌿 Nature  | 산, 강, 불, 달, 해 | Mountain, River, Fire, Moon, Sun |
| 🎨 Colours | 빨강, 파랑, 초록   | Red, Blue, Green                 |
| 🔢 Numbers | 일, 이, 삼, 사, 오 | One, Two, Three, Four, Five      |
| 🏠 Home    | 방, 문, 창, 침대   | Room, Door, Window, Bed          |

### 10.3 Daily Rotation

Words are stored in a static `words.json` file. The app derives today's word using:

```js
const index = daysSinceEpoch % words.length;
```

No backend required. With 60+ words in the bank, content repeats only after two months.

### 10.4 Decoy Tile Strategy

Decoy tiles are chosen deliberately to teach common beginner mix-ups:

| Slot        | Common Confusion Pairs                 |
| ----------- | -------------------------------------- |
| 초성 / 종성 | ㅂ vs ㅍ, ㄱ vs ㅋ, ㄷ vs ㅌ, ㅅ vs ㅆ |
| 중성        | ㅏ vs ㅓ, ㅗ vs ㅜ, ㅐ vs ㅔ           |

---

## 11. Technical Architecture

### 11.1 Tech Stack

| Layer            | Choice                                   |
| ---------------- | ---------------------------------------- |
| Framework        | React 18 + Vite                          |
| Styling          | Tailwind CSS                             |
| Animations       | Framer Motion                            |
| State Management | React useState / useReducer              |
| Routing          | React Router v6 (3 screens)              |
| Audio            | Web Speech API (free, no backend)        |
| Word Data        | Static `words.json`                      |
| Persistence      | localStorage (last played date, history) |
| Hosting          | Vercel (free tier)                       |
| Optional Backend | Supabase (auth + history sync)           |

### 11.2 Component Breakdown

```
App.jsx                      — Routing, daily word loader, global game state
├── IntroScreen.jsx          — Word reveal, image, meaning, audio, level selector, Start button
├── GameScreen.jsx           — Orchestrates the syllable builder loop
│   ├── WordGrid.jsx         — Target word with filled/blank syllable slots
│   ├── SyllableBuilder.jsx  — 초성/중성/종성 slots + live preview
│   ├── TileBank.jsx         — Curated 자음/모음 tiles (one character per tile)
│   └── AudioButton.jsx      — Replay pronunciation via Web Speech API
└── ResultScreen.jsx         — Rating, message, breakdown, Play Again CTA

useDailyWord.js              — Custom hook: loads today's word by date index + level
words.json                   — Curated word bank with syllable component data
```

### 11.3 Word JSON Schema

```json
{
  "id": 1,
  "level": "beginner",
  "theme": "food",
  "emoji": "🍚",
  "image": "/assets/images/밥.png",
  "korean": "밥",
  "romanisation": "bap",
  "english": "Rice",
  "syllables": [
    {
      "block": "밥",
      "components": {
        "초성": "ㅂ",
        "중성": "ㅏ",
        "종성": "ㅂ"
      },
      "decoys": {
        "초성": ["ㄱ", "ㄷ"],
        "중성": ["ㅓ", "ㅗ"],
        "종성": ["ㄱ", "ㄹ"]
      }
    }
  ]
}
```

---

## 12. Result Screen Layout

```
        ✅ Today's word complete!

           밥 · Rice · 🍚
          [word image here]

        ——————————————————

              🌟 Perfect
           "Flawless!"

        ——————————————————

         ㅂ + ㅏ + ㅂ = 밥
         (syllable breakdown)

        ——————————————————

           [ Play Again ]
```

---

## 13. Todo List

### Setup

- [ ] Initialise project with Vite + React
- [ ] Install and configure Tailwind CSS
- [ ] Install Framer Motion
- [ ] Set up React Router v6 with 3 routes (intro / game / result)
- [ ] Create folder structure matching component breakdown

### Word Data

- [ ] Define `words.json` schema
- [ ] Author 15+ beginner words with components and decoys
- [ ] Author 10+ intermediate words
- [ ] Author 10+ advanced words
- [ ] Add placeholder image paths for all words
- [ ] Build `useDailyWord.js` hook with date-seeded index and level filter

### Screen 1 — Intro

- [ ] App title and logo
- [ ] Level selector (Beginner / Intermediate / Advanced)
- [ ] Display today's Korean word
- [ ] Display word image
- [ ] Display English meaning and romanisation
- [ ] Audio play button using Web Speech API
- [ ] Syllable count display
- [ ] Start button → navigate to game screen
- [ ] Slide-in transition to Screen 2

### Screen 2 — Game

- [ ] Word grid component with filled/blank slots
- [ ] Syllable builder with 초성 / 중성 / 종성 slots
- [ ] Auto-select 초성 on screen load
- [ ] Selected slot scales up with highlight border
- [ ] Tap slot to switch selection
- [ ] Tile bank with curated single-character tiles + decoys
- [ ] Swap tile bank content when slot selection changes
- [ ] Live syllable preview (renders in real time)
- [ ] Audio replay button
- [ ] Flying tile animation (bank → slot on tap, Framer Motion shared layout)
- [ ] Correct tile: slot pulses green, tile locks in
- [ ] Incorrect tile: tile shakes, returns to bank, record mistake silently
- [ ] Vibration on tile tap and slot tap
- [ ] On syllable complete: syllable flies into word grid position
- [ ] Load next syllable builder automatically
- [ ] On all syllables complete: word grid bounces → fade + scale to result screen

### Screen 3 — Result

- [ ] Checkmark spring pop animation on load
- [ ] Display word, image, and meaning
- [ ] Syllable breakdown display (e.g. ㅂ + ㅏ + ㅂ = 밥)
- [ ] Calculate accuracy rating from mistake count
- [ ] Display rating label
- [ ] Display encouraging message below rating (fade in)
- [ ] Vibration on completion
- [ ] Play Again button → reset game state and return to Screen 1

### Polish & QA

- [ ] Mobile responsive layout (test on 375px viewport)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Test Web Speech API on iOS and Android
- [ ] Test Vibration API on mobile devices
- [ ] Empty state handling (no word found for today)
- [ ] Replay flow testing (already played today → still works)

### Deploy

- [ ] Connect repo to Vercel
- [ ] Deploy and test on production URL
- [ ] Test on real mobile devices after deploy

---

_End of Document — Hangul Daily PRD v1.2_
