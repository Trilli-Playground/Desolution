import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    // If email confirmation is turned off in Supabase, signUp already
    // returns an active session — skip the "check your email" step.
    if (data.session) {
      navigate('/dashboard', { replace: true })
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="auth-page">
        <Link to="/" className="wordmark auth-wordmark">
          dominik<span className="accent-dot">.</span>
        </Link>
        <div className="auth-card">
          <h1>Check your email</h1>
          <p className="auth-sub">
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your
            account, then come back and sign in.
          </p>
          <Link to="/login" className="btn btn-primary btn-large auth-submit">
            Go to sign in
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <Link to="/" className="wordmark auth-wordmark">
        dominik<span className="accent-dot">.</span>
      </Link>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create an account</h1>
        <p className="auth-sub">Takes about ten seconds.</p>

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
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="btn btn-primary btn-large auth-submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </main>
  )
}

export default SignUp
