import type { Sanctuary } from '../../types/sanctuary'
import styles from './SanctuaryPopup.module.css'

interface SanctuaryPopupProps {
  sanctuary: Sanctuary
}

function Badge({ label }: { label: string }) {
  return <span className={styles.badge}>{label}</span>
}

function link(href: string | undefined, label: string): React.ReactNode {
  if (!href || !href.startsWith('http')) return null
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  )
}

export function SanctuaryPopup({ sanctuary }: SanctuaryPopupProps) {
  const s = sanctuary
  return (
    <div className={styles.popup}>
      <h3 className={styles.name}>{s.name}</h3>

      {s.animalTypes.length > 0 && (
        <div className={styles.section}>
          <strong>Animals:</strong>{' '}
          {s.animalTypes.map((t) => (
            <Badge key={t} label={t} />
          ))}
        </div>
      )}

      <div className={styles.features}>
        {s.allowsVisits && <Badge label="Allows visits" />}
        {s.cafe && <Badge label="Cafe" />}
        {s.holidayAccommodation && <Badge label="Holiday accommodation" />}
        {s.canVolunteer && <Badge label="Can volunteer" />}
      </div>

      <div className={styles.links}>
        {link(s.website, 'Website')}
        {s.website && s.facebook && ' · '}
        {link(s.facebook, 'Facebook')}
      </div>
    </div>
  )
}
