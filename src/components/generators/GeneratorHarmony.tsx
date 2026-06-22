import { useMemo, useState } from 'react'
import PaletteGrid from '../PaletteGrid'
import ColorPicker from '../ColorPicker'
import { generatePalettes } from '../../color/harmony'
import {
  HARMONY_LABEL,
  ROLES,
  ROLE_HINT,
  ROLE_LABEL,
  colorsToTuple,
  type HarmonyModel,
  type Role,
} from '../../color/types'
import { usePalette } from '../../store/usePalette'

const MODELS = Object.keys(HARMONY_LABEL) as HarmonyModel[]

export default function GeneratorHarmony() {
  const colors = usePalette((s) => s.colors)
  const storeSelected = usePalette((s) => s.selected)
  const [seedRole, setSeedRole] = useState<Role>(storeSelected)
  const [base, setBase] = useState<string>(colors[storeSelected])
  const [model, setModel] = useState<HarmonyModel>('analog')

  const pickRole = (role: Role) => {
    setSeedRole(role)
    setBase(colors[role])
  }

  const generated = useMemo(
    () => generatePalettes(base, seedRole, model),
    [base, seedRole, model],
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="card flex flex-col gap-5 p-4">
        <div>
          <h2 className="mb-2 text-sm font-medium text-ink-soft">1 · Ausgangs-Rolle</h2>
          <div className="grid gap-2 sm:grid-cols-3">
            {ROLES.map((role) => {
              const active = seedRole === role
              return (
                <button
                  key={role}
                  onClick={() => pickRole(role)}
                  className={`rounded-xl border px-3 py-2.5 text-left transition ${
                    active ? 'border-brand bg-brand/5' : 'border-surface-line hover:border-brand/40'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-4 w-4 flex-none rounded border border-black/5"
                      style={{ background: colors[role] }}
                    />
                    <span className="text-sm font-medium text-ink">{ROLE_LABEL[role]}</span>
                  </span>
                  <span className="mt-0.5 block text-[11px] text-ink-faint">{ROLE_HINT[role]}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-medium text-ink-soft">2 · Basisfarbe</h2>
          <div className="flex items-center gap-3 rounded-xl border border-surface-line p-3">
            <ColorPicker
              value={base}
              onChange={setBase}
              paletteSwatches={colorsToTuple(colors)}
              ariaLabel="Basisfarbe wählen"
            />
            <span className="font-mono text-sm uppercase text-ink-soft">{base}</span>
            <span className="ml-auto text-xs text-ink-faint">
              wird der {ROLE_LABEL[seedRole]}-Farbe zugewiesen
            </span>
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-medium text-ink-soft">3 · Harmonie-Modell</h2>
          <div className="flex flex-wrap gap-2">
            {MODELS.map((m) => (
              <button
                key={m}
                onClick={() => setModel(m)}
                className={`pill border ${
                  model === m
                    ? 'border-brand bg-brand/5 font-medium text-ink'
                    : 'border-surface-line text-ink-soft hover:border-brand/40'
                }`}
              >
                {HARMONY_LABEL[m]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-medium text-ink">Ergebnis · {HARMONY_LABEL[model]}</h2>
        <PaletteGrid palettes={generated} savable hideModel />
      </section>
    </div>
  )
}
