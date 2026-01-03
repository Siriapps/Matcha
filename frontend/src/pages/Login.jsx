import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()
  const [devpostUrl, setDevpostUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Get the intended destination from location state, or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard'

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Validate Devpost URL
      if (!devpostUrl.includes('devpost.com')) {
        setError('Please enter a valid Devpost profile URL')
        setIsLoading(false)
        return
      }

      // Login with Devpost profile
      const result = await login(devpostUrl)

      if (result.success) {
        navigate('/dashboard', { replace: true })
      } else {
        setError(result.error || 'Failed to load profile. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
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

            {/* Simple Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Devpost Profile URL
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <span className="material-icons-outlined text-lg">person</span>
                  </span>
                  <input
                    type="url"
                    value={devpostUrl}
                    onChange={(e) => setDevpostUrl(e.target.value)}
                    placeholder="https://devpost.com/your-username"
                    required
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest text-gray-900 bg-white disabled:bg-gray-100"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Enter your Devpost profile link (e.g., devpost.com/username)
                </p>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-forest text-white text-center py-3 rounded-lg font-semibold hover:bg-forest-mid transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="material-icons-outlined animate-spin text-lg">refresh</span>
                    Loading your profile...
                  </>
                ) : (
                  'Continue with Devpost'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-gray-600">
              Don't have a Devpost account?{' '}
              <a href="https://devpost.com/users/new" target="_blank" rel="noopener noreferrer" className="text-forest font-semibold hover:underline">
                Create one here
              </a>
            </p>

            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-xs text-center">
                ℹ️ We'll scrape your Devpost profile to personalize teammate recommendations
              </p>
            </div>
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