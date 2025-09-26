import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function OAuthSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      login(token)
      navigate('/dashboard', { replace: true })
    } else {
      // No token, redirect to login with error
      navigate('/login?error=oauth_failed', { replace: true })
    }
  }, [searchParams, login, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p>Completing Google sign-in...</p>
      </div>
    </div>
  )
}
