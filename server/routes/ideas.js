const express = require('express')
const router = express.Router()
const { generateIdeas } = require('../utils/geminiService')
const { optionalAuth } = require('../middleware/auth')

// Generate hackathon ideas
// Uses optionalAuth to support both Auth0 users and JWT users
router.post('/generate', optionalAuth, async (req, res) => {
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
