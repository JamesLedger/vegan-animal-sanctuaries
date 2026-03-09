export interface Sanctuary {
  id: string
  name: string
  address?: string
  postcode?: string
  latitude: number
  longitude: number
  animalTypes: string[]
  allowsVisits: boolean
  cafe: boolean
  holidayAccommodation: boolean
  canVolunteer: boolean
  website?: string
  facebook?: string
  notes?: string
  image?: string
  published: boolean
}

export interface MapFilters {
  allowsVisits: boolean | null
  cafe: boolean | null
  holidayAccommodation: boolean | null
  canVolunteer: boolean | null
  animalTypes: string[]
}
