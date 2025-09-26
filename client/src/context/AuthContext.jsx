import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system')

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [theme])

  useEffect(() => {
    if (token) {
      api.setToken(token)
      api.get('/auth/me').then((res) => setUser(res.data.user)).catch(() => {})
    }
  }, [token])

  function login(nextToken) {
    setToken(nextToken)
    localStorage.setItem('token', nextToken)
    api.setToken(nextToken)
  }

  function logout() {
    setToken('')
    setUser(null)
    localStorage.removeItem('token')
    api.setToken('')
  }

  function toggleTheme() {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      return next
    })
  }

  const value = useMemo(() => ({ token, user, login, logout, theme, toggleTheme, setUser }), [token, user, theme])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


