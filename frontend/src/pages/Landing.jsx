import { Link, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

function Landing() {
  const { loginWithRedirect } = useAuth0()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // Don't render landing page if authenticated
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="material-icons-outlined text-forest text-3xl">local_cafe</span>
            <span className="text-xl font-bold tracking-tight text-gray-900">Matcha</span>
          </div>
          <Link className="text-sm font-medium text-gray-500 hover:text-forest transition-colors" to="/login">
            Log in
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
        {/* Left content */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <span className="h-2 w-2 rounded-full bg-forest" />
            Now available for desktop
          </div>

          <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            Brewing your
            <br />
            <span className="text-forest">perfect hack team</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            Don&apos;t let a great idea go to waste. Connect with developers, designers, and visionaries. Build projects
            that matter in a low-fidelity, high-impact environment.
          </p>

          

          
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-forest-mid"
            >
              Get Started <span className="material-icons-outlined text-base">arrow_downward</span>
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              Learn more
            </Link>
          </div>
        </div>

        {/* Right graphic */}
        <div className="relative hidden justify-center lg:flex">
          <div className="relative h-[420px] w-[420px]">
            {/* rings */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-300" />
            <div className="absolute inset-10 rounded-full border border-gray-200" />

            {/* center card */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex h-56 w-56 items-center justify-center rounded-3xl border border-gray-200 bg-white shadow-2xl rotate-[-10deg]">
                <span className="material-icons-outlined text-forest" style={{ fontSize: '84px' }}>
                  local_cafe
                </span>
              </div>
            </div>

            {/* floating pills */}
            <div className="absolute right-16 top-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-lg">
              <span className="material-icons-outlined text-gray-500">code</span>
            </div>
            <div className="absolute bottom-14 left-16 flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-lg">
              <span className="material-icons-outlined text-gray-500">groups</span>
            </div>
            <div className="absolute bottom-14 right-16 flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-lg">
              <span className="material-icons-outlined text-gray-500">edit</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Landing
