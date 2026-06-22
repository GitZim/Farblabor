import { useState } from 'react'
import PaletteGrid from '../PaletteGrid'
import { randomPalettes, type RandomStyle } from '../../color/generators'
import { usePalette } from '../../store/usePalette'

const COUNT = 14

const STYLES: { id: RandomStyle; label: string }[] = [
  { id: 'alle', label: 'Alle' },
  { id: 'gedaempft', label: 'Gedämpft' },
  { id: 'kraeftig', label: 'Kräftig' },
  { id: 'pastell', label: 'Pastell' },
  { id: 'tief', label: 'Tief' },
]

export default function GeneratorRandom() {
  const anker = usePalette((s) => s.colors.anker)
  const [style, setStyle] = useState<RandomStyle>('alle')
  const [keepAnchor, setKeepAnchor] = useState(false)
  const [palettes, setPalettes] = useState(() => randomPalettes(COUNT, 'alle'))

  const roll = (s: RandomStyle = style, keep: boolean = keepAnchor) =>
    setPalettes(randomPalettes(COUNT, s, keep ? anker : undefined))

  return (
    <div className="flex flex-col gap-6">
      <div className="card flex flex-col gap-4 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn btn-primary" onClick={() => roll()}>
            Neu würfeln
          </button>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={keepAnchor}
              onChange={(e) => {
                setKeepAnchor(e.target.checked)
                roll(style, e.target.checked)
              }}
            />
            Anker behalten
          </label>
        </div>

        <div>
          <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
            Charakter
          </div>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setStyle(s.id)
                  roll(s.id)
                }}
                className={`pill border ${
                  style === s.id
                    ? 'border-brand bg-brand/5 font-medium text-ink'
                    : 'border-surface-line text-ink-soft hover:border-brand/40 hover:text-ink'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-ink-faint">
          Zufällig über Farbton + Harmonie-Modell + Charakter — dadurch immer stimmig (kein reines
          RGB-Rauschen). Unter „Alle" mischen sich 15 Wildcard-Strategien abseits der Harmonie dazu
          (Golden-Angle, Jewel, Cyber, Vaporwave, Sorbet, Erdig, Clash, …).
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-medium text-ink">Ergebnis · Zufall</h2>
        <PaletteGrid palettes={palettes} savable hideModel />
      </section>
    </div>
  )
}
