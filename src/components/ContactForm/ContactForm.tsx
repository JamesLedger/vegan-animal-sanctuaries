import { useState, FormEvent } from 'react'
import styles from './ContactForm.module.css'

export interface ContactFormData {
  name: string
  email: string
  message: string
}

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void> | void
}

const initial: ContactFormData = { name: '', email: '', message: '' }

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [data, setData] = useState<ContactFormData>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const validate = (): boolean => {
    const next: Partial<Record<keyof ContactFormData, string>> = {}
    if (!data.name.trim()) next.name = 'Name is required'
    if (!data.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      next.email = 'Please enter a valid email'
    }
    if (!data.message.trim()) next.message = 'Message is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setErrors({})
    try {
      if (onSubmit) {
        await onSubmit(data)
      }
      setSubmitted(true)
      setData(initial)
    } catch (err) {
      setErrors({ message: err instanceof Error ? err.message : 'Something went wrong' })
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className={styles.success} role="status">
        <p>Thank you. Your message has been sent.</p>
        <p>We&apos;ll get back to you as soon as we can.</p>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="contact-name">Name *</label>
        <input
          id="contact-name"
          type="text"
          value={data.name}
          onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
          disabled={submitting}
          aria-invalid={!!errors.name}
        />
        {errors.name && <span className={styles.error}>{errors.name}</span>}
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-email">Email *</label>
        <input
          id="contact-email"
          type="email"
          value={data.email}
          onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
          disabled={submitting}
          aria-invalid={!!errors.email}
        />
        {errors.email && <span className={styles.error}>{errors.email}</span>}
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-message">Message *</label>
        <textarea
          id="contact-message"
          rows={5}
          value={data.message}
          onChange={(e) => setData((d) => ({ ...d, message: e.target.value }))}
          disabled={submitting}
          aria-invalid={!!errors.message}
        />
        {errors.message && <span className={styles.error}>{errors.message}</span>}
      </div>
      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
