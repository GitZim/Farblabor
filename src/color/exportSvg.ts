import type { Colors } from './types'
import { LOGO_PATHS, LOGO_VIEWBOX } from '../logo/logoPaths'

/** Build a standalone SVG document string with the given colors applied. */
export function buildSvg(colors: Colors): string {
  const paths = LOGO_PATHS.map(
    (p) => `  <path fill="${colors[p.role]}" d="${p.d}"/>`,
  ).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_VIEWBOX}">
${paths}
</svg>
`
}

/** Trigger a browser download of the recolored logo as an .svg file. */
export function downloadSvg(colors: Colors, filename = 'logo-farblabor.svg') {
  const blob = new Blob([buildSvg(colors)], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/** CSS custom-property block for the current palette. */
export function toCssVars(colors: Colors): string {
  return `:root {
  --anker: ${colors.anker};
  --verbindung: ${colors.verbindung};
  --akzent: ${colors.akzent};
}`
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
