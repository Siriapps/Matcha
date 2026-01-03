from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from pymongo import MongoClient
import time
import os
from typing import List, Dict
from teammate_matcher import TeammateMatcher
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# MongoDB configuration
MONGODB_URI = "mongodb+srv://sainikhil1611_db_user:LrCOwJCDgBRI4mCh@hack-for-hacks.hg2vjaf.mongodb.net/?appName=Hack-for-Hacks"
DATABASE_NAME = "devpost_data"
COLLECTION_NAME = "participants"

# Gemini API configuration
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')

# Devpost cookies for authentication
DEVPOST_COOKIES = [
    {'name': 'jwt', 'value': 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6OTUwNzE4N30.P-kx9z10_Xkd-80cKiO7YvUx2FPdll1ZTCAtOcxVQKQ'},
    {'name': 'remember_user_token', 'value': 'W1s5NTA3MTg3XSwiaEV1c3RrcGFRb0JzQ1ozaVloenEiLCIxNzY3MjgyMzA5LjE5OTE5Il0%3D--08dcc06f0434b060ea3a36da99b969a0863a4381'},
    {'name': '_devpost', 'value': 'SlJMaDE0WDFFWXdzRnB6YkNlbG82UXJaZUZ5UFhuK1V6NWxGRWo0WTZ6TVAvMXV4QmhGZW90dWh3R0VEaFpzTG5IT3hoWDh6MlZpa1pHeVE0Q0RIN1BvRkJTalBaVzZQemNtSjJkUDQxbzdtdWFldFVtMDZVUGU3b3NaeTFMTmcwQXV5RnBhYXJYSm9WUVRiRGMrRWJyNHUyM2tOYkxlQ1lieE80Vk1KL2Q0eGMyYVYxQWd3RitBTWJRalBqaVJpSEVwZGdIRFRPdytRSG9GbE5Ld1pRL3dZdzdHK0xFRlBwbHFsSmNKK3pvN1VsSmxNZ2dQSDZweGtwbktCR0hmbXpCcXRrb1g2cTkzRDBzSG52WFJ3eE1zdVFkakt3ME5PaVZiY3ZtcVpCTmZmcUZaNDZ6OS83UjZDckNTOGVWM29hbEJxbDVXSHEyY3ZCUktuQmtpSnlmTjBzK05pVXJ0YzRxNGx0ZmhIdldTVVpYS2hITVhqWWNOUWVYUUJWWndNckJKTFdvak5hL3ZJVXVYZnJTYzR1Y2gzODhYczV3SGgxNm53cHdyUDJkWVJ6d3BpOEpvcTkvWTh0QmdIdGRTT0MzOXIzKy83TEZoUTdvQmZ3MjZxTExVdFFNeEpveXRaVUFUcFdaNVQybGdNcGhhRmtRTlJBOVlIU3BLSUk4TmRXYWE5STl2a3VncUlLL1krMFIxZ0JSTjFiRXozZkZNY0pUeXBwRVNvakNWVHVWejhuMFdaNXEzRlVJRXg5WUFKRVJ4MUJ0djAya2YwZFFIaUgzaVdVeExITWV6RW15Q2RwK1lZK0FkOFlkTT0tLXNJNjlOTnkvcVd3SFpFV3BoNFk4NUE9PQ%3D%3D--dcfd7291b4da71cad63b01fdcd8f5844eb5a3686'},
    {'name': 'aws-waf-token', 'value': '3b85b5f3-f100-4cd5-b9d2-1df93816b6c9:EQoAk+iTY7oCAAAA:6QpeMmOEcwcl3z2mL8OrFP/quJ+GrhUKWsX/joAxvC7eOjiOersSLpcas1nOGiFOr/xgxsiCRUirc+T++aJrjNgPEpxXjIo/31djntuIR+fP5ez1zhZdKc9XrF1RIShvo1/yVtqqXKDR42kqd8vobkp9jt9FdVWMcKtlYfqhoxgoBBthOko7AJP49Dx13nLqE4fu7j0nW2/jeuUfri5I1UB4SWkl+dLs0or4Cbx0fy/+tBI2mp7KG68BWIuSGavfxCI='},
    {'name': '_ga', 'value': 'GA1.2.1951265362.1767282304'},
]


class DevpostScraperService:
    """Service to scrape Devpost participants using Selenium"""

    def __init__(self):
        self.options = Options()
        self.options.add_argument('--headless')
        self.options.add_argument('--no-sandbox')
        self.options.add_argument('--disable-dev-shm-usage')
        self.options.add_argument('user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')

    def scrape_participants(self, hackathon_url: str, cookies: List[Dict]) -> tuple:
        """
        Scrape participants from a Devpost hackathon.
        Returns: (participants_list, hackathon_name, error_message)
        """
        driver = None
        try:
            # Extract hackathon name from URL
            hackathon_name = hackathon_url.rstrip('/').split('/')[-1].replace('.devpost.com', '')
            if 'devpost.com' not in hackathon_url:
                hackathon_name = hackathon_url.split('//')[-1].split('.')[0]

            # Construct participants URL
            if not hackathon_url.endswith('/participants'):
                participants_url = hackathon_url.rstrip('/') + '/participants'
            else:
                participants_url = hackathon_url

            driver = webdriver.Chrome(options=self.options)

            # Navigate to base URL and set cookies
            base_url = participants_url.split('/participants')[0]
            driver.get(base_url)

            for cookie in cookies:
                if 'name' in cookie and 'value' in cookie:
                    cookie_dict = {
                        'name': cookie['name'],
                        'value': cookie['value'],
                        'domain': cookie.get('domain', '.devpost.com')
                    }
                    try:
                        driver.add_cookie(cookie_dict)
                    except:
                        pass

            # Navigate to participants page
            driver.get(participants_url)
            time.sleep(3)

            # Check if authenticated
            if "Please log in" in driver.page_source:
                return None, hackathon_name, "Authentication failed - cookies may be expired"

            # Scroll to load all participants with improved logic
            last_height = driver.execute_script("return document.body.scrollHeight")
            participants_count = 0
            no_change_count = 0
            max_no_change = 3  # Allow 3 consecutive no-change attempts before stopping

            print("Starting to scroll and load participants...")

            while no_change_count < max_no_change:
                # Scroll to bottom
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2.5)  # Increased wait time for slower networks

                # Count participants
                current_count = len(driver.find_elements(By.CLASS_NAME, "participant"))

                if current_count > participants_count:
                    print(f"Found {current_count} participants so far...")
                    participants_count = current_count
                    no_change_count = 0  # Reset counter when we find new participants
                else:
                    no_change_count += 1
                    print(f"No new participants found (attempt {no_change_count}/{max_no_change})")

                # Check if page height changed
                new_height = driver.execute_script("return document.body.scrollHeight")
                if new_height == last_height and no_change_count >= max_no_change:
                    break
                last_height = new_height

            print(f"Finished scrolling. Total participants found: {participants_count}")

            # Parse the page
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            participants = self._extract_all_participants(soup, hackathon_name)

            return participants, hackathon_name, None

        except Exception as e:
            return None, hackathon_name if 'hackathon_name' in locals() else 'unknown', str(e)

        finally:
            if driver:
                driver.quit()

    def _extract_all_participants(self, soup: BeautifulSoup, hackathon_name: str) -> List[Dict]:
        """Extract all participant data from the page"""
        participants = []
        participant_cards = soup.find_all('div', class_='participant')

        for card in participant_cards:
            participant_data = self._extract_participant_data(card)
            if participant_data:
                participant_data['hackathon'] = hackathon_name
                participants.append(participant_data)

        return participants

    def _extract_participant_data(self, card) -> Dict:
        """Extract participant information from a card element"""
        data = {}

        try:
            participant_id = card.get('data-participant-id')
            if participant_id:
                data['participant_id'] = participant_id

            name_elem = card.find('div', class_='user-name')
            if name_elem:
                h5 = name_elem.find('h5')
                if h5:
                    data['name'] = h5.get_text().strip()

            profile_link = card.find('a', class_='user-profile-link')
            if profile_link:
                data['profile_url'] = profile_link['href']

            role_elem = card.find('span', class_='role')
            if role_elem:
                data['role'] = role_elem.get_text().strip()

            stats = {}
            projects_elem = card.find('li', class_='participant-software-count')
            if projects_elem:
                strong = projects_elem.find('strong')
                if strong:
                    stats['projects'] = int(strong.get_text().strip())

            followers_elem = card.find('li', class_='participant-followers-count')
            if followers_elem:
                strong = followers_elem.find('strong')
                if strong:
                    stats['followers'] = int(strong.get_text().strip())

            achievements_elem = card.find('li', class_='participant-achievements-count')
            if achievements_elem:
                strong = achievements_elem.find('strong')
                if strong:
                    stats['achievements'] = int(strong.get_text().strip())

            if stats:
                data['stats'] = stats

            skills_section = card.find_all('span', class_='cp-tag')
            if skills_section:
                skills = []
                for skill_tag in skills_section:
                    skill_link = skill_tag.find('a')
                    if skill_link:
                        skills.append(skill_link.get_text().strip())
                if skills:
                    data['skills'] = skills

            main_content = card.find('div', class_='main-content')
            if main_content:
                headers = main_content.find_all('h6')
                for header in headers:
                    header_text = header.get_text().strip().lower()

                    if 'interest' in header_text:
                        interests_list = header.find_next('ul')
                        if interests_list:
                            interests = []
                            for li in interests_list.find_all('li'):
                                interest_tag = li.find('span', class_='cp-tag')
                                if interest_tag:
                                    interest_link = interest_tag.find('a')
                                    if interest_link:
                                        interests.append(interest_link.get_text().strip())
                            if interests:
                                data['interests'] = interests

            photo_elem = card.find('img', class_='user-photo')
            if photo_elem and photo_elem.get('src'):
                photo_url = photo_elem['src']
                if photo_url.startswith('//'):
                    photo_url = 'https:' + photo_url
                data['photo_url'] = photo_url

        except Exception as e:
            print(f"Error extracting participant data: {e}")

        return data


@app.route('/')
def index():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Matcha Backend API is running',
        'endpoints': {
            'scrape': '/api/scrape',
            'find_teammates': '/api/find-teammates',
            'stats': '/api/stats'
        }
    })


@app.route('/api/scrape', methods=['POST'])
def scrape_and_store():
    """Scrape hackathon participants and store in MongoDB"""
    try:
        data = request.get_json()
        hackathon_url = data.get('url', '').strip()

        if not hackathon_url:
            return jsonify({'error': 'URL is required'}), 400

        # Validate URL
        if 'devpost.com' not in hackathon_url:
            return jsonify({'error': 'Invalid Devpost URL'}), 400

        # Initialize scraper
        scraper = DevpostScraperService()

        # Scrape participants
        participants, hackathon_name, error = scraper.scrape_participants(hackathon_url, DEVPOST_COOKIES)

        if error:
            return jsonify({'error': error}), 500

        if not participants:
            return jsonify({'error': 'No participants found'}), 404

        # Store in MongoDB
        client = MongoClient(MONGODB_URI)
        db = client[DATABASE_NAME]
        collection = db[COLLECTION_NAME]

        # Clear entire MongoDB collection before inserting new data
        collection.delete_many({})
        print(f"Cleared entire MongoDB collection before inserting new data")

        # Insert new data
        if participants:
            collection.insert_many(participants)

        # Create indexes
        collection.create_index('hackathon')
        collection.create_index('participant_id')
        collection.create_index('skills')

        client.close()

        return jsonify({
            'success': True,
            'hackathon': hackathon_name,
            'participants_count': len(participants),
            'message': f'Successfully scraped and stored {len(participants)} participants!'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get statistics from MongoDB"""
    try:
        client = MongoClient(MONGODB_URI)
        db = client[DATABASE_NAME]
        collection = db[COLLECTION_NAME]

        total = collection.count_documents({})

        # Get hackathon breakdown
        pipeline = [
            {"$group": {"_id": "$hackathon", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        hackathons = list(collection.aggregate(pipeline))

        client.close()

        return jsonify({
            'total_participants': total,
            'hackathons': [{'name': h['_id'], 'count': h['count']} for h in hackathons]
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/find-teammates', methods=['POST'])
def find_teammates():
    """Find compatible teammates using Gemini AI"""
    try:
        if not GEMINI_API_KEY:
            return jsonify({'error': 'Gemini API key not configured'}), 500

        data = request.get_json()
        hackathon = data.get('hackathon', '').strip()

        if not hackathon:
            return jsonify({'error': 'Hackathon name is required'}), 400

        # Get the first participant (the user who scraped)
        client = MongoClient(MONGODB_URI)
        db = client[DATABASE_NAME]
        collection = db[COLLECTION_NAME]

        # Get the first participant from this hackathon (sorted by when they were inserted)
        current_user = collection.find_one({'hackathon': hackathon})

        if not current_user:
            client.close()
            return jsonify({'error': 'No participants found for this hackathon'}), 404

        current_user_id = current_user.get('participant_id')
        client.close()

        # Use Gemini to find matches
        matcher = TeammateMatcher(GEMINI_API_KEY, MONGODB_URI)

        try:
            matches = matcher.find_teammates(
                current_user_id=current_user_id,
                hackathon=hackathon,
                top_n=10
            )

            return jsonify({
                'success': True,
                'current_user': {
                    'name': current_user.get('name'),
                    'role': current_user.get('role'),
                    'skills': current_user.get('skills', []),
                    'interests': current_user.get('interests', [])
                },
                'matches': matches
            })

        finally:
            matcher.close()

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/search-teammates', methods=['POST'])
def search_teammates():
    """Search for teammates using custom AI query"""
    try:
        if not GEMINI_API_KEY:
            return jsonify({'error': 'Gemini API key not configured'}), 500

        data = request.get_json()
        hackathon = data.get('hackathon', '').strip()
        search_query = data.get('search_query', '').strip()
        current_user_id = data.get('current_user_id', '').strip()

        if not hackathon:
            return jsonify({'error': 'Hackathon name is required'}), 400

        if not search_query:
            return jsonify({'error': 'Search query is required'}), 400

        # Get current user if provided
        client = MongoClient(MONGODB_URI)
        db = client[DATABASE_NAME]
        collection = db[COLLECTION_NAME]

        current_user = None
        if current_user_id:
            current_user = collection.find_one({
                'participant_id': current_user_id,
                'hackathon': hackathon
            })

        # If no current user provided or found, get the first participant
        if not current_user:
            current_user = collection.find_one({'hackathon': hackathon})

        if not current_user:
            client.close()
            return jsonify({'error': 'No participants found for this hackathon'}), 404

        client.close()

        # Use Gemini to find matches with custom search query
        matcher = TeammateMatcher(GEMINI_API_KEY, MONGODB_URI)

        try:
            matches = matcher.find_teammates_with_query(
                current_user_id=current_user.get('participant_id'),
                hackathon=hackathon,
                search_query=search_query,
                top_n=10
            )

            return jsonify({
                'success': True,
                'matches': matches
            })

        finally:
            matcher.close()

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
