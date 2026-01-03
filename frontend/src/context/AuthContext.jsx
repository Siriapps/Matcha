import { createContext, useContext, useState, useEffect } from 'react'
import { userStorage } from '../utils/userStorage'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = userStorage.getUser()
    if (savedUser) {
      setUser(savedUser)
    }
    setLoading(false)
  }, [])

  const login = async (devpostUrl) => {
    try {
      // Call backend to scrape profile
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api'

      const response = await fetch(`${API_BASE_URL}/scrape-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile_url: devpostUrl }),
      })

      if (!response.ok) {
        const error = await response.json()
        return { success: false, error: error.error || 'Failed to load profile' }
      }

      const result = await response.json()
      const profileData = result.profile

      // Create user from scraped profile
      const newUser = {
        id: profileData.username || `user_${Date.now()}`,
        email: `${profileData.username}@devpost.com`, // Synthetic email
        name: profileData.name || profileData.username,
        picture: profileData.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.username}`,
        emailVerified: true,
        provider: 'devpost',
        title: profileData.tagline || profileData.role || 'Developer',
        devpostProfile: profileData, // Store full profile data
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Save to both the users list and current user
      userStorage.saveUser(newUser)
      localStorage.setItem('matcha_current_user', JSON.stringify(newUser))
      setUser(newUser)
      return { success: true, user: newUser }

    } catch (err) {
      console.error('Login error:', err)
      return { success: false, error: 'Failed to connect to server' }
    }
  }

  const logout = () => {
    userStorage.clearUser()
    setUser(null)
    window.location.href = '/'
  }

  const updateProfile = (profileData) => {
    const updatedUser = { ...user, ...profileData, updatedAt: new Date().toISOString() }
    userStorage.saveUser(updatedUser)
    localStorage.setItem('matcha_current_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    return { success: true, user: updatedUser }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}