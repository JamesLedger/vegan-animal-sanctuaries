import type { Sanctuary, MapFilters } from '../types/sanctuary'

export function filterSanctuaries(sanctuaries: Sanctuary[], filters: MapFilters): Sanctuary[] {
  return sanctuaries.filter((s) => {
    if (filters.allowsVisits === true && !s.allowsVisits) return false
    if (filters.cafe === true && !s.cafe) return false
    if (filters.holidayAccommodation === true && !s.holidayAccommodation) return false
    if (filters.canVolunteer === true && !s.canVolunteer) return false

    if (filters.animalTypes.length > 0) {
      const sanctuaryTypes = s.animalTypes.map((t) => t.trim().toLowerCase())
      const hasMatch = filters.animalTypes.some((selected) =>
        sanctuaryTypes.includes(selected.trim().toLowerCase())
      )
      if (!hasMatch) return false
    }

    return true
  })
}

export function getUniqueAnimalTypes(sanctuaries: Sanctuary[]): string[] {
  const set = new Set<string>()
  for (const s of sanctuaries) {
    for (const t of s.animalTypes) {
      const trimmed = t.trim()
      if (trimmed) set.add(trimmed)
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}

export const DEFAULT_FILTERS: MapFilters = {
  allowsVisits: null,
  cafe: null,
  holidayAccommodation: null,
  canVolunteer: null,
  animalTypes: [],
}
