import { useMemo, useState } from 'react'
import ColorPicker from '../ColorPicker'
import { contrastTricolors, type ContrastResult } from '../../color/generators'
import { colorsToTuple, type Palette } from '../../color/types'
import { usePalette } from '../../store/usePalette'

type Bg = 'hell' | 'dunkel'

function Badge({ label, ratio }: { label: string; ratio: number }) {
  const tone =
    ratio >= 3
      ? 'bg-emerald-50 text-emerald-700'
      : ratio >= 1.5
        ? 'bg-amber-50 text-amber-700'
        : 'bg-red-50 text-red-700'
  return (
    <span className={`rounded-md px-2 py-0.5 text-[11px] ${tone}`}>
      {label} · {ratio.toFixed(1)}
    </span>
  )
}

function ResultCard({ result, bg }: { result: ContrastResult; bg: Bg }) {
  const applyColors = usePalette((s) => s.applyColors)
  const saved = usePalette((s) => s.saved)
  const savePalette = usePalette((s) => s.savePalette)
  const removeSaved = usePalette((s) => s.removeSaved)

  const palette: Palette = { name: 'Kontrast', model: 'monochrom', colors: result.colors }
  const isSaved = saved.some(
    (s) => s.colors.join().toLowerCase() === result.colors.join().toLowerCase(),
  )

  return (
    <div className="card overflow-hidden">
      <div
        className="flex gap-2 p-3"
        style={{ background: bg === 'hell' ? '#ffffff' : '#0e1726' }}
      >
        {result.colors.map((c, i) => (
          <span
            key={i}
            className="h-10 flex-1 rounded-md border border-black/10"
            style={{ background: c }}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-wrap gap-1.5">
          {result.pairs.map((p) => (
            <Badge key={p.label} label={p.label} ratio={p.ratio} />
          ))}
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary flex-1" onClick={() => applyColors({ anker: result.colors[0], verbindung: result.colors[1], akzent: result.colors[2] })}>
            Anwenden
          </button>
          <button
            className="btn"
            aria-label={isSaved ? 'Aus Favoriten entfernen' : 'Merken'}
            onClick={() => {
              const idx = saved.findIndex(
                (s) => s.colors.join().toLowerCase() === result.colors.join().toLowerCase(),
              )
              idx >= 0 ? removeSaved(idx) : savePalette(palette)
            }}
          >
            {isSaved ? '★' : '☆'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function GeneratorContrast() {
  const colors = usePalette((s) => s.colors)
  const [base, setBase] = useState(colors.anker)
  const [bg, setBg] = useState<Bg>('hell')

  const results = useMemo(() => contrastTricolors(base), [base])

  return (
    <div className="flex flex-col gap-6">
      <div className="card flex flex-col gap-4 p-4">
        <h2 className="text-sm font-medium text-ink-soft">Basis-Farbton & Vorschau-Hintergrund</h2>
        <div className="flex items-center gap-3">
          <ColorPicker value={base} onChange={setBase} paletteSwatches={colorsToTuple(colors)} ariaLabel="Basisfarbe" />
          <span className="font-mono text-sm uppercase text-ink-soft">{base}</span>
          <div className="ml-auto flex gap-1 rounded-lg bg-surface-sunken p-1">
            {(['hell', 'dunkel'] as Bg[]).map((b) => (
              <button
                key={b}
                onClick={() => setBg(b)}
                className={`rounded-md px-2.5 py-1 text-xs capitalize transition ${
                  bg === b ? 'bg-surface text-ink shadow-sm' : 'text-ink-faint hover:text-ink'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-ink-faint">
          Es werden nur Tripel gezeigt, deren drei Elemente sich klar unterscheiden (Kontrast je
          Paar ≥ 1,5; ≥ 3,0 = stark). Sortiert nach schwächstem Paar.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-medium text-ink">Ergebnis · Kontrast-gesichert</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r, i) => (
            <ResultCard key={i} result={r} bg={bg} />
          ))}
        </div>
      </section>
    </div>
  )
}
