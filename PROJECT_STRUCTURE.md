# Matcha - Project Structure

## Directory Layout

```
Hacks_for_Hackers/
├── backend/                        # Python Flask Backend
│   ├── app.py                      # Main Flask application with API routes
│   ├── teammate_matcher.py         # Gemini AI matching logic
│   ├── scraper_selenium.py         # Devpost web scraper
│   ├── upload_to_mongodb.py        # MongoDB upload utility
│   ├── templates/                  # Old HTML templates (deprecated)
│   ├── requirements.txt            # Python dependencies
│   └── .env                        # Environment variables (GEMINI_API_KEY)
│
├── frontend/                       # React Frontend
│   ├── src/
│   │   ├── App.jsx                 # Main React app component
│   │   ├── main.jsx                # React entry point
│   │   ├── index.css               # Global styles
│   │   ├── services/
│   │   │   └── api.js              # API client for backend calls
│   │   ├── pages/
│   │   │   ├── Landing.jsx         # Landing page
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Signup.jsx          # Signup page
│   │   │   ├── Dashboard.jsx       # Main dashboard (paste hackathon URL)
│   │   │   ├── Brewing.jsx         # Loading screen with progress
│   │   │   ├── BrewResults.jsx     # Display AI-matched teammates
│   │   │   ├── Messages.jsx        # Chat interface
│   │   │   ├── Settings.jsx        # User settings
│   │   │   ├── ProfileSetupStep1.jsx  # Profile setup step 1
│   │   │   └── ProfileSetupStep2.jsx  # Profile setup step 2
│   │   ├── components/
│   │   │   ├── Layout.jsx          # Layout wrapper
│   │   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   │   └── ProtectedRoute.jsx  # Auth route guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Authentication context
│   │   └── utils/
│   │       └── userStorage.js      # User data storage
│   ├── package.json                # Node dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS config
│   └── index.html                  # HTML entry point
│
├── .env                            # Root environment variables
├── .gitignore                      # Git ignore rules
├── README.md                       # Main documentation
├── PROJECT_STRUCTURE.md            # This file
├── REACT_INTEGRATION_GUIDE.md      # Integration guide
├── INTEGRATION_SUMMARY.md          # Integration summary
├── MONGODB_SETUP_GUIDE.md          # MongoDB Atlas setup
├── SETUP_INSTRUCTIONS.md           # Setup instructions
├── FINAL_SUMMARY.md                # Feature summary
├── QUICK_START.md                  # Quick start guide
├── START_SERVER.md                 # Server startup guide
└── TEAM_SETUP.md                   # Team setup guide
```

## Component Descriptions

### Backend (`backend/`)

#### Core Files
- **app.py** - Flask REST API with CORS enabled
  - Routes: `/`, `/api/scrape`, `/api/find-teammates`, `/api/stats`
  - Integrates Selenium scraper and Gemini AI matcher

- **teammate_matcher.py** - AI matching engine
  - Uses Google Gemini 2.5-flash
  - Pre-filters 1000+ participants → top 50
  - Batch processing (20 participants per request)
  - Returns top 10 matches with scores and AI reasoning

- **scraper_selenium.py** - Devpost web scraper
  - Handles infinite scroll
  - Extracts: name, role, skills, interests, projects, photos
  - Cookie-based authentication

#### Data Files
- **.env** - Contains `GEMINI_API_KEY`
- **requirements.txt** - Python package dependencies

### Frontend (`frontend/`)

#### Core Components
- **App.jsx** - Root component with routing
- **api.js** - Backend API client
  - `scrapeHackathon(url)` - Scrape participants
  - `findTeammates(hackathon)` - Get AI matches
  - `brewTeammates(url, onProgress, onStepChange)` - Combined operation

#### Page Flow
1. **Landing** → Welcome page
2. **Login/Signup** → Authentication
3. **Dashboard** → Paste hackathon URL
4. **Brewing** → Real-time scraping + AI matching progress
5. **BrewResults** → Display top 10 teammate matches

#### Key Features
- **sessionStorage** for data transfer between routes
- **React Router** for navigation
- **TailwindCSS** for styling
- **Material Icons** for UI elements

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Flask | Web framework |
| Flask-CORS | Enable cross-origin requests |
| Selenium | Web scraping |
| BeautifulSoup4 | HTML parsing |
| PyMongo | MongoDB driver |
| Google Gemini AI | Teammate matching |
| Python-dotenv | Environment variables |

### Frontend
| Technology | Purpose |
|------------|---------|
| React | UI framework |
| Vite | Build tool & dev server |
| TailwindCSS | Styling |
| React Router | Navigation |
| Fetch API | HTTP requests |

### Database
| Technology | Purpose |
|------------|---------|
| MongoDB Atlas | Cloud NoSQL database |
| Collections | `participants` (stores scraped data) |

## Running the Project

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
pip install -r requirements.txt
python app.py
# Runs on http://127.0.0.1:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Production Build

**Build Frontend:**
```bash
cd frontend
npm run build
# Creates dist/ folder
```

**Serve from Flask:**
```python
# Update app.py to serve React build
app = Flask(__name__, static_folder='../frontend/dist')

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')
```

## Data Flow

```
User enters URL (Dashboard)
         ↓
sessionStorage.setItem('hackathonUrl', url)
         ↓
Navigate to /brewing
         ↓
┌─────────────────────────────────────────┐
│  Brewing Page                            │
│  ┌─────────────────────────────────────┐│
│  │ Step 1: Scrape (0-50%)              ││
│  │ POST /api/scrape                    ││
│  │ → Selenium scrapes Devpost          ││
│  │ → Stores in MongoDB                 ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ Step 2: AI Match (50-100%)          ││
│  │ POST /api/find-teammates            ││
│  │ → Pre-filter 1000+ → top 50         ││
│  │ → Gemini AI analyzes compatibility  ││
│  │ → Returns top 10 with scores        ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
         ↓
sessionStorage.setItem('matchResults', JSON.stringify(data))
         ↓
Navigate to /results
         ↓
Display matched teammates
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check + API info |
| `/api/scrape` | POST | Scrape hackathon participants |
| `/api/find-teammates` | POST | Get AI-matched teammates |
| `/api/stats` | GET | Database statistics |

## Environment Variables

**Backend (.env):**
```bash
GEMINI_API_KEY=your_api_key_here
```

**Frontend (optional .env.local):**
```bash
VITE_API_URL=http://127.0.0.1:5000/api
```

## Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Flask Backend | 5000 | http://127.0.0.1:5000 |
| React Frontend | 5173 | http://localhost:5173 |
| MongoDB Atlas | N/A | Cloud hosted |

## Git Structure

```
main branch
└── feature/ai-teammate-matching
    ├── Frontend merge commit
    ├── Integration layer commit
    └── Restructure commit (current)
```

## Next Steps

1. ✅ Separate frontend and backend folders
2. ✅ Update Flask with CORS and /api/ routes
3. ✅ Test backend API endpoints
4. ✅ Test frontend React app
5. ✅ Remove unnecessary files
6. ⏳ Update React components to call backend API
7. ⏳ Test full integration flow
8. ⏳ Build for production deployment

## Troubleshooting

### Backend Issues
- **Port 5000 in use**: Change port in app.py
- **CORS errors**: Ensure `flask-cors` is installed
- **Gemini API errors**: Check `.env` file has `GEMINI_API_KEY`

### Frontend Issues
- **API connection failed**: Ensure backend is running on port 5000
- **Module not found**: Run `npm install` in frontend folder
- **Build errors**: Check Node.js version (need v16+)

### MongoDB Issues
- **Connection timeout**: Check MongoDB Atlas whitelist
- **Auth failed**: Verify connection string in app.py

## Documentation Files

- **README.md** - Main project overview
- **PROJECT_STRUCTURE.md** - This file (directory structure)
- **REACT_INTEGRATION_GUIDE.md** - Detailed integration guide
- **INTEGRATION_SUMMARY.md** - Quick integration reference
- **SETUP_INSTRUCTIONS.md** - Python backend setup
- **MONGODB_SETUP_GUIDE.md** - MongoDB Atlas configuration
- **FINAL_SUMMARY.md** - Feature list and capabilities
- **QUICK_START.md** - Quick start guide
- **START_SERVER.md** - Server startup instructions
- **TEAM_SETUP.md** - Team development setup

---

**Last Updated**: January 2, 2026
**Status**: Restructured with separate frontend/backend folders
**Next**: Implement API integration in React components
