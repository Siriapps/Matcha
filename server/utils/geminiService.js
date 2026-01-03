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
- description: 1–2 sentence summary
- track_alignment: list of tracks this idea fits
- feasibility_score: integer from 1 to 10
- scope_fit: one of ["Small", "Medium", "Large"]
- skill_coverage_percent: integer from 0 to 100
- risks: 1–2 concise risks
- why_good_fit: short explanation (1 sentence)

Rules:
- Scores must be realistic for a 24–48 hour hackathon
- Penalize ideas that require heavy infrastructure or niche expertise
- Favor ideas that align clearly with the given tracks
- Use only the provided skills and roles
- Do not repeat similar ideas
- Do not include implementation details beyond high level concepts

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

    // Validate and add IDs to ideas
    const validatedIdeas = ideas.map((idea, index) => ({
      id: `idea_${Date.now()}_${index}`,
      title: idea.title || `Idea ${index + 1}`,
      description: idea.description || '',
      track_alignment: Array.isArray(idea.track_alignment) ? idea.track_alignment : [idea.track_alignment].filter(Boolean),
      feasibility_score: Math.max(1, Math.min(10, parseInt(idea.feasibility_score) || 5)),
      scope_fit: ['Small', 'Medium', 'Large'].includes(idea.scope_fit) ? idea.scope_fit : 'Medium',
      skill_coverage_percent: Math.max(0, Math.min(100, parseInt(idea.skill_coverage_percent) || 50)),
      risks: Array.isArray(idea.risks) ? idea.risks : [idea.risks].filter(Boolean),
      why_good_fit: idea.why_good_fit || '',
      generatedAt: new Date().toISOString(),
      shortlisted: false,
      likedBy: []
    }))

    return validatedIdeas
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw new Error(`Failed to generate ideas: ${error.message}`)
  }
}

module.exports = { generateIdeas }
