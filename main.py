import requests
from bs4 import BeautifulSoup
import json
from typing import List, Dict
import time

class DevpostScraper:
    def __init__(self, cookies=None):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })

        # Add cookies if provided
        if cookies:
            for name, value in cookies.items():
                self.session.cookies.set(name, value)

    def scrape_participants(self, url: str) -> List[Dict]:
        """
        Scrape participant information from a Devpost participants page.

        Args:
            url: The Devpost participants page URL

        Returns:
            List of dictionaries containing participant information
        """
        participants = []

        try:
            response = self.session.get(url)
            response.raise_for_status()

            soup = BeautifulSoup(response.content, 'html.parser')

            # Check if login is required
            if "Please log in" in soup.text:
                print(f"⚠️  Authentication required for: {url}")
                print("This page requires Devpost login to view participants.")
                return participants

            # Find participant containers
            participant_cards = soup.find_all('div', class_='participant')

            print(f"Found {len(participant_cards)} participants")

            for card in participant_cards:
                participant_data = self._extract_participant_data(card)
                if participant_data:
                    participants.append(participant_data)

        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")

        return participants

    def _extract_participant_data(self, card) -> Dict:
        """Extract participant information from a card element."""
        data = {}

        try:
            # Extract participant ID
            participant_id = card.get('data-participant-id')
            if participant_id:
                data['participant_id'] = participant_id

            # Extract name from h5 inside user-name div
            name_elem = card.find('div', class_='user-name')
            if name_elem:
                h5 = name_elem.find('h5')
                if h5:
                    data['name'] = h5.get_text().strip()

            # Extract profile link
            profile_link = card.find('a', class_='user-profile-link')
            if profile_link:
                data['profile_url'] = profile_link['href']

            # Extract role (e.g., "Full-stack developer")
            role_elem = card.find('span', class_='role')
            if role_elem:
                data['role'] = role_elem.get_text().strip()

            # Extract stats (projects, followers, achievements)
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

            # Extract interests (look for section with interests heading)
            main_content = card.find('div', class_='main-content')
            if main_content:
                # Find all h6 headers to locate sections
                headers = main_content.find_all('h6')
                for header in headers:
                    header_text = header.get_text().strip().lower()

                    if 'interest' in header_text:
                        # Find the next ul after this header
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

    def scrape_multiple_hackathons(self, urls: List[str]) -> Dict[str, List[Dict]]:
        """
        Scrape participants from multiple hackathon pages.

        Args:
            urls: List of Devpost participant page URLs

        Returns:
            Dictionary mapping hackathon names to participant lists
        """
        results = {}

        for url in urls:
            # Extract hackathon name from URL
            hackathon_name = url.split('/')[2].split('.')[0]
            print(f"\n🔍 Scraping {hackathon_name}...")

            participants = self.scrape_participants(url)
            results[hackathon_name] = participants

            # Be polite and avoid rate limiting
            time.sleep(2)

        return results

    def save_to_json(self, data: Dict, filename: str = 'participants.json'):
        """Save scraped data to a JSON file."""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"\n✅ Data saved to {filename}")


def main():
    # Example URLs
    urls = [
        'https://hacktx2025.devpost.com/participants',
        'https://hackutd-2025.devpost.com/participants'
    ]

    # Authentication cookies from your browser session
    cookies = {
        'jwt': 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6OTUwNzE4N30.P-kx9z10_Xkd-80cKiO7YvUx2FPdll1ZTCAtOcxVQKQ',
        'remember_user_token': 'W1s5NTA3MTg3XSwiaEV1c3RrcGFRb0JzQ1ozaVloenEiLCIxNzY3MjgyMzA5LjE5OTE5Il0%3D--08dcc06f0434b060ea3a36da99b969a0863a4381',
        '_devpost': 'SlJMaDE0WDFFWXdzRnB6YkNlbG82UXJaZUZ5UFhuK1V6NWxGRWo0WTZ6TVAvMXV4QmhGZW90dWh3R0VEaFpzTG5IT3hoWDh6MlZpa1pHeVE0Q0RIN1BvRkJTalBaVzZQemNtSjJkUDQxbzdtdWFldFVtMDZVUGU3b3NaeTFMTmcwQXV5RnBhYXJYSm9WUVRiRGMrRWJyNHUyM2tOYkxlQ1lieE80Vk1KL2Q0eGMyYVYxQWd3RitBTWJRalBqaVJpSEVwZGdIRFRPdytRSG9GbE5Ld1pRL3dZdzdHK0xFRlBwbHFsSmNKK3pvN1VsSmxNZ2dQSDZweGtwbktCR0hmbXpCcXRrb1g2cTkzRDBzSG52WFJ3eE1zdVFkakt3ME5PaVZiY3ZtcVpCTmZmcUZaNDZ6OS83UjZDckNTOGVWM29hbEJxbDVXSHEyY3ZCUktuQmtpSnlmTjBzK05pVXJ0YzRxNGx0ZmhIdldTVVpYS2hITVhqWWNOUWVYUUJWWndNckJKTFdvak5hL3ZJVXVYZnJTYzR1Y2gzODhYczV3SGgxNm53cHdyUDJkWVJ6d3BpOEpvcTkvWTh0QmdIdGRTT0MzOXIzKy83TEZoUTdvQmZ3MjZxTExVdFFNeEpveXRaVUFUcFdaNVQybGdNcGhhRmtRTlJBOVlIU3BLSUk4TmRXYWE5STl2a3VncUlLL1krMFIxZ0JSTjFiRXozZkZNY0pUeXBwRVNvakNWVHVWejhuMFdaNXEzRlVJRXg5WUFKRVJ4MUJ0djAya2YwZFFIaUgzaVdVeExITWV6RW15Q2RwK1lZK0FkOFlkTT0tLXNJNjlOTnkvcVd3SFpFV3BoNFk4NUE9PQ%3D%3D--dcfd7291b4da71cad63b01fdcd8f5844eb5a3686',
        'aws-waf-token': '3b85b5f3-f100-4cd5-b9d2-1df93816b6c9:EQoAk+iTY7oCAAAA:6QpeMmOEcwcl3z2mL8OrFP/quJ+GrhUKWsX/joAxvC7eOjiOersSLpcas1nOGiFOr/xgxsiCRUirc+T++aJrjNgPEpxXjIo/31djntuIR+fP5ez1zhZdKc9XrF1RIShvo1/yVtqqXKDR42kqd8vobkp9jt9FdVWMcKtlYfqhoxgoBBthOko7AJP49Dx13nLqE4fu7j0nW2/jeuUfri5I1UB4SWkl+dLs0or4Cbx0fy/+tBI2mp7KG68BWIuSGavfxCI=',
        '_ga': 'GA1.2.1951265362.1767282304',
    }

    scraper = DevpostScraper(cookies=cookies)

    print("🚀 Starting Devpost scraper...")
    print("=" * 50)

    # Scrape all hackathons
    results = scraper.scrape_multiple_hackathons(urls)

    # Print summary
    print("\n" + "=" * 50)
    print("📊 Summary:")
    for hackathon, participants in results.items():
        print(f"  {hackathon}: {len(participants)} participants")

    # Save to JSON
    scraper.save_to_json(results)

    # Print sample data if available
    for hackathon, participants in results.items():
        if participants:
            print(f"\n📝 Sample participant from {hackathon}:")
            print(json.dumps(participants[0], indent=2))
            break


if __name__ == "__main__":
    main()
