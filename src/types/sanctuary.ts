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
  /** Diet/food policy: vegan (green pin) or vegetarian (blue pin). */
  diet?: 'vegan' | 'vegetarian'
}

export interface MapFilters {
  allowsVisits: boolean | null
  cafe: boolean | null
  holidayAccommodation: boolean | null
  canVolunteer: boolean | null
  vegan: boolean | null
  animalTypes: string[]
}
