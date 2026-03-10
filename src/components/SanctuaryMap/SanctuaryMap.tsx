import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Sanctuary } from '../../types/sanctuary'
import { SanctuaryPopup } from '../SanctuaryPopup/SanctuaryPopup'
import styles from './SanctuaryMap.module.css'

const UK_CENTER: [number, number] = [54.5, -2.5]
const DEFAULT_ZOOM = 6

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const holidayIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: styles.holidayMarker,
})

const veganIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: styles.veganMarker,
})

const vegetarianIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: styles.vegetarianMarker,
})

function getMarkerIcon(sanctuary: Sanctuary): L.DivIcon | L.Icon {
  if (sanctuary.diet === 'vegan') return veganIcon
  if (sanctuary.diet === 'vegetarian') return vegetarianIcon
  if (sanctuary.holidayAccommodation) return holidayIcon
  return defaultIcon
}

function FitBounds({ sanctuaries }: { sanctuaries: Sanctuary[] }) {
  const map = useMap()
  useEffect(() => {
    if (sanctuaries.length === 0) return
    if (sanctuaries.length === 1) {
      map.setView([sanctuaries[0].latitude, sanctuaries[0].longitude], 12)
      return
    }
    const bounds = L.latLngBounds(
      sanctuaries.map((s) => [s.latitude, s.longitude] as [number, number])
    )
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 })
  }, [map, sanctuaries])
  return null
}

interface SanctuaryMapProps {
  sanctuaries: Sanctuary[]
}

export function SanctuaryMap({ sanctuaries }: SanctuaryMapProps) {
  const hasData = sanctuaries.length > 0

  return (
    <div className={styles.mapWrap}>
      <MapContainer
        center={UK_CENTER}
        zoom={DEFAULT_ZOOM}
        className={styles.map}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hasData && <FitBounds sanctuaries={sanctuaries} />}
        {sanctuaries.map((s) => (
          <Marker
            key={s.id}
            position={[s.latitude, s.longitude]}
            icon={getMarkerIcon(s)}
          >
            <Popup>
              <SanctuaryPopup sanctuary={s} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
