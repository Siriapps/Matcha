const express = require('express')
const router = express.Router()
const { generateIdeas } = require('../utils/geminiService')
const { optionalAuth } = require('../middleware/auth')

// Test endpoint to verify connection
router.get('/test', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Ideas route is working',
    timestamp: new Date().toISOString()
  })
})

// Generate hackathon ideas
// Uses optionalAuth to support both Auth0 users and JWT users
router.post('/generate', optionalAuth, async (req, res) => {
  console.log('POST /api/ideas/generate - Request received')
  console.log('Body:', JSON.stringify(req.body, null, 2))
  console.log('Headers:', req.headers)
  try {
    const { hackathonContext, skills, roles, teammates } = req.body

    // Validate required fields
    if (!hackathonContext || !skills) {
      return res.status(400).json({ 
        error: 'Missing required fields: hackathonContext and skills are required' 
      })
    }

    // Validate hackathon context
    if (!hackathonContext.name || !hackathonContext.tracks) {
      return res.status(400).json({ 
        error: 'Invalid hackathon context: name and tracks are required' 
      })
    }

    // Generate ideas using Gemini
    const ideas = await generateIdeas(
      hackathonContext,
      skills,
      roles || [],
      teammates || []
    )

    res.json({ ideas })
  } catch (error) {
    console.error('Error generating ideas:', error)
    res.status(500).json({ 
      error: error.message || 'Failed to generate ideas. Please try again.' 
    })
  }
})

module.exports = router
