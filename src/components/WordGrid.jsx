import { motion } from 'framer-motion';
import { vowelLayout, COMPOUND_VOWELS } from '../utils/hangul.js';

const GAP = 4;

const CELL_CFG = {
  1: { px: 72, fontSize: 'text-2xl' },
  2: { px: 60, fontSize: 'text-xl' },
  3: { px: 48, fontSize: 'text-lg' },
};

function JamoCell({ char, isSelected, isShaking, status, cfg, fullWidth, onClick }) {
  const w = fullWidth ? cfg.px * 2 + GAP : cfg.px;
  const h = cfg.px;

  function cellStyle() {
    // Completed cells: white with character
    if (status === 'completed') {
      return {
        background: '#fff',
        border: '2px solid #D6E4F7',
      };
    }
    // Future cells: blue placeholder
    if (status !== 'current') {
      return {
        background: 'var(--color-blue-pale)',
        border: '2px solid transparent',
        opacity: 0.5,
      };
    }
    // Current cell states
    if (isShaking) {
      return {
        background: 'var(--color-red-soft)',
        border: '2px solid var(--color-red)',
      };
    }
    if (char) {
      return {
        background: '#fff',
        border: '2px solid var(--color-jade)',
      };
    }
    if (isSelected) {
      return {
        background: '#fff',
        border: '2px solid var(--color-blue)',
        boxShadow: '0 0 0 3px rgba(91,143,212,0.15)',
      };
    }
    // Empty unselected
    return {
      background: 'var(--color-blue-pale)',
      border: '2px dashed var(--color-blue-soft)',
    };
  }

  return (
    <motion.button
      onClick={status === 'current' ? onClick : undefined}
      animate={isShaking ? { x: [0, -9, 9, -9, 9, -5, 5, 0] } : { x: 0 }}
      transition={{ duration: 0.38 }}
      whileTap={status === 'current' ? { scale: 0.93 } : {}}
      className={`rounded-xl flex items-center justify-center font-bold
        ${cfg.fontSize}
        ${status === 'current' ? 'cursor-pointer' : 'cursor-default'}`}
      style={{
        width: w,
        height: h,
        fontFamily: 'var(--font-korean)',
        flexShrink: 0,
        color: 'var(--color-ink)',
        ...cellStyle(),
      }}>
      {char && (
        <motion.span
          key={char}
          initial={{ scale: 0.45, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}>
          {char}
        </motion.span>
      )}
    </motion.button>
  );
}

function SyllableGroup({ syl, status, jamo, vLayout, selectedSlot, shakingSlots, cfg, onSlotSelect }) {
  const hasJong = syl.components['종성'] !== null;

  const cell = (slot, fullWidth = false) => (
    <JamoCell
      key={slot}
      char={jamo[slot]}
      isSelected={selectedSlot === slot}
      isShaking={shakingSlots.includes(slot)}
      status={status}
      cfg={cfg}
      fullWidth={fullWidth}
      onClick={() => onSlotSelect(slot)}
    />
  );

  if (vLayout === 'vertical') {
    return (
      <div className="flex flex-col" style={{ gap: GAP }}>
        {cell('초성')}
        {cell('중성')}
        {hasJong && cell('종성')}
      </div>
    );
  }

  if (vLayout === 'compound') {
    return (
      <div className="flex flex-col" style={{ gap: GAP }}>
        <div className="flex" style={{ gap: GAP }}>
          {cell('초성')}
          {cell('중성_H')}
        </div>
        {cell('중성_V', true)}
        {hasJong && cell('종성', true)}
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ gap: GAP }}>
      <div className="flex" style={{ gap: GAP }}>
        {cell('초성')}
        {cell('중성')}
      </div>
      {hasJong && cell('종성', true)}
    </div>
  );
}

export default function WordGrid({ word, completedCount, currentIdx, placed, selectedSlot, shakingSlots, bouncing, onSlotSelect }) {
  const count = word.syllables.length;
  const cfg = CELL_CFG[Math.min(count, 3)];

  return (
    <motion.div
      className="flex items-center justify-center"
      style={{ gap: 16 }}
      animate={bouncing ? { y: [0, -18, 0, -10, 0, -5, 0] } : { y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}>
      {word.syllables.map((syl, i) => {
        const status = i < completedCount ? 'completed' : i === currentIdx ? 'current' : 'future';
        const vLay = vowelLayout(syl.components['중성']);
        const compound = COMPOUND_VOWELS[syl.components['중성']];

        const jamo = {
          초성: status === 'completed' ? syl.components['초성'] : status === 'current' ? placed['초성'] : null,
          중성: status === 'completed' ? syl.components['중성'] : status === 'current' ? placed['중성'] : null,
          중성_V: status === 'completed' ? compound?.[0] : status === 'current' ? placed['중성_V'] : null,
          중성_H: status === 'completed' ? compound?.[1] : status === 'current' ? placed['중성_H'] : null,
          종성: status === 'completed' ? syl.components['종성'] : status === 'current' ? placed['종성'] : null,
        };

        return (
          <SyllableGroup
            key={i}
            syl={syl}
            status={status}
            jamo={jamo}
            vLayout={vLay}
            selectedSlot={status === 'current' ? selectedSlot : null}
            shakingSlots={status === 'current' ? shakingSlots : []}
            cfg={cfg}
            onSlotSelect={status === 'current' ? onSlotSelect : () => {}}
          />
        );
      })}
    </motion.div>
  );
}
