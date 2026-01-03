# React Frontend + Flask Backend Integration Guide

## Overview

This document explains how to integrate the React frontend with the Python Flask backend for AI-powered teammate matching.

## Architecture

```
┌─────────────────┐          ┌──────────────────┐          ┌────────────────┐
│  React Frontend │  HTTP    │  Flask Backend   │          │  MongoDB Atlas │
│  (Port 5173)    │─────────▶│  (Port 5000)     │─────────▶│  (Cloud)       │
│                 │          │                  │          │                │
│  - Dashboard    │          │  - /api/scrape   │          │  - Participants│
│  - Brewing      │◀─────────│  - /api/find     │◀─────────│  - Hackathons  │
│  - BrewResults  │  JSON    │  - /api/stats    │  Query   │                │
└─────────────────┘          └──────────────────┘          └────────────────┘
                                      │
                                      ▼
                             ┌──────────────────┐
                             │   Gemini AI      │
                             │   (Google)       │
                             └──────────────────┘
```

## Setup Instructions

### 1. Install Python Dependencies

```bash
pip install flask flask-cors selenium beautifulsoup4 pymongo dnspython google-generativeai python-dotenv
```

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create `.env` file:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start Development Servers

**Terminal 1 - Flask Backend:**
```bash
python app.py
# Runs on http://127.0.0.1:5000
```

**Terminal 2 - React Frontend:**
```bash
npm run dev
# Runs on http://localhost:5173
```

## API Endpoints

### Backend Flask API (Port 5000)

#### 1. Scrape Hackathon
```http
POST /api/scrape
Content-Type: application/json

{
  "url": "https://hackutd-2025.devpost.com/"
}

Response:
{
  "success": true,
  "hackathon": "hackutd-2025",
  "participants_count": 1154,
  "message": "Successfully scraped and stored 1154 participants!"
}
```

#### 2. Find Teammates
```http
POST /api/find-teammates
Content-Type: application/json

{
  "hackathon": "hackutd-2025",
  "user_id": "2457597"  // Optional: specific participant ID
}

Response:
{
  "success": true,
  "current_user": {
    "name": "John Doe",
    "role": "Full-stack developer",
    "skills": ["python", "react", "nodejs"],
    "interests": ["Machine Learning/AI"]
  },
  "matches": [
    {
      "participant_id": "1234567",
      "name": "Jane Smith",
      "role": "Backend developer",
      "profile_url": "https://devpost.com/janesmith",
      "skills": ["java", "docker", "kubernetes"],
      "interests": ["Cloud Computing", "DevOps"],
      "stats": {
        "projects": 8,
        "followers": 45,
        "achievements": 3
      },
      "photo_url": "https://...",
      "match_score": 92,
      "match_reason": "Strong complementary skills in backend (Java, Docker) while you excel in frontend. Shared passion for building scalable systems. Her 8 completed projects show commitment and experience."
    }
  ]
}
```

#### 3. Get Statistics
```http
GET /api/stats

Response:
{
  "total_participants": 1886,
  "hackathons": [
    {"name": "hackutd-2025", "count": 1154},
    {"name": "hacktx2025", "count": 732}
  ]
}
```

## Frontend Integration

### 1. Create API Service (`src/services/api.js`)

```javascript
const API_BASE_URL = 'http://127.0.0.1:5000/api'

export const scrapeHackathon = async (hackathonUrl) => {
  const response = await fetch(`${API_BASE_URL}/scrape`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: hackathonUrl })
  })
  return response.json()
}

export const findTeammates = async (hackathon, userId = null) => {
  const response = await fetch(`${API_BASE_URL}/find-teammates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hackathon, user_id: userId })
  })
  return response.json()
}

export const getStats = async () => {
  const response = await fetch(`${API_BASE_URL}/stats`)
  return response.json()
}
```

### 2. Update Dashboard Component

```javascript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { scrapeHackathon } from '../services/api'

// In handleFindTeammates:
const handleFindTeammates = async () => {
  if (!hackathonUrl.trim()) {
    alert('Please enter a hackathon URL')
    return
  }

  // Store URL in session storage
  sessionStorage.setItem('hackathonUrl', hackathonUrl)

  // Navigate to brewing page
  navigate('/brewing')
}
```

### 3. Update Brewing Component

```javascript
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { scrapeHackathon, findTeammates } from '../services/api'

const Brewing = () => {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState('Initializing...')
  const [hackathonData, setHackathonData] = useState(null)

  useEffect(() => {
    const processHackathon = async () => {
      const hackathonUrl = sessionStorage.getItem('hackathonUrl')

      try {
        // Step 1: Scrape hackathon (0-50%)
        setStep('Scraping participant data...')
        const scrapeResult = await scrapeHackathon(hackathonUrl)
        setProgress(50)

        // Step 2: AI matching (50-100%)
        setStep('AI analyzing compatibility...')
        const matchResult = await findTeammates(scrapeResult.hackathon)
        setProgress(100)

        // Store results
        sessionStorage.setItem('matchResults', JSON.stringify(matchResult))

        // Navigate to results
        setTimeout(() => navigate('/results'), 1000)
      } catch (error) {
        console.error('Error processing hackathon:', error)
        alert('Error processing hackathon. Please try again.')
        navigate('/dashboard')
      }
    }

    processHackathon()
  }, [navigate])

  // ... rest of component
}
```

### 4. Update BrewResults Component

```javascript
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const BrewResults = () => {
  const navigate = useNavigate()
  const [results, setResults] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const matchResults = sessionStorage.getItem('matchResults')
    if (!matchResults) {
      navigate('/dashboard')
      return
    }

    const data = JSON.parse(matchResults)
    setCurrentUser(data.current_user)
    setResults(data.matches)
  }, [navigate])

  if (!results) return <div>Loading...</div>

  return (
    <Layout>
      {/* Display current_user profile */}
      <div className="current-user-card">
        <h2>{currentUser.name}</h2>
        <p>{currentUser.role}</p>
        <div>
          {currentUser.skills.map(skill => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>

      {/* Display matches */}
      {results.map(brewer => (
        <div key={brewer.participant_id}>
          <h3>{brewer.name}</h3>
          <p>Match: {brewer.match_score}%</p>
          <p>{brewer.match_reason}</p>
          <div>
            {brewer.skills.map(skill => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
          <a href={brewer.profile_url}>View Devpost Profile</a>
        </div>
      ))}
    </Layout>
  )
}
```

## Data Flow

1. **User enters hackathon URL** in Dashboard
   - URL stored in sessionStorage
   - Navigate to `/brewing`

2. **Brewing page processes request**
   - Calls `POST /api/scrape` with URL
   - Flask scrapes Devpost using Selenium
   - Stores participants in MongoDB
   - Returns hackathon name and count

3. **AI matching begins**
   - Calls `POST /api/find-teammates` with hackathon name
   - Flask uses Gemini AI to analyze compatibility
   - Pre-filters 1000+ participants to top 50
   - Returns top 10 matches with scores and reasons

4. **Results displayed**
   - Match data stored in sessionStorage
   - Navigate to `/results`
   - Display current user profile + top matches

## CORS Configuration

The Flask backend uses `flask-cors` to allow requests from the React frontend:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows all origins in development
```

For production, configure specific origins:
```python
CORS(app, origins=['https://yourdomain.com'])
```

## MongoDB Data Structure

### Participant Document
```json
{
  "participant_id": "2457597",
  "name": "John Doe",
  "role": "Full-stack developer",
  "profile_url": "https://devpost.com/johndoe",
  "photo_url": "https://...",
  "skills": ["python", "react", "nodejs"],
  "interests": ["Machine Learning/AI", "Web Development"],
  "stats": {
    "projects": 12,
    "followers": 85,
    "achievements": 5
  },
  "hackathon": "hackutd-2025"
}
```

## AI Matching Algorithm

The system uses a two-stage approach:

### Stage 1: Pre-filtering (Fast)
```python
score = (complementary_skills * 5) + (shared_interests * 10) + (projects * 2)
# Keep top 50 candidates
```

### Stage 2: AI Analysis (Detailed)
```
Gemini 2.5-flash analyzes:
- Complementary skills (30%)
- Shared interests (25%)
- Experience balance (20%)
- Technical stack (15%)
- Track record (10%)
```

## Production Deployment

### Build React App
```bash
npm run build
# Creates dist/ folder
```

### Flask serves React build
```python
app = Flask(__name__, static_folder='dist', static_url_path='')

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')
```

### Single server deployment
```bash
python app.py
# Serves React app on / and API on /api/*
```

## Environment Variables

### Development
- React: `http://localhost:5173`
- Flask: `http://127.0.0.1:5000`

### Production
- Single domain serving both
- API endpoints: `/api/*`
- Frontend: All other routes

## Troubleshooting

### CORS Errors
- Ensure `flask-cors` is installed
- Check Flask is running on port 5000
- Verify API_BASE_URL in React

### MongoDB Connection
- Check MONGODB_URI is correct
- Verify network access in MongoDB Atlas
- Test connection: `mongosh "mongodb+srv://..."`

### Gemini API Errors
- Verify `GEMINI_API_KEY` in `.env`
- Check API quota: https://makersuite.google.com/
- Model: `gemini-2.5-flash`

### Scraping Fails
- Devpost cookies may expire
- Update `DEVPOST_COOKIES` in app.py
- Check Chrome/ChromeDriver version

## Testing

### Test Backend API
```bash
# Test scraping
curl -X POST http://127.0.0.1:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://hackutd-2025.devpost.com/"}'

# Test matching
curl -X POST http://127.0.0.1:5000/api/find-teammates \
  -H "Content-Type: application/json" \
  -d '{"hackathon": "hackutd-2025"}'
```

### Test Frontend
```bash
npm run dev
# Navigate to http://localhost:5173
# Test full flow: Dashboard → Brewing → Results
```

## Next Steps

1. ✅ Create `src/services/api.js`
2. ✅ Update `src/pages/Dashboard.jsx`
3. ✅ Update `src/pages/Brewing.jsx`
4. ✅ Update `src/pages/BrewResults.jsx`
5. ✅ Add error handling and loading states
6. ✅ Test full integration
7. ✅ Deploy to production

---

**Ready to integrate!** Follow the steps above to connect the React frontend with the Flask backend for AI-powered teammate matching.
