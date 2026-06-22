import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  type Colors,
  type Palette,
  type Role,
  colorsToTuple,
  paletteToColors,
} from '../color/types'
import { DEFAULT_PALETTE } from '../color/palettes'

const MAX_RECENT = 12

interface PaletteState {
  colors: Colors
  selected: Role
  saved: Palette[]
  recent: string[]
  setColor: (role: Role, hex: string) => void
  setSelected: (role: Role) => void
  applyColors: (colors: Colors) => void
  applyPalette: (palette: Palette) => void
  savePalette: (palette: Palette) => void
  removeSaved: (index: number) => void
  isSaved: (colors: [string, string, string]) => boolean
  pushRecent: (hex: string) => void
}

const sameTriple = (a: [string, string, string], b: [string, string, string]) =>
  a[0].toLowerCase() === b[0].toLowerCase() &&
  a[1].toLowerCase() === b[1].toLowerCase() &&
  a[2].toLowerCase() === b[2].toLowerCase()

export const usePalette = create<PaletteState>()(
  persist(
    (set, get) => ({
      colors: paletteToColors(DEFAULT_PALETTE),
      selected: 'anker',
      saved: [],
      recent: [],
      setColor: (role, hex) =>
        set((s) => ({ colors: { ...s.colors, [role]: hex } })),
      pushRecent: (hex) =>
        set((s) => {
          const h = hex.toLowerCase()
          return {
            recent: [h, ...s.recent.filter((c) => c.toLowerCase() !== h)].slice(
              0,
              MAX_RECENT,
            ),
          }
        }),
      setSelected: (role) => set({ selected: role }),
      applyColors: (colors) => set({ colors }),
      applyPalette: (palette) => set({ colors: paletteToColors(palette) }),
      savePalette: (palette) =>
        set((s) =>
          s.saved.some((p) => sameTriple(p.colors, palette.colors))
            ? s
            : { saved: [palette, ...s.saved] },
        ),
      removeSaved: (index) =>
        set((s) => ({ saved: s.saved.filter((_, i) => i !== index) })),
      isSaved: (colors) =>
        get().saved.some((p) => sameTriple(p.colors, colors)),
    }),
    {
      name: 'farblabor',
      partialize: (s) => ({ colors: s.colors, saved: s.saved, recent: s.recent }),
    },
  ),
)

/** Current colors as an [anker, verbindung, akzent] tuple. */
export const useColorTuple = () => colorsToTuple(usePalette((s) => s.colors))
