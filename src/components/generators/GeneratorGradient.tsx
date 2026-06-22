import { useMemo, useState } from 'react'
import PaletteGrid from '../PaletteGrid'
import ColorPicker from '../ColorPicker'
import { gradientTricolors } from '../../color/generators'
import { colorsToTuple } from '../../color/types'
import { usePalette } from '../../store/usePalette'

export default function GeneratorGradient() {
  const colors = usePalette((s) => s.colors)
  const [from, setFrom] = useState(colors.anker)
  const [to, setTo] = useState(colors.akzent)

  const generated = useMemo(() => gradientTricolors(from, to), [from, to])
  const swatches = colorsToTuple(colors)

  return (
    <div className="flex flex-col gap-6">
      <div className="card flex flex-col gap-4 p-4">
        <h2 className="text-sm font-medium text-ink-soft">Zwei Endfarben wählen</h2>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ColorPicker value={from} onChange={setFrom} paletteSwatches={swatches} ariaLabel="Startfarbe" />
            <div className="text-xs">
              <div className="text-ink-faint">Von</div>
              <div className="font-mono uppercase text-ink-soft">{from}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right text-xs">
              <div className="text-ink-faint">Bis</div>
              <div className="font-mono uppercase text-ink-soft">{to}</div>
            </div>
            <ColorPicker value={to} onChange={setTo} paletteSwatches={swatches} ariaLabel="Endfarbe" />
          </div>
        </div>
        <div
          className="h-6 rounded-lg border border-surface-line"
          style={{ background: `linear-gradient(to right in oklch, ${from}, ${to})` }}
        />
        <p className="text-xs text-ink-faint">
          Die Verbindung wird als perzeptueller Mittelpunkt in OKLCH berechnet; die Rollen werden
          dunkel → hell sortiert.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-medium text-ink">Ergebnis · OKLCH-Verlauf</h2>
        <PaletteGrid palettes={generated} savable hideModel />
      </section>
    </div>
  )
}
