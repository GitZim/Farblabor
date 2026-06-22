import { useRef, useState } from 'react'
import PaletteGrid from '../PaletteGrid'
import { extractColorsFromImage } from '../../color/imagePalette'
import { ROLES, ROLE_LABEL, type Palette } from '../../color/types'
import { usePalette } from '../../store/usePalette'

const at = (arr: string[], i: number) => arr[Math.min(arr.length - 1, Math.max(0, i))]

function buildCandidates(extracted: string[]): Palette[] {
  if (extracted.length < 3) return []
  const n = extracted.length
  const combos: { name: string; idx: [number, number, number] }[] = [
    { name: 'Aus Bild', idx: [Math.round(n * 0.15), Math.round(n * 0.5), Math.round(n * 0.82)] },
    { name: 'Kräftig', idx: [0, Math.round(n * 0.45), n - 1] },
    { name: 'Sanft', idx: [Math.round(n * 0.3), Math.round(n * 0.55), Math.round(n * 0.8)] },
  ]
  return combos.map((c) => ({
    name: c.name,
    model: 'analog',
    colors: [at(extracted, c.idx[0]), at(extracted, c.idx[1]), at(extracted, c.idx[2])],
  }))
}

export default function GeneratorImage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [extracted, setExtracted] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)

  const colors = usePalette((s) => s.colors)
  const setColor = usePalette((s) => s.setColor)
  const pushRecent = usePalette((s) => s.pushRecent)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Bitte eine Bilddatei wählen.')
      return
    }
    setBusy(true)
    setError(null)
    setPicked(null)
    try {
      const result = await extractColorsFromImage(file, 8)
      setExtracted(result)
    } catch {
      setError('Bild konnte nicht verarbeitet werden.')
    } finally {
      setBusy(false)
    }
  }

  const candidates = buildCandidates(extracted)

  return (
    <div className="flex flex-col gap-6">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          const file = e.dataTransfer.files[0]
          if (file) handleFile(file)
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed p-8 text-center transition ${
          dragOver ? 'border-brand bg-brand/5' : 'border-surface-line hover:border-brand/40'
        }`}
      >
        <span className="text-sm font-medium text-ink">
          {busy ? 'Analysiere Bild …' : 'Bild hierher ziehen oder klicken'}
        </span>
        <span className="text-xs text-ink-faint">
          JPG / PNG · wird lokal im Browser verarbeitet, kein Upload
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
            e.target.value = ''
          }}
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {extracted.length > 0 && (
        <>
          <div>
            <h2 className="mb-1 text-sm font-medium text-ink-soft">Extrahierte Farben</h2>
            <p className="mb-2 text-xs text-ink-faint">
              Farbe anklicken, um sie einem Element zuzuweisen.
            </p>
            <div className="flex gap-1.5">
              {extracted.map((c, i) => {
                const sel = picked === c
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPicked(sel ? null : c)}
                    title={c}
                    style={{ background: c }}
                    className={`h-12 flex-1 rounded-lg transition hover:scale-105 ${
                      sel ? 'ring-2 ring-brand ring-offset-2' : 'border border-black/10'
                    }`}
                  />
                )
              })}
            </div>

            {picked && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5 rounded-lg border border-surface-line bg-surface-sunken p-2">
                <span
                  className="h-6 w-6 flex-none rounded border border-black/10"
                  style={{ background: picked }}
                />
                <span className="font-mono text-xs uppercase text-ink-faint">{picked}</span>
                <span className="ml-1 text-[11px] text-ink-faint">zuweisen an</span>
                {ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setColor(role, picked.toLowerCase())
                      pushRecent(picked)
                      setPicked(null)
                    }}
                    className="flex items-center gap-1.5 rounded-md border border-surface-line bg-surface px-2 py-1 text-xs text-ink-soft transition hover:border-brand/40 hover:text-ink"
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-black/10"
                      style={{ background: colors[role] }}
                    />
                    {ROLE_LABEL[role]}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPicked(null)}
                  aria-label="Abbrechen"
                  className="ml-auto grid h-6 w-6 place-items-center rounded text-ink-faint hover:text-ink"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <section>
            <h2 className="mb-3 text-sm font-medium text-ink">Tricolor-Vorschläge aus dem Bild</h2>
            <PaletteGrid palettes={candidates} savable hideModel />
          </section>
        </>
      )}
    </div>
  )
}
