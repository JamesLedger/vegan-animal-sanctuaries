import type { Sanctuary } from '../types/sanctuary'

const TRUTHY = new Set(['yes', 'true', '1', 'y', 'on'])
const FALSY = new Set(['no', 'false', '0', 'n', 'off', '', 'unsure'])

function parseBoolean(value: unknown): boolean {
  if (value === true || value === 1) return true
  if (value === false || value === 0) return false
  const s = String(value ?? '').trim().toLowerCase()
  if (TRUTHY.has(s)) return true
  if (FALSY.has(s)) return false
  // Handle values like "Yes - regular opening hours", "Yes - allows dogs", "Yes - no pets"
  if (s.startsWith('yes')) return true
  return false
}

/**
 * Parse fields where any non-empty, non-"no", non-"unsure" value means true.
 * Used for "Allows visits?" which has values like "Open days and or bookable tours only",
 * "By private arrangement", "Regular opening hours".
 */
function parsePermissive(value: unknown): boolean {
  if (value === true || value === 1) return true
  if (value === false || value === 0) return false
  const s = String(value ?? '').trim().toLowerCase()
  if (!s || FALSY.has(s)) return false
  return true
}

function parseNumber(value: unknown): number | null {
  if (typeof value === 'number' && !Number.isNaN(value)) return value
  const s = String(value ?? '').trim()
  if (!s) return null
  const n = Number(s)
  return Number.isNaN(n) ? null : n
}

function parseString(value: unknown): string {
  return String(value ?? '').trim()
}

function parseStringArray(value: unknown): string[] {
  const s = parseString(value)
  if (!s) return []
  return s.split(',').map((x) => x.trim()).filter(Boolean)
}

/**
 * Parse "Location" column: "lat, lng" or "lat lng" (e.g. "52.123, -1.456").
 * Returns [lat, lng] or null if invalid.
 */
function parseLocation(value: unknown): [number, number] | null {
  const s = parseString(value)
  if (!s) return null
  const parts = s.split(/[,\s]+/).map((x) => parseNumber(x.trim()))
  if (parts.length >= 2 && parts[0] != null && parts[1] != null) {
    const lat = parts[0]
    const lng = parts[1]
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) return [lat, lng]
  }
  return null
}

export interface RawRow {
  [key: string]: string | undefined
}

export interface ParsedSanctuaryRow extends Omit<Sanctuary, 'latitude' | 'longitude'> {
  latitude: number | null
  longitude: number | null
}

const HEADER_ALIASES: Record<string, string[]> = {
  name: ['sanctuary name', 'name'],
  address: ['address'],
  nearestTown: ['nearest town'],
  county: ['county'],
  postcode: ['postcode'],
  location: ['location'],
  latitude: ['latitude', 'lat'],
  longitude: ['longitude', 'lng', 'long'],
  animalTypes: ['animaltypes', 'animal types'],
  allowsVisits: ['allows visits?', 'allows visits', 'allowsvisits'],
  cafe: ['café', 'cafe'],
  holidayAccommodation: ['holiday accommodation', 'holidayaccommodation'],
  canVolunteer: ['can volunteer', 'canvolunteer'],
  website: ['website'],
  facebook: ['facebook page', 'facebook'],
  notes: ['notes'],
  image: ['image'],
  published: ['published'],
}

const ANIMAL_COLUMNS = [
  'Sheep', 'Goats', 'Cows', 'Pigs', 'Chickens / Turkeys', 'Ducks / Geese',
  'Horses / Ponies', 'Donkeys', 'Dogs', 'Cats', 'Rabbits', 'Other',
]

function norm(h: string): string {
  return h.replace(/\uFEFF/g, '').trim().toLowerCase()
}

function get(row: RawRow, headers: string[], canonicalKey: string): string | undefined {
  const aliases = HEADER_ALIASES[canonicalKey] ?? [canonicalKey]
  for (const alias of aliases) {
    const key = headers.find((h) => norm(h) === alias)
    if (key) {
      const v = row[key]
      if (v !== undefined && String(v).trim() !== '') return row[key]
    }
  }
  return undefined
}

function buildAnimalTypes(row: RawRow, headers: string[]): string[] {
  const types: string[] = []
  for (const col of ANIMAL_COLUMNS) {
    const key = headers.find((h) => norm(h) === col.toLowerCase())
    if (key && parseBoolean(row[key])) types.push(col)
  }
  return types
}

export function parseSanctuaryRow(row: RawRow, headers: string[]): ParsedSanctuaryRow | null {
  const name = parseString(get(row, headers, 'name'))
  if (!name) return null

  const publishedRaw = get(row, headers, 'published')
  if (publishedRaw !== undefined && !parseBoolean(publishedRaw)) return null

  let lat = parseNumber(get(row, headers, 'latitude'))
  let lng = parseNumber(get(row, headers, 'longitude'))
  if (lat == null || lng == null) {
    const loc = parseLocation(get(row, headers, 'location'))
    if (loc) {
      lat = loc[0]
      lng = loc[1]
    }
  }

  const animalTypesFromCols = buildAnimalTypes(row, headers)
  const animalTypes = animalTypesFromCols.length > 0
    ? animalTypesFromCols
    : parseStringArray(get(row, headers, 'animalTypes'))

  const nearestTown = parseString(get(row, headers, 'nearestTown'))
  const county = parseString(get(row, headers, 'county'))
  const addressParts = [nearestTown, county].filter(Boolean)
  const address = addressParts.length ? addressParts.join(', ') : (parseString(get(row, headers, 'address')) || undefined)

  return {
    id: parseString(get(row, headers, 'id')) || name.replace(/\s+/g, '-').slice(0, 50),
    name,
    address,
    postcode: parseString(get(row, headers, 'postcode')) || undefined,
    latitude: lat ?? null,
    longitude: lng ?? null,
    animalTypes,
    allowsVisits: parsePermissive(get(row, headers, 'allowsVisits')),
    cafe: parseBoolean(get(row, headers, 'cafe')),
    holidayAccommodation: parseBoolean(get(row, headers, 'holidayAccommodation')),
    canVolunteer: parseBoolean(get(row, headers, 'canVolunteer')),
    website: parseString(get(row, headers, 'website')) || undefined,
    facebook: parseString(get(row, headers, 'facebook')) || undefined,
    notes: parseString(get(row, headers, 'notes')) || undefined,
    image: parseString(get(row, headers, 'image')) || undefined,
    published: true,
  }
}

export function toSanctuary(row: ParsedSanctuaryRow, lat: number, lng: number): Sanctuary {
  return { ...row, latitude: lat, longitude: lng }
}
