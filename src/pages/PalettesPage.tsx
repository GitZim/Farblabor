import { useMemo, useState } from 'react'
import LogoPreviewCard from '../components/LogoPreviewCard'
import PaletteGrid from '../components/PaletteGrid'
import { PALETTE_GROUPS } from '../color/palettes'
import { usePalette } from '../store/usePalette'

export default function PalettesPage() {
  const saved = usePalette((s) => s.saved)
  const [active, setActive] = useState<string>('alle')

  const totalCount = useMemo(
    () => PALETTE_GROUPS.reduce((n, g) => n + g.palettes.length, 0),
    [],
  )
  const groups =
    active === 'alle' ? PALETTE_GROUPS : PALETTE_GROUPS.filter((g) => g.id === active)

  const chips = [
    { id: 'alle', title: 'Alle' },
    ...PALETTE_GROUPS.map((g) => ({ id: g.id, title: g.title })),
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <LogoPreviewCard />
      </aside>

      <div className="flex flex-col gap-5">
        <header>
          <h1 className="text-lg font-semibold">Paletten</h1>
          <p className="mt-1 text-sm text-ink-faint">
            {totalCount} kuratierte Tricolor-Paletten in {PALETTE_GROUPS.length} Kategorien.
            Klick überträgt sie direkt aufs Logo; mit dem Stern merkst du dir Favoriten.
          </p>
        </header>

        <div className="sticky top-14 z-[5] -mx-1 flex flex-wrap gap-1.5 bg-surface-sunken/95 px-1 py-2 backdrop-blur">
          {chips.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`pill border text-sm ${
                active === c.id
                  ? 'border-brand bg-brand/5 font-medium text-ink'
                  : 'border-surface-line text-ink-soft hover:border-brand/40 hover:text-ink'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        {active === 'alle' && saved.length > 0 && (
          <section>
            <h2 className="mb-1 text-sm font-medium text-ink">Favoriten</h2>
            <p className="mb-3 text-xs text-ink-faint">Lokal in diesem Browser gespeichert.</p>
            <PaletteGrid palettes={saved} savable />
          </section>
        )}

        {groups.map((group) => (
          <section key={group.id}>
            <h2 className="mb-1 text-sm font-medium text-ink">{group.title}</h2>
            <p className="mb-3 text-xs text-ink-faint">{group.blurb}</p>
            <PaletteGrid palettes={group.palettes} savable />
          </section>
        ))}
      </div>
    </div>
  )
}
