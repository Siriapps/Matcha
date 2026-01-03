# Quick Setup for Team Members

## 🚀 Get Started in 3 Steps

1. **Clone and install:**
```bash
git clone https://github.com/Siriapps/Matcha.git
cd Matcha
npm install
```

2. **Create `.env` file:**

Create a `.env` file in the root directory with this content:

```env
# Frontend API URL
VITE_API_URL=http://localhost:3001/api

# Auth0 Credentials (get these from team lead)
VITE_AUTH0_DOMAIN=YOUR-AUTH0-DOMAIN-HERE
VITE_AUTH0_CLIENT_ID=YOUR-CLIENT-ID-HERE

# Backend Configuration
JWT_SECRET=dev-secret-key-change-in-production
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**Replace:**
- `YOUR-AUTH0-DOMAIN-HERE` with the Auth0 domain provided by team lead
- `YOUR-CLIENT-ID-HERE` with the Auth0 client ID provided by team lead

3. **Start the app:**
```bash
# Start both frontend and backend
npm run dev:all
```

That's it! The app will be running at `http://localhost:5173`

## ✅ What's Already Configured

- ✅ Backend configuration
- ✅ All dependencies
- ✅ Project structure

## 📝 Notes

- The `.env` file contains your Auth0 credentials (get them from team lead)
- Backend runs on port 3001
- Frontend runs on port 5173
- Google/GitHub login works once Auth0 credentials are added
- Email/password login requires the backend to be running

## 🔧 Troubleshooting

**"Cannot connect to server" error:**
- Make sure you ran `npm run dev:all` (starts both frontend and backend)
- Or start them separately: `npm run dev:server` in one terminal, `npm run dev` in another

**Port already in use:**
- Make sure nothing else is using ports 3001 or 5173
- Close other applications using those ports

**Auth0 errors:**
- Verify your `.env` file has the correct Auth0 credentials
- Make sure the credentials match what the team lead provided
