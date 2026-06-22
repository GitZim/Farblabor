import { forwardRef } from 'react'
import type { Colors, Role } from '../color/types'
import { LOGO_PATHS, LOGO_VIEWBOX } from './logoPaths'

interface LogoMarkProps {
  colors: Colors
  selected?: Role
  onSelect?: (role: Role) => void
  className?: string
  /** When true, paths are clickable and the active one is emphasized. */
  interactive?: boolean
}

const LogoMark = forwardRef<SVGSVGElement, LogoMarkProps>(function LogoMark(
  { colors, selected, onSelect, className, interactive = false },
  ref,
) {
  return (
    <svg
      ref={ref}
      viewBox={LOGO_VIEWBOX}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Logo mit drei Farbelementen"
    >
      {LOGO_PATHS.map(({ role, d }) => {
        const isActive = interactive && selected === role
        const dimmed = interactive && selected != null && !isActive
        return (
          <path
            key={role}
            d={d}
            fill={colors[role]}
            onClick={interactive ? () => onSelect?.(role) : undefined}
            style={{
              cursor: interactive ? 'pointer' : undefined,
              opacity: dimmed ? 0.82 : 1,
              transition: 'fill .18s ease, opacity .18s ease',
            }}
            aria-label={interactive ? role : undefined}
          />
        )
      })}
    </svg>
  )
})

export default LogoMark
