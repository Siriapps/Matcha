const fs = require('fs')
const path = require('path')

const DATA_DIR = path.join(__dirname, '../data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Initialize users file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2))
}

const readUsers = () => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading users file:', error)
    return []
  }
}

const writeUsers = (users) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('Error writing users file:', error)
    throw error
  }
}

exports.userStorage = {
  getAllUsers: () => {
    return readUsers()
  },

  getUserById: (userId) => {
    const users = readUsers()
    return users.find(user => user.id === userId)
  },

  getUserByEmail: (email) => {
    const users = readUsers()
    return users.find(user => user.email === email)
  },

  saveUser: (userData) => {
    const users = readUsers()
    const existingIndex = users.findIndex(u => u.id === userData.id || u.email === userData.email)
    
    const userToSave = {
      ...userData,
      updatedAt: new Date().toISOString(),
    }

    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...userToSave }
    } else {
      userToSave.createdAt = new Date().toISOString()
      users.push(userToSave)
    }

    writeUsers(users)
    return userToSave
  },

  updateUserProfile: (userId, profileData) => {
    const users = readUsers()
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex >= 0) {
      users[userIndex] = {
        ...users[userIndex],
        ...profileData,
        updatedAt: new Date().toISOString(),
      }
      writeUsers(users)
      return users[userIndex]
    }
    return null
  },

  deleteUser: (userId) => {
    const users = readUsers()
    const filtered = users.filter(u => u.id !== userId)
    writeUsers(filtered)
    return true
  },
}


