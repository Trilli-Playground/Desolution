import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    navigate(redirectTo, { replace: true })
  }

  return (
    <main className="auth-page">
      <Link to="/" className="wordmark auth-wordmark">
        dominik<span className="accent-dot">.</span>
      </Link>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <p className="auth-sub">Welcome back.</p>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="btn btn-primary btn-large auth-submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </form>
    </main>
  )
}

export default Login
