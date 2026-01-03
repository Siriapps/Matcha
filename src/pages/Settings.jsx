import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

function Settings() {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
  const token = localStorage.getItem('token')
  const emailPrefix = (user?.email || '').split('@')[0] || ''
  const photoInputRef = useRef(null)
  
  // Initialize state with user data if available
  const [displayName, setDisplayName] = useState(() => user?.name || emailPrefix || '')
  const [email, setEmail] = useState(() => user?.email || '')
  const [selectedRoles, setSelectedRoles] = useState(() => Array.isArray(user?.preferredRoles) ? user.preferredRoles : [])
  const [experience, setExperience] = useState(() => user?.experience || user?.experienceLevel || '')
  const [skills, setSkills] = useState(() => Array.isArray(user?.skills) ? user.skills : [])
  const [skillInput, setSkillInput] = useState('')
  const [interests, setInterests] = useState(() => Array.isArray(user?.interests) ? user.interests : [])
  const [interestInput, setInterestInput] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [loadError, setLoadError] = useState('')

  const roles = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'ml', label: 'Machine Learning' },
    { value: 'design', label: 'Product Design' },
  ]

  // Fetch latest user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoadError('')
      if (token && token !== 'auth0_token') {
        try {
          const response = await fetch(`${API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (response.ok) {
            const data = await response.json()
            const userData = data.user
            // Update all fields from fetched user data
            setDisplayName(userData.name || (userData.email?.split('@')[0] || '') || '')
            setEmail(userData.email || '')
            
            // Handle preferredRoles (check both preferredRoles and roles for compatibility)
            if (Array.isArray(userData.preferredRoles)) {
              setSelectedRoles(userData.preferredRoles)
            } else if (Array.isArray(userData.roles)) {
              setSelectedRoles(userData.roles)
            } else if (userData.preferredRoles) {
              setSelectedRoles([userData.preferredRoles])
            } else if (userData.roles) {
              setSelectedRoles([userData.roles])
            } else {
              setSelectedRoles([])
            }
            
            // Handle experience (check both experience and experienceLevel for compatibility)
            setExperience(userData.experience || userData.experienceLevel || '')
            
            // Handle skills
            if (Array.isArray(userData.skills)) {
              setSkills(userData.skills)
            } else if (userData.skills) {
              setSkills([userData.skills])
            } else {
              setSkills([])
            }
            
            // Handle interests
            if (Array.isArray(userData.interests)) {
              setInterests(userData.interests)
            } else if (userData.interests) {
              setInterests([userData.interests])
            } else {
              setInterests([])
            }
          } else {
            setLoadError('Could not load profile. Please refresh or re-login.')
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error)
          setLoadError('Could not load profile. Please refresh or re-login.')
        }
      } else if (user) {
        // For Auth0 users or if user is already in context, use that data
        setDisplayName(user.name || emailPrefix || '')
        setEmail(user.email || '')
        
        if (Array.isArray(user.preferredRoles)) {
          setSelectedRoles(user.preferredRoles)
        } else if (Array.isArray(user.roles)) {
          setSelectedRoles(user.roles)
        } else if (user.preferredRoles) {
          setSelectedRoles([user.preferredRoles])
        } else if (user.roles) {
          setSelectedRoles([user.roles])
        } else {
          setSelectedRoles([])
        }
        
        setExperience(user.experience || user.experienceLevel || '')
        
        if (Array.isArray(user.skills)) {
          setSkills(user.skills)
        } else if (user.skills) {
          setSkills([user.skills])
        } else {
          setSkills([])
        }
        
        if (Array.isArray(user.interests)) {
          setInterests(user.interests)
        } else if (user.interests) {
          setInterests([user.interests])
        } else {
          setInterests([])
        }
      }
      setInitializing(false)
    }
    
    fetchUserData()
  }, [user, token, API_URL])

  const handlePhotoClick = () => {
    if (photoInputRef.current) {
      photoInputRef.current.click()
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Placeholder: integrate upload to backend/storage when available
      console.info('Selected profile photo:', file.name)
    }
  }

  const toggleRole = (roleValue) => {
    if (selectedRoles.includes(roleValue)) {
      setSelectedRoles(selectedRoles.filter(r => r !== roleValue))
    } else {
      setSelectedRoles([...selectedRoles, roleValue])
    }
  }

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()])
      }
      setSkillInput('')
    }
  }

  const removeSkill = (skill) => {
    setSkills(skills.filter(s => s !== skill))
  }

  const addInterest = (e) => {
    if (e.key === 'Enter' && interestInput.trim()) {
      if (!interests.includes(interestInput.trim())) {
        setInterests([...interests, interestInput.trim()])
      }
      setInterestInput('')
    }
  }

  const removeInterest = (interest) => {
    setInterests(interests.filter(i => i !== interest))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
      setResumeFile(file)
    } else if (file) {
      alert('Please upload a PDF file under 5MB')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setLoadError('')

    const result = await updateProfile({
      name: displayName,
      preferredRoles: selectedRoles,
      experience,
      skills: Array.isArray(skills) ? skills : [],
      interests: Array.isArray(interests) ? interests : [],
      resume: resumeFile ? resumeFile.name : user?.resume || null,
    })

    setLoading(false)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      // Refresh user data after successful update
      if (token && token !== 'auth0_token') {
        try {
          const response = await fetch(`${API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          if (response.ok) {
            const data = await response.json()
            // Update local state with fresh data
            const userData = data.user
            setDisplayName(userData.name || '')
            if (Array.isArray(userData.preferredRoles)) {
              setSelectedRoles(userData.preferredRoles)
            } else if (Array.isArray(userData.roles)) {
              setSelectedRoles(userData.roles)
            }
            setExperience(userData.experience || userData.experienceLevel || '')
            if (Array.isArray(userData.skills)) {
              setSkills(userData.skills)
            }
            if (Array.isArray(userData.interests)) {
              setInterests(userData.interests)
            }
          }
        } catch (error) {
          console.error('Failed to refresh user data:', error)
        }
      }
    } else {
      setLoadError(result.error || 'Failed to save profile. Please try again.')
    }
  }

  return (
    <Layout>
      <div className="flex-1 bg-background-dark">
        <div className="max-w-4xl mx-auto p-6 lg:p-10">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="mb-4 text-forest hover:text-forest-mid transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-text-secondary">
              Update your details to find your perfect team. These details will be visible to potential teammates.
            </p>
          </div>

          {loadError && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-200">
              {loadError}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-forest/20 border border-forest rounded-lg text-forest">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Photo + Name */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-surface-dark border-2 border-forest flex items-center justify-center overflow-hidden">
                  {user?.picture ? (
                    <img src={user.picture} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl text-forest font-bold">
                      {(displayName || emailPrefix || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-text-secondary text-xs uppercase tracking-wide mb-1">Full Name</p>
                <p className="text-2xl font-bold text-white">{displayName || emailPrefix || 'Not set yet'}</p>
                <button
                  type="button"
                  onClick={handlePhotoClick}
                  className="mt-2 inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-surface-dark border border-[#28392e] text-white hover:bg-surface-highlight transition"
                >
                  <span className="material-symbols-outlined text-base">upload</span>
                  Upload Photo
                </button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 bg-surface-dark border border-[#28392e] rounded-lg text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest"
                required
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-surface-dark border border-[#28392e] rounded-lg text-text-secondary cursor-not-allowed"
              />
              <p className="text-text-secondary text-xs mt-1">Email cannot be changed</p>
            </div>

            {/* Preferred Role(s) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-white">
                  Preferred Role
                  <span className="text-text-secondary font-normal ml-1 text-xs">(Select multiple)</span>
                </label>
                <span className="text-xs text-text-secondary">
                  {selectedRoles.length > 0 ? selectedRoles.join(', ') : 'None selected'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => {
                  const isSelected = selectedRoles.includes(role.value)
                  return (
                    <label
                      key={role.value}
                      className="relative cursor-pointer group"
                    >
                      <input
                        className="peer sr-only"
                        name="role"
                        type="checkbox"
                        value={role.value}
                        checked={isSelected}
                        onChange={() => toggleRole(role.value)}
                      />
                      <div className={`px-4 py-3 text-center border rounded text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-forest/20 border-forest text-white'
                          : 'border-[#28392e] bg-surface-dark text-text-secondary hover:bg-surface-highlight hover:border-[#3b5443]'
                      }`}>
                        {role.label}
                      </div>
                    </label>
                  )
                })}
              </div>
            {initializing === false && selectedRoles.length === 0 && (
              <p className="text-xs text-text-secondary mt-2">No preferred role saved yet.</p>
            )}
            </div>

            {/* Experience Level */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-white">Experience Level</label>
                <span className="text-xs text-text-secondary">
                  {experience ? experience : 'None selected'}
                </span>
              </div>
              <div className="space-y-3">
                {['beginner', 'intermediate', 'advanced'].map((level) => {
                  const isSelected = experience === level
                  return (
                    <label
                      key={level}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                        isSelected
                          ? 'border-forest bg-forest/10'
                          : 'border-[#28392e] bg-surface-dark hover:bg-surface-highlight'
                      }`}
                    >
                      <input
                        type="radio"
                        name="experience"
                        value={level}
                        checked={isSelected}
                        onChange={(e) => setExperience(e.target.value)}
                        className="h-4 w-4 text-forest focus:ring-forest bg-transparent border-[#28392e]"
                      />
                      <span className={`ml-3 block text-sm font-medium capitalize ${
                        isSelected ? 'text-white' : 'text-white'
                      }`}>{level}</span>
                      {isSelected && (
                        <span className="ml-auto text-forest">
                          <span className="material-symbols-outlined text-lg">check_circle</span>
                        </span>
                      )}
                    </label>
                  )
                })}
              </div>
            {initializing === false && !experience && (
              <p className="text-xs text-text-secondary mt-2">No experience level saved yet.</p>
            )}
            </div>

            {/* Technical Skills */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Technical Skills</label>
              <div className="min-h-[3rem] p-3 w-full rounded-lg border border-[#28392e] bg-surface-dark flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-forest focus-within:border-forest transition">
                {skills.map((skill, idx) => (
                  <div key={idx} className="inline-flex items-center bg-[#28392e] text-white text-sm font-medium px-3 py-1 rounded-full gap-2">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-text-secondary hover:text-white transition"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={addSkill}
                  placeholder="Type and press Enter..."
                  className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm text-white placeholder-text-secondary min-w-[200px]"
                />
              </div>
              <p className="text-text-secondary text-xs mt-2">Add skills like languages, frameworks, or tools.</p>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Interests</label>
              <div className="min-h-[3rem] p-3 w-full rounded-lg border border-[#28392e] bg-surface-dark flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-forest focus-within:border-forest transition">
                {interests.map((interest, idx) => (
                  <div key={idx} className="inline-flex items-center bg-[#28392e] text-white text-sm font-medium px-3 py-1 rounded-full gap-2">
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="text-text-secondary hover:text-white transition"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyPress={addInterest}
                  placeholder="Add an interest..."
                  className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm text-white placeholder-text-secondary min-w-[200px]"
                />
              </div>
              <p className="text-text-secondary text-xs mt-1">Press enter to add tags</p>
            </div>

            {/* Resume */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Resume</label>
              <label className="block">
                <div className="border-2 border-dashed border-[#28392e] rounded-lg p-8 text-center hover:border-forest transition cursor-pointer bg-surface-dark">
                  <span className="material-symbols-outlined text-5xl text-text-secondary mb-4 block">description</span>
                  <p className="text-white font-medium mb-1">Upload resume (PDF)</p>
                  <p className="text-sm text-text-secondary">Optional. PDF up to 5MB.</p>
                  {resumeFile && (
                    <p className="text-sm text-forest mt-2 font-medium">{resumeFile.name}</p>
                  )}
                  {user?.resume && !resumeFile && (
                    <p className="text-sm text-forest mt-2 font-medium">Current: {user.resume}</p>
                  )}
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-[#28392e] rounded-lg text-white hover:bg-surface-highlight transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-forest text-white rounded-lg hover:bg-forest-mid transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default Settings

