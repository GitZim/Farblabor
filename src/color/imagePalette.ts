import { hexToOklch } from './harmony'

type RGB = [number, number, number]

const toHex = ([r, g, b]: RGB) =>
  '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')

/** Recursive median-cut quantization: returns 2^depth representative colors. */
function medianCut(pixels: RGB[], depth: number): RGB[] {
  if (pixels.length === 0) return []
  if (depth === 0 || pixels.length === 1) {
    const sum = pixels.reduce(
      (a, p) => [a[0] + p[0], a[1] + p[1], a[2] + p[2]],
      [0, 0, 0],
    )
    const n = pixels.length
    return [[sum[0] / n, sum[1] / n, sum[2] / n]]
  }
  let rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0
  for (const [r, g, b] of pixels) {
    if (r < rMin) rMin = r
    if (r > rMax) rMax = r
    if (g < gMin) gMin = g
    if (g > gMax) gMax = g
    if (b < bMin) bMin = b
    if (b > bMax) bMax = b
  }
  const rR = rMax - rMin, gR = gMax - gMin, bR = bMax - bMin
  const ch = rR >= gR && rR >= bR ? 0 : gR >= bR ? 1 : 2
  pixels.sort((a, b) => a[ch] - b[ch])
  const mid = pixels.length >> 1
  return [
    ...medianCut(pixels.slice(0, mid), depth - 1),
    ...medianCut(pixels.slice(mid), depth - 1),
  ]
}

/**
 * Extract a small palette from an image file via median cut, fully client-side.
 * Returns hex colors sorted dark → light (by OKLCH lightness).
 */
export function extractColorsFromImage(file: File, count = 8): Promise<string[]> {
  const depth = Math.max(1, Math.ceil(Math.log2(count)))
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      try {
        const maxDim = 140
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
        const w = Math.max(1, Math.round(img.width * scale))
        const h = Math.max(1, Math.round(img.height * scale))
        const cvs = document.createElement('canvas')
        cvs.width = w
        cvs.height = h
        const ctx = cvs.getContext('2d')
        if (!ctx) throw new Error('no 2d context')
        ctx.drawImage(img, 0, 0, w, h)
        const data = ctx.getImageData(0, 0, w, h).data
        const pixels: RGB[] = []
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 125) continue // skip transparent
          pixels.push([data[i], data[i + 1], data[i + 2]])
        }
        const colors = medianCut(pixels, depth)
          .map(toHex)
          .sort((a, b) => hexToOklch(a).l - hexToOklch(b).l)
        resolve(colors)
      } catch (e) {
        reject(e)
      } finally {
        URL.revokeObjectURL(url)
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Bild konnte nicht geladen werden'))
    }
    img.src = url
  })
}
