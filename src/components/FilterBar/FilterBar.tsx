import type { MapFilters } from '../../types/sanctuary'
import styles from './FilterBar.module.css'

interface FilterBarProps {
  filters: MapFilters
  animalTypeOptions: string[]
  onFiltersChange: (f: MapFilters) => void
  onClear: () => void
}

export function FilterBar({
  filters,
  animalTypeOptions,
  onFiltersChange,
  onClear,
}: FilterBarProps) {
  const setBool = (key: keyof MapFilters, value: boolean | null) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const setAnimalTypes = (animalTypes: string[]) => {
    onFiltersChange({ ...filters, animalTypes })
  }

  const toggleAnimalType = (type: string) => {
    const current = filters.animalTypes
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type]
    setAnimalTypes(next)
  }

  const hasActiveFilters =
    // filters.allowsVisits === true ||
    // filters.cafe === true ||
    filters.holidayAccommodation === true ||
    filters.canVolunteer === true ||
    filters.animalTypes.length > 0

  return (
    <div className={styles.bar}>
      <div className={styles.checkboxes}>
        {/* <label className={styles.label}>
          <input
            type="checkbox"
            checked={filters.allowsVisits === true}
            onChange={(e) => setBool('allowsVisits', e.target.checked ? true : null)}
          />
          <span>Allows visits</span>
        </label> */}
        {/* <label className={styles.label}>
          <input
            type="checkbox"
            checked={filters.cafe === true}
            onChange={(e) => setBool('cafe', e.target.checked ? true : null)}
          />
          <span>Has cafe</span>
        </label> */}
        <label className={styles.label}>
          <input
            type="checkbox"
            checked={filters.holidayAccommodation === true}
            onChange={(e) =>
              setBool('holidayAccommodation', e.target.checked ? true : null)
            }
          />
          <span>Holiday accommodation</span>
        </label>
        <label className={styles.label}>
          <input
            type="checkbox"
            checked={filters.canVolunteer === true}
            onChange={(e) => setBool('canVolunteer', e.target.checked ? true : null)}
          />
          <span>Can volunteer</span>
        </label>
      </div>

      {animalTypeOptions.length > 0 && (
        <div className={styles.animalTypes}>
          <span className={styles.animalLabel}>Animal type:</span>
          <select
            className={styles.select}
            value=""
            onChange={(e) => {
              const v = e.target.value
              if (v && !filters.animalTypes.includes(v)) {
                setAnimalTypes([...filters.animalTypes, v])
              }
              e.target.value = ''
            }}
          >
            <option value="">Select type…</option>
            {animalTypeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {filters.animalTypes.length > 0 && (
            <div className={styles.chips}>
              {filters.animalTypes.map((t) => (
                <span key={t} className={styles.chip}>
                  {t}{' '}
                  <button
                    type="button"
                    className={styles.chipRemove}
                    onClick={() => toggleAnimalType(t)}
                    aria-label={`Remove ${t}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {hasActiveFilters && (
        <button type="button" className={styles.clear} onClick={onClear}>
          Clear filters
        </button>
      )}
    </div>
  )
}
