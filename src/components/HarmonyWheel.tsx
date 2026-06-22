import type { HarmonyModel } from '../color/types'

interface HarmonyWheelProps {
  model: HarmonyModel
  baseHue?: number
  size?: number
}

const SEGMENTS = 36

const pt = (cx: number, cy: number, r: number, deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const
}

const wedge = (cx: number, cy: number, R: number, r: number, a1: number, a2: number) => {
  const [x1, y1] = pt(cx, cy, R, a1)
  const [x2, y2] = pt(cx, cy, R, a2)
  const [x3, y3] = pt(cx, cy, r, a2)
  const [x4, y4] = pt(cx, cy, r, a1)
  return `M${x1} ${y1} A${R} ${R} 0 0 1 ${x2} ${y2} L${x3} ${y3} A${r} ${r} 0 0 0 ${x4} ${y4} Z`
}

/** Conceptual marker hues per model (for illustration, not generation). */
function markers(model: HarmonyModel, h0: number): number[] {
  const w = (h: number) => ((h % 360) + 360) % 360
  switch (model) {
    case 'monochrom':
      return [h0]
    case 'analog':
      return [w(h0 - 32), h0, w(h0 + 32)]
    case 'komplementaer':
      return [h0, w(h0 + 180)]
    case 'split':
      return [h0, w(h0 + 150), w(h0 - 150)]
    case 'triadisch':
      return [h0, w(h0 + 120), w(h0 - 120)]
    case 'tetradisch':
      return [h0, w(h0 + 90), w(h0 + 180), w(h0 + 270)]
  }
}

export default function HarmonyWheel({ model, baseHue = 210, size = 132 }: HarmonyWheelProps) {
  const cx = size / 2
  const cy = size / 2
  const R = size / 2 - 4
  const r = R * 0.6
  const step = 360 / SEGMENTS
  const dots = markers(model, baseHue)

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      {Array.from({ length: SEGMENTS }, (_, i) => {
        const hue = (i + 0.5) * step
        return (
          <path
            key={i}
            d={wedge(cx, cy, R, r, i * step, (i + 1) * step)}
            fill={`hsl(${hue} 68% 55%)`}
          />
        )
      })}
      {dots.map((h, i) => {
        const [x, y] = pt(cx, cy, (R + r) / 2, h)
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="#ffffff" strokeWidth={1.5} opacity={0.7} />
            <circle cx={x} cy={y} r={7} fill={`hsl(${h} 70% 50%)`} stroke="#fff" strokeWidth={2.5} />
          </g>
        )
      })}
      <circle cx={cx} cy={cy} r={r - 1} fill="#fff" />
    </svg>
  )
}
