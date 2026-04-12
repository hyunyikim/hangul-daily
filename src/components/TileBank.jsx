import { motion } from 'framer-motion'

export default function TileBank({ tiles, onTileTap }) {
  const cols = tiles.length <= 4 ? 'grid-cols-4' : tiles.length <= 6 ? 'grid-cols-3' : 'grid-cols-4'

  return (
    <div className={`grid ${cols} gap-2 w-full max-w-xs mx-auto mt-2`}>
      {tiles.map((tile, i) => (
        <motion.button
          key={`${tile}-${i}`}
          onClick={() => onTileTap(tile)}
          whileTap={{ scale: 0.88 }}
          className="h-14 rounded-xl bg-slate-50 border-2 border-slate-200
            hover:border-violet-300 hover:bg-violet-50
            flex items-center justify-center
            text-3xl font-bold text-slate-900
            cursor-pointer transition-colors shadow-sm select-none"
          style={{ fontFamily: 'var(--font-korean)' }}
        >
          {tile}
        </motion.button>
      ))}
    </div>
  )
}
