import { formatHex, interpolate } from 'culori'
import { CLINICAL_PALETTES, WAYFINDING, type ClinicalPalette } from '../color/clinical'
import { usePalette } from '../store/usePalette'

const HUE_COLUMNS: { label: string; stops: string[]; bullets: string[] }[] = [
  {
    label: 'Warm',
    stops: ['#E8412B', '#EF7A2E', '#F4A93C', '#F7D24A', '#FBE96B'],
    bullets: [
      'Mit Aufmerksamkeit & Wachheit assoziiert',
      'Kann Herzfrequenz, Blutdruck und Pupillenweite erhöhen',
      'Geeignet für Notfall-/Rettungsdienste',
    ],
  },
  {
    label: 'Kühl',
    stops: ['#9B3FB5', '#5A3BAE', '#2E46A6', '#1F5F94', '#1E7A6C', '#2E7D43'],
    bullets: [
      'Mit Ruhe & Stressreduktion assoziiert',
      'Kann Herzfrequenz und Blutdruck senken',
      'Häufig in Healthcare-Logos, Kliniken & Therapieeinrichtungen',
    ],
  },
  {
    label: 'Neutral',
    stops: ['#5A3A1E', '#2A1C10', '#121212', '#3F3F3F', '#7C7C7C', '#B4B4B4', '#E6E6E6', '#F5F5F5'],
    bullets: [
      'Löst keine messbare Reaktion aus, stützt aber andere Farben',
      'Weiße Untertöne können in der Pädiatrie nützlich sein',
    ],
  },
]

const HUE_STEPS = 18
const bands = (stops: string[]) => {
  const mix = interpolate(stops, 'rgb')
  return Array.from({ length: HUE_STEPS }, (_, i) => formatHex(mix(i / (HUE_STEPS - 1))) ?? '#000000')
}

function HealthyHues() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-5">
      {HUE_COLUMNS.map((col) => (
        <div key={col.label} className="flex flex-col items-center">
          <span className="rounded-full bg-brand-deep px-4 py-1 text-sm font-medium text-white">
            {col.label}
          </span>
          <div className="mt-3 flex h-64 w-full max-w-[150px] flex-col overflow-hidden rounded-lg border border-surface-line">
            {bands(col.stops).map((c, i) => (
              <div key={i} className="flex-1" style={{ background: c }} />
            ))}
          </div>
          <ul className="mt-3 w-full list-disc space-y-1 pl-4 text-left text-xs leading-snug text-ink-soft">
            {col.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function Source({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
    >
      {children}
    </a>
  )
}

function ClinicalCard({ p }: { p: ClinicalPalette }) {
  const applyPalette = usePalette((s) => s.applyPalette)
  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => applyPalette(p)}
        className="block w-full text-left"
        aria-label={`Palette ${p.name} anwenden`}
      >
        <span className="flex h-12">
          {p.colors.map((c, i) => (
            <span key={i} className="flex-1" style={{ background: c }} />
          ))}
        </span>
      </button>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-ink">{p.name}</span>
          <span className="rounded-md bg-surface-sunken px-2 py-0.5 text-[11px] text-ink-faint">
            {p.context}
          </span>
        </div>
        <p className="mt-1 text-[13px] leading-snug text-ink-soft">{p.rationale}</p>
      </div>
    </div>
  )
}

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <article className="flex flex-col gap-10">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">
            Farbwirkung in Psychiatrie &amp; Medizin
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
            Eine Forschungsübersicht zu Farbe in klinischen Umgebungen — als Grundlage für die
            Palettenwahl. Schwerpunkt: <strong>evidenzbasiertes Healthcare-Design</strong> und
            Umweltpsychologie, nicht „Farbtherapie".
          </p>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[13px] leading-relaxed text-amber-800">
            <strong>Einordnung:</strong> Farbwirkung ist teils kulturell geprägt und die Studienlage
            heterogen. „Chromotherapie" (Heilung durch Farblicht) gilt wissenschaftlich als{' '}
            <Source href="https://pmc.ncbi.nlm.nih.gov/articles/PMC1297510/">
              nicht evidenzbasiert
            </Source>
            . Diese Seite beschreibt <em>Gestaltungswirkungen</em> (Wahrnehmung, Stimmung,
            Orientierung) — sie ist keine medizinische oder therapeutische Beratung.
          </div>
        </header>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Wie Farbe wirkt — die Evidenz</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Farbwirkung lässt sich gut über zwei Dimensionen beschreiben: <strong>Erregung</strong>{' '}
            (Arousal) und <strong>Wertigkeit</strong> (angenehm/unangenehm). Studien zeigen
            konsistent: Erregung steigt von Blau/Grün hin zu Rot; <strong>Sättigung und
            Helligkeit verstärken</strong> die Wirkung (gesättigte, helle Farben lösen stärkere
            Hautleitwert-Reaktionen aus). Hellere, kühle Töne (Blau, Grün) heben tendenziell die
            Stimmung und senken Stress.{' '}
            <Source href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7027086/">
              (Jonauskaite u. a., 2020)
            </Source>{' '}
            Viele Assoziationen sind jedoch{' '}
            <Source href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10017663/">
              kulturabhängig
            </Source>
            .
          </p>
          <div className="card mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-surface-line text-xs uppercase tracking-wide text-ink-faint">
                  <th className="px-3 py-2 font-medium">Farbe</th>
                  <th className="px-3 py-2 font-medium">Tendenz</th>
                  <th className="px-3 py-2 font-medium">Hinweis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-line">
                {[
                  ['Blau', 'beruhigend, geringe Erregung', 'wird mit Ruhe/Vertrauen assoziiert; senkt wahrgenommenen Stress'],
                  ['Grün / Teal', 'ausgleichend, naturnah', 'positive Distraktion; OP-Grün = Komplement zu Blut-Rot'],
                  ['Lavendel', 'ruhig, zurückhaltend', 'häufig Onkologie-Kodierung in der Wegeleitung'],
                  ['Warm (Rot/Orange)', 'aktivierend, höhere Erregung', 'sparsam einsetzen; als Akzent statt Fläche'],
                  ['Hoch gesättigt/hell', 'verstärkt jede Wirkung', 'in Ruhezonen meiden — niedrige Sättigung bevorzugen'],
                ].map((row) => (
                  <tr key={row[0]}>
                    <td className="px-3 py-2 font-medium text-ink">{row[0]}</td>
                    <td className="px-3 py-2 text-ink-soft">{row[1]}</td>
                    <td className="px-3 py-2 text-ink-faint">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-1 text-lg font-semibold">
            Physiologische Farbwirkung — Warm · Kühl · Neutral
          </h2>
          <p className="mb-4 text-sm text-ink-faint">
            Allgemeine Tendenzen aus der Literatur. Die Stärke der Effekte variiert individuell und
            kulturell (siehe Einordnung oben).
          </p>
          <div className="card p-4 sm:p-6">
            <HealthyHues />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Evidenzbasiertes Healthcare-Design</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Der einflussreichste Rahmen ist Roger Ulrichs <em>Theory of Supportive Design</em>:
            Umgebungen senken Stress, wenn sie <strong>Kontrolle</strong>, <strong>soziale
            Unterstützung</strong> und <strong>positive Ablenkung</strong> fördern — vor allem
            Naturbezug und Tageslicht. Patient:innen in sonnigen Zimmern mit Naturblick zeigten in
            Studien geringeren Stress und teils kürzere Aufenthalte.{' '}
            <Source href="https://www.healthdesign.org/knowledge-repository/stress-reduction-hospital-room-applying-ulrich%E2%80%99s-theory-supportive-design">
              (Ulrich; Center for Health Design)
            </Source>{' '}
            Für Farbe heißt das: <strong>beruhigende, nicht-institutionelle Paletten</strong> statt
            steriler Vollneutralität, gern mit einem warmen Akzent auf einer Fläche.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Psychiatrie im Speziellen</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Leitlinien für psychiatrische Einrichtungen empfehlen <strong>kühle, niedrig gesättigte
            Wandfarben</strong> (Blau, Grün) als beruhigend und restorativ, kombiniert mit viel
            Tageslicht und Naturzugang.{' '}
            <Source href="https://www.parkin.ca/insight/determining-colour-and-design-specifications-for-mental-health-facilities/">
              (Parkin: Mental Health Facilities)
            </Source>{' '}
            Überreizung durch große, hochgesättigte (besonders rote) Flächen wird vermieden. Das oft
            zitierte „Baker-Miller-Pink" zur Deeskalation wirkt nur kurzfristig (Effekt lässt nach
            ~30&nbsp;Minuten nach) und ist <strong>kein verlässliches Mittel</strong>.{' '}
            <Source href="https://www.psychiatryadvisor.com/features/color-in-health-care-design-spaces/">
              (Psychiatry Advisor)
            </Source>
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Klinische Konventionen</h2>
          <ul className="flex flex-col gap-2 text-[15px] leading-relaxed text-ink-soft">
            <li>
              <strong>OP-Grün / -Blau:</strong> Komplement zum Blut-Rot — dämpft rote Nachbilder und
              erhöht den Gewebekontrast; Grün liegt mittig im Spektrum und ermüdet das Auge wenig.{' '}
              <Source href="https://medicuscaps.com/blogs/scrub-caps-news/the-science-behind-green-surgical-scrubs">
                (Medicus)
              </Source>
            </li>
            <li>
              <strong>Wegeleitung (Wayfinding):</strong> distinkte Farbfamilien pro Abteilung
              reduzieren Verwirrung und Navigationsangst.
            </li>
            <li>
              <strong>Geriatrie / Demenz:</strong> höhere Helligkeitskontraste und warme Paletten
              unterstützen Orientierung; Primärfarben auf Schlüsselelementen (Türen) helfen —{' '}
              <em>extreme</em> Kontraste (Nachbilder) jedoch vermeiden.{' '}
              <Source href="http://www.medi-plinth.co.uk/use-of-colour-in-conjunction-with-dementia">
                (Medi-Plinth)
              </Source>
            </li>
          </ul>
          <div className="mt-4">
            <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
              Wegeleitung — Beispiel-Kodierung
            </div>
            <div className="flex flex-wrap gap-2">
              {WAYFINDING.map((w) => (
                <span
                  key={w.dept}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-surface-line bg-surface px-2.5 py-1 text-xs text-ink-soft"
                >
                  <span
                    className="h-3 w-3 rounded-full border border-black/10"
                    style={{ background: w.color }}
                  />
                  {w.dept}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-1 text-lg font-semibold">Beispiele · Farbkombinationen aus dem Sektor</h2>
          <p className="mb-4 text-sm text-ink-faint">
            Klick überträgt die Kombination aufs Logo. Jede Karte nennt Kontext und Begründung.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {CLINICAL_PALETTES.map((p) => (
              <ClinicalCard key={p.name} p={p} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Gestaltungsregeln aus der Forschung</h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">
            Aus den Befunden lassen sich konkrete Regeln für die Palettenwahl ableiten — sie prägen
            die Beispiele oben und die Kategorie <strong>„Klinik &amp; Therapie"</strong> unter{' '}
            <strong>Paletten</strong>:
          </p>
          <ul className="mt-2 flex flex-col gap-1.5 text-[15px] leading-relaxed text-ink-soft">
            <li>
              <strong>Beruhigend</strong> — kühle Farbtöne (Blau/Grün/Lavendel), niedrige Sättigung
              (≤&nbsp;0,05&nbsp;Chroma), sanfter Helligkeitsverlauf.
            </li>
            <li>
              <strong>Klinisch</strong> — OP-/Grünfamilie, entsättigt, kontrastarm.
            </li>
            <li>
              <strong>Orientierung</strong> — ruhiger kühler Grund plus ein klar unterscheidbarer
              Akzent (Wegeleitung), aber ohne extreme Kontraste.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Quellen</h2>
          <ul className="flex flex-col gap-1.5 text-sm text-ink-soft">
            <li>
              <Source href="https://www.healthdesign.org/knowledge-repository/stress-reduction-hospital-room-applying-ulrich%E2%80%99s-theory-supportive-design">
                Ulrich — Theory of Supportive Design (Center for Health Design)
              </Source>
            </li>
            <li>
              <Source href="https://www.parkin.ca/insight/determining-colour-and-design-specifications-for-mental-health-facilities/">
                Parkin — Colour &amp; Design Specifications for Mental Health Facilities
              </Source>
            </li>
            <li>
              <Source href="https://www.psychiatryadvisor.com/features/color-in-health-care-design-spaces/">
                Psychiatry Advisor — Color in Health Care Design
              </Source>
            </li>
            <li>
              <Source href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7027086/">
                Jonauskaite u. a. (2020) — Colour–Emotion Associations
              </Source>
            </li>
            <li>
              <Source href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10017663/">
                Implicit colour–valence associations across cultures (2023)
              </Source>
            </li>
            <li>
              <Source href="https://pmc.ncbi.nlm.nih.gov/articles/PMC1297510/">
                A Critical Analysis of Chromotherapy and Its Scientific Evolution
              </Source>
            </li>
            <li>
              <Source href="https://medicuscaps.com/blogs/scrub-caps-news/the-science-behind-green-surgical-scrubs">
                The Science Behind Green Surgical Scrubs
              </Source>
            </li>
            <li>
              <Source href="http://www.medi-plinth.co.uk/use-of-colour-in-conjunction-with-dementia">
                Use of Colour in Dementia Care Environments
              </Source>
            </li>
          </ul>
        </section>
      </article>
    </div>
  )
}
