import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProfileSetupStep2() {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()
  const [skills, setSkills] = useState(user?.skills || [])
  const [skillInput, setSkillInput] = useState('')
  const [interests, setInterests] = useState(user?.interests || [])
  const [interestInput, setInterestInput] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  
  // Load existing user data if available
  useEffect(() => {
    if (user?.skills) {
      setSkills(user.skills)
    }
    if (user?.interests) {
      setInterests(user.interests)
    }
  }, [user])

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault()
      setSkills([...skills, skillInput.trim()])
      setSkillInput('')
    }
  }

  const removeSkill = (skill) => {
    setSkills(skills.filter(s => s !== skill))
  }

  const addInterest = (e) => {
    if (e.key === 'Enter' && interestInput.trim()) {
      e.preventDefault()
      setInterests([...interests, interestInput.trim()])
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

  const handleSave = async () => {
    // Save step 1 + step 2 data together before going to dashboard
    if (updateProfile) {
      const result = await updateProfile({
        // Bring forward step 1 fields to retry save if they failed earlier
        name: user?.name || '',
        preferredRoles: user?.preferredRoles || user?.roles || [],
        experience: user?.experience || user?.experienceLevel || '',
        // Step 2 fields
        skills,
        interests,
        resume: resumeFile ? resumeFile.name : null,
      })
      
      if (result?.success) {
        navigate('/dashboard', { replace: true })
      } else {
        alert(result?.error || 'Failed to save profile. Please try again.')
      }
    } else {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-card-light dark:bg-card-dark rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Left Section - Info */}
          <div className="bg-gray-50 dark:bg-neutral-900 p-12 flex flex-col justify-center items-center text-center">
            <div className="w-24 h-24 bg-gray-200 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
              <span className="material-icons-outlined text-5xl text-gray-400 dark:text-neutral-600">upload_file</span>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">Showcase Your Expertise</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Adding your skills and resume helps us brew the perfect team match for you.
            </p>
            <div className="mt-8 w-16 h-16 bg-gray-200 dark:bg-neutral-800 rounded-full opacity-50"></div>
          </div>

          {/* Right Section - Form */}
          <div className="p-8 md:p-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Profile Setup</h2>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Step 2 of 2</span>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Skills
                </label>
                <div className="min-h-[3rem] p-2 w-full rounded border border-neutral-300 dark:border-neutral-700 bg-transparent flex flex-wrap gap-2 focus-within:ring-1 focus-within:ring-neutral-900 dark:focus-within:ring-neutral-100 focus-within:border-neutral-900 dark:focus-within:border-neutral-100 transition-colors">
                  {skills.map((skill, idx) => (
                    <div key={idx} className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-medium px-2.5 py-1 rounded">
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 focus:outline-none"
                        type="button"
                      >
                        <span className="material-icons-outlined text-[14px]">close</span>
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={addSkill}
                    placeholder="Type and press Enter to add skills..."
                    className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 min-w-[200px]"
                  />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                  Add at least 3 skills to help us match you better.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Interests
                </label>
                <div className="min-h-[3rem] p-2 w-full rounded border border-neutral-300 dark:border-neutral-700 bg-transparent flex flex-wrap gap-2 focus-within:ring-1 focus-within:ring-neutral-900 dark:focus-within:ring-neutral-100 focus-within:border-neutral-900 dark:focus-within:border-neutral-100 transition-colors">
                  {interests.map((interest, idx) => (
                    <div key={idx} className="inline-flex items-center bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-medium px-2.5 py-1 rounded">
                      {interest}
                      <button
                        className="ml-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 focus:outline-none"
                        type="button"
                        onClick={() => removeInterest(interest)}
                      >
                        <span className="material-icons-outlined text-[14px]">close</span>
                      </button>
                    </div>
                  ))}
                  <input
                    className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 min-w-[200px]"
                    placeholder="Add an interest..."
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyPress={addInterest}
                  />
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-500">Press enter to add tags</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Resume
                </label>
                <label className="block">
                  <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-12 text-center hover:border-primary dark:hover:border-primary transition cursor-pointer">
                    <span className="material-icons-outlined text-5xl text-neutral-400 dark:text-neutral-600 mb-4 block">description</span>
                    <p className="text-neutral-700 dark:text-neutral-300 font-medium mb-1">Upload resume (PDF)</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-500">Optional. PDF up to 5MB.</p>
                    {resumeFile && (
                      <p className="text-sm text-primary mt-2 font-medium">{resumeFile.name}</p>
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

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => navigate('/profile/step1')}
                  className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-primary dark:bg-neutral-100 dark:text-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSetupStep2
