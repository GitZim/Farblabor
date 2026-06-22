import { formatHex, interpolate } from 'culori'
import { contrastRatio, generatePalettes, hexToOklch, oklchToHex } from './harmony'
import { HARMONY_LABEL, type HarmonyModel, type Palette } from './types'

const sortByLightness = (hexes: string[]) =>
  [...hexes].sort((a, b) => hexToOklch(a).l - hexToOklch(b).l)

/**
 * Verlauf/Interpolation: perceptual OKLCH blend between two endpoint colours.
 * The middle role becomes the interpolated midpoint; roles are ordered dark→light.
 */
export function gradientTricolors(from: string, to: string): Palette[] {
  const mix = interpolate([from, to], 'oklch')
  const variants: { name: string; t: number }[] = [
    { name: 'Mittig', t: 0.5 },
    { name: 'Hellere Mitte', t: 0.62 },
    { name: 'Dunklere Mitte', t: 0.38 },
  ]
  return variants.map((v) => {
    const mid = formatHex(mix(v.t)) ?? '#888888'
    const [a, b, c] = sortByLightness([from, mid, to])
    return { name: v.name, model: 'analog', colors: [a, b, c] }
  })
}

export interface ContrastResult {
  name: string
  colors: [string, string, string]
  pairs: { label: string; ratio: number }[]
  /** Lowest of the three pairwise ratios — how distinguishable the weakest pair is. */
  weakest: number
}

const DISTINGUISHABLE = 1.5

/**
 * Kontrast/Barrierefrei: monochrome lightness spreads at the base hue, kept only
 * when all three elements are mutually distinguishable. Ordered by weakest pair.
 */
export function contrastTricolors(base: string): ContrastResult[] {
  const { c, h } = hexToOklch(base)
  const spreads: [number, number, number][] = [
    [0.3, 0.55, 0.82],
    [0.25, 0.52, 0.8],
    [0.34, 0.6, 0.86],
    [0.28, 0.5, 0.74],
    [0.22, 0.48, 0.78],
    [0.32, 0.58, 0.9],
  ]
  const results: ContrastResult[] = spreads.map(([l1, l2, l3], i) => {
    const colors: [string, string, string] = [
      oklchToHex({ l: l1, c, h }),
      oklchToHex({ l: l2, c: c * 0.9, h }),
      oklchToHex({ l: l3, c: c * 0.8, h }),
    ]
    const av = contrastRatio(colors[0], colors[1])
    const va = contrastRatio(colors[1], colors[2])
    const aa = contrastRatio(colors[0], colors[2])
    return {
      name: `Variante ${i + 1}`,
      colors,
      pairs: [
        { label: 'Anker ↔ Verbindung', ratio: av },
        { label: 'Verbindung ↔ Akzent', ratio: va },
        { label: 'Anker ↔ Akzent', ratio: aa },
      ],
      weakest: Math.min(av, va, aa),
    }
  })
  return results
    .filter((r) => r.weakest >= DISTINGUISHABLE)
    .sort((a, b) => b.weakest - a.weakest)
}

export interface Attribute {
  id: string
  label: string
  blurb: string
  hue: number
  chroma: number
  model: HarmonyModel
  /** Optional distinct hue for the accent role (e.g. gold for luxury). */
  accentHue?: number
}

export const ATTRIBUTES: Attribute[] = [
  { id: 'vertrauen', label: 'Vertrauen', blurb: 'Blau — seriös, verlässlich', hue: 250, chroma: 0.1, model: 'monochrom' },
  { id: 'energie', label: 'Energie', blurb: 'Rot/Orange — dynamisch', hue: 32, chroma: 0.16, model: 'analog' },
  { id: 'ruhe', label: 'Ruhe', blurb: 'Blaugrün — entspannt', hue: 200, chroma: 0.07, model: 'analog' },
  { id: 'luxus', label: 'Luxus', blurb: 'Violett + Gold — edel', hue: 312, chroma: 0.1, model: 'split', accentHue: 85 },
  { id: 'natur', label: 'Natur', blurb: 'Grün/Erde — organisch', hue: 140, chroma: 0.12, model: 'analog' },
  { id: 'verspielt', label: 'Verspielt', blurb: 'Magenta/Pink — lebhaft', hue: 330, chroma: 0.16, model: 'triadisch' },
  { id: 'optimismus', label: 'Optimismus', blurb: 'Gelb/Orange — heiter', hue: 75, chroma: 0.14, model: 'analog' },
  { id: 'serioes', label: 'Seriös', blurb: 'Blaugrau — zurückhaltend', hue: 235, chroma: 0.04, model: 'monochrom' },
]

const rnd = (a: number, b: number) => a + Math.random() * (b - a)
const choice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const RANDOM_MODELS: HarmonyModel[] = [
  'monochrom',
  'analog',
  'komplementaer',
  'split',
  'triadisch',
  'tetradisch',
]

export type RandomStyle = 'alle' | 'gedaempft' | 'kraeftig' | 'pastell' | 'tief'

/**
 * Structured random: instead of three raw RGB values (almost always ugly), we
 * randomise over hue + harmony model + character variant. The 60-30-10 engine
 * keeps every result coherent. `anchorBase` locks the anker and only re-rolls
 * the other two roles. `style` biases base chroma/lightness and the variant.
 */
const wrap = (h: number) => ((h % 360) + 360) % 360
const baseHue = (anchor?: string) => (anchor ? hexToOklch(anchor).h : rnd(0, 360))

/**
 * Wildcards: coherent tricolor strategies that are NOT based on the geometric
 * harmony wheel. `model` is a plausible closest scheme (only shown when saved);
 * the strategy name is what's displayed. Each honours a locked anker if given.
 */
interface Wildcard {
  name: string
  model: HarmonyModel
  build: (anchor?: string) => [string, string, string]
}

const WILDCARDS: Wildcard[] = [
  {
    name: 'Golden-Angle',
    model: 'triadisch',
    build: (a) => {
      const h = baseHue(a)
      return [
        a ?? oklchToHex({ l: 0.34, c: 0.1, h }),
        oklchToHex({ l: 0.55, c: 0.12, h: wrap(h + 137.5) }),
        oklchToHex({ l: 0.8, c: 0.13, h: wrap(h + 275) }),
      ]
    },
  },
  {
    name: 'Neutral + Pop',
    model: 'komplementaer',
    build: (a) => {
      const h = baseHue(a)
      return [
        a ?? oklchToHex({ l: 0.3, c: 0.025, h }),
        oklchToHex({ l: 0.63, c: 0.02, h }),
        oklchToHex({ l: rnd(0.55, 0.7), c: 0.17, h: wrap(h + rnd(120, 220)) }),
      ]
    },
  },
  {
    name: 'Warm–Kalt',
    model: 'komplementaer',
    build: (a) => {
      const warmH = rnd(28, 68)
      const h = a ? hexToOklch(a).h : rnd(205, 265)
      return [
        a ?? oklchToHex({ l: 0.32, c: 0.1, h }),
        oklchToHex({ l: 0.6, c: 0.05, h: wrap((h + warmH) / 2) }),
        oklchToHex({ l: 0.7, c: 0.15, h: warmH }),
      ]
    },
  },
  {
    name: 'Drift',
    model: 'analog',
    build: (a) => {
      const h = baseHue(a)
      const C0 = rnd(0.07, 0.12)
      const l1 = 0.32 + rnd(0.14, 0.2)
      const h1 = wrap(h + rnd(-40, 40))
      return [
        a ?? oklchToHex({ l: 0.32, c: C0, h }),
        oklchToHex({ l: l1, c: C0 * rnd(0.85, 1.2), h: h1 }),
        oklchToHex({ l: Math.min(l1 + rnd(0.12, 0.2), 0.9), c: C0 * rnd(0.8, 1.2), h: wrap(h1 + rnd(-40, 40)) }),
      ]
    },
  },
  {
    name: 'Hochkey',
    model: 'monochrom',
    build: (a) => {
      const h = baseHue(a)
      return [
        a ?? oklchToHex({ l: 0.55, c: rnd(0.06, 0.1), h }),
        oklchToHex({ l: 0.72, c: 0.07, h: wrap(h + rnd(-30, 30)) }),
        oklchToHex({ l: 0.88, c: 0.05, h: wrap(h + rnd(-30, 30)) }),
      ]
    },
  },
  {
    name: 'Tiefkey',
    model: 'monochrom',
    build: (a) => {
      const h = baseHue(a)
      return [
        a ?? oklchToHex({ l: 0.22, c: rnd(0.06, 0.12), h }),
        oklchToHex({ l: 0.36, c: 0.1, h: wrap(h + rnd(-25, 25)) }),
        oklchToHex({ l: 0.52, c: 0.12, h: wrap(h + rnd(-25, 25)) }),
      ]
    },
  },
  {
    name: 'Jewel',
    model: 'triadisch',
    build: (a) => {
      const h = baseHue(a)
      return [
        a ?? oklchToHex({ l: 0.36, c: 0.15, h }),
        oklchToHex({ l: 0.46, c: 0.16, h: wrap(h + rnd(60, 140)) }),
        oklchToHex({ l: 0.56, c: 0.16, h: wrap(h + rnd(190, 300)) }),
      ]
    },
  },
  {
    name: 'Erdig',
    model: 'analog',
    build: (a) => {
      const h = a ? hexToOklch(a).h : rnd(20, 95)
      return [
        a ?? oklchToHex({ l: 0.32, c: 0.07, h }),
        oklchToHex({ l: 0.5, c: 0.09, h: wrap(h + rnd(-20, 30)) }),
        oklchToHex({ l: 0.72, c: 0.08, h: wrap(h + rnd(-15, 25)) }),
      ]
    },
  },
  {
    name: 'Clash',
    model: 'split',
    build: (a) => {
      const h = baseHue(a)
      return [
        a ?? oklchToHex({ l: 0.42, c: 0.15, h }),
        oklchToHex({ l: 0.58, c: 0.16, h: wrap(h + rnd(55, 85)) }),
        oklchToHex({ l: 0.7, c: 0.16, h: wrap(h - rnd(55, 85)) }),
      ]
    },
  },
  {
    name: 'Sorbet',
    model: 'analog',
    build: (a) => {
      const h = baseHue(a)
      return [
        a ?? oklchToHex({ l: 0.5, c: 0.15, h }),
        oklchToHex({ l: 0.66, c: 0.15, h: wrap(h + rnd(18, 40)) }),
        oklchToHex({ l: 0.82, c: 0.12, h: wrap(h + rnd(45, 75)) }),
      ]
    },
  },
  {
    name: 'Gedeckt',
    model: 'triadisch',
    build: (a) => {
      const h = baseHue(a)
      return [
        a ?? oklchToHex({ l: 0.38, c: 0.045, h }),
        oklchToHex({ l: 0.55, c: 0.05, h: wrap(h + rnd(80, 160)) }),
        oklchToHex({ l: 0.74, c: 0.045, h: wrap(h + rnd(190, 280)) }),
      ]
    },
  },
  {
    name: 'Cyber',
    model: 'split',
    build: (a) => {
      const h = baseHue(a)
      return [
        a ?? oklchToHex({ l: 0.18, c: 0.05, h }),
        oklchToHex({ l: 0.62, c: 0.16, h: wrap(h + rnd(120, 160)) }),
        oklchToHex({ l: 0.8, c: 0.17, h: wrap(h + rnd(180, 220)) }),
      ]
    },
  },
  {
    name: 'Vaporwave',
    model: 'split',
    build: (a) => [
      a ?? oklchToHex({ l: 0.4, c: 0.13, h: rnd(280, 300) }),
      oklchToHex({ l: 0.62, c: 0.14, h: rnd(190, 210) }),
      oklchToHex({ l: 0.78, c: 0.12, h: rnd(340, 358) }),
    ],
  },
  {
    name: 'Duoton',
    model: 'monochrom',
    build: (a) => {
      const h = baseHue(a)
      return [
        a ?? oklchToHex({ l: 0.3, c: 0.1, h }),
        oklchToHex({ l: 0.56, c: 0.14, h: wrap(h + rnd(150, 210)) }),
        oklchToHex({ l: 0.84, c: 0.07, h }),
      ]
    },
  },
  {
    name: 'Metallic',
    model: 'analog',
    build: (a) => {
      const h = a ? hexToOklch(a).h : rnd(62, 90)
      return [
        a ?? oklchToHex({ l: 0.34, c: 0.07, h }),
        oklchToHex({ l: 0.56, c: 0.1, h: wrap(h + rnd(-8, 8)) }),
        oklchToHex({ l: 0.83, c: 0.06, h: wrap(h + rnd(-6, 10)) }),
      ]
    },
  },
]

/** Harmony-wheel based random (one model + character variant). */
function harmonyRandom(style: RandomStyle, anchorBase?: string): Palette {
  const model = choice(RANDOM_MODELS)
  let baseL = rnd(0.3, 0.45)
  let baseC = rnd(0.06, 0.13)
  if (style === 'gedaempft') baseC = rnd(0.03, 0.06)
  if (style === 'kraeftig') baseC = rnd(0.12, 0.18)
  if (style === 'pastell') {
    baseL = rnd(0.4, 0.5)
    baseC = rnd(0.05, 0.09)
  }
  if (style === 'tief') {
    baseL = rnd(0.26, 0.36)
    baseC = rnd(0.1, 0.16)
  }
  const base = anchorBase ?? oklchToHex({ l: baseL, c: baseC, h: rnd(0, 360) })
  const variants = generatePalettes(base, 'anker', model)
  const byName = (n: string) => variants.find((v) => v.name === n) ?? variants[0]
  const v =
    style === 'pastell'
      ? byName('Weich')
      : style === 'kraeftig'
        ? byName('Kräftig')
        : style === 'tief'
          ? byName('Kontrast')
          : choice(variants)
  return { name: HARMONY_LABEL[model], model, colors: v.colors }
}

export function randomPalette(style: RandomStyle = 'alle', anchorBase?: string): Palette {
  // Controlled character → harmony only. "Alle" → mix in the wildcards.
  if (style !== 'alle' || Math.random() < 0.45) return harmonyRandom(style, anchorBase)
  const w = choice(WILDCARDS)
  return { name: w.name, model: w.model, colors: w.build(anchorBase) }
}

export function randomPalettes(
  count: number,
  style: RandomStyle = 'alle',
  anchorBase?: string,
): Palette[] {
  return Array.from({ length: count }, () => randomPalette(style, anchorBase))
}

/** Farbpsychologie: derive tricolor variants from a semantic attribute. */
export function semanticTricolors(attr: Attribute): Palette[] {
  const base = oklchToHex({ l: 0.36, c: attr.chroma, h: attr.hue })
  const pals = generatePalettes(base, 'anker', attr.model)
  if (attr.accentHue == null) return pals.map((p) => ({ ...p, model: attr.model }))
  // Recolor the accent role onto the distinct accent hue (keep its lightness).
  return pals.map((p) => {
    const akL = hexToOklch(p.colors[2]).l
    const akzent = oklchToHex({ l: akL, c: 0.13, h: attr.accentHue! })
    return { ...p, model: attr.model, colors: [p.colors[0], p.colors[1], akzent] }
  })
}
