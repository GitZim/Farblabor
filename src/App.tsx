import { NavLink, Route, Routes } from 'react-router-dom'
import LogoMark from './logo/LogoMark'
import { usePalette } from './store/usePalette'
import EditorPage from './pages/EditorPage'
import PalettesPage from './pages/PalettesPage'
import GeneratorPage from './pages/GeneratorPage'
import TheoryPage from './pages/TheoryPage'

const NAV = [
  { to: '/', label: 'Editor', end: true },
  { to: '/paletten', label: 'Paletten', end: false },
  { to: '/generator', label: 'Generator', end: false },
  { to: '/theorie', label: 'Theorie', end: false },
]

export default function App() {
  const colors = usePalette((s) => s.colors)

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-surface-line bg-surface/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <div className="flex items-center gap-2">
            <LogoMark colors={colors} className="h-7 w-7" />
            <span className="text-[15px] font-semibold tracking-tight">Farblabor</span>
          </div>
          <nav className="ml-2 flex items-center gap-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `pill ${
                    isActive
                      ? 'bg-surface-sunken font-medium text-ink'
                      : 'text-ink-faint hover:text-ink'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<EditorPage />} />
          <Route path="/paletten" element={<PalettesPage />} />
          <Route path="/generator" element={<GeneratorPage />} />
          <Route path="/theorie" element={<TheoryPage />} />
        </Routes>
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-4 text-xs text-ink-faint">
        Farblabor · Tricolor-Farbstudio für das Wellen-Logo · Berechnungen in OKLCH
      </footer>
    </div>
  )
}
