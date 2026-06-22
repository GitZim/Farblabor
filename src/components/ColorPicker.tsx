import { useEffect, useMemo, useRef, useState } from 'react'
import { HexColorInput } from 'react-colorful'
import { harmonySuggestions, tintsAndShades } from '../color/harmony'
import { usePalette } from '../store/usePalette'
import { ROLES, ROLE_LABEL, type Role } from '../color/types'
import OklchField from './OklchField'

declare global {
  interface Window {
    EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> }
  }
}

interface ColorPickerProps {
  value: string
  onChange: (hex: string) => void
  /** Quick-access swatches shown under "Palette" (e.g. the current logo colors). */
  paletteSwatches?: string[]
  /** Trigger swatch size in px. */
  size?: number
  ariaLabel?: string
  /**
   * The logo role this picker edits. When set together with onAssignRole,
   * harmony suggestions are applied to the *other* roles via a chooser instead
   * of overwriting the current colour.
   */
  currentRole?: Role
  onAssignRole?: (role: Role, hex: string) => void
}

function Swatch({
  color,
  onPick,
  title,
  size = 22,
}: {
  color: string
  onPick: (c: string) => void
  title?: string
  size?: number
}) {
  return (
    <button
      type="button"
      onClick={() => onPick(color)}
      title={title ?? color}
      aria-label={title ?? color}
      style={{ background: color, width: size, height: size }}
      className="rounded-md border border-black/10 transition hover:scale-110"
    />
  )
}

export default function ColorPicker({
  value,
  onChange,
  paletteSwatches = [],
  size = 44,
  ariaLabel = 'Farbe wählen',
  currentRole,
  onAssignRole,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false)
  const [pendingHarmony, setPendingHarmony] = useState<string | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const openValueRef = useRef(value)
  const recent = usePalette((s) => s.recent)
  const pushRecent = usePalette((s) => s.pushRecent)
  const storeColors = usePalette((s) => s.colors)

  const tints = useMemo(() => tintsAndShades(value), [value])
  const harmonies = useMemo(() => harmonySuggestions(value), [value])
  const supportsEyedropper = typeof window !== 'undefined' && 'EyeDropper' in window

  const harmonyAssign = Boolean(currentRole && onAssignRole)
  const otherRoles = currentRole ? ROLES.filter((r) => r !== currentRole) : []

  // A stale pending suggestion makes no sense once the base colour changed.
  useEffect(() => setPendingHarmony(null), [value])

  const close = () => {
    setOpen(false)
    setPendingHarmony(null)
    if (value.toLowerCase() !== openValueRef.current.toLowerCase()) pushRecent(value)
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) close()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, value])

  const pickEyedropper = async () => {
    if (!window.EyeDropper) return
    try {
      const res = await new window.EyeDropper().open()
      onChange(res.sRGBHex)
      pushRecent(res.sRGBHex)
    } catch {
      /* user cancelled */
    }
  }

  const dedupedPalette = paletteSwatches.filter(
    (c, i) => paletteSwatches.findIndex((x) => x.toLowerCase() === c.toLowerCase()) === i,
  )

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => {
          if (open) {
            close()
          } else {
            openValueRef.current = value
            setOpen(true)
          }
        }}
        style={{ width: size, height: size, background: value }}
        className="rounded-lg border border-black/10 ring-offset-2 transition hover:ring-2 hover:ring-brand/40"
      />

      {open && (
        <div
          className="absolute left-0 top-full z-30 mt-2 w-[288px] rounded-2xl border border-surface-line bg-surface p-3 shadow-xl shadow-black/10"
          role="dialog"
          aria-label="Farbpicker"
        >
          <OklchField value={value} onChange={onChange} />

          <div className="mt-3 flex items-center gap-2">
            <div
              className="h-9 w-9 flex-none rounded-lg border border-surface-line"
              style={{ background: value }}
            />
            <div className="flex h-9 flex-1 items-center gap-1 rounded-lg border border-surface-line px-2">
              <span className="font-mono text-sm text-ink-faint">#</span>
              <HexColorInput
                color={value}
                onChange={onChange}
                className="w-full bg-transparent font-mono text-sm uppercase text-ink outline-none"
                aria-label="Hex-Wert"
              />
            </div>
            <button
              type="button"
              onClick={pickEyedropper}
              disabled={!supportsEyedropper}
              aria-label="Pipette: Farbe vom Bildschirm aufnehmen"
              title={
                supportsEyedropper
                  ? 'Farbe vom Bildschirm aufnehmen'
                  : 'Pipette wird von diesem Browser nicht unterstützt'
              }
              className="grid h-9 w-9 flex-none place-items-center rounded-lg border border-surface-line text-ink-soft transition hover:border-brand/40 hover:text-ink disabled:opacity-40"
            >
              <PipetteIcon />
            </button>
          </div>

          <Section label="Heller / dunkler">
            <div className="flex gap-1">
              {tints.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onChange(c)}
                  title={c}
                  style={{ background: c }}
                  className="h-5 flex-1 rounded transition hover:scale-y-125"
                />
              ))}
            </div>
          </Section>

          <Section label="Harmonie-Vorschläge">
            {harmonyAssign ? (
              <>
                <div className="flex gap-1.5">
                  {harmonies.map((h) => {
                    const sel = pendingHarmony === h.hex
                    return (
                      <button
                        key={h.label}
                        type="button"
                        onClick={() => setPendingHarmony(sel ? null : h.hex)}
                        title={`${h.label} · ${h.hex}`}
                        aria-label={`${h.label} · ${h.hex}`}
                        style={{ background: h.hex }}
                        className={`h-[22px] w-[22px] rounded-md transition hover:scale-110 ${
                          sel ? 'ring-2 ring-brand ring-offset-1' : 'border border-black/10'
                        }`}
                      />
                    )
                  })}
                </div>
                {pendingHarmony ? (
                  <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-surface-line bg-surface-sunken p-1.5">
                    <span
                      className="h-6 w-6 flex-none rounded border border-black/10"
                      style={{ background: pendingHarmony }}
                    />
                    <span className="text-[11px] text-ink-faint">Als</span>
                    {otherRoles.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          onAssignRole?.(role, pendingHarmony)
                          pushRecent(pendingHarmony)
                          setPendingHarmony(null)
                        }}
                        className="flex items-center gap-1.5 rounded-md border border-surface-line bg-surface px-2 py-1 text-xs text-ink-soft transition hover:border-brand/40 hover:text-ink"
                      >
                        <span
                          className="h-3 w-3 rounded-full border border-black/10"
                          style={{ background: storeColors[role] }}
                        />
                        {ROLE_LABEL[role]}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPendingHarmony(null)}
                      aria-label="Abbrechen"
                      className="ml-auto grid h-6 w-6 place-items-center rounded text-ink-faint hover:text-ink"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <p className="mt-1.5 text-[11px] text-ink-faint">
                    Vorschlag wählen → einem anderen Element zuweisen
                  </p>
                )}
              </>
            ) : (
              <div className="flex gap-1.5">
                {harmonies.map((h) => (
                  <Swatch key={h.label} color={h.hex} title={`${h.label} · ${h.hex}`} onPick={onChange} />
                ))}
              </div>
            )}
          </Section>

          {(dedupedPalette.length > 0 || recent.length > 0) && (
            <Section label="Palette & zuletzt">
              <div className="flex flex-wrap items-center gap-1.5">
                {dedupedPalette.map((c, i) => (
                  <Swatch key={`p${i}`} color={c} onPick={onChange} title={`Palette · ${c}`} />
                ))}
                {dedupedPalette.length > 0 && recent.length > 0 && (
                  <span className="mx-0.5 h-5 w-px self-center bg-surface-line" />
                )}
                {recent.slice(0, 8).map((c, i) => (
                  <Swatch key={`r${i}`} color={c} onPick={onChange} title={`Zuletzt · ${c}`} />
                ))}
              </div>
            </Section>
          )}
        </div>
      )}
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
        {label}
      </div>
      {children}
    </div>
  )
}

function PipetteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m2 22 1-1h3l9-9" />
      <path d="M3 21v-3l9-9" />
      <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
    </svg>
  )
}
