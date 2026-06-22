import { useState } from 'react'
import LogoMark from '../logo/LogoMark'
import ElementSelector from '../components/ElementSelector'
import ColorControl from '../components/ColorControl'
import ToneModifiers from '../components/ToneModifiers'
import { usePalette } from '../store/usePalette'
import { copyText, downloadSvg, toCssVars } from '../color/exportSvg'
import { DEFAULT_PALETTE } from '../color/palettes'
import { paletteToColors } from '../color/types'

type Bg = 'hell' | 'dunkel' | 'transparent'

const BG_STYLE: Record<Bg, string> = {
  hell: 'bg-white',
  dunkel: 'bg-ink',
  transparent:
    'bg-[length:18px_18px] bg-[linear-gradient(45deg,#e9edf2_25%,transparent_25%,transparent_75%,#e9edf2_75%),linear-gradient(45deg,#e9edf2_25%,transparent_25%,transparent_75%,#e9edf2_75%)] bg-[position:0_0,9px_9px] bg-white',
}

export default function EditorPage() {
  const colors = usePalette((s) => s.colors)
  const selected = usePalette((s) => s.selected)
  const setSelected = usePalette((s) => s.setSelected)
  const applyColors = usePalette((s) => s.applyColors)
  const [bg, setBg] = useState<Bg>('hell')
  const [toast, setToast] = useState<string | null>(null)

  const flash = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 1600)
  }

  const copyHex = async () => {
    const ok = await copyText(
      `Anker: ${colors.anker}\nVerbindung: ${colors.verbindung}\nAkzent: ${colors.akzent}`,
    )
    flash(ok ? 'Hex-Codes kopiert' : 'Kopieren nicht möglich')
  }
  const copyCss = async () => {
    const ok = await copyText(toCssVars(colors))
    flash(ok ? 'CSS kopiert' : 'Kopieren nicht möglich')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-base font-semibold">Editor</h1>
          <div className="flex gap-1 rounded-lg bg-surface-sunken p-1">
            {(['hell', 'dunkel', 'transparent'] as Bg[]).map((b) => (
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
        <div
          className={`grid place-items-center rounded-xl border border-surface-line p-6 ${BG_STYLE[bg]}`}
        >
          <LogoMark
            colors={colors}
            selected={selected}
            onSelect={setSelected}
            interactive
            className="h-auto w-full max-w-[340px]"
          />
        </div>
        <p className="mt-3 text-center text-xs text-ink-faint">
          Tipp: Klicke direkt auf ein Element im Logo, um es auszuwählen.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="mb-2 text-sm font-medium text-ink-soft">Element wählen</h2>
          <ElementSelector />
        </div>

        <div>
          <h2 className="mb-2 text-sm font-medium text-ink-soft">Farbe anpassen</h2>
          <ColorControl />
        </div>

        <div>
          <h2 className="mb-2 text-sm font-medium text-ink-soft">Ton-Modifikatoren</h2>
          <ToneModifiers />
        </div>

        <div>
          <h2 className="mb-2 text-sm font-medium text-ink-soft">Export</h2>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary" onClick={() => downloadSvg(colors)}>
              SVG herunterladen
            </button>
            <button className="btn" onClick={copyHex}>
              Hex kopieren
            </button>
            <button className="btn" onClick={copyCss}>
              CSS kopieren
            </button>
            <button
              className="btn"
              onClick={() => applyColors(paletteToColors(DEFAULT_PALETTE))}
            >
              Zurücksetzen
            </button>
          </div>
          <div className="mt-2 h-5 text-xs text-brand">{toast}</div>
        </div>
      </section>
    </div>
  )
}
