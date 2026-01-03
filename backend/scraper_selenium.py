from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import json
import time
from typing import List, Dict

class DevpostSeleniumScraper:
    def __init__(self):
        # Setup Chrome options
        self.options = Options()
        self.options.add_argument('--headless')  # Run in background
        self.options.add_argument('--no-sandbox')
        self.options.add_argument('--disable-dev-shm-usage')
        self.options.add_argument('user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')

    def scrape_with_cookies(self, url: str, cookies: List[Dict]) -> List[Dict]:
        """
        Scrape participants using Selenium with infinite scroll support.

        Args:
            url: The Devpost participants page URL
            cookies: List of cookie dictionaries with 'name' and 'value' keys

        Returns:
            List of participant data dictionaries
        """
        driver = webdriver.Chrome(options=self.options)

        try:
            # First, navigate to the domain to set cookies
            base_url = url.split('/participants')[0]
            driver.get(base_url)

            # Add cookies
            for cookie in cookies:
                if 'name' in cookie and 'value' in cookie:
                    cookie_dict = {
                        'name': cookie['name'],
                        'value': cookie['value'],
                        'domain': cookie.get('domain', '.devpost.com')
                    }
                    try:
                        driver.add_cookie(cookie_dict)
                    except Exception as e:
                        print(f"Failed to add cookie {cookie['name']}: {e}")

            # Now navigate to the participants page
            driver.get(url)
            time.sleep(3)  # Wait for initial load

            # Check if we're logged in
            if "Please log in" in driver.page_source:
                print("⚠️  Authentication failed - cookies may be expired")
                return []

            print("✓ Successfully authenticated")

            # Scroll to load all participants
            last_height = driver.execute_script("return document.body.scrollHeight")
            participants_count = 0

            print("Scrolling to load all participants...")

            while True:
                # Scroll down to bottom
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

                # Wait for new content to load
                time.sleep(2)

                # Count participants
                current_count = len(driver.find_elements(By.CLASS_NAME, "participant"))
                if current_count > participants_count:
                    print(f"Loaded {current_count} participants...")
                    participants_count = current_count
                else:
                    # No new participants loaded, we might be done
                    # Try scrolling one more time to be sure
                    new_height = driver.execute_script("return document.body.scrollHeight")
                    if new_height == last_height:
                        break
                    last_height = new_height
                    continue

                last_height = driver.execute_script("return document.body.scrollHeight")

            print(f"Finished scrolling. Total participants found: {participants_count}")

            # Parse the fully loaded page
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            participants = self._extract_all_participants(soup)

            return participants

        finally:
            driver.quit()

    def _extract_all_participants(self, soup: BeautifulSoup) -> List[Dict]:
        """Extract all participant data from the page."""
        participants = []
        participant_cards = soup.find_all('div', class_='participant')

        print(f"Extracting data from {len(participant_cards)} participants...")

        for i, card in enumerate(participant_cards, 1):
            if i % 50 == 0:
                print(f"  Processed {i} participants...")

            participant_data = self._extract_participant_data(card)
            if participant_data:
                participants.append(participant_data)

        return participants

    def _extract_participant_data(self, card) -> Dict:
        """Extract participant information from a card element."""
        data = {}

        try:
            # Extract participant ID
            participant_id = card.get('data-participant-id')
            if participant_id:
                data['participant_id'] = participant_id

            # Extract name
            name_elem = card.find('div', class_='user-name')
            if name_elem:
                h5 = name_elem.find('h5')
                if h5:
                    data['name'] = h5.get_text().strip()

            # Extract profile link
            profile_link = card.find('a', class_='user-profile-link')
            if profile_link:
                data['profile_url'] = profile_link['href']

            # Extract role
            role_elem = card.find('span', class_='role')
            if role_elem:
                data['role'] = role_elem.get_text().strip()

            # Extract stats
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

            # Extract skills
            skills_section = card.find_all('span', class_='cp-tag')
            if skills_section:
                skills = []
                for skill_tag in skills_section:
                    skill_link = skill_tag.find('a')
                    if skill_link:
                        skills.append(skill_link.get_text().strip())
                if skills:
                    data['skills'] = skills

            # Extract interests
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

            # Extract photo URL
            photo_elem = card.find('img', class_='user-photo')
            if photo_elem and photo_elem.get('src'):
                photo_url = photo_elem['src']
                if photo_url.startswith('//'):
                    photo_url = 'https:' + photo_url
                data['photo_url'] = photo_url

        except Exception as e:
            print(f"Error extracting participant data: {e}")

        return data


def main():
    # URLs to scrape
    urls = [
        'https://hacktx2025.devpost.com/participants',
        'https://hackutd-2025.devpost.com/participants'
    ]

    # Cookies for authentication
    cookies = [
        {'name': 'jwt', 'value': 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6OTUwNzE4N30.P-kx9z10_Xkd-80cKiO7YvUx2FPdll1ZTCAtOcxVQKQ'},
        {'name': 'remember_user_token', 'value': 'W1s5NTA3MTg3XSwiaEV1c3RrcGFRb0JzQ1ozaVloenEiLCIxNzY3MjgyMzA5LjE5OTE5Il0%3D--08dcc06f0434b060ea3a36da99b969a0863a4381'},
        {'name': '_devpost', 'value': 'SlJMaDE0WDFFWXdzRnB6YkNlbG82UXJaZUZ5UFhuK1V6NWxGRWo0WTZ6TVAvMXV4QmhGZW90dWh3R0VEaFpzTG5IT3hoWDh6MlZpa1pHeVE0Q0RIN1BvRkJTalBaVzZQemNtSjJkUDQxbzdtdWFldFVtMDZVUGU3b3NaeTFMTmcwQXV5RnBhYXJYSm9WUVRiRGMrRWJyNHUyM2tOYkxlQ1lieE80Vk1KL2Q0eGMyYVYxQWd3RitBTWJRalBqaVJpSEVwZGdIRFRPdytRSG9GbE5Ld1pRL3dZdzdHK0xFRlBwbHFsSmNKK3pvN1VsSmxNZ2dQSDZweGtwbktCR0hmbXpCcXRrb1g2cTkzRDBzSG52WFJ3eE1zdVFkakt3ME5PaVZiY3ZtcVpCTmZmcUZaNDZ6OS83UjZDckNTOGVWM29hbEJxbDVXSHEyY3ZCUktuQmtpSnlmTjBzK05pVXJ0YzRxNGx0ZmhIdldTVVpYS2hITVhqWWNOUWVYUUJWWndNckJKTFdvak5hL3ZJVXVYZnJTYzR1Y2gzODhYczV3SGgxNm53cHdyUDJkWVJ6d3BpOEpvcTkvWTh0QmdIdGRTT0MzOXIzKy83TEZoUTdvQmZ3MjZxTExVdFFNeEpveXRaVUFUcFdaNVQybGdNcGhhRmtRTlJBOVlIU3BLSUk4TmRXYWE5STl2a3VncUlLL1krMFIxZ0JSTjFiRXozZkZNY0pUeXBwRVNvakNWVHVWejhuMFdaNXEzRlVJRXg5WUFKRVJ4MUJ0djAya2YwZFFIaUgzaVdVeExITWV6RW15Q2RwK1lZK0FkOFlkTT0tLXNJNjlOTnkvcVd3SFpFV3BoNFk4NUE9PQ%3D%3D--dcfd7291b4da71cad63b01fdcd8f5844eb5a3686'},
        {'name': 'aws-waf-token', 'value': '3b85b5f3-f100-4cd5-b9d2-1df93816b6c9:EQoAk+iTY7oCAAAA:6QpeMmOEcwcl3z2mL8OrFP/quJ+GrhUKWsX/joAxvC7eOjiOersSLpcas1nOGiFOr/xgxsiCRUirc+T++aJrjNgPEpxXjIo/31djntuIR+fP5ez1zhZdKc9XrF1RIShvo1/yVtqqXKDR42kqd8vobkp9jt9FdVWMcKtlYfqhoxgoBBthOko7AJP49Dx13nLqE4fu7j0nW2/jeuUfri5I1UB4SWkl+dLs0or4Cbx0fy/+tBI2mp7KG68BWIuSGavfxCI='},
        {'name': '_ga', 'value': 'GA1.2.1951265362.1767282304'},
    ]

    scraper = DevpostSeleniumScraper()
    results = {}

    print("🚀 Starting Devpost Selenium scraper...")
    print("=" * 70)

    for url in urls:
        hackathon_name = url.split('/')[2].split('.')[0]
        print(f"\n🔍 Scraping {hackathon_name}...")
        print("-" * 70)

        participants = scraper.scrape_with_cookies(url, cookies)
        results[hackathon_name] = participants

        print(f"✅ Collected {len(participants)} participants from {hackathon_name}")

    # Save results
    output_file = 'participants_full.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print("\n" + "=" * 70)
    print("📊 Summary:")
    for hackathon, participants in results.items():
        print(f"  {hackathon}: {len(participants)} participants")

    print(f"\n✅ Data saved to {output_file}")

    # Print sample
    for hackathon, participants in results.items():
        if participants:
            print(f"\n📝 Sample participant from {hackathon}:")
            print(json.dumps(participants[0], indent=2))
            break


if __name__ == "__main__":
    main()
