# Devpost Participants Scraper - Summary

## ✅ Success!

The scraper successfully extracted participant data from both Devpost hackathons using Selenium with infinite scroll support.

## Results

### Total Participants Scraped:
- **HackTX 2025**: 732 participants
- **HackUTD 2025**: 1,154 participants
- **Total**: 1,886 participants

### Data Extracted for Each Participant:

1. **participant_id** - Unique Devpost participant ID
2. **name** - Full name
3. **profile_url** - Devpost profile link
4. **role** - Role (e.g., "Full-stack developer", "Data scientist")
5. **stats** - Object containing:
   - `projects` - Number of projects
   - `followers` - Number of followers
   - `achievements` - Number of achievements
6. **skills** - Array of skill tags (e.g., ["python", "javascript", "Machine Learning/AI"])
7. **interests** - Array of interests (e.g., ["Blockchain", "Machine Learning/AI"])
8. **photo_url** - Profile photo URL

## Files Created

1. **scraper_selenium.py** - Working Selenium-based scraper with infinite scroll
2. **participants_full.json** - Complete dataset (946 KB)
3. **main.py** - Initial requests-based scraper (doesn't handle infinite scroll)

## How It Works

### Authentication
- Uses your Devpost session cookies to authenticate
- Cookies include: `jwt`, `remember_user_token`, `_devpost`, `aws-waf-token`, `_ga`

### Infinite Scroll Handling
1. Opens the page with Chrome in headless mode
2. Scrolls to the bottom repeatedly
3. Waits for new participants to load
4. Stops when no new participants appear
5. Extracts all participant data from the fully-loaded page

### Sample Data Structure:

```json
{
  "participant_id": "2412572",
  "name": "Nikhil Marisetty",
  "profile_url": "https://devpost.com/nxm230088",
  "role": "Full-stack developer",
  "stats": {
    "projects": 4,
    "followers": 1,
    "achievements": 5
  },
  "skills": [
    "python",
    "java",
    "javascript",
    "mysql",
    "react",
    "pytorch",
    "Machine Learning/AI"
  ],
  "interests": [
    "Machine Learning/AI"
  ],
  "photo_url": "https://..."
}
```

## Usage

To scrape other hackathons, simply add their participant page URLs to the `urls` list in `scraper_selenium.py`:

```python
urls = [
    'https://hacktx2025.devpost.com/participants',
    'https://hackutd-2025.devpost.com/participants',
    'https://your-hackathon.devpost.com/participants'  # Add more here
]
```

Then run:
```bash
python scraper_selenium.py
```

## Dependencies

- selenium
- beautifulsoup4
- requests (for the basic scraper)

## Notes

- The cookies will eventually expire - you'll need to get fresh ones from your browser
- The scraper is polite with 1-2 second delays between scrolls
- Chrome must be installed for Selenium to work
- The scraper runs in headless mode (no visible browser window)
