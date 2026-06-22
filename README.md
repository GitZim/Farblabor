# Farblabor

Web-App, um die Farben des Wellen-Logos anzupassen. Das Logo besteht aus drei
verschachtelten Elementen, die drei Farb-Rollen tragen:

| Element | Rolle (60-30-10) |
|---|---|
| Äußerer Ring | **Anker** — dominant (~60 %) |
| Mittlere Spirale | **Verbindung** — sekundär (~30 %) |
| Innerer Kern | **Akzent** — Akzent (~10 %) |

## Funktionen

- **Editor** — jedes Element einzeln einfärben (per Klick aufs Logo oder über die Tabs),
  Live-Vorschau, Hintergrund hell/dunkel/transparent, **SVG-Download**, Hex-/CSS-Export.
  - **Ton-Modifikatoren** ([modifiers.ts](src/color/modifiers.ts)) — wirken auf die gewählte
    Elementfarbe (alles in OKLCH, gamut-sicher), in zwei Gruppen:
    - *Charakter* (absolut, Farbton bleibt): Pastell, Kräftig, Gedämpft, Tief, Blass.
    - *Feinjustierung* (relativ, wiederholbar): Heller, Dunkler, Sättigung +/−, Wärmer, Kühler.
- **Paletten** — 92 kuratierte Tricolor-Paletten in 11 Kategorien (Harmonisch, Modern 2026,
  Ozean & Küste, Natur & Erde, Jahreszeiten, Vintage & Retro, Stimmungen, Branchen & Brand,
  Pastell & Soft, Bold & Dark, Farbpsychologie) mit Kategorie-Filterleiste, per Klick aufs Logo
  übertragbar, Favoriten lokal speicherbar.
- **Generator** — fünf Paletten-Modelle (umschaltbar):
  - **Harmonie** — geometrische Farbkreis-Beziehungen aus Rolle + Basisfarbe (OKLCH, 60-30-10).
  - **Foto-Extraktion** — dominante Farben aus einem Bild per Median-Cut, vollständig
    clientseitig ([imagePalette.ts](src/color/imagePalette.ts)); jede extrahierte Farbe ist
    einzeln anklickbar und einem Element zuweisbar, plus fertige Tricolor-Vorschläge.
  - **Verlauf** — perzeptueller OKLCH-Mittelpunkt zwischen zwei Endfarben.
  - **Kontrast** — Tripel mit garantiert unterscheidbaren Elementen inkl. Kontrast-Badges (WCAG).
  - **Zufall** — *strukturierter* Zufall (nicht drei rohe RGB-Werte): würfelt Farbton +
    Harmonie-Modell + Charakter-Variante, daher immer stimmig; zeigt 14 Paletten pro Wurf. Unter
    „Alle" mischen sich **15 Wildcard-Strategien abseits der Harmonie-Modelle** dazu: Golden-Angle,
    Neutral + Pop, Warm–Kalt, Drift (OKLCH-Random-Walk), Hochkey, Tiefkey, Jewel, Erdig, Clash,
    Sorbet, Gedeckt, Cyber, Vaporwave, Duoton, Metallic. Mit Charakter-Filter (Gedämpft/Kräftig/
    Pastell/Tief — dann harmoniebasiert) und „Anker behalten" (nur Verbindung/Akzent neu würfeln).
  - Verlauf, Kontrast & Zufall in [generators.ts](src/color/generators.ts). Die
    Farbpsychologie-Presets leben als Paletten-Kategorie (siehe oben), nicht im Generator.
- **Theorie** — die sechs Harmonie-Modelle mit Farbkreis-Visualisierung, 60-30-10-Prinzip,
  OKLCH und Trends 2026.

## Entwicklung

```bash
npm install
npm run dev      # Dev-Server auf http://localhost:5173
npm run build    # Production-Build nach dist/
npm run preview  # Build lokal ansehen
```

## Stack

Vite · React 18 · TypeScript · Tailwind CSS · [culori](https://culorijs.org) (OKLCH-Farbmathematik)
· [react-colorful](https://github.com/omgovich/react-colorful) (Hex-Eingabefeld) · Zustand · React Router.

Der Farbpicker ([ColorPicker.tsx](src/components/ColorPicker.tsx)) ist ein Popover mit:
- einem eigenen **OKLCH-Feld** ([OklchField.tsx](src/components/OklchField.tsx)) — Helligkeit (y) ×
  relative Sättigung (x) als Canvas + Hue-Regler. Die x-Achse ist pro Zeile auf das dort erreichbare
  Chroma-Maximum skaliert (OKHSV-artig), d. h. jeder Punkt im Feld ist eine echte, anklickbare
  Farbe in sRGB — keine Gamut-Kurve, keine toten Flächen. Beim Farbton-Wechsel bleibt die relative
  Sättigung erhalten,
- Hex-Eingabe, Pipette (EyeDropper-API), einem in OKLCH gerechneten Heller/Dunkler-Streifen
  sowie Palette- und Zuletzt-Swatches.
- **Harmonie-Vorschlägen**: im Editor sind das Partnerfarben zur aktuellen Auswahl — ein Klick
  öffnet eine kleine Auswahl, ob die Farbe einem *anderen* Element (z. B. Verbindung oder Akzent)
  zugewiesen wird, statt die aktuelle zu überschreiben. Im Generator setzen sie direkt die Basisfarbe.

## Struktur

```
src/
  color/      Farb-Kern: types, harmony (OKLCH), palettes (Presets), exportSvg
  store/      Zustand-Store (Farben, Auswahl, Favoriten, localStorage)
  logo/       LogoMark (Inline-SVG) + Pfaddaten
  components/ ElementSelector, ColorControl, PaletteCard/Grid, LogoPreviewCard, HarmonyWheel
  pages/      Editor, Paletten, Generator, Theorie
```

Das Original-Logo liegt unter `~/Downloads/Logo Final Version.svg` (und `.ai`); die
Pfaddaten sind in `src/logo/logoPaths.ts` eingebettet.
