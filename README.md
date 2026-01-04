# ☕ Matcha - Brewing Your Perfect Hack Team

<div align="center">
  
[![Demo Video](https://img.shields.io/badge/▶️_Watch_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/bx2dYwqAUJI)
[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-00C7B7?style=for-the-badge)](https://matcha.app)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**Don't let a great idea go to waste. Connect with developers, designers, and visionaries.**

[Getting Started](#getting-started) • [Features](#features) • [Tech Stack](#tech-stack) • [Demo](#demo-video) • [Contributing](#contributing)

</div>

---

## About Matcha

Matcha is an **AI-powered hackathon teammate matching platform** that helps developers, designers, and innovators find their perfect team. Whether you're looking for a frontend wizard, a backend guru, or a design genius, Matcha brews the perfect team combination using advanced AI matching algorithms.

### The Problem

- **Solo hackers** struggle to find teammates with complementary skills
- **Teams** waste valuable hackathon time searching for missing roles
- **Great ideas** never ship because of incomplete teams

### Our Solution

Matcha uses **Google Gemini AI** to analyze skills, interests, and hackathon goals to create perfectly balanced teams. We scrape Devpost hackathon data, analyze participant profiles, and match you with your ideal teammates in seconds.

---

## Demo Video

[![Matcha Demo](https://img.youtube.com/vi/bx2dYwqAUJI/maxresdefault.jpg)](https://youtu.be/bx2dYwqAUJI)

**Watch the full demo:** [https://youtu.be/bx2dYwqAUJI](https://youtu.be/bx2dYwqAUJI)

---

## Features

### AI-Powered Matching

- **Smart Algorithm**: Google Gemini 2.5-flash analyzes skills, interests, and goals
- **Personalized Results**: Get teammates that complement your skillset
- **Real-time Matching**: Find your team in seconds, not hours

### Beautiful UI/UX

- **Animated Landing Page**: Eye-catching hero section with smooth animations
- **3D Testimonials**: Interactive testimonial carousel
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern Aesthetics**: Built with TailwindCSS for a sleek, professional look

### Secure Authentication

- **Auth0 Integration**: Industry-standard OAuth authentication
- **JWT Tokens**: Secure session management
- **Password Recovery**: Email-based password reset flow

### Profile Management

- **Two-Step Setup**: Easy onboarding process
- **Skills Tags**: Add your technical skills
- **Project Ideas**: Share what you want to build
- **Hackathon Goals**: Define your objectives

### Smart Features

- **Devpost Scraping**: Automatically fetch participant data from hackathons
- **Survey System**: Collect detailed information about hackers
- **Team Dashboard**: Manage your matched teams
- **Messaging**: Communicate with potential teammates
- **Idea Board**: Share and collaborate on project concepts

---

## Tech Stack

### Frontend

- **React 18.2** - Modern UI library
- **Vite 5.0** - Lightning-fast build tool
- **React Router 6.20** - Client-side routing
- **TailwindCSS 3.3** - Utility-first CSS framework
- **Auth0 React** - Authentication SDK
- **Material Icons** - Icon library

### Backend (Python/Flask)

- **Flask 3.0** - Lightweight web framework
- **Flask-CORS** - Cross-origin resource sharing
- **PyMongo 4.6** - MongoDB driver
- **Selenium 4.16** - Web scraping automation
- **BeautifulSoup4 4.12** - HTML parsing
- **Google Generative AI** - Gemini API integration
- **Python-dotenv** - Environment variable management

### Backend (Node.js/Express)

- **Express 5.2** - Web application framework
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **Nodemailer** - Email sending
- **Cors** - CORS middleware

### Database

- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **File System** - JSON-based user storage

### DevOps

- **Git** - Version control
- **GitHub** - Code hosting
- **npm** - Package management
- **pip** - Python package management

---

## Project Structure

```
Matcha/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── assets/             # Images, videos, static files
│   │   ├── auth/               # Auth0 configuration
│   │   ├── components/         # Reusable React components
│   │   │   ├── Layout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── context/            # React Context providers
│   │   │   └── AuthContext.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Landing.jsx     # Animated landing page
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProfileSetupStep1.jsx
│   │   │   ├── ProfileSetupStep2.jsx
│   │   │   ├── Survey.jsx      # Hackathon survey
│   │   │   ├── Brewing.jsx     # AI matching page
│   │   │   ├── BrewResults.jsx # Match results
│   │   │   ├── Team.jsx        # Team management
│   │   │   ├── Ideas.jsx       # Project ideas board
│   │   │   ├── Messages.jsx
│   │   │   └── Settings.jsx
│   │   ├── services/
│   │   │   └── api.js          # API client
│   │   ├── utils/              # Utility functions
│   │   │   ├── userStorage.js
│   │   │   ├── teamStorage.js
│   │   │   └── ideaStorage.js
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                     # Python Flask backend
│   ├── app.py                  # Main Flask application
│   ├── teammate_matcher.py     # AI matching logic
│   ├── scraper_selenium.py     # Devpost scraper
│   ├── upload_to_mongodb.py    # Database utilities
│   ├── requirements.txt        # Python dependencies
│   └── templates/
│       └── index.html
│
├── server/                      # Node.js authentication backend
│   ├── index.js                # Express server
│   ├── middleware/
│   │   └── auth.js             # JWT middleware
│   └── routes/
│       ├── auth.js             # Authentication routes
│       └── users.js            # User management routes
│
└── README.md
```

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.11 or higher) - [Download](https://www.python.org/)
- **Git** - [Download](https://git-scm.com/)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)

### Required API Keys

You'll need the following API keys:

1. **MongoDB Atlas URI** - Database connection string
2. **Google Gemini API Key** - For AI matching ([Get it here](https://makersuite.google.com/app/apikey))
3. **Auth0 Credentials** - Authentication ([Create free account](https://auth0.com/))
4. **Devpost Cookies** - For scraping (see setup guide)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Siriapps/Matcha.git
cd Matcha
```

### 2. Setup Frontend

```bash
cd frontend
npm install
```

### 3. Setup Python Backend

```bash
cd ../backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 4. Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=YourApp

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Devpost Cookies (for scraping)
DEVPOST_JWT=your_jwt_cookie
DEVPOST_REMEMBER_TOKEN=your_remember_token
DEVPOST_SESSION=your_session_cookie
```

Create a `.env` file in the root directory for frontend:

```env
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your_client_id
VITE_AUTH0_AUDIENCE=your_api_audience
VITE_AUTH0_REDIRECT_URI=http://localhost:5173

# API URLs
VITE_API_URL=http://localhost:5000
```

---

## Running the Application

### Option 1: Run All Services Separately

**Terminal 1 - Flask Backend (Python):**

```bash
cd backend
python app.py
# Server runs on http://127.0.0.1:5000
```

**Terminal 2 - Frontend (React + Vite):**

```bash
cd frontend
npm run dev
# Server runs on http://localhost:5173
```

**Terminal 3 - Auth Backend (Node.js)** _(Optional)_:

```bash
cd server
node index.js
# Server runs on http://localhost:3001
```

### Option 2: Run Frontend & Node Backend Together

```bash
cd frontend
npm run dev:all
# Runs both Vite dev server and Node.js auth server
```

### Access the Application

Open your browser and navigate to:

- **Frontend**: http://localhost:5173
- **Flask Backend**: http://127.0.0.1:5000
- **Node Backend**: http://localhost:3001

---

---

## Key Features Walkthrough

### 1. **Landing Page**

- Animated hero section with gradient background
- Auto-scrolling 3D testimonials
- Smooth scroll-to-section navigation
- Responsive design for all devices

### 2. **Authentication Flow**

- Sign up with email/password or OAuth (Auth0)
- Email verification
- Password reset via email
- Secure JWT-based sessions

### 3. **Profile Setup**

- **Step 1**: Basic information (name, university, major)
- **Step 2**: Skills, interests, and hackathon goals
- Tag-based input for easy skill selection

### 4. **Survey System**

- Collect detailed hacker information
- Dynamic form validation
- Save responses to database

### 5. **AI Matching (Brewing)**

- Select hackathon and preferences
- AI analyzes all participants
- Real-time matching with progress animation
- Match scores and reasoning provided

### 6. **Results Page**

- View matched teammates
- See compatibility scores
- Export team data
- Contact matched members

### 7. **Team Dashboard**

- Manage current teams
- Track project progress
- Invite new members
- Team chat integration

### 8. **Ideas Board**

- Browse project ideas
- Submit your own ideas
- Upvote interesting projects
- Find teams for ideas

---

## Team

- **Siri**
- **Nikhil**
- **Karthik**

---
