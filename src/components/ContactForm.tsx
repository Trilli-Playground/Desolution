import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'

function ContactForm() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    const trimmedMessage = message.trim()
    if (!trimmedMessage) {
      setError('Looks like the message is empty.')
      return
    }

    setError(null)
    setLoading(true)

    try {
      const { error: insertError } = await supabase
        .from('contact_messages')
        .insert({ email: email.trim(), phone: phone.trim() || null, message: trimmedMessage })

      if (insertError) {
        setError("Something went wrong sending that — mind trying again?")
        return
      }

      setSent(true)
    } catch {
      setError("Something went wrong sending that — mind trying again?")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="contact-card">
        <h3>Thanks — got it.</h3>
        <p>I'll get back to you soon.</p>
      </div>
    )
  }

  return (
    <form className="contact-card" onSubmit={handleSubmit}>
      <label htmlFor="contact-email">Email</label>
      <input
        id="contact-email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <label htmlFor="contact-phone">Phone (optional)</label>
      <input
        id="contact-phone"
        type="tel"
        autoComplete="tel"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
      />

      <label htmlFor="contact-message">Message</label>
      <textarea
        id="contact-message"
        required
        rows={4}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />

      {error && <p className="auth-error">{error}</p>}

      <button type="submit" className="btn btn-primary btn-large auth-submit" disabled={loading}>
        {loading ? 'Sending…' : 'Send'}
      </button>
    </form>
  )
}

export default ContactForm
