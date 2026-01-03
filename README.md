# Matcha ☕

**Brewing your perfect hack team**

Matcha is a team matching platform designed specifically for hackathons. It connects developers, designers, and visionaries to form high-impact teams that build projects that matter.

## What is Matcha?

Matcha helps you find the right teammates for the right hackathon. Instead of scrambling at the last minute or working solo, Matcha uses intelligent matching to connect you with compatible team members based on your skills, interests, and hackathon experience.

## Why Matcha?

### 🎯 **Find Your Perfect Squad**
No more awkward team formations or working alone. Matcha matches you with teammates who complement your skills and share your interests.

### ⚡ **Quick Team Formation**
Paste a Devpost or hackathon URL, and Matcha instantly starts the matching process. No lengthy forms or complicated setup—just paste and go.

### 🎨 **Skill-Based Matching**
Our algorithm considers your preferred roles (Frontend, Backend, ML, Design), experience level, technical skills, and interests to find the best team fit.

### 💬 **Built-in Communication**
Once matched, start chatting with your potential teammates directly in the app. No need to exchange contact info or switch platforms.

### 📊 **Track Your Hack History**
Keep a record of all your hackathon projects, teams, and achievements in one place. See your growth over time and showcase your best work.

## How It Works

1. **Sign Up & Set Up Your Profile**
   - Create an account with email/password or use Google/GitHub
   - Complete your profile: preferred roles, experience level, skills, and interests
   - Upload your resume (optional) to showcase your expertise

2. **Find a Hackathon**
   - Paste a Devpost or hackathon URL on your dashboard
   - Matcha analyzes the hackathon and finds compatible teammates

3. **Get Matched**
   - Review your potential teammates based on skill compatibility
   - See their profiles, experience, and past projects

4. **Connect & Build**
   - Start chatting with your matches directly in the app
   - Form your team and start building something amazing

5. **Track Your Progress**
   - All your hackathons, teams, and projects are saved in your dashboard
   - Build your hackathon portfolio over time

## Key Features

- **Smart Matching Algorithm**: AI-powered matching using Google Gemini to find teammates based on complementary skills and shared interests
- **Profile Customization**: Showcase your roles, skills, experience, and interests
- **Real-time Chat**: Communicate with potential teammates without leaving the app
- **Hackathon History**: Track all your projects and teams in one place
- **Multiple Authentication Options**: Sign up with email, Google, or GitHub
- **Devpost Integration**: Scrape participant data from any Devpost hackathon
- **Secure & Private**: Your data is protected and only shared with matched teammates

## Tech Stack

### Frontend
- **React** with Vite
- **TailwindCSS** for styling
- **React Router** for navigation
- **Auth0** for authentication

### Backend
- **Flask** - Python web framework
- **Selenium** - Web scraping for Devpost
- **BeautifulSoup4** - HTML parsing
- **MongoDB Atlas** - Cloud database
- **Google Gemini AI** - AI-powered teammate matching
- **Node.js/Express** - API server for frontend

## Quick Start

### Frontend (React App)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Backend (Python Scraper & AI Matching)

```bash
# Install Python dependencies
pip install flask selenium beautifulsoup4 pymongo dnspython google-generativeai python-dotenv

# Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env

# Run Flask server
python app.py
```

The Flask API will be available at `http://127.0.0.1:5000`

### Node.js Backend Server

```bash
cd server
npm install
npm start
```

The Node server will be available at `http://localhost:3000`

## Setup Instructions

For detailed setup instructions, see:
- [TEAM_SETUP.md](./TEAM_SETUP.md) - Quick team setup guide
- [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) - Python backend setup
- [START_SERVER.md](./START_SERVER.md) - Server startup guide

## AI Teammate Matching

The AI matching system uses Google Gemini to analyze participant profiles and find the best matches based on:

- **Complementary Skills** (30%) - Diverse technical skills for well-rounded teams
- **Shared Interests** (25%) - Common passion areas and goals
- **Experience Balance** (20%) - Mix of experienced and learning developers
- **Technical Stack** (15%) - Compatible languages and frameworks
- **Track Record** (10%) - Project history and commitment

### Pre-filtering Algorithm

For large hackathons (1000+ participants), the system uses a two-stage approach:
1. **Quick pre-filter**: Scores all participants based on complementary skills, shared interests, and experience
2. **AI analysis**: Top 50 candidates get detailed Gemini AI analysis

This reduces processing time by ~95% while maintaining match quality.

## API Endpoints

### Python Backend (Flask)

- `POST /scrape` - Scrape Devpost hackathon participants
- `POST /find-teammates` - Find AI-matched teammates
- `GET /stats` - Get database statistics

### Node.js Backend (Express)

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Who Is Matcha For?

- **Hackathon Enthusiasts**: Regular participants looking for reliable teammates
- **First-Timers**: New to hackathons? Find experienced teammates to guide you
- **Solo Developers**: Don't have a team? Matcha finds one for you
- **Skill Builders**: Connect with people who can help you learn and grow
- **Project Creators**: Build meaningful projects with the right team

## The Matcha Philosophy

Great ideas shouldn't go to waste because you couldn't find the right team. Matcha believes that the best projects come from diverse teams with complementary skills, shared passion, and clear communication. We're here to make team formation as smooth as your morning matcha—simple, effective, and energizing.

## Environment Variables

Create a `.env` file in the root directory:

```bash
# Google Gemini API (for AI matching)
GEMINI_API_KEY=your_gemini_api_key

# MongoDB (already configured in app.py)
MONGODB_URI=your_mongodb_uri

# Server port (optional)
PORT=5000
```

## Contributing

Contributions are welcome! Please see [TEAM_SETUP.md](./TEAM_SETUP.md) for development setup.

## License

MIT License - Free to use and modify

## Credits

Built with:
- Flask (Python web framework)
- Selenium (Web scraping)
- Google Gemini AI (Teammate matching)
- MongoDB Atlas (Database)
- React + Vite (Frontend)
- TailwindCSS (Styling)
- Auth0 (Authentication)

---

**Ready to brew your perfect team?** Get started by running both the frontend and backend servers!
