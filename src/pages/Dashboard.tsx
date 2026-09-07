import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

interface ContactMessage {
  id: string
  email: string
  phone: string | null
  message: string
  created_at: string
}

function Dashboard() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('contact_messages')
          .select('id, email, phone, message, created_at')
          .order('created_at', { ascending: false })

        if (fetchError) {
          setError(fetchError.message)
          return
        }
        setMessages(data ?? [])
      } catch {
        setError('Could not load messages — mind refreshing?')
      } finally {
        setLoading(false)
      }
    }

    loadMessages()
  }, [])

  return (
    <main className="auth-page dashboard-page">
      <Link to="/" className="wordmark auth-wordmark">
        dominik<span className="accent-dot">.</span>
      </Link>

      <div className="auth-card dashboard-card">
        <h1>You're in</h1>
        <p className="auth-sub">
          Signed in as <strong>{user?.email}</strong>. Only signed-in people can see this page —
          anyone else gets sent to <code>/login</code> instead.
        </p>
        <Link to="/" className="btn btn-ghost auth-submit">
          Back to the site
        </Link>
      </div>

      <div className="auth-card dashboard-card messages-card">
        <h2>Contact messages</h2>
        {loading && <p className="auth-sub">Loading…</p>}
        {error && <p className="auth-error">{error}</p>}
        {!loading && !error && messages.length === 0 && (
          <p className="auth-sub">Nothing yet — messages sent through the contact form show up here.</p>
        )}
        <ul className="message-list">
          {messages.map((msg) => (
            <li key={msg.id} className="message-item">
              <div className="message-meta">
                <span>{msg.email}</span>
                {msg.phone && <span>{msg.phone}</span>}
                <span>{new Date(msg.created_at).toLocaleString()}</span>
              </div>
              <p>{msg.message}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

export default Dashboard
