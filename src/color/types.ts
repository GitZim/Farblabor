/** The three customizable logo elements, in 60-30-10 hierarchy. */
export type Role = 'anker' | 'verbindung' | 'akzent'

export const ROLES: Role[] = ['anker', 'verbindung', 'akzent']

export const ROLE_LABEL: Record<Role, string> = {
  anker: 'Anker',
  verbindung: 'Verbindung',
  akzent: 'Akzent',
}

export const ROLE_HINT: Record<Role, string> = {
  anker: 'Äußerer Ring · dominant (~60 %)',
  verbindung: 'Mittlere Spirale · sekundär (~30 %)',
  akzent: 'Innerer Kern · Akzent (~10 %)',
}

/** A full set of colors for the logo, keyed by role. */
export type Colors = Record<Role, string>

export type HarmonyModel =
  | 'monochrom'
  | 'analog'
  | 'komplementaer'
  | 'split'
  | 'triadisch'
  | 'tetradisch'

export const HARMONY_LABEL: Record<HarmonyModel, string> = {
  monochrom: 'Monochrom',
  analog: 'Analog',
  komplementaer: 'Komplementär',
  split: 'Split-Komplementär',
  triadisch: 'Triadisch',
  tetradisch: 'Tetradisch',
}

/** A curated or generated tricolor palette. colors = [anker, verbindung, akzent]. */
export interface Palette {
  name: string
  model: HarmonyModel
  colors: [string, string, string]
}

export function paletteToColors(p: Pick<Palette, 'colors'>): Colors {
  return { anker: p.colors[0], verbindung: p.colors[1], akzent: p.colors[2] }
}

export function colorsToTuple(c: Colors): [string, string, string] {
  return [c.anker, c.verbindung, c.akzent]
}
