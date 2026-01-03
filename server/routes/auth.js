const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { userStorage } = require('../utils/userStorage')
const { sendEmail } = require('../utils/emailService')

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, devpostLink } = req.body

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Check if user already exists
    const existingUser = userStorage.getUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      password: hashedPassword,
      name,
      devpostLink: devpostLink || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      emailVerified: false,
    }

    userStorage.saveUser(user)

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    // Send welcome email
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to Matcha!',
        html: `
          <h2>Welcome to Matcha, ${name}!</h2>
          <p>Thank you for joining Matcha - Brewing your perfect hack team.</p>
          <p>You can now start finding teammates for your hackathons!</p>
          <p>Happy hacking! ☕</p>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail registration if email fails
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user
    const user = userStorage.getUserByEmail(email)
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Forgot password - send reset email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    const user = userStorage.getUserByEmail(email)
    if (!user) {
      // Don't reveal if user exists for security
      return res.json({ message: 'If an account exists, a password reset email has been sent' })
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, type: 'password-reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    // Save reset token to user
    userStorage.updateUserProfile(user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: new Date(Date.now() + 3600000).toISOString(), // 1 hour
    })

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`

    try {
      await sendEmail({
        to: email,
        subject: 'Reset Your Matcha Password',
        html: `
          <h2>Reset Your Password</h2>
          <p>Hello ${user.name},</p>
          <p>You requested to reset your password. Click the link below to reset it:</p>
          <p><a href="${resetUrl}" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      })

      res.json({ message: 'Password reset email sent' })
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError)
      res.status(500).json({ error: 'Failed to send reset email' })
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Verify token
    let decoded
    try {
      decoded = jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return res.status(400).json({ error: 'Invalid or expired token' })
    }

    if (decoded.type !== 'password-reset') {
      return res.status(400).json({ error: 'Invalid token' })
    }

    // Find user
    const user = userStorage.getUserById(decoded.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Check if token matches and hasn't expired
    if (user.resetPasswordToken !== token) {
      return res.status(400).json({ error: 'Invalid token' })
    }

    if (new Date(user.resetPasswordExpires) < new Date()) {
      return res.status(400).json({ error: 'Token has expired' })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update user
    userStorage.updateUserProfile(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    })

    res.json({ message: 'Password reset successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Verify token (for protected routes)
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = userStorage.getUserById(decoded.userId)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const { password: _, ...userWithoutPassword } = user

    res.json({ user: userWithoutPassword })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

module.exports = router


