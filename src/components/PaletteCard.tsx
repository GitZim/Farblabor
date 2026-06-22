import type { Palette } from '../color/types'
import { HARMONY_LABEL } from '../color/types'

interface PaletteCardProps {
  palette: Palette
  onApply: () => void
  onToggleSave?: () => void
  saved?: boolean
  active?: boolean
  /** Hide the harmony-model sub-label (e.g. in the generator where it's implied). */
  hideModel?: boolean
}

export default function PaletteCard({
  palette,
  onApply,
  onToggleSave,
  saved,
  active,
  hideModel,
}: PaletteCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border bg-surface transition ${
        active ? 'border-brand ring-1 ring-brand/30' : 'border-surface-line hover:border-brand/40'
      }`}
    >
      <button
        onClick={onApply}
        className="block w-full text-left"
        aria-label={`Palette ${palette.name} anwenden`}
      >
        <span className="flex h-14">
          {palette.colors.map((c, i) => (
            <span key={i} className="flex-1" style={{ background: c }} />
          ))}
        </span>
        <span className="flex items-center justify-between px-3 py-2">
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-ink">
              {palette.name}
            </span>
            {!hideModel && (
              <span className="block text-xs text-ink-faint">
                {HARMONY_LABEL[palette.model]}
              </span>
            )}
          </span>
        </span>
      </button>

      {onToggleSave && (
        <button
          onClick={onToggleSave}
          aria-label={saved ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
          title={saved ? 'Gespeichert' : 'Merken'}
          className={`absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-lg border text-sm backdrop-blur transition ${
            saved
              ? 'border-amber-300 bg-white/85 text-amber-500'
              : 'border-white/60 bg-white/70 text-ink-soft opacity-0 hover:text-amber-500 group-hover:opacity-100'
          }`}
        >
          {saved ? '★' : '☆'}
        </button>
      )}
    </div>
  )
}
