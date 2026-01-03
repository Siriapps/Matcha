const { GoogleGenerativeAI } = require('@google/generative-ai')

const SYSTEM_PROMPT = `You are an assistant helping generate and evaluate hackathon project ideas.

Your job is to propose realistic, hackathon-feasible project ideas that respect event rules and team skill constraints.

You must provide transparent scoring and concise reasoning.
Do not overscope ideas.
Do not assume unavailable skills or technologies.`

const USER_PROMPT_TEMPLATE = `Generate 4–6 hackathon project ideas using the following context.

Hackathon Context:
- Name: {{hackathon_name}}
- Tracks: {{tracks}}
- Rules: {{rules}}
- Team Size: {{team_size}}

Team Skill Context:
- Skills: {{skills_list}}
- Roles: {{roles_list}}

For each project idea, return the following fields in valid JSON:

- title: short project name
- description: 3-5 sentence summary
- problem_statement: 2–3 sentence explanation of the problem this idea solves
- core_features: REQUIRED array of 3–5 specific, unique features for THIS idea (e.g., ["Real-time chat interface", "User authentication", "File upload system", "Search functionality"])
- tech_stack: REQUIRED array of 3–6 specific technologies/tools for THIS idea (e.g., ["React", "Node.js", "MongoDB", "Socket.io", "AWS S3"])
- track_alignment: list of tracks this idea fits
- feasibility_score: integer from 1 to 10
- scope_fit: one of ["Small", "Medium", "Large"]
- skill_coverage_percent: integer from 0 to 100
- risks: 1–2 concise risks
- why_good_fit: short explanation (1 sentence)

IMPORTANT RULES:
- Each idea MUST have unique core_features and tech_stack - do NOT reuse the same values across ideas
- core_features must be specific to the project idea, not generic
- tech_stack must match the actual technologies needed for this specific idea
- Scores must be realistic for a 24–48 hour hackathon
- Penalize ideas that require heavy infrastructure or niche expertise
- Favor ideas that align clearly with the given tracks
- Use only the provided skills and roles
- Do not repeat similar ideas
- Include implementation details

Return only valid JSON. No markdown. No commentary.`

async function generateIdeas(hackathonContext, skills, roles, teammates = []) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables')
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Build skills list
    const skillsList = Array.isArray(skills) ? skills.join(', ') : skills
    const rolesList = Array.isArray(roles) ? roles.join(', ') : roles
    const tracksList = Array.isArray(hackathonContext.tracks) 
      ? hackathonContext.tracks.join(', ') 
      : hackathonContext.tracks

    // Fill in the prompt template
    const userPrompt = USER_PROMPT_TEMPLATE
      .replace('{{hackathon_name}}', hackathonContext.name || 'Hackathon')
      .replace('{{tracks}}', tracksList)
      .replace('{{rules}}', hackathonContext.rules || 'Standard hackathon rules')
      .replace('{{team_size}}', hackathonContext.teamSize || '2-4')
      .replace('{{skills_list}}', skillsList)
      .replace('{{roles_list}}', rolesList)

    // Combine system prompt and user prompt
    const fullPrompt = `${SYSTEM_PROMPT}\n\n${userPrompt}`

    // Use gemini-2.5-flash (stable version from June 2025)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(fullPrompt)

    const response = await result.response
    const text = response.text()

    // Parse JSON from response
    // Try to extract JSON if wrapped in markdown code blocks
    let jsonText = text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    }

    // Parse the JSON
    let ideas
    try {
      ideas = JSON.parse(jsonText)
    } catch (parseError) {
      // If parsing fails, try to extract JSON array from the text
      const jsonMatch = jsonText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        ideas = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Failed to parse JSON response from Gemini')
      }
    }

    // Ensure it's an array
    if (!Array.isArray(ideas)) {
      ideas = [ideas]
    }
    

    // Validate and add IDs to ideas, then generate coding prompts
    const validatedIdeas = ideas.map((idea, index) => {
      // Ensure core_features is a non-empty array
      let coreFeatures = []
      if (Array.isArray(idea.core_features) && idea.core_features.length > 0) {
        coreFeatures = idea.core_features.filter(Boolean)
      } else if (idea.core_features && typeof idea.core_features === 'string') {
        coreFeatures = [idea.core_features]
      }
      
      // Ensure tech_stack is a non-empty array
      let techStack = []
      if (Array.isArray(idea.tech_stack) && idea.tech_stack.length > 0) {
        techStack = idea.tech_stack.filter(Boolean)
      } else if (idea.tech_stack && typeof idea.tech_stack === 'string') {
        techStack = [idea.tech_stack]
      }
      
      // If still empty, log a warning (but don't fail - let frontend handle fallback)
      if (coreFeatures.length === 0) {
        console.warn(`Idea ${index + 1} (${idea.title || 'Untitled'}) missing core_features`)
      }
      if (techStack.length === 0) {
        console.warn(`Idea ${index + 1} (${idea.title || 'Untitled'}) missing tech_stack`)
      }
      
      return {
        id: `idea_${Date.now()}_${index}`,
        title: idea.title || `Idea ${index + 1}`,
        description: idea.description || '',
        problem_statement: idea.problem_statement || idea.description || '',
        core_features: coreFeatures,
        tech_stack: techStack,
        track_alignment: Array.isArray(idea.track_alignment) ? idea.track_alignment : [idea.track_alignment].filter(Boolean),
        feasibility_score: Math.max(1, Math.min(10, parseInt(idea.feasibility_score) || 5)),
        scope_fit: ['Small', 'Medium', 'Large'].includes(idea.scope_fit) ? idea.scope_fit : 'Medium',
        skill_coverage_percent: Math.max(0, Math.min(100, parseInt(idea.skill_coverage_percent) || 50)),
        risks: Array.isArray(idea.risks) ? idea.risks : [idea.risks].filter(Boolean),
        why_good_fit: idea.why_good_fit || '',
        generatedAt: new Date().toISOString(),
        shortlisted: false,
        likedBy: []
      }
    })

    return validatedIdeas
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw new Error(`Failed to generate ideas: ${error.message}`)
  }
}

module.exports = { generateIdeas }
