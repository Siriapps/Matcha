# How to Start the Backend Server

## Quick Start

To run the backend server, open a terminal and run:

```bash
npm run dev:server
```

Or to run both frontend and backend together:

```bash
npm run dev:all
```

## Troubleshooting

If you get "Cannot connect to server" errors:

1. **Make sure the backend is running:**
   - Open a terminal
   - Navigate to the project folder
   - Run: `npm run dev:server`
   - You should see: `🚀 Server running on http://localhost:3001`

2. **Check your .env file:**
   Make sure you have:
   ```env
   VITE_API_URL=http://localhost:3001/api
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

3. **Check if port 3001 is available:**
   - If another app is using port 3001, change the PORT in your .env file
   - Update VITE_API_URL accordingly

4. **Verify the server is accessible:**
   - Open your browser and go to: `http://localhost:3001/api/health`
   - You should see: `{"status":"ok","message":"Server is running"}`

## Common Issues

- **"Cannot find module" errors:** Run `npm install` in the root directory
- **Port already in use:** Change PORT in .env or stop the other application
- **CORS errors:** Make sure FRONTEND_URL in .env matches your frontend URL

