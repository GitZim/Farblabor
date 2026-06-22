import type { Palette } from './types'
import { ATTRIBUTES, semanticTricolors } from './generators'

/**
 * Curated tricolor palettes. Each `colors` tuple is ordered
 * [anker (dominant/dark), verbindung (mid), akzent (light or pop)].
 */
export interface PaletteGroup {
  id: string
  title: string
  blurb: string
  palettes: Palette[]
}

const BASE_GROUPS: PaletteGroup[] = [
  {
    id: 'harmonisch',
    title: 'Harmonisch',
    blurb: 'Klassische Farbkreis-Beziehungen — verlässlich und ausgewogen.',
    palettes: [
      { name: 'Tiefsee', model: 'monochrom', colors: ['#0B2A45', '#2D6E9E', '#84C5E0'] },
      { name: 'Schiefer', model: 'monochrom', colors: ['#14233A', '#46627F', '#9DB4C9'] },
      { name: 'Lagune', model: 'analog', colors: ['#0E4A52', '#2C8C9B', '#8FD0CF'] },
      { name: 'Waldsaum', model: 'analog', colors: ['#14402A', '#3E8C5A', '#A7D8A0'] },
      { name: 'Sonnenuntergang', model: 'komplementaer', colors: ['#15425C', '#E08A3C', '#F6D9A8'] },
      { name: 'Hafen', model: 'komplementaer', colors: ['#103A4A', '#D9663B', '#F0C9A0'] },
      { name: 'Korallenriff', model: 'split', colors: ['#123A4A', '#E2674E', '#F2C36B'] },
      { name: 'Beere & Stein', model: 'split', colors: ['#2E2440', '#8E4585', '#C9B7D6'] },
      { name: 'Primärfrisch', model: 'triadisch', colors: ['#2E5E8C', '#C9457E', '#5DA653'] },
      { name: 'Karneval', model: 'triadisch', colors: ['#2B6E6A', '#B5462E', '#D9A441'] },
      { name: 'Vierklang', model: 'tetradisch', colors: ['#244A6E', '#2E8B6F', '#C75B57'] },
      { name: 'Spektrum', model: 'tetradisch', colors: ['#3A2E6E', '#2E8B57', '#D98C3A'] },
    ],
  },
  {
    id: 'modern',
    title: 'Modern 2026',
    blurb: 'Aktuelle Trendpaletten — von Transformative Teal bis Tech-Neon.',
    palettes: [
      { name: 'Transformative Teal', model: 'analog', colors: ['#0F4C4A', '#2A9D8F', '#8FD9CF'] },
      { name: 'Erdig & gedämpft', model: 'monochrom', colors: ['#4A4031', '#9C7A4D', '#CBB892'] },
      { name: 'Salbei & Terrakotta', model: 'komplementaer', colors: ['#3C4A3A', '#B0613F', '#D8C3A5'] },
      { name: 'Digital Lavender', model: 'analog', colors: ['#2E2A4A', '#7A6FB0', '#C9C2E8'] },
      { name: 'Tech-Neon', model: 'split', colors: ['#0B1020', '#1FB6A6', '#6EE7FF'] },
      { name: 'Coral & Cobalt', model: 'komplementaer', colors: ['#16306B', '#2B59C3', '#FF6F61'] },
      { name: 'Cloud & Stein', model: 'monochrom', colors: ['#3A3A38', '#8C8A82', '#EDEBE3'] },
      { name: 'Wasabi', model: 'triadisch', colors: ['#213A2A', '#4F7A3E', '#B7D14B'] },
    ],
  },
  {
    id: 'ozean',
    title: 'Ozean & Küste',
    blurb: 'Maritime und Küsten-Töne — passend zum Wellen-Logo.',
    palettes: [
      { name: 'Tiefsee', model: 'monochrom', colors: ['#0B2A45', '#2D6E9E', '#84C5E0'] },
      { name: 'Lagune', model: 'analog', colors: ['#0E4A52', '#2C8C9B', '#8FD0CF'] },
      { name: 'Strand & Sand', model: 'komplementaer', colors: ['#2A4A5A', '#C9A36B', '#EFE0C4'] },
      { name: 'Korallenriff', model: 'split', colors: ['#123A4A', '#E2674E', '#F2C36B'] },
      { name: 'Nordsee', model: 'monochrom', colors: ['#1B2E3A', '#41707E', '#A9C7CE'] },
      { name: 'Mittelmeer', model: 'komplementaer', colors: ['#14506E', '#1C9AA8', '#E8D9A0'] },
      { name: 'Navy & Weiß', model: 'monochrom', colors: ['#16263F', '#3E5C7E', '#DCE6EF'] },
      { name: 'Gezeiten', model: 'analog', colors: ['#0E3B3B', '#2E8B8B', '#BFE3DE'] },
    ],
  },
  {
    id: 'natur',
    title: 'Natur & Erde',
    blurb: 'Organische, geerdete Töne — Wald, Wüste, Stein, Herbst.',
    palettes: [
      { name: 'Wald', model: 'analog', colors: ['#1E3A2A', '#4F7A4E', '#A7C796'] },
      { name: 'Wüste', model: 'monochrom', colors: ['#6B4A2E', '#C08A4E', '#E8CBA0'] },
      { name: 'Stein', model: 'monochrom', colors: ['#3A3A38', '#7D7B74', '#C9C5BC'] },
      { name: 'Moos', model: 'analog', colors: ['#25331C', '#5E7A3A', '#AEC48A'] },
      { name: 'Herbstlaub', model: 'analog', colors: ['#5A2A1A', '#B5632E', '#E0A94E'] },
      { name: 'Vulkan', model: 'split', colors: ['#2A1A18', '#8A3320', '#D98C3A'] },
      { name: 'Salbei & Ton', model: 'komplementaer', colors: ['#3C4A3A', '#8A6A52', '#CBB892'] },
      { name: 'Tundra', model: 'monochrom', colors: ['#34403A', '#6E8276', '#C2CBBE'] },
    ],
  },
  {
    id: 'jahreszeiten',
    title: 'Jahreszeiten',
    blurb: 'Frühling, Sommer, Herbst, Winter — Stimmungen der Saisons.',
    palettes: [
      { name: 'Frühling', model: 'analog', colors: ['#2E5E3A', '#7FB069', '#E8E1A0'] },
      { name: 'Blüte', model: 'split', colors: ['#4A6E3A', '#A8C66C', '#F2D7E0'] },
      { name: 'Sommer', model: 'komplementaer', colors: ['#1C6E8C', '#2DC7C7', '#FFE08A'] },
      { name: 'Hochsommer', model: 'analog', colors: ['#146E6E', '#2BB3A3', '#FFD86E'] },
      { name: 'Herbst', model: 'analog', colors: ['#5A2A1A', '#C2622E', '#E0B24E'] },
      { name: 'Goldener Herbst', model: 'monochrom', colors: ['#4A2E14', '#A65E2E', '#E8C06A'] },
      { name: 'Winter', model: 'monochrom', colors: ['#1F2D45', '#5B7FA6', '#CADCE8'] },
      { name: 'Winterfrost', model: 'monochrom', colors: ['#25323F', '#6E8EA6', '#DCE8EE'] },
    ],
  },
  {
    id: 'vintage',
    title: 'Vintage & Retro',
    blurb: '70er, Mid-Century, Synthwave, Sepia, Art Déco.',
    palettes: [
      { name: '70er Erdtöne', model: 'analog', colors: ['#6B3A1E', '#CC5500', '#DA9100'] },
      { name: 'Mid-Century', model: 'split', colors: ['#2A3B3A', '#C75B39', '#E3C56B'] },
      { name: 'Synthwave', model: 'komplementaer', colors: ['#1A0B2E', '#C0407F', '#36E0E0'] },
      { name: '80er Neon', model: 'split', colors: ['#1A1040', '#FF4FA3', '#2DE0D0'] },
      { name: 'Sepia', model: 'monochrom', colors: ['#3A2E22', '#8C6A47', '#D9C2A0'] },
      { name: 'Art Déco', model: 'komplementaer', colors: ['#16202A', '#3E6E6A', '#C9A24B'] },
      { name: 'Walnut Retro', model: 'monochrom', colors: ['#2E1E14', '#6E4A2E', '#C7A07A'] },
      { name: 'Pop 90er', model: 'triadisch', colors: ['#2D2A4A', '#5AA0C9', '#F2B5C4'] },
    ],
  },
  {
    id: 'mood',
    title: 'Stimmungen',
    blurb: 'Nach emotionaler Wirkung — ruhig, energetisch, verspielt, seriös.',
    palettes: [
      { name: 'Ruhig', model: 'monochrom', colors: ['#2C3E50', '#6B8CAE', '#BCD3E0'] },
      { name: 'Energetisch', model: 'analog', colors: ['#7A1F2B', '#E84C2B', '#F4B23E'] },
      { name: 'Verspielt', model: 'triadisch', colors: ['#3A2E6E', '#E55D9C', '#6FD3C9'] },
      { name: 'Seriös', model: 'monochrom', colors: ['#1F2A38', '#44586E', '#9AA8B6'] },
      { name: 'Warm', model: 'analog', colors: ['#5A2A2E', '#C56A4E', '#E8C49A'] },
      { name: 'Kühl', model: 'monochrom', colors: ['#1E3A4A', '#3E7E8E', '#ACCBD2'] },
      { name: 'Optimistisch', model: 'komplementaer', colors: ['#1C5D78', '#2FA8C9', '#FFD56B'] },
      { name: 'Mystisch', model: 'monochrom', colors: ['#1A1430', '#4A3A7A', '#9A86C9'] },
    ],
  },
  {
    id: 'branchen',
    title: 'Branchen & Brand',
    blurb: 'Nach Branchenwirkung — Tech, Finanzen, Health, Food, Luxus, Eco.',
    palettes: [
      { name: 'Tech', model: 'monochrom', colors: ['#14233A', '#2B6CB0', '#63D2FF'] },
      { name: 'Finanzen', model: 'analog', colors: ['#14302A', '#1F6E5A', '#B8C9A8'] },
      { name: 'Health', model: 'analog', colors: ['#1E4A45', '#4FAE9E', '#BFE3D6'] },
      { name: 'Food', model: 'split', colors: ['#5A2418', '#C24A2E', '#E8B84E'] },
      { name: 'Luxus', model: 'split', colors: ['#2A1E2E', '#6E2E4A', '#C9A24B'] },
      { name: 'Eco', model: 'analog', colors: ['#2E4A22', '#6E9E3A', '#CFE0A0'] },
      { name: 'Beauty', model: 'monochrom', colors: ['#3A1E2E', '#9A4E6E', '#E8C2CE'] },
      { name: 'Bildung', model: 'komplementaer', colors: ['#1F2E5A', '#3E6EB0', '#F2C14E'] },
    ],
  },
  {
    id: 'pastell',
    title: 'Pastell & Soft',
    blurb: 'Sanfte, gedämpfte, sonnengebleichte Töne.',
    palettes: [
      { name: 'Pastellblau', model: 'monochrom', colors: ['#6E7AA0', '#A9B3D6', '#E6E9F5'] },
      { name: 'Peach', model: 'monochrom', colors: ['#9A6A5A', '#E0A98C', '#F6DDC9'] },
      { name: 'Mint', model: 'monochrom', colors: ['#4A7A6E', '#9AD0BE', '#DDF0E6'] },
      { name: 'Lavendel', model: 'monochrom', colors: ['#5A4E7A', '#A89AC9', '#E4DCF2'] },
      { name: 'Rosé', model: 'monochrom', colors: ['#8A5A6E', '#D6A0B4', '#F2DCE6'] },
      { name: 'Sorbet', model: 'analog', colors: ['#7A8A6E', '#C2C99A', '#EEF0DC'] },
      { name: 'Himmel', model: 'monochrom', colors: ['#5A7A9A', '#A6C2D9', '#E2EEF5'] },
      { name: 'Flieder & Salbei', model: 'split', colors: ['#6E6A8A', '#A9C2A8', '#E6E2D6'] },
    ],
  },
  {
    id: 'bold',
    title: 'Bold & Dark',
    blurb: 'Kontraststark und Dark-Mode-tauglich — Jewel Tones, Neon.',
    palettes: [
      { name: 'Jewel Tones', model: 'split', colors: ['#2A0E3A', '#8E1E6A', '#E0307F'] },
      { name: 'Dark UI', model: 'split', colors: ['#0B0F1A', '#1F6FEB', '#58E0C0'] },
      { name: 'Neon', model: 'analog', colors: ['#0B1020', '#1FB6A6', '#6EE7FF'] },
      { name: 'Primär-Kontrast', model: 'triadisch', colors: ['#161616', '#E03E2F', '#F2C200'] },
      { name: 'Smaragd & Gold', model: 'komplementaer', colors: ['#0E1F1A', '#1F7A5A', '#E0B24E'] },
      { name: 'Magenta Punch', model: 'monochrom', colors: ['#1A0B20', '#B0185A', '#FF5DA2'] },
      { name: 'Cyber', model: 'komplementaer', colors: ['#07111A', '#00B3C4', '#C6FF3D'] },
      { name: 'Royal', model: 'komplementaer', colors: ['#14143A', '#3A3AC9', '#E0A030'] },
    ],
  },
]

/** Farbpsychologie — one representative palette per semantic attribute. */
const semanticGroup: PaletteGroup = {
  id: 'farbpsychologie',
  title: 'Farbpsychologie',
  blurb: 'Nach Bedeutung & Wirkung — Vertrauen, Energie, Luxus, Natur …',
  palettes: ATTRIBUTES.map((a) => {
    const p = semanticTricolors(a)[0]
    return { name: a.label, model: p.model, colors: p.colors }
  }),
}

export const PALETTE_GROUPS: PaletteGroup[] = [...BASE_GROUPS, semanticGroup]

/** Default palette the app starts with (the on-brand ocean blues). */
export const DEFAULT_PALETTE: Palette = {
  name: 'Tiefsee',
  model: 'monochrom',
  colors: ['#173F5F', '#3A7CA5', '#7FB8D4'],
}
