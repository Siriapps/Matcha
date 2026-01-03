import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAuth0 } from '@auth0/auth0-react'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()
  const { loginWithRedirect, user: auth0User, isAuthenticated: auth0IsAuthenticated } = useAuth0()
  
  // Get the intended destination from location state, or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard'
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle Auth0 redirect after login - immediately redirect to intended destination
  useEffect(() => {
    if (auth0IsAuthenticated && auth0User) {
      // Use replace to avoid back button issues
      navigate(from, { replace: true })
    }
  }, [auth0IsAuthenticated, auth0User, navigate, from])

  // Handle email/password login redirect
  useEffect(() => {
    if (isAuthenticated) {
      // Use replace to avoid back button issues
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    setLoading(false)

    if (result.success) {
      // Use replace to avoid back button issues and ensure clean navigation
      navigate(from, { replace: true })
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-[700px]">
          {/* Left Panel - Login Form */}
          <div className="p-8 md:p-12 bg-white flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-forest rounded flex items-center justify-center">
                <span className="material-icons-outlined text-white text-xl">local_cafe</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Matcha</span>
            </div>

            <h2 className="text-3xl font-bold mb-2 text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mb-8">
              Find the right teammates for the right hackathon. Let's get brewing.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={() => loginWithRedirect({ 
                  authorizationParams: {
                    connection: 'google-oauth2',
                    prompt: 'login'
                  },
                  appState: { returnTo: '/dashboard' },
                })}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-forest/10 hover:border-forest transition bg-white text-gray-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => loginWithRedirect({ 
                  authorizationParams: {
                    connection: 'github',
                    prompt: 'login'
                  },
                  appState: { returnTo: '/dashboard' },
                })}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-forest/10 hover:border-forest transition bg-white text-gray-700"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
                Continue with GitHub
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or login with email</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <span className="material-icons-outlined text-lg">mail</span>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hackerman@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest text-gray-900 bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <span className="material-icons-outlined text-lg">lock</span>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest text-gray-900 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <span className="material-icons-outlined text-lg">{showPassword ? 'visibility' : 'visibility_off'}</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300 text-forest focus:ring-forest" />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-forest hover:underline">
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-forest text-white text-center py-3 rounded-lg font-semibold hover:bg-forest-mid transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </form>

            <p className="mt-6 text-center text-gray-600">
              Don't have an account yet?{' '}
              <Link to="/signup" className="text-forest font-semibold hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>

          {/* Right Panel - Forest Green Gradient */}
          <div className="hidden md:flex bg-gradient-to-b from-forest-dark to-forest p-12 flex-col items-center justify-center relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-48 h-48 bg-black/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center max-w-md">
              {/* Icon Stack */}
              <div className="mb-10 flex flex-col items-center">
                <div className="w-36 h-36 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                  <span className="material-icons-outlined text-white text-6xl opacity-90">groups</span>
                </div>
                <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/15 -mt-6 ml-20 shadow-lg">
                  <span className="material-icons-outlined text-white text-4xl opacity-80">code</span>
                </div>
              </div>

              <h3 className="text-3xl font-bold text-white mb-4">
                Find Your Perfect Squad
              </h3>
              <p className="text-white/80 text-lg mb-10">
                Connect with developers, designers, and visionaries. Build projects that matter.
              </p>

              {/* Pagination Dots */}
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                <div className="w-2 h-2 bg-white/40 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
