import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
const Landing = lazy(() => import('./pages/Landing.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))
const OAuthSuccess = lazy(() => import('./pages/OAuthSuccess.jsx'))

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

function Layout({ children }) {
  const { token, logout, theme, toggleTheme } = useAuth()
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100">
        <header className="px-6 py-4 border-b border-gray-200/60 dark:border-gray-800/60 backdrop-blur bg-white/70 dark:bg-gray-900/70 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link to="/" className="font-semibold text-lg hover:opacity-80 transition-opacity">😴 Sleep Pattern Monitor</Link>
            <div className="flex gap-2 items-center">
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              {token ? (
                <>
                  <Link to="/settings" className="px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-colors">Settings</Link>
                  <button onClick={logout} className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">Login</Link>
                  <Link to="/register" className="px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition-colors">Register</Link>
                </>
              )}
            </div>
          </div>
        </header>
        <main className="p-6 max-w-6xl mx-auto">{children}</main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </AuthProvider>
  )
}


