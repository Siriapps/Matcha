# Setup Instructions

## Quick Start

### 1. Install Dependencies

```bash
pip install flask selenium beautifulsoup4 pymongo dnspython google-generativeai
```

### 2. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key

### 3. Create `.env` File

Create a file named `.env` in the project root:

```bash
GEMINI_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with the API key you copied.

### 4. Run the App

```bash
python app.py
```

### 5. Open in Browser

Navigate to: **http://127.0.0.1:5000**

## Features

### 1. Scrape Hackathon Participants
- Enter a Devpost hackathon URL
- Click "Scrape & Store Participants"
- Data is automatically saved to MongoDB Atlas

### 2. AI-Powered Teammate Matching
- After scraping, click "🤝 Find My Ideal Teammates"
- Gemini AI analyzes all participants
- Returns top 5 matches with:
  - Match score (0-100)
  - Detailed reasoning
  - Skills and interests
  - Direct profile links

## How the Teammate Matching Works

The AI considers:
- **Complementary Skills** - Diverse technical skills for a well-rounded team
- **Shared Interests** - Common goals and passion areas
- **Experience Level** - Mix of experienced and learning developers
- **Technical Stack Compatibility** - Compatible tech preferences
- **Project History** - Commitment and experience indicators

## Example Usage

1. **Scrape a hackathon:**
   - URL: `https://hackutd-2025.devpost.com/`
   - Wait for completion (~2 minutes)

2. **Find teammates:**
   - Click "Find My Ideal Teammates"
   - AI analyzes 1000+ participants in ~30 seconds
   - View top 5 matches with detailed explanations

3. **Connect with teammates:**
   - Click "View Profile" to see their Devpost page
   - Reach out based on AI recommendations

## API Endpoints

### POST `/scrape`
Scrapes and stores hackathon participants.

**Request:**
```json
{
  "url": "https://hackutd-2025.devpost.com/"
}
```

**Response:**
```json
{
  "success": true,
  "hackathon": "hackutd-2025",
  "participants_count": 1154,
  "message": "Successfully scraped and stored 1154 participants!"
}
```

### POST `/find-teammates`
Finds best teammate matches using Gemini AI.

**Request:**
```json
{
  "hackathon": "hackutd-2025"
}
```

**Response:**
```json
{
  "success": true,
  "current_user": {
    "name": "Your Name",
    "role": "Full-stack developer",
    "skills": ["python", "javascript", "react"],
    "interests": ["Machine Learning/AI"]
  },
  "matches": [
    {
      "name": "John Doe",
      "match_score": 92,
      "match_reason": "Strong complementary skills in backend...",
      "skills": ["java", "docker", "kubernetes"],
      "profile_url": "https://devpost.com/johndoe"
    }
  ]
}
```

### GET `/stats`
Returns database statistics.

**Response:**
```json
{
  "total_participants": 1886,
  "hackathons": [
    {"name": "hackutd-2025", "count": 1154},
    {"name": "hacktx2025", "count": 732}
  ]
}
```

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌────────────────┐
│   Browser   │─────▶│ Flask App    │─────▶│ MongoDB Atlas  │
│   (User)    │◀─────│  (Backend)   │◀─────│  (Database)    │
└─────────────┘      └──────────────┘      └────────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  Selenium    │
                     │  (Scraper)   │
                     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   Gemini AI  │
                     │  (Matcher)   │
                     └──────────────┘
```

## Troubleshooting

### "Gemini API key not configured"
- Make sure you created the `.env` file
- Check that `GEMINI_API_KEY` is set correctly
- Restart the Flask app after creating `.env`

### "Authentication failed" (Devpost)
- Devpost cookies may have expired
- Get fresh cookies from your browser
- Update `DEVPOST_COOKIES` in `app.py`

### Slow AI matching
- Gemini analyzes participants in batches
- Larger hackathons (1000+ participants) may take 30-60 seconds
- This is normal and ensures quality matches

### Chrome driver issues
- Ensure Chrome browser is installed
- ChromeDriver downloads automatically with Selenium
- If issues persist, update Chrome to latest version

## Environment Variables

The app uses the following environment variables:

- `GEMINI_API_KEY` - Your Google Gemini API key (required for teammate matching)
- `MONGODB_URI` - MongoDB connection string (hardcoded in app.py, can be moved to .env)

## Security Notes

- Never commit `.env` file to version control
- Never share your Gemini API key
- Keep Devpost cookies private
- Add `.env` to `.gitignore`

## Cost Information

### Gemini API
- Free tier: 60 requests per minute
- Teammate matching uses ~1 request per 20 participants
- Example: 1000 participants = ~50 requests = FREE

### MongoDB Atlas
- Free tier (M0): 512MB storage
- Plenty for 10,000+ participants
- No credit card required

## Support

If you encounter issues:
1. Check this documentation first
2. Verify all dependencies are installed
3. Check that `.env` file exists and is properly formatted
4. Restart the Flask server
5. Check browser console for error messages

## Next Steps

- Deploy to production using Gunicorn/Heroku
- Add user authentication
- Create team formation tools
- Build analytics dashboard
- Add email notifications for matches
