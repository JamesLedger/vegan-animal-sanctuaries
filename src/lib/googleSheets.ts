import Papa from 'papaparse'
import type { RawRow } from './sanctuaryParser'
import { parseSanctuaryRow, toSanctuary } from './sanctuaryParser'
import type { Sanctuary } from '../types/sanctuary'

function getSheetUrl(): string {
  const url = import.meta.env.VITE_GOOGLE_SHEET_URL
  return (url && typeof url === 'string' ? url.trim() : '') || ''
}

function toCsvUrl(sheetUrl: string): string {
  const u = sheetUrl.trim()
  if (!u) return u
  const gidMatch = u.match(/[?&#]gid=(\d+)/)
  const gid = gidMatch ? gidMatch[1] : ''
  if (u.includes('/d/e/') && u.includes('/pub')) {
    const base = u.split('?')[0]
    const sep = u.includes('?') ? '&' : '?'
    return `${base}${sep}output=csv${gid ? `&gid=${gid}` : ''}`
  }
  const match = u.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (match) {
    return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv${gid ? `&gid=${gid}` : ''}`
  }
  return u
}

function isValidCoordinates(lat: number, lng: number): boolean {
  return (
    !Number.isNaN(lat) && !Number.isNaN(lng) &&
    lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
  )
}

export async function fetchSanctuariesFromSheet(): Promise<Sanctuary[]> {
  const sheetUrl = getSheetUrl()
  if (!sheetUrl) return getMockSanctuaries()

  const csvUrl = toCsvUrl(sheetUrl)
  const res = await fetch(csvUrl)
  if (!res.ok) throw new Error(`Failed to fetch sheet: ${res.status} ${res.statusText}`)

  let text = await res.text()
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1)

  const parsed = Papa.parse<RawRow>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.replace(/\uFEFF/g, '').trim(),
  })
  const headers = (parsed.meta.fields ?? []).map((h) => (typeof h === 'string' ? h.trim() : String(h)))
  const rows = parsed.data as RawRow[]

  const sanctuaries: Sanctuary[] = []
  for (const row of rows) {
    const parsedRow = parseSanctuaryRow(row, headers)
    if (!parsedRow) continue

    const lat = parsedRow.latitude
    const lng = parsedRow.longitude

    if (lat != null && lng != null && isValidCoordinates(lat, lng)) {
      sanctuaries.push(toSanctuary(parsedRow, lat, lng))
    }
  }
  return sanctuaries
}

function getMockSanctuaries(): Sanctuary[] {
  return [
    {
      id: '1',
      name: 'Example Farm Sanctuary',
      address: '123 Green Lane',
      postcode: 'AB1 2CD',
      latitude: 52.3555,
      longitude: -1.1743,
      animalTypes: ['Cows', 'Sheep', 'Pigs'],
      allowsVisits: true,
      cafe: true,
      holidayAccommodation: true,
      canVolunteer: true,
      website: 'https://example.org',
      facebook: '',
      notes: 'Sample data when no sheet URL is set.',
      image: '',
      published: true,
    },
    {
      id: '2',
      name: 'Haven Animal Rescue',
      address: '45 Meadow Road',
      postcode: 'EF3 4GH',
      latitude: 51.5074,
      longitude: -0.1278,
      animalTypes: ['Dogs', 'Cats', 'Rabbits'],
      allowsVisits: true,
      cafe: false,
      holidayAccommodation: false,
      canVolunteer: true,
      website: 'https://example.org/haven',
      facebook: '',
      notes: '',
      image: '',
      published: true,
    },
  ]
}
