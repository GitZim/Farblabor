import { usePalette } from '../store/usePalette'
import { ROLES, ROLE_HINT, ROLE_LABEL } from '../color/types'

export default function ElementSelector() {
  const colors = usePalette((s) => s.colors)
  const selected = usePalette((s) => s.selected)
  const setSelected = usePalette((s) => s.setSelected)

  return (
    <div className="flex flex-col gap-2">
      {ROLES.map((role) => {
        const active = selected === role
        return (
          <button
            key={role}
            onClick={() => setSelected(role)}
            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
              active
                ? 'border-brand bg-brand/5'
                : 'border-surface-line bg-surface hover:border-brand/40'
            }`}
          >
            <span
              className="h-9 w-9 flex-none rounded-lg border border-black/5"
              style={{ background: colors[role] }}
            />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-ink">
                {ROLE_LABEL[role]}
              </span>
              <span className="block text-xs text-ink-faint">{ROLE_HINT[role]}</span>
            </span>
            <span className="font-mono text-xs uppercase text-ink-faint">
              {colors[role]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
