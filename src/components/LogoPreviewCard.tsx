import LogoMark from '../logo/LogoMark'
import { usePalette } from '../store/usePalette'
import { downloadSvg } from '../color/exportSvg'
import { ROLES, ROLE_LABEL } from '../color/types'

export default function LogoPreviewCard() {
  const colors = usePalette((s) => s.colors)
  return (
    <div className="card p-4">
      <div className="grid place-items-center rounded-xl border border-surface-line bg-white p-5">
        <LogoMark colors={colors} className="h-auto w-full max-w-[220px]" />
      </div>
      <div className="mt-3 flex flex-col gap-1.5">
        {ROLES.map((role) => (
          <div key={role} className="flex items-center gap-2 text-xs">
            <span
              className="h-4 w-4 flex-none rounded border border-black/5"
              style={{ background: colors[role] }}
            />
            <span className="flex-1 text-ink-soft">{ROLE_LABEL[role]}</span>
            <span className="font-mono uppercase text-ink-faint">{colors[role]}</span>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3 w-full" onClick={() => downloadSvg(colors)}>
        SVG herunterladen
      </button>
    </div>
  )
}
