import { useEffect, useRef, useState } from 'react'
import { clampChroma, converter } from 'culori'
import { oklchToHex } from '../color/harmony'

const toOklch = converter('oklch')

const RES_W = 264
const RES_H = 168

/** Highest in-gamut chroma at a given lightness/hue (binary-searched by culori). */
function maxInGamutChroma(l: number, h: number): number {
  return clampChroma({ mode: 'oklch', l, c: 0.5, h }, 'oklch')?.c ?? 0
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

interface Lch {
  l: number
  c: number
  h: number
}

/** Parse a hex into OKLCH, keeping a fallback hue for achromatic colors. */
function fromHex(hex: string, fallbackHue: number): Lch {
  const o = toOklch(hex)
  const c = o?.c ?? 0
  const h = o?.h == null || c < 0.0002 ? fallbackHue : o.h
  return { l: o?.l ?? 0, c, h }
}

const lin = (x: number) =>
  x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055

/** OKLCH → linear-light → sRGB (0..1 floats), inline for fast per-pixel fills. */
function oklchRGB(L: number, C: number, H: number): [number, number, number] {
  const hr = (H * Math.PI) / 180
  const a = C * Math.cos(hr)
  const b = C * Math.sin(hr)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b
  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_
  return [
    lin(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    lin(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    lin(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ]
}

interface OklchFieldProps {
  value: string
  onChange: (hex: string) => void
}

export default function OklchField({ value, onChange }: OklchFieldProps) {
  const [lch, setLch] = useState<Lch>(() => fromHex(value, 250))
  const lastEmit = useRef(value)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)

  // Re-sync from an external value change (swatch, role switch, hex input, …)
  // but ignore the echoes of our own emissions so the handle never snaps.
  useEffect(() => {
    if (value.toLowerCase() !== lastEmit.current.toLowerCase()) {
      setLch((prev) => fromHex(value, prev.h))
    }
  }, [value])

  // Repaint the field whenever the hue changes. The x-axis is RELATIVE chroma:
  // each row is scaled to its own in-gamut maximum, so every pixel is a real,
  // selectable colour (no gamut curve, no dead zones).
  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')
    if (!ctx) return
    const img = ctx.createImageData(RES_W, RES_H)
    const d = img.data
    const h = lch.h
    for (let y = 0; y < RES_H; y++) {
      const L = 1 - y / (RES_H - 1)
      const maxCRow = maxInGamutChroma(L, h)
      for (let x = 0; x < RES_W; x++) {
        const C = (x / (RES_W - 1)) * maxCRow
        const rgb = oklchRGB(L, C, h)
        const i = (y * RES_W + x) * 4
        d[i] = clamp(rgb[0] * 255, 0, 255)
        d[i + 1] = clamp(rgb[1] * 255, 0, 255)
        d[i + 2] = clamp(rgb[2] * 255, 0, 255)
        d[i + 3] = 255
      }
    }
    ctx.putImageData(img, 0, 0)
  }, [lch.h])

  // Build the OKLCH hue ramp for the slider once.
  useEffect(() => {
    if (!hueRef.current) return
    const stops: string[] = []
    for (let h = 0; h <= 360; h += 30) {
      stops.push(`${oklchToHex({ l: 0.65, c: 0.15, h })} ${(h / 360) * 100}%`)
    }
    hueRef.current.style.background = `linear-gradient(to right, ${stops.join(',')})`
  }, [])

  const emit = (L: number, C: number, H: number) => {
    const hex = oklchToHex({ l: clamp(L, 0, 1), c: Math.max(0, C), h: H })
    lastEmit.current = hex
    const back = fromHex(hex, H)
    setLch({ l: back.l, c: back.c, h: H })
    onChange(hex)
  }

  const onField = (e: PointerEvent | React.PointerEvent) => {
    const r = fieldRef.current!.getBoundingClientRect()
    const sat = clamp((e.clientX - r.left) / r.width, 0, 1)
    const L = 1 - clamp((e.clientY - r.top) / r.height, 0, 1)
    emit(L, sat * maxInGamutChroma(L, lch.h), lch.h)
  }
  const onHue = (e: PointerEvent | React.PointerEvent) => {
    const r = hueRef.current!.getBoundingClientRect()
    const H = clamp((e.clientX - r.left) / r.width, 0, 1) * 360
    // Keep relative saturation constant so the handle stays put on hue change.
    const curMax = maxInGamutChroma(lch.l, lch.h)
    const sat = curMax > 1e-4 ? lch.c / curMax : 0
    emit(lch.l, sat * maxInGamutChroma(lch.l, H), H)
  }

  const drag =
    (handler: (e: PointerEvent | React.PointerEvent) => void) =>
    (e: React.PointerEvent) => {
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      handler(e)
      const move = (ev: PointerEvent) => handler(ev)
      const up = () => {
        document.removeEventListener('pointermove', move)
        document.removeEventListener('pointerup', up)
      }
      document.addEventListener('pointermove', move)
      document.addEventListener('pointerup', up)
    }

  const handleHex = oklchToHex(lch)
  const handleMaxC = maxInGamutChroma(lch.l, lch.h)
  const handleSat = handleMaxC > 1e-4 ? clamp(lch.c / handleMaxC, 0, 1) : 0

  return (
    <div>
      <div
        ref={fieldRef}
        onPointerDown={drag(onField)}
        className="relative w-full cursor-crosshair touch-none overflow-hidden rounded-xl"
        style={{ aspectRatio: `${RES_W} / ${RES_H}` }}
      >
        <canvas
          ref={canvasRef}
          width={RES_W}
          height={RES_H}
          className="block h-full w-full"
        />
        <div
          className="pointer-events-none absolute h-4 w-4 rounded-full border-2 border-white"
          style={{
            left: `${handleSat * 100}%`,
            top: `${(1 - lch.l) * 100}%`,
            transform: 'translate(-8px, -8px)',
            background: handleHex,
            boxShadow: '0 0 0 1px rgba(0,0,0,.4)',
          }}
        />
      </div>

      <div
        ref={hueRef}
        onPointerDown={drag(onHue)}
        className="relative mt-2.5 h-3.5 cursor-pointer touch-none rounded-full"
      >
        <div
          className="pointer-events-none absolute top-1/2 h-[18px] w-[18px] rounded-full bg-white"
          style={{
            left: `${(lch.h / 360) * 100}%`,
            transform: 'translate(-9px, -50%)',
            boxShadow: '0 1px 3px rgba(0,0,0,.35)',
          }}
        />
      </div>
    </div>
  )
}
