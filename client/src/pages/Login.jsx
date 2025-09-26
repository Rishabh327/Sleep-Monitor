import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { Card, CardHeader, CardContent } from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Check for OAuth error in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const oauthError = urlParams.get('error')
    if (oauthError === 'oauth_failed') {
      setError('Google sign-in failed. Please try again.')
    }
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/login', { email, password })
      login(data.token)
      nav('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  function googleLogin() {
    const base = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'
    window.location.href = `${base}/api/auth/google`
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader title="Login" />
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <input className="w-full p-3 border rounded-md bg-white dark:bg-gray-800" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="w-full p-3 border rounded-md bg-white dark:bg-gray-800" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button className="w-full" loading={loading} disabled={loading}>Login</Button>
            <Button type="button" variant="subtle" className="w-full" onClick={googleLogin}>Login with Google</Button>
          </form>
          <p className="mt-3 text-sm">No account? <Link to="/register" className="text-indigo-600">Register</Link></p>
        </CardContent>
      </Card>
    </div>
  )
}


