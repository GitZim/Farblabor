import ColorPicker from './ColorPicker'
import { usePalette } from '../store/usePalette'
import { ROLE_LABEL, colorsToTuple } from '../color/types'

export default function ColorControl() {
  const selected = usePalette((s) => s.selected)
  const colors = usePalette((s) => s.colors)
  const setColor = usePalette((s) => s.setColor)
  const value = colors[selected]

  return (
    <div className="flex items-center gap-3 rounded-xl border border-surface-line bg-surface p-3">
      <ColorPicker
        value={value}
        onChange={(hex) => setColor(selected, hex)}
        paletteSwatches={colorsToTuple(colors)}
        ariaLabel={`Farbe für ${ROLE_LABEL[selected]} wählen`}
        currentRole={selected}
        onAssignRole={setColor}
      />
      <div className="min-w-0">
        <div className="text-xs text-ink-faint">
          Farbe für <span className="font-medium text-ink-soft">{ROLE_LABEL[selected]}</span>
        </div>
        <div className="font-mono text-sm uppercase text-ink">{value}</div>
      </div>
    </div>
  )
}
