const express = require('express')
const router = express.Router()
const { userStorage } = require('../utils/userStorage')
const { authenticateToken } = require('../middleware/auth')

// Get current user profile
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = userStorage.getUserById(req.user.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const { password: _, ...userWithoutPassword } = user
    res.json({ user: userWithoutPassword })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update user profile
router.put('/me', authenticateToken, (req, res) => {
  try {
    const { name, devpostLink, skills, interests, roles, experienceLevel } = req.body
    const user = userStorage.getUserById(req.user.userId)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const updatedUser = userStorage.updateUserProfile(req.user.userId, {
      name,
      devpostLink,
      skills,
      interests,
      roles,
      experienceLevel,
    })

    const { password: _, ...userWithoutPassword } = updatedUser
    res.json({ user: userWithoutPassword })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router


