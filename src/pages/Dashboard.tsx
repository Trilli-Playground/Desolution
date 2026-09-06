import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const { user } = useAuth()

  return (
    <main className="auth-page">
      <Link to="/" className="wordmark auth-wordmark">
        dominik<span className="accent-dot">.</span>
      </Link>

      <div className="auth-card">
        <h1>You're in</h1>
        <p className="auth-sub">
          Signed in as <strong>{user?.email}</strong>. Only signed-in people can see this page —
          anyone else gets sent to <code>/login</code> instead.
        </p>
        <Link to="/" className="btn btn-ghost auth-submit">
          Back to the site
        </Link>
      </div>
    </main>
  )
}

export default Dashboard
