import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProfileSetupStep1() {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()
  const [fullName, setFullName] = useState('')
  const [selectedRoles, setSelectedRoles] = useState([])
  const [experienceLevel, setExperienceLevel] = useState('')
  
  // Load existing user data if available
  useEffect(() => {
    if (user) {
      setFullName(user.name || '')
      setSelectedRoles(user.preferredRoles || [])
      setExperienceLevel(user.experience || '')
      // interests now captured in Step 2
    }
  }, [user])

  const roles = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'ml', label: 'Machine Learning' },
    { value: 'design', label: 'Product Design' },
  ]

  const toggleRole = (roleValue) => {
    if (selectedRoles.includes(roleValue)) {
      setSelectedRoles(selectedRoles.filter(r => r !== roleValue))
    } else {
      setSelectedRoles([...selectedRoles, roleValue])
    }
  }

  const handleNext = async (e) => {
    e.preventDefault()
    
    // Save step 1 data before moving to step 2
    if (updateProfile) {
      const result = await updateProfile({
        name: fullName || user?.name || '',
        preferredRoles: selectedRoles,
        experience: experienceLevel,
      })

      // Stop if saving failed so data isn't lost
      if (!result?.success) {
        alert(result?.error || 'Failed to save profile. Please try again.')
        return
      }
    }
    
    navigate('/profile/step2')
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-neutral-900 dark:text-neutral-100 min-h-screen flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-xl bg-card-light dark:bg-card-dark rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
        
        <div className="relative z-10 mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="material-icons-outlined text-3xl text-neutral-800 dark:text-neutral-200">local_cafe</span>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Matcha</h1>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Brewing your perfect hack team</p>
        </div>

        <div className="relative z-10 mb-10">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Step 1 of 2</span>
            <span className="text-xs font-medium text-neutral-400 dark:text-neutral-500">50% Complete</span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary dark:bg-neutral-200 h-1.5 rounded-full w-1/2 transition-all duration-500 ease-out"></div>
          </div>
        </div>

        <form className="relative z-10 space-y-8" onSubmit={handleNext}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="name">Full Name</label>
            <input
              className="block w-full px-4 py-3 rounded border border-neutral-300 dark:border-neutral-700 bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 focus:border-neutral-900 dark:focus:border-neutral-100 focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100 outline-none transition-colors sm:text-sm"
              id="name"
              name="name"
              placeholder="e.g. Alex Morgan"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Preferred Role 
              <span className="text-neutral-400 font-normal ml-1 text-xs">(Select multiple)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <label key={role.value} className="relative cursor-pointer group">
                  <input
                    className="peer sr-only"
                    name="role"
                    type="checkbox"
                    value={role.value}
                    checked={selectedRoles.includes(role.value)}
                    onChange={() => toggleRole(role.value)}
                  />
                  <div className="px-4 py-3 text-center border border-neutral-300 dark:border-neutral-700 rounded text-sm font-medium text-neutral-600 dark:text-neutral-400 bg-transparent transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800 peer-checked:bg-neutral-900 peer-checked:text-white peer-checked:border-neutral-900 dark:peer-checked:bg-neutral-100 dark:peer-checked:text-neutral-900 dark:peer-checked:border-neutral-100">
                    {role.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Experience Level</label>
            <div className="space-y-3">
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <label key={level} className="flex items-center p-3 border border-neutral-200 dark:border-neutral-800 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors">
                  <input
                    className="h-4 w-4 text-neutral-900 dark:text-neutral-100 border-neutral-300 focus:ring-neutral-900 dark:focus:ring-neutral-100 bg-transparent"
                    name="experience"
                    type="radio"
                    value={level}
                    checked={experienceLevel === level}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                  />
                  <span className="ml-3 block text-sm font-medium text-neutral-700 dark:text-neutral-300 capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end">
            <button
              className="group relative flex items-center justify-center py-3 px-8 border border-transparent text-sm font-medium rounded text-white bg-primary hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 transition-all shadow-md hover:shadow-lg"
              type="submit"
            >
              Next Step
              <span className="material-icons-outlined ml-2 text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileSetupStep1
