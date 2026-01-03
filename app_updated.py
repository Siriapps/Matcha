# Updated Flask Backend with CORS and API prefix for React integration
# This file shows the changes needed to integrate with React frontend

# Changes needed in app.py:

# 1. Add flask-cors import at the top:
from flask_cors import CORS

# 2. Update Flask app initialization:
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# 3. Update route prefixes from / to /api/:
# OLD: @app.route('/scrape', methods=['POST'])
# NEW: @app.route('/api/scrape', methods=['POST'])

# OLD: @app.route('/find-teammates', methods=['POST'])
# NEW: @app.route('/api/find-teammates', methods=['POST'])

# OLD: @app.route('/stats', methods=['GET'])
# NEW: @app.route('/api/stats', methods=['GET'])

# 4. Remove the old template route (not needed for React):
# DELETE: @app.route('/')
#         def index():
#             return render_template('index.html')

# 5. Add React build serving (for production):
@app.route('/')
def serve_react():
    return send_from_directory(app.static_folder, 'index.html')

# Full updated routes:

@app.route('/api/scrape', methods=['POST'])
def scrape_and_store():
    """Scrape hackathon participants and store in MongoDB"""
    # ... existing code ...

@app.route('/api/find-teammates', methods=['POST'])
def find_teammates():
    """Find compatible teammates using Gemini AI"""
    # ... existing code ...

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get statistics from MongoDB"""
    # ... existing code ...
