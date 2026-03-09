import { ContactForm } from '../../components/ContactForm/ContactForm'
import type { ContactFormData } from '../../components/ContactForm/ContactForm'
import styles from './ContactPage.module.css'

async function submitContact(_data: ContactFormData): Promise<void> {
  // Placeholder: replace with real API call when backend is ready
  await new Promise((resolve) => setTimeout(resolve, 600))
}

export function ContactPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Contact us</h1>
      <p className={styles.intro}>
        Send us a message and we&apos;ll get back to you as soon as we can.
      </p>
      <ContactForm onSubmit={submitContact} />
    </div>
  )
}
