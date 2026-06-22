import { useState } from 'react'
import LogoPreviewCard from '../components/LogoPreviewCard'
import GeneratorHarmony from '../components/generators/GeneratorHarmony'
import GeneratorImage from '../components/generators/GeneratorImage'
import GeneratorGradient from '../components/generators/GeneratorGradient'
import GeneratorContrast from '../components/generators/GeneratorContrast'
import GeneratorRandom from '../components/generators/GeneratorRandom'

type Model = 'harmonie' | 'foto' | 'verlauf' | 'kontrast' | 'zufall'

const MODELS: { id: Model; label: string; blurb: string }[] = [
  { id: 'harmonie', label: 'Harmonie', blurb: 'Geometrische Farbkreis-Beziehungen aus einer Basisfarbe.' },
  { id: 'foto', label: 'Foto-Extraktion', blurb: 'Farben aus einem Bild extrahieren (Median-Cut, clientseitig).' },
  { id: 'verlauf', label: 'Verlauf', blurb: 'Perzeptueller OKLCH-Verlauf zwischen zwei Endfarben.' },
  { id: 'kontrast', label: 'Kontrast', blurb: 'Tripel mit garantiert unterscheidbaren Elementen (WCAG).' },
  { id: 'zufall', label: 'Zufall', blurb: 'Stimmige Zufallspaletten über Farbton, Modell & Charakter.' },
]

export default function GeneratorPage() {
  const [model, setModel] = useState<Model>('harmonie')
  const active = MODELS.find((m) => m.id === model)!

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <LogoPreviewCard />
      </aside>

      <div className="flex flex-col gap-6">
        <header>
          <h1 className="text-lg font-semibold">Paletten-Generator</h1>
          <p className="mt-1 text-sm text-ink-faint">{active.blurb}</p>
        </header>

        <div className="flex flex-wrap gap-1.5">
          {MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => setModel(m.id)}
              className={`pill border text-sm ${
                model === m.id
                  ? 'border-brand bg-brand/5 font-medium text-ink'
                  : 'border-surface-line text-ink-soft hover:border-brand/40 hover:text-ink'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {model === 'harmonie' && <GeneratorHarmony />}
        {model === 'foto' && <GeneratorImage />}
        {model === 'verlauf' && <GeneratorGradient />}
        {model === 'kontrast' && <GeneratorContrast />}
        {model === 'zufall' && <GeneratorRandom />}
      </div>
    </div>
  )
}
