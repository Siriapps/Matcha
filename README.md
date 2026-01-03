# Devpost Hackathon Scraper Web App

A web application that scrapes Devpost hackathon participant data and stores it in MongoDB Atlas.

## 🎉 Your Web App is Running!

**URL:** http://127.0.0.1:5000

Open this URL in your browser to use the scraper!

## Features

- ✅ Simple web interface to enter hackathon URLs
- ✅ Automatic scraping with infinite scroll support
- ✅ Stores data directly to MongoDB Atlas
- ✅ Real-time statistics display
- ✅ Clears old data for the same hackathon before inserting new data

## How to Use

1. **Open the web app** in your browser:
   ```
   http://127.0.0.1:5000
   ```

2. **Enter a Devpost hackathon URL**, for example:
   - `https://hackutd-2025.devpost.com/`
   - `https://hacktx2025.devpost.com/`
   - `https://your-hackathon.devpost.com/`

3. **Click "Scrape & Store Participants"**

4. **Wait** for the scraping to complete (may take 1-2 minutes depending on participant count)

5. **View statistics** showing total participants and breakdown by hackathon

## Project Structure

```
Hacks_for_Hackers/
├── app.py                      # Flask web application
├── templates/
│   └── index.html             # Web interface
├── scraper_selenium.py        # Standalone Selenium scraper
├── upload_to_mongodb.py       # Standalone MongoDB uploader
├── participants_full.json     # Sample scraped data
├── MONGODB_SETUP_GUIDE.md     # MongoDB setup instructions
└── README.md                  # This file
```

## API Endpoints

### GET `/`
- Returns the main web interface

### POST `/scrape`
- Scrapes hackathon participants and stores in MongoDB
- **Body:** `{ "url": "https://hackathon.devpost.com/" }`
- **Response:**
  ```json
  {
    "success": true,
    "hackathon": "hackathon-name",
    "participants_count": 1154,
    "message": "Successfully scraped and stored 1154 participants!"
  }
  ```

### GET `/stats`
- Returns statistics about stored data
- **Response:**
  ```json
  {
    "total_participants": 1886,
    "hackathons": [
      {"name": "hackutd-2025", "count": 1154},
      {"name": "hacktx2025", "count": 732}
    ]
  }
  ```

## Data Stored

Each participant document in MongoDB contains:

```json
{
  "participant_id": "2412572",
  "name": "Nikhil Marisetty",
  "profile_url": "https://devpost.com/nxm230088",
  "role": "Full-stack developer",
  "hackathon": "hacktx2025",
  "stats": {
    "projects": 4,
    "followers": 1,
    "achievements": 5
  },
  "skills": ["python", "java", "javascript", "mysql", "react", "pytorch", "Machine Learning/AI"],
  "interests": ["Machine Learning/AI"],
  "photo_url": "https://..."
}
```

## MongoDB Configuration

The app is pre-configured to connect to your MongoDB Atlas cluster:
- **Database:** `devpost_data`
- **Collection:** `participants`

Indexes are automatically created on:
- `hackathon`
- `participant_id`
- `skills`

## Running the App

### Start the server:
```bash
python app.py
```

The server will start on http://127.0.0.1:5000

### Stop the server:
Press `Ctrl+C` in the terminal

## Dependencies

```bash
pip install flask selenium beautifulsoup4 pymongo dnspython
```

## Important Notes

### Authentication
- The app uses your Devpost cookies for authentication
- Cookies are stored in `app.py` in the `DEVPOST_COOKIES` variable
- If scraping stops working, you may need to update these cookies

### Rate Limiting
- The scraper includes delays between scroll actions to be respectful
- It may take 1-2 minutes per hackathon depending on participant count

### Data Management
- Each time you scrape a hackathon, it **clears old data** for that specific hackathon
- Data from other hackathons is preserved
- Total participants across all hackathons can be viewed in the stats

## Troubleshooting

### "Authentication failed"
- Your Devpost cookies may have expired
- Log into Devpost in your browser and get fresh cookies
- Update the `DEVPOST_COOKIES` in `app.py`

### "No participants found"
- Check that the URL is correct
- Ensure you're using the base hackathon URL (not the /participants page)
- Verify the hackathon exists and has participants

### Chrome driver issues
- Make sure Chrome browser is installed
- Selenium will download ChromeDriver automatically

## Advanced Usage

### Query MongoDB from Python

```python
from pymongo import MongoClient

client = MongoClient("your_connection_string")
db = client.devpost_data
collection = db.participants

# Find all Python developers from HackUTD
python_devs = collection.find({
    "hackathon": "hackutd-2025",
    "skills": "python"
})

for dev in python_devs:
    print(f"{dev['name']} - {dev.get('role', 'No role')}")
```

### Using the Standalone Scripts

If you prefer command-line tools:

1. **Selenium scraper:**
   ```bash
   python scraper_selenium.py
   ```
   Saves to `participants_full.json`

2. **MongoDB uploader:**
   ```bash
   export MONGODB_URI="your_connection_string"
   python upload_to_mongodb.py
   ```

## License

MIT License - Feel free to use this for your hackathon needs!

## Credits

Built with:
- Flask - Web framework
- Selenium - Web scraping
- BeautifulSoup4 - HTML parsing
- MongoDB Atlas - Database
- Chrome - Headless browser
