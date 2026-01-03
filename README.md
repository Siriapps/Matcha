# Matcha - Brewing your perfect hack team

A team-building platform designed to help hackathon participants find compatible teammates. The platform uses a unique "brewing" algorithm to match developers, designers, and visionaries based on their skills, experience, and interests.

## Features

- 🎯 **Smart Matching**: AI-powered algorithm to find compatible teammates
- 👥 **Profile Setup**: Two-step onboarding process to capture skills and preferences
- 📊 **Dashboard**: Track your hackathon history and team formations
- 🔍 **Brew Results**: View matched teammates with compatibility scores
- ☕ **Brewing Process**: Real-time progress tracking during team matching
- 🔐 **Full Authentication**: 
  - Email/password authentication
  - Social login via Google and GitHub (Auth0)
  - Forgot password functionality
- 💬 **Messaging**: Chat with matched teammates directly from the results page

## Tech Stack

- **Frontend**: React 18, Vite, React Router, Tailwind CSS
- **Backend**: Node.js, Express
- **Authentication**: 
  - JWT tokens for email/password
  - Auth0 for social logins (Google, GitHub)
  - bcrypt for password hashing
- **Storage**: JSON files (ready for MongoDB migration)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Auth0 account (for social logins)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Siriapps/Matcha.git
cd Matcha
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create a `.env` file in the root directory:

```env
# Frontend
VITE_API_URL=http://localhost:3001/api

# Auth0 (for Google/GitHub login)
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id-here

# Backend
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
FRONTEND_URL=http://localhost:5173
```

4. **Start the development servers:**

**⚠️ IMPORTANT:** The backend server MUST be running for email/password authentication to work!

```bash
# Option 1: Start both frontend and backend together (RECOMMENDED)
npm run dev:all

# Option 2: Start them separately (use two terminals):
# Terminal 1 - Frontend
npm run dev          # Frontend (port 5173)

# Terminal 2 - Backend (REQUIRED for email/password login/signup)
npm run dev:server    # Backend (port 3001)
```

**Windows Users:** You can also double-click `server/start.bat` to start the backend.

5. **Verify the backend is running:**
   - You should see in terminal: `🚀 Server running on http://localhost:3001`
   - Test it: Open `http://localhost:3001/api/health` in your browser
   - You should see: `{"status":"ok","message":"Server is running"}`
   - If you see an error or "Cannot connect", the backend is NOT running!

6. **Open your browser:**
Navigate to `http://localhost:5173`

**Note:** 
- Google/GitHub login works WITHOUT the backend (uses Auth0)
- Email/Password login REQUIRES the backend to be running
- If you see "Cannot connect to server" errors, the backend is not running - go back to step 4!

## Auth0 Setup (for Google/GitHub Login)

1. Create an Auth0 account at [https://auth0.com](https://auth0.com)
2. Create a **Single Page Web Application**
3. Configure:
   - **Allowed Callback URLs**: `http://localhost:5173`
   - **Allowed Logout URLs**: `http://localhost:5173`
   - **Allowed Web Origins**: `http://localhost:5173`
4. Enable **Google** and **GitHub** social connections in Auth0 Dashboard
5. Add your Auth0 credentials to `.env`:
   ```env
   VITE_AUTH0_DOMAIN=your-tenant.auth0.com
   VITE_AUTH0_CLIENT_ID=your-client-id-here
   ```

## Available Routes

- `/` - Landing page
- `/login` - Login page (email/password + Google/GitHub)
- `/signup` - Signup page (includes Devpost link field)
- `/forgot-password` - Forgot password page
- `/reset-password` - Reset password page (with token)
- `/profile/step1` - Profile setup step 1 (Basic info)
- `/profile/step2` - Profile setup step 2 (Skills & Resume)
- `/dashboard` - Main dashboard (shows user details)
- `/brewing` - Team matching process screen
- `/results` - Team matching results
- `/messages` - Chat with matched teammates
- `/settings` - Profile settings page

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/verify` - Verify JWT token

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

## User Data Storage

Currently, user data is stored in JSON files in `server/data/users.json`. This will be migrated to MongoDB later.

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx           # Collapsible sidebar navigation
│   ├── Layout.jsx            # Layout wrapper with sidebar
│   └── ProtectedRoute.jsx    # Route protection component
├── context/
│   └── AuthContext.jsx       # Authentication context
├── pages/
│   ├── Landing.jsx            # Landing page
│   ├── Login.jsx             # Login page
│   ├── Signup.jsx            # Signup page (with Devpost link)
│   ├── Dashboard.jsx         # Main dashboard
│   ├── Brewing.jsx           # Team matching process
│   ├── BrewResults.jsx       # Matching results
│   └── Messages.jsx          # Chat interface
└── utils/
    └── userStorage.js        # Local storage utilities

server/
├── routes/
│   ├── auth.js              # Authentication routes
│   └── users.js             # User routes
├── middleware/
│   └── auth.js              # JWT verification middleware
├── utils/
│   ├── userStorage.js       # JSON file storage
│   └── emailService.js      # Email service (placeholder)
└── index.js                 # Express server entry point
```

## Troubleshooting

### Network Error on Email/Password Login

If you're getting "Network error" when logging in or signing up with email/password:

1. **Make sure the backend server is running:**
   ```bash
   npm run dev:server
   ```
   The backend should be running on `http://localhost:3001`

2. **Check your `.env` file:**
   Ensure `VITE_API_URL=http://localhost:3001/api` is set correctly

3. **Check browser console:**
   Look for CORS errors or connection refused errors

4. **Verify the backend is accessible:**
   Try visiting `http://localhost:3001/api/auth/verify` in your browser (should return an error, but confirms the server is running)

## License

MIT
