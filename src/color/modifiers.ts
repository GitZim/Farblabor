import { hexToOklch, oklchToHex } from './harmony'

/** A tone modifier transforms a single colour in OKLCH. */
export interface Modifier {
  id: string
  label: string
  hint: string
  apply: (hex: string) => string
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/** Move a hue a fraction of the way toward a target hue (shortest path). */
const toward = (h: number, target: number, frac: number) =>
  (((h + (((target - h + 540) % 360) - 180) * frac) % 360) + 360) % 360

/**
 * Absolute character presets: hue is preserved, lightness/chroma jump to the
 * target tone. High chroma targets (Kräftig/Tief) are reduced to the sRGB
 * gamut boundary automatically by oklchToHex.
 */
export const MODIFIERS: Modifier[] = [
  {
    id: 'pastell',
    label: 'Pastell',
    hint: 'hell & weich',
    apply: (hex) => oklchToHex({ l: 0.87, c: 0.055, h: hexToOklch(hex).h }),
  },
  {
    id: 'kraeftig',
    label: 'Kräftig',
    hint: 'maximale Sättigung',
    apply: (hex) => oklchToHex({ l: 0.6, c: 0.4, h: hexToOklch(hex).h }),
  },
  {
    id: 'gedaempft',
    label: 'Gedämpft',
    hint: 'entsättigt, Helligkeit bleibt',
    apply: (hex) => {
      const { l, h } = hexToOklch(hex)
      return oklchToHex({ l, c: 0.04, h })
    },
  },
  {
    id: 'tief',
    label: 'Tief',
    hint: 'dunkel & satt',
    apply: (hex) => oklchToHex({ l: 0.34, c: 0.4, h: hexToOklch(hex).h }),
  },
  {
    id: 'blass',
    label: 'Blass',
    hint: 'sehr hell, fast grau',
    apply: (hex) => oklchToHex({ l: 0.93, c: 0.028, h: hexToOklch(hex).h }),
  },
]

/**
 * Relative, repeatable fine adjustments — small OKLCH steps that can be applied
 * multiple times. Chroma steps that exceed the gamut are clamped by oklchToHex.
 */
export const FINE_MODIFIERS: Modifier[] = [
  {
    id: 'heller',
    label: 'Heller',
    hint: 'Helligkeit + (wiederholbar)',
    apply: (hex) => {
      const { l, c, h } = hexToOklch(hex)
      return oklchToHex({ l: clamp(l + 0.07, 0.06, 0.97), c, h })
    },
  },
  {
    id: 'dunkler',
    label: 'Dunkler',
    hint: 'Helligkeit − (wiederholbar)',
    apply: (hex) => {
      const { l, c, h } = hexToOklch(hex)
      return oklchToHex({ l: clamp(l - 0.07, 0.06, 0.97), c, h })
    },
  },
  {
    id: 'sat-plus',
    label: 'Sättigung +',
    hint: 'Sättigung + (bis Gamut-Grenze)',
    apply: (hex) => {
      const { l, c, h } = hexToOklch(hex)
      return oklchToHex({ l, c: Math.max(c, 0.02) * 1.3, h })
    },
  },
  {
    id: 'sat-minus',
    label: 'Sättigung −',
    hint: 'Sättigung − (Richtung grau)',
    apply: (hex) => {
      const { l, c, h } = hexToOklch(hex)
      return oklchToHex({ l, c: c * 0.78, h })
    },
  },
  {
    id: 'waermer',
    label: 'Wärmer',
    hint: 'Farbton Richtung Orange',
    apply: (hex) => {
      const { l, c, h } = hexToOklch(hex)
      return oklchToHex({ l, c, h: toward(h, 60, 0.16) })
    },
  },
  {
    id: 'kuehler',
    label: 'Kühler',
    hint: 'Farbton Richtung Blau',
    apply: (hex) => {
      const { l, c, h } = hexToOklch(hex)
      return oklchToHex({ l, c, h: toward(h, 250, 0.16) })
    },
  },
]
