import { useState, useEffect, useCallback } from 'react'
import { fetchSanctuariesFromSheet } from '../../lib/googleSheets'
import { filterSanctuaries, getUniqueAnimalTypes, DEFAULT_FILTERS } from '../../lib/filters'
import type { Sanctuary, MapFilters } from '../../types/sanctuary'
import { FilterBar } from '../../components/FilterBar/FilterBar'
import { SanctuaryMap } from '../../components/SanctuaryMap/SanctuaryMap'
import { LoadingState } from '../../components/LoadingState/LoadingState'
import { ErrorState } from '../../components/ErrorState/ErrorState'
import styles from './MapPage.module.css'

export function MapPage() {
  const [sanctuaries, setSanctuaries] = useState<Sanctuary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<MapFilters>(DEFAULT_FILTERS)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchSanctuariesFromSheet()
      setSanctuaries(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load sanctuaries')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filtered = filterSanctuaries(sanctuaries, filters)
  const animalTypeOptions = getUniqueAnimalTypes(sanctuaries)

  const clearFilters = () => setFilters(DEFAULT_FILTERS)

  if (loading) {
    return (
      <div className={styles.page}>
        <LoadingState message="Loading sanctuary data…" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <ErrorState message={error} onRetry={loadData} />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <FilterBar
        filters={filters}
        animalTypeOptions={animalTypeOptions}
        onFiltersChange={setFilters}
        onClear={clearFilters}
      />
      <div className={styles.mapContainer}>
        <div className={styles.mapCount} role="status" aria-live="polite">
          {sanctuaries.length === 0
            ? 'No sanctuaries'
            : filtered.length === sanctuaries.length
              ? `${filtered.length} ${filtered.length === 1 ? 'sanctuary' : 'sanctuaries'}`
              : `${filtered.length} of ${sanctuaries.length} sanctuaries`}
        </div>
        <SanctuaryMap sanctuaries={filtered} />
        {filtered.length === 0 && (
          <div className={styles.empty} role="status">
            <p>No sanctuaries match the current filters.</p>
            <p>Try clearing some filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
