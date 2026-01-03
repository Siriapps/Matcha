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

  const login = (email, password) => {
    // Accept any email/password and create a user
    const newUser = {
      id: `user_${Date.now()}`,
      email: email,
      name: email.split('@')[0] || 'User',
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      emailVerified: true,
      provider: 'email',
      title: 'Full Stack Developer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Save to both the users list and current user
    userStorage.saveUser(newUser)
    localStorage.setItem('matcha_current_user', JSON.stringify(newUser))
    setUser(newUser)
    return { success: true, user: newUser }
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