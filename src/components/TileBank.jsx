import { motion } from 'framer-motion'

export default function TileBank({ tiles, onTileTap }) {
  const cols = tiles.length <= 4 ? 'grid-cols-4' : tiles.length <= 6 ? 'grid-cols-3' : 'grid-cols-4'

  return (
    <div className={`grid ${cols} gap-2.5 w-full max-w-xs mx-auto mt-2`}>
      {tiles.map((tile, i) => (
        <motion.button
          key={`${tile}-${i}`}
          onClick={() => onTileTap(tile)}
          whileTap={{ scale: 0.88 }}
          className="h-14 rounded-2xl flex items-center justify-center
            text-2xl font-bold text-white
            cursor-pointer transition-colors select-none"
          style={{
            fontFamily: 'var(--font-korean)',
            background: 'var(--color-tile-bg)',
            border: '1px solid var(--color-tile-border)',
          }}
        >
          {tile}
        </motion.button>
      ))}
    </div>
  )
}
