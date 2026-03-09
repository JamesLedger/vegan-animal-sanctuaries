import styles from './LoadingState.module.css'

export function LoadingState({ message = 'Loading…' }: { message?: string }) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden />
      <p className={styles.message}>{message}</p>
    </div>
  )
}
