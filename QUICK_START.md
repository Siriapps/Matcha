# Quick Start Guide

## 🚀 Start the Backend Server (REQUIRED for Email/Password Login)

**The backend server MUST be running for email/password authentication to work!**

### Option 1: Start Backend Only
```bash
npm run dev:server
```

You should see:
```
🚀 Server running on http://localhost:3001
📡 API available at http://localhost:3001/api
```

### Option 2: Start Both Frontend + Backend Together
```bash
npm run dev:all
```

### Option 3: Windows Users - Double-click
Double-click `server/start.bat` to start the backend server

## ✅ Verify Backend is Running

1. Open your browser
2. Go to: `http://localhost:3001/api/health`
3. You should see: `{"status":"ok","message":"Server is running"}`

If you see an error, the backend is NOT running!

## 🔧 Troubleshooting

**"Cannot connect to server" error:**
- Make sure you ran `npm run dev:server` in a terminal
- Check that port 3001 is not being used by another app
- Verify `.env` file has: `VITE_API_URL=http://localhost:3001/api`

**Backend won't start:**
- Make sure you ran `npm install` in the root directory
- Check that Node.js is installed: `node --version`
- Look for error messages in the terminal

## 📝 Notes

- **Google/GitHub login** works WITHOUT the backend (uses Auth0)
- **Email/Password login** REQUIRES the backend to be running
- The backend stores user data in `server/data/users.json`

