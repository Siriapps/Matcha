import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function Brewing() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(65)
  const [currentStep, setCurrentStep] = useState(2)

  const steps = [
    { id: 0, text: 'Initializing hackathon protocols...', completed: progress >= 30 },
    { id: 1, text: 'Parsing user skillsets [Python, React, UI/UX]...', completed: progress >= 60 },
    { id: 2, text: 'Analyzing compatibility metrics...', completed: progress >= 90, active: progress >= 60 && progress < 90 },
    { id: 3, text: 'Finalizing tea blend...', completed: progress >= 100 },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => navigate('/results'), 1000)
          return 100
        }
        return prev + 1
      })
    }, 200)

    return () => clearInterval(interval)
  }, [navigate])

  return (
    <Layout>
      <div className="relative overflow-hidden h-full bg-gradient-to-br from-background-dark via-[#0d1a12] to-background-dark">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#13ec5b 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        {/* Header */}
        <header className="relative z-10 flex justify-between items-center p-6 border-b border-[#28392e] bg-[#111813]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-sm">upload</span>
            </div>
            <span className="text-white font-semibold">MATCHA_BUILD_V1.0</span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <span className="material-symbols-outlined">logout</span>
            Log out
          </button>
        </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6">
        {/* Teacup Animation */}
        <div className="relative mb-8">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 border-2 border-matcha-green rounded-full animate-ping opacity-20"></div>
            <div className="absolute inset-4 border-2 border-matcha-green rounded-full animate-ping opacity-30" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute inset-8 border-2 border-matcha-green rounded-full animate-ping opacity-40" style={{ animationDelay: '1s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl">☕</div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-2">Brewing your perfect team...</h1>
        <p className="text-gray-400 mb-12">SYSTEM PROCESSING</p>

        {/* Progress Card */}
        <div className="bg-surface-dark border border-[#28392e] rounded-xl p-8 w-full max-w-2xl shadow-lg">
          <div className="mb-6">
            <p className="text-primary font-semibold mb-4">STATUS: ACTIVE</p>
            <div className="mb-2">
              <p className="text-white mb-2">Whisking data parameters</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-[#102216] rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-white font-semibold">{progress}%</span>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-3 text-white">
                {step.completed ? (
                  <span className="text-primary text-xl">✓</span>
                ) : step.active ? (
                  <span className="text-primary text-xl animate-spin">
                    <span className="material-symbols-outlined">sync</span>
                  </span>
                ) : (
                  <span className="text-[#9db9a6] text-xl">○</span>
                )}
                <span className={step.completed ? 'text-[#9db9a6]' : step.active ? 'text-white' : 'text-[#9db9a6]'}>
                  {step.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[#9db9a6] text-sm mb-4">
            Estimated time remaining: ~{Math.max(0, Math.ceil((100 - progress) * 0.2))} seconds. Usually depends on the size of the hackathon event.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-[#9db9a6] hover:text-white transition mx-auto"
          >
            <span className="material-symbols-outlined">close</span>
            Cancel Brewing
          </button>
        </div>
      </div>
      </div>
    </Layout>
  )
}

export default Brewing

