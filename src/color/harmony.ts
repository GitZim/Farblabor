import { converter, formatHex, clampChroma } from 'culori'
import {
  type Colors,
  type HarmonyModel,
  type Palette,
  type Role,
  ROLES,
  colorsToTuple,
} from './types'

const toOklch = converter('oklch')

export interface Oklch {
  l: number
  c: number
  h: number
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

export function hexToOklch(hex: string): Oklch {
  const o = toOklch(hex)
  if (!o) return { l: 0, c: 0, h: 0 }
  return { l: o.l ?? 0, c: o.c ?? 0, h: o.h ?? 0 }
}

/** OKLCH → sRGB hex, reducing chroma until the color fits the sRGB gamut. */
export function oklchToHex({ l, c, h }: Oklch): string {
  const inGamut = clampChroma(
    { mode: 'oklch', l: clamp(l, 0, 1), c: Math.max(0, c), h },
    'oklch',
  )
  return formatHex(inGamut) ?? '#000000'
}

/** Shortest angular distance between two hues, in degrees [0..180]. */
export function hueDistance(a: number, b: number): number {
  const d = Math.abs(((a - b) % 360 + 360) % 360)
  return Math.min(d, 360 - d)
}

const wrap = (h: number) => ((h % 360) + 360) % 360

/**
 * For a model, returns three hues derived from the base hue.
 * Index 0 is always the base hue; indices 1-2 are the harmony partners.
 */
function modelHues(model: HarmonyModel, h0: number): [number, number, number] {
  switch (model) {
    case 'monochrom':
      return [h0, h0, h0]
    case 'analog':
      return [h0, wrap(h0 + 32), wrap(h0 - 32)]
    case 'komplementaer':
      return [h0, wrap(h0 + 180), h0]
    case 'split':
      return [h0, wrap(h0 + 150), wrap(h0 - 150)]
    case 'triadisch':
      return [h0, wrap(h0 + 120), wrap(h0 - 120)]
    case 'tetradisch':
      return [h0, wrap(h0 + 90), wrap(h0 + 180)]
  }
}

/** Lightness/chroma targets per variant. Seed role keeps its exact base color. */
interface Variant {
  name: string
  cScale: number
  l: Record<Role, number>
}

const VARIANTS: Variant[] = [
  { name: 'Ausgewogen', cScale: 1.0, l: { anker: 0.37, verbindung: 0.56, akzent: 0.8 } },
  { name: 'Kräftig', cScale: 1.3, l: { anker: 0.33, verbindung: 0.53, akzent: 0.74 } },
  { name: 'Weich', cScale: 0.62, l: { anker: 0.46, verbindung: 0.64, akzent: 0.85 } },
  { name: 'Kontrast', cScale: 1.12, l: { anker: 0.28, verbindung: 0.55, akzent: 0.87 } },
]

const C_BASE: Record<Role, number> = { anker: 0.1, verbindung: 0.13, akzent: 0.14 }

/**
 * Generate a set of tricolor palette variants from a base color assigned to
 * one role. The seed role keeps the exact base color; the other two roles are
 * styled to the 60-30-10 hierarchy using the harmony's partner hues, with the
 * most contrasting hue routed to the more accent-like role.
 */
export function generatePalettes(
  base: string,
  seedRole: Role,
  model: HarmonyModel,
): Palette[] {
  const baseO = hexToOklch(base)
  const hues = modelHues(model, baseO.h)
  const partnerHues = [hues[1], hues[2]]

  // Non-seed roles, ordered by "accent-ness" (anker < verbindung < akzent).
  const otherRoles = ROLES.filter((r) => r !== seedRole)
  // Partners sorted by hue distance from base, descending.
  const sortedPartners = [...partnerHues].sort(
    (a, b) => hueDistance(b, baseO.h) - hueDistance(a, baseO.h),
  )
  // Route the most-distant partner hue to the most accent-like role.
  const hueForRole: Partial<Record<Role, number>> = {}
  hueForRole[otherRoles[otherRoles.length - 1]] = sortedPartners[0]
  hueForRole[otherRoles[0]] = sortedPartners[sortedPartners.length - 1]

  return VARIANTS.map((variant) => {
    const colors = {} as Colors
    for (const role of ROLES) {
      if (role === seedRole) {
        colors[role] = base
      } else {
        colors[role] = oklchToHex({
          l: variant.l[role],
          c: C_BASE[role] * variant.cScale,
          h: hueForRole[role] ?? baseO.h,
        })
      }
    }
    return {
      name: variant.name,
      model,
      colors: colorsToTuple(colors),
    }
  })
}

/**
 * A dark→light ramp of the given color: keeps hue & chroma, varies OKLCH
 * lightness. Useful for quickly nudging brightness within the 60-30-10 tiers.
 */
export function tintsAndShades(hex: string, steps = 9): string[] {
  const { c, h } = hexToOklch(hex)
  const loL = 0.22
  const hiL = 0.94
  return Array.from({ length: steps }, (_, i) => {
    const l = loL + (i / (steps - 1)) * (hiL - loL)
    // Taper chroma at the extremes so very dark/light steps stay natural.
    const edge = 1 - Math.abs(l - 0.55) / 0.55
    return oklchToHex({ l, c: c * (0.55 + 0.45 * Math.max(0, edge)), h })
  })
}

/** Harmony partners of a color (same L & C, rotated hue), for quick suggestions. */
export function harmonySuggestions(hex: string): { label: string; hex: string }[] {
  const { l, c, h } = hexToOklch(hex)
  const at = (deg: number) => oklchToHex({ l, c, h: ((h + deg) % 360 + 360) % 360 })
  return [
    { label: 'Komplementär', hex: at(180) },
    { label: 'Analog +30°', hex: at(30) },
    { label: 'Analog −30°', hex: at(-30) },
    { label: 'Triadisch +120°', hex: at(120) },
    { label: 'Triadisch −120°', hex: at(-120) },
  ]
}

/** WCAG relative luminance from a hex color. */
function relLuminance(hex: string): number {
  const rgb = converter('rgb')(hex)
  if (!rgb) return 0
  const lin = (v: number) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  return 0.2126 * lin(rgb.r) + 0.7152 * lin(rgb.g) + 0.0722 * lin(rgb.b)
}

/** WCAG contrast ratio between two hex colors (1..21). */
export function contrastRatio(a: string, b: string): number {
  const la = relLuminance(a)
  const lb = relLuminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}
