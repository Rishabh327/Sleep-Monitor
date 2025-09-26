import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import { Card, CardHeader, CardContent } from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      login(data.token)
      nav('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader title="Create account" />
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <input className="w-full p-3 border rounded-md bg-white dark:bg-gray-800" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="w-full p-3 border rounded-md bg-white dark:bg-gray-800" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="w-full p-3 border rounded-md bg-white dark:bg-gray-800" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button className="w-full" loading={loading} disabled={loading}>Create Account</Button>
          </form>
          <p className="mt-3 text-sm">Have an account? <Link to="/login" className="text-indigo-600">Login</Link></p>
        </CardContent>
      </Card>
    </div>
  )
}


