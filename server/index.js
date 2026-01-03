const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })
const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📡 API available at http://localhost:${PORT}/api`)
  console.log(`💡 Make sure VITE_API_URL=http://localhost:${PORT}/api in your .env file`)
})

