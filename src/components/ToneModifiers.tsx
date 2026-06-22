import { usePalette } from '../store/usePalette'
import { FINE_MODIFIERS, MODIFIERS, type Modifier } from '../color/modifiers'
import { ROLE_LABEL } from '../color/types'

export default function ToneModifiers() {
  const selected = usePalette((s) => s.selected)
  const colors = usePalette((s) => s.colors)
  const setColor = usePalette((s) => s.setColor)

  const run = (m: Modifier) => setColor(selected, m.apply(colors[selected]))

  const Group = ({ label, items }: { label: string; items: Modifier[] }) => (
    <div>
      <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((m) => (
          <button
            key={m.id}
            title={m.hint}
            onClick={() => run(m)}
            className="pill border border-surface-line text-ink-soft hover:border-brand/40 hover:text-ink"
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-3">
      <Group label="Charakter" items={MODIFIERS} />
      <Group label="Feinjustierung" items={FINE_MODIFIERS} />
      <p className="text-xs text-ink-faint">
        Wirken auf die {ROLE_LABEL[selected]}-Farbe. Feinjustierung ist mehrfach anwendbar.
      </p>
    </div>
  )
}
