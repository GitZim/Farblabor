import HarmonyWheel from '../components/HarmonyWheel'
import { usePalette } from '../store/usePalette'
import {
  HARMONY_LABEL,
  type HarmonyModel,
  type Palette,
  ROLE_LABEL,
  ROLES,
} from '../color/types'

const MODEL_INFO: { model: HarmonyModel; text: string; example: [string, string, string] }[] = [
  {
    model: 'monochrom',
    text: 'Ein einziger Farbton, variiert über Helligkeit und Sättigung. Sehr ruhig und elegant, aber kontrastarm.',
    example: ['#0B2A45', '#2D6E9E', '#84C5E0'],
  },
  {
    model: 'analog',
    text: 'Benachbarte Farbtöne (±30°). Wirkt natürlich und stimmig, weil die Farben „verwandt" sind.',
    example: ['#0F4C4A', '#2A9D8F', '#8FD9CF'],
  },
  {
    model: 'komplementaer',
    text: 'Gegenüberliegende Farben (180°). Maximaler Kontrast und Spannung — ideal, um den Akzent klar abzusetzen.',
    example: ['#15425C', '#E08A3C', '#F6D9A8'],
  },
  {
    model: 'split',
    text: 'Basis plus die zwei Nachbarn ihres Komplements. Starker Kontrast, aber weniger hart als reines Komplementär.',
    example: ['#123A4A', '#E2674E', '#F2C36B'],
  },
  {
    model: 'triadisch',
    text: 'Drei Farben im 120°-Abstand. Lebendig und ausgewogen — die klassische Tricolor-Wahl.',
    example: ['#2E5E8C', '#C9457E', '#5DA653'],
  },
  {
    model: 'tetradisch',
    text: 'Vier Farben (zwei Komplementärpaare). Größte Vielfalt; für ein Tricolor-Logo auf drei reduziert.',
    example: ['#244A6E', '#2E8B6F', '#C75B57'],
  },
]

const TRENDS: { name: string; text: string; colors: string[] }[] = [
  { name: 'Transformative Teal', text: 'Fusion aus tiefem Blau und Aquagrün — Ruhe & Wandel.', colors: ['#0F4C4A', '#2A9D8F', '#8FD9CF'] },
  { name: 'Gedämpfte Erdtöne', text: 'Terrakotta, Salbei, Ocker — geerdet und natürlich.', colors: ['#4A4031', '#9C7A4D', '#CBB892'] },
  { name: 'Digital Lavender', text: 'Sonnengebleichte Pastelle, modern und nahbar.', colors: ['#2E2A4A', '#7A6FB0', '#C9C2E8'] },
  { name: 'Tech-Neon', text: 'Elektrische Akzente auf dunklem Grund — cinematisch.', colors: ['#0B1020', '#1FB6A6', '#6EE7FF'] },
]

function MiniBar({ colors, onClick }: { colors: string[]; onClick?: () => void }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={`flex h-7 w-full overflow-hidden rounded-md border border-surface-line ${
        onClick ? 'transition hover:opacity-90' : ''
      }`}
    >
      {colors.map((c, i) => (
        <span key={i} className="flex-1" style={{ background: c }} />
      ))}
    </Tag>
  )
}

export default function TheoryPage() {
  const applyPalette = usePalette((s) => s.applyPalette)
  const colors = usePalette((s) => s.colors)

  const apply = (example: [string, string, string], model: HarmonyModel) => {
    const p: Palette = { name: HARMONY_LABEL[model], model, colors: example }
    applyPalette(p)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <article className="flex flex-col gap-10">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Farbtheorie</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            Farbharmonie beschreibt, wie Farben auf dem <strong>Farbkreis</strong> zueinander
            stehen. Aus geometrischen Beziehungen — Nachbarschaft, Gegenüber, gleichmäßige
            Abstände — entstehen Schemata mit jeweils eigenem Charakter und Kontrast. Dieses Tool
            arbeitet mit <strong>drei</strong> Farben, passend zu den drei Elementen des Logos.
          </p>
        </header>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Die sechs Harmonie-Modelle</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {MODEL_INFO.map(({ model, text, example }) => (
              <div key={model} className="card flex gap-4 p-4">
                <div className="flex-none">
                  <HarmonyWheel model={model} />
                </div>
                <div className="flex min-w-0 flex-col">
                  <h3 className="text-sm font-semibold text-ink">{HARMONY_LABEL[model]}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{text}</p>
                  <div className="mt-auto pt-3">
                    <MiniBar colors={example} onClick={() => apply(example, model)} />
                    <span className="mt-1 block text-[11px] text-ink-faint">
                      Beispiel anwenden →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Das 60-30-10-Prinzip</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Eine ausgewogene Dreifarb-Komposition verteilt die Flächen etwa im Verhältnis
            <strong> 60 : 30 : 10</strong>: eine dominante Grundfarbe, eine sekundäre Stützfarbe und
            ein kleiner, kräftiger Akzent. Genau diese drei Rollen tragen die Logo-Elemente:
          </p>
          <div className="card mt-4 overflow-hidden">
            <div className="flex h-12">
              <div className="flex items-center justify-center text-xs font-medium text-white" style={{ background: colors.anker, flexGrow: 60 }}>60 %</div>
              <div className="flex items-center justify-center text-xs font-medium text-white" style={{ background: colors.verbindung, flexGrow: 30 }}>30 %</div>
              <div className="flex items-center justify-center text-xs font-medium text-ink" style={{ background: colors.akzent, flexGrow: 10 }}>10 %</div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-surface-line text-center text-xs">
              {ROLES.map((role) => (
                <div key={role} className="px-2 py-2">
                  <div className="font-medium text-ink">{ROLE_LABEL[role]}</div>
                  <div className="text-ink-faint">
                    {role === 'anker' ? 'Dominant' : role === 'verbindung' ? 'Sekundär' : 'Akzent'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Warum OKLCH?</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Die Paletten werden im <strong>OKLCH</strong>-Farbraum berechnet, nicht in HSL. OKLCH ist
            <em> perzeptuell gleichmäßig</em>: Farben mit gleichem Helligkeitswert wirken auch
            tatsächlich gleich hell. In HSL dagegen erscheint ein Gelb bei gleicher „Lightness"
            deutlich heller als ein Blau. Dadurch sehen automatisch erzeugte Tricolor-Paletten
            ausgewogener aus und die 60-30-10-Hierarchie bleibt verlässlich erhalten.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Trends 2026</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {TRENDS.map((t) => (
              <div key={t.name} className="card p-3">
                <MiniBar colors={t.colors} />
                <div className="mt-2 text-sm font-medium text-ink">{t.name}</div>
                <div className="text-[13px] leading-snug text-ink-soft">{t.text}</div>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  )
}
