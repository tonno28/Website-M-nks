#!/usr/bin/env node
/**
 * Findet Anwaltskanzleien im Raum Düren / Köln / Aachen, die bei Google gut
 * bewertet sind, aber KEINE Website hinterlegt haben.
 *
 * Nutzt die offizielle Google Places API (New) statt Scraping — das Feld
 * `websiteUri` fehlt genau dann, wenn in Google Maps kein Website-Button steht.
 * Das ist exakt das Signal, das wir suchen, und im Gegensatz zum Abgreifen der
 * Maps-Oberfläche von Google auch so vorgesehen.
 *
 * Voraussetzung: Places API (New) im Google-Cloud-Projekt aktiviert.
 *
 *   GOOGLE_MAPS_API_KEY=... node akquise/places-scan.mjs
 *
 * Ergebnis: akquise/ergebnis-ohne-website.csv + .md
 *
 * Hinweis: In der Remote-Umgebung von Claude Code läuft das Skript nicht —
 * dort sind ausgehende Verbindungen zu Drittanbieter-Hosts blockiert.
 * Lokal ausführen.
 */

import { writeFileSync } from 'node:fs'

const API_KEY = process.env.GOOGLE_MAPS_API_KEY
if (!API_KEY) {
  console.error('Fehlt: GOOGLE_MAPS_API_KEY')
  process.exit(1)
}

// Suchmittelpunkte mit Radius in Metern
const ORTE = [
  { name: 'Düren',        lat: 50.8028, lng: 6.4828, radius: 12000 },
  { name: 'Jülich',       lat: 50.9210, lng: 6.3612, radius: 10000 },
  { name: 'Eschweiler',   lat: 50.8180, lng: 6.2710, radius: 10000 },
  { name: 'Stolberg',     lat: 50.7730, lng: 6.2280, radius: 10000 },
  { name: 'Aachen',       lat: 50.7753, lng: 6.0839, radius: 12000 },
  { name: 'Herzogenrath', lat: 50.8690, lng: 6.0950, radius: 8000 },
  { name: 'Kerpen',       lat: 50.8700, lng: 6.6970, radius: 10000 },
  { name: 'Bergheim',     lat: 50.9550, lng: 6.6400, radius: 10000 },
  { name: 'Frechen',      lat: 50.9100, lng: 6.8130, radius: 8000 },
  { name: 'Köln',         lat: 50.9375, lng: 6.9603, radius: 15000 },
]

const SUCHBEGRIFFE = [
  'Rechtsanwalt',
  'Anwaltskanzlei',
  'Rechtsanwaltskanzlei',
  'Fachanwalt',
  'Anwalt Familienrecht',
  'Anwalt Arbeitsrecht',
  'Anwalt Strafrecht',
  'Anwalt Verkehrsrecht',
  'Anwalt Erbrecht',
  'Anwalt Mietrecht',
]

// Filter: ab wann gilt eine Kanzlei als "gut bewertet"
const MIN_RATING = 4.3
const MIN_BEWERTUNGEN = 5

const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.nationalPhoneNumber',
  'places.websiteUri',
  'places.rating',
  'places.userRatingCount',
  'places.googleMapsUri',
  'nextPageToken',
].join(',')

const schlafen = (ms) => new Promise((r) => setTimeout(r, ms))

async function sucheSeite(textQuery, ort, pageToken) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery: `${textQuery} ${ort.name}`,
      languageCode: 'de',
      regionCode: 'DE',
      pageSize: 20,
      ...(pageToken ? { pageToken } : {}),
      locationBias: {
        circle: {
          center: { latitude: ort.lat, longitude: ort.lng },
          radius: ort.radius,
        },
      },
    }),
  })

  if (!res.ok) {
    throw new Error(`Places API ${res.status}: ${await res.text()}`)
  }
  return res.json()
}

async function suche(textQuery, ort) {
  const treffer = []
  let pageToken
  // max 3 Seiten = 60 Treffer pro Begriff/Ort
  for (let seite = 0; seite < 3; seite++) {
    const daten = await sucheSeite(textQuery, ort, pageToken)
    treffer.push(...(daten.places ?? []))
    pageToken = daten.nextPageToken
    if (!pageToken) break
    await schlafen(300)
  }
  return treffer
}

const alle = new Map()

for (const ort of ORTE) {
  for (const begriff of SUCHBEGRIFFE) {
    try {
      const treffer = await suche(begriff, ort)
      for (const p of treffer) {
        if (!alle.has(p.id)) alle.set(p.id, { ...p, _ort: ort.name })
      }
      console.log(`${ort.name} · ${begriff}: ${treffer.length} Treffer (gesamt ${alle.size})`)
    } catch (err) {
      console.error(`  Fehler bei ${ort.name} / ${begriff}: ${err.message}`)
    }
    await schlafen(200)
  }
}

const ohneWebsite = [...alle.values()]
  .filter((p) => !p.websiteUri)
  .filter((p) => (p.rating ?? 0) >= MIN_RATING)
  .filter((p) => (p.userRatingCount ?? 0) >= MIN_BEWERTUNGEN)
  .sort(
    (a, b) =>
      b.rating - a.rating || b.userRatingCount - a.userRatingCount,
  )

console.log(
  `\n${alle.size} Kanzleien gesamt · ${ohneWebsite.length} davon gut bewertet und ohne Website\n`,
)

const zeilen = ohneWebsite.map((p) => ({
  name: p.displayName?.text ?? '',
  adresse: p.formattedAddress ?? '',
  telefon: p.nationalPhoneNumber ?? '',
  bewertung: p.rating ?? '',
  anzahl: p.userRatingCount ?? '',
  ort: p._ort,
  maps: p.googleMapsUri ?? '',
}))

const csvFeld = (v) => `"${String(v).replace(/"/g, '""')}"`
const csv = [
  'Name,Adresse,Telefon,Bewertung,Anzahl Bewertungen,Suchraum,Google Maps',
  ...zeilen.map((z) =>
    [z.name, z.adresse, z.telefon, z.bewertung, z.anzahl, z.ort, z.maps]
      .map(csvFeld)
      .join(','),
  ),
].join('\n')

const md = [
  '# Kanzleien ohne Website — Anrufliste',
  '',
  `Erzeugt am ${new Date().toISOString().slice(0, 10)} · ` +
    `${alle.size} Kanzleien geprüft · ${ohneWebsite.length} ohne Website ` +
    `(ab ${MIN_RATING} Sternen, ab ${MIN_BEWERTUNGEN} Bewertungen)`,
  '',
  '| # | Kanzlei | Adresse | Telefon | Bewertung | Maps |',
  '|---|---|---|---|---|---|',
  ...zeilen.map(
    (z, i) =>
      `| ${i + 1} | ${z.name} | ${z.adresse} | ${z.telefon} | ` +
      `${z.bewertung} (${z.anzahl}) | [Link](${z.maps}) |`,
  ),
].join('\n')

writeFileSync('akquise/ergebnis-ohne-website.csv', csv)
writeFileSync('akquise/ergebnis-ohne-website.md', md)

console.log(zeilen.slice(0, 10))
console.log('\nGeschrieben: akquise/ergebnis-ohne-website.csv und .md')
