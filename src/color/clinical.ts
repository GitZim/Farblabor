import type { Palette } from './types'

/**
 * Curated colour combinations from the medical/clinical sector, each with the
 * context it stems from and a short, evidence-aware rationale. These are
 * *design* references (environmental psychology), not therapeutic claims.
 */
export interface ClinicalPalette extends Palette {
  context: string
  rationale: string
}

export const CLINICAL_PALETTES: ClinicalPalette[] = [
  {
    name: 'Psychiatrie · beruhigend',
    model: 'analog',
    colors: ['#2E4A52', '#6E9AA0', '#C7DCDC'],
    context: 'Psychiatrie / Aufnahme',
    rationale:
      'Kühle, niedrig gesättigte Blaugrün-Töne werden als beruhigend wahrgenommen; geringe Sättigung vermeidet Überreizung.',
  },
  {
    name: 'OP · klinisch',
    model: 'monochrom',
    colors: ['#1F4A42', '#4E8C7A', '#BFD8CE'],
    context: 'OP / Eingriffsraum',
    rationale:
      'OP-Grün ist das Komplement zu Blut-Rot: es dämpft rote Nachbilder und erhöht den Gewebekontrast für das Auge.',
  },
  {
    name: 'Pädiatrie · freundlich',
    model: 'komplementaer',
    colors: ['#2E5E6E', '#E89A4E', '#F6E1B5'],
    context: 'Pädiatrie / Kinderstation',
    rationale:
      'Ein warmer, freundlicher Akzent auf ruhigem Grund wirkt einladend, ohne durch hohe Sättigung zu überfordern.',
  },
  {
    name: 'Geriatrie · Orientierung',
    model: 'komplementaer',
    colors: ['#243A52', '#C9772E', '#EAD9B0'],
    context: 'Geriatrie / Demenzpflege',
    rationale:
      'Erhöhter Helligkeitskontrast und ein klar unterscheidbarer warmer Akzent unterstützen Orientierung und Wegeleitung — ohne extreme Kontraste.',
  },
  {
    name: 'Onkologie · Lavendel',
    model: 'analog',
    colors: ['#3A2F55', '#8E7CB0', '#DAD2EC'],
    context: 'Onkologie',
    rationale:
      'Lavendel wird in der Farb-Wegeleitung häufig der Onkologie zugeordnet; ruhige, entsättigte Violett-Töne.',
  },
  {
    name: 'Kardiologie · Blau',
    model: 'monochrom',
    colors: ['#14334F', '#3E7CA8', '#BFD8EC'],
    context: 'Kardiologie',
    rationale:
      'Blau-Kodierung der Kardiologie; Blau wird als beruhigend wahrgenommen (geringere Erregung).',
  },
  {
    name: 'Rehabilitation · Grün',
    model: 'analog',
    colors: ['#1E4633', '#4E9E6A', '#BFD9B8'],
    context: 'Rehabilitation',
    rationale:
      'Grün-Kodierung der Reha; Naturassoziation als positive Ablenkung (Ulrich) wirkt stressmindernd.',
  },
  {
    name: 'Wellness · Natur',
    model: 'analog',
    colors: ['#2F4A3A', '#8FB08A', '#E6E0CC'],
    context: 'Wellness / Reha-Garten',
    rationale:
      'Biophile, naturnahe Töne (Salbei, Sand) als positive Distraktion und Erholungssignal.',
  },
]

/** Department → wayfinding colour (illustrative convention). */
export const WAYFINDING: { dept: string; color: string }[] = [
  { dept: 'Kardiologie', color: '#3E7CA8' },
  { dept: 'Rehabilitation', color: '#4E9E6A' },
  { dept: 'Onkologie', color: '#8E7CB0' },
  { dept: 'Pädiatrie', color: '#E8A24E' },
  { dept: 'Psychiatrie', color: '#5FA0A0' },
  { dept: 'Neurologie', color: '#5E6AB0' },
  { dept: 'Geriatrie', color: '#C9772E' },
  { dept: 'Notaufnahme', color: '#C0453A' },
]
