import type { Palette } from '../color/types'
import { colorsToTuple } from '../color/types'
import { usePalette } from '../store/usePalette'
import PaletteCard from './PaletteCard'

interface PaletteGridProps {
  palettes: Palette[]
  /** Show the favorite (star) toggle on each card. */
  savable?: boolean
  hideModel?: boolean
}

export default function PaletteGrid({ palettes, savable, hideModel }: PaletteGridProps) {
  const applyPalette = usePalette((s) => s.applyPalette)
  const current = usePalette((s) => s.colors)
  const saved = usePalette((s) => s.saved)
  const savePalette = usePalette((s) => s.savePalette)
  const removeSaved = usePalette((s) => s.removeSaved)

  const currentTuple = colorsToTuple(current)
  const eq = (a: [string, string, string], b: [string, string, string]) =>
    a.every((v, i) => v.toLowerCase() === b[i].toLowerCase())

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {palettes.map((p, i) => {
        const savedIndex = saved.findIndex((s) => eq(s.colors, p.colors))
        return (
          <PaletteCard
            key={`${p.name}-${i}`}
            palette={p}
            active={eq(currentTuple, p.colors)}
            hideModel={hideModel}
            onApply={() => applyPalette(p)}
            saved={savable ? savedIndex >= 0 : undefined}
            onToggleSave={
              savable
                ? () => (savedIndex >= 0 ? removeSaved(savedIndex) : savePalette(p))
                : undefined
            }
          />
        )
      })}
    </div>
  )
}
