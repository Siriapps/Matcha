# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account (or log in if you have one)
3. Choose the **FREE tier** (M0 Sandbox - 512 MB storage)

## Step 2: Create a Cluster

1. After logging in, click **"Create"** or **"Build a Database"**
2. Choose **M0 FREE** tier
3. Select a cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region close to you
5. Give your cluster a name (e.g., "devpost-cluster")
6. Click **"Create Cluster"** (takes 3-5 minutes to provision)

## Step 3: Create Database User

1. In the left sidebar, go to **Database Access** under "Security"
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username (e.g., `devpost_user`)
5. Click **"Autogenerate Secure Password"** and **copy it** somewhere safe
6. Under "Database User Privileges", select **"Read and write to any database"**
7. Click **"Add User"**

## Step 4: Configure Network Access

1. In the left sidebar, go to **Network Access** under "Security"
2. Click **"Add IP Address"**
3. For testing, click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ For production, only allow specific IPs
4. Click **"Confirm"**

## Step 5: Get Connection String

1. Go back to **Database** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Python"** and version **"3.12 or later"**
5. Copy the connection string (looks like this):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` with your database username
7. Replace `<password>` with the password you copied earlier

**Example:**
```
mongodb+srv://devpost_user:MySecurePass123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

## Step 6: Install Python MongoDB Driver

```bash
pip install pymongo[srv]
```

The `[srv]` part is needed for MongoDB Atlas connections.

## Step 7: Upload Data to MongoDB

### Option A: Set environment variable (recommended)
```bash
export MONGODB_URI="your_connection_string_here"
python upload_to_mongodb.py
```

### Option B: Enter when prompted
```bash
python upload_to_mongodb.py
# Then paste your connection string when asked
```

### Option C: Hardcode in script (not recommended for production)
Edit `upload_to_mongodb.py` and replace line with connection string:
```python
connection_string = "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/..."
```

## Step 8: Verify Data in MongoDB Atlas

1. Go to your MongoDB Atlas dashboard
2. Click **"Browse Collections"** on your cluster
3. You should see:
   - Database: `devpost_data`
   - Collection: `participants`
   - Documents: 1,886 participants

## Sample Queries You Can Run

### In MongoDB Atlas (Browse Collections)

Filter by hackathon:
```json
{ "hackathon": "hacktx2025" }
```

Find Python developers:
```json
{ "skills": "python" }
```

Find people interested in ML/AI:
```json
{ "interests": "Machine Learning/AI" }
```

### In Python Code

```python
from pymongo import MongoClient

client = MongoClient("your_connection_string")
db = client.devpost_data
collection = db.participants

# Find all participants from HackTX 2025
hacktx_participants = collection.find({"hackathon": "hacktx2025"})

# Find participants with Python skills
python_devs = collection.find({"skills": "python"})

# Find participants with most projects
top_builders = collection.find().sort("stats.projects", -1).limit(10)

# Count participants by role
pipeline = [
    {"$group": {"_id": "$role", "count": {"$sum": 1}}},
    {"$sort": {"count": -1}}
]
results = collection.aggregate(pipeline)
```

## Data Structure in MongoDB

Each document will look like this:

```json
{
  "_id": ObjectId("..."),
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

## Useful Indexes Created

The upload script automatically creates these indexes for better query performance:
- `hackathon` - Query participants by hackathon
- `participant_id` - Unique participant lookup
- `name` - Search by name
- `skills` - Find by skills
- `interests` - Find by interests

## Troubleshooting

### "Authentication failed"
- Double-check your username and password in the connection string
- Make sure you copied the password correctly when creating the user

### "Connection timeout"
- Check Network Access settings - make sure your IP is whitelisted
- Try using "Allow Access from Anywhere" for testing

### "ModuleNotFoundError: No module named 'pymongo'"
```bash
pip install pymongo[srv]
```

### "ServerSelectionTimeoutError"
- Check your internet connection
- Verify the cluster is running (green indicator in Atlas dashboard)
- Make sure you're using `pymongo[srv]` for Atlas connections

## Security Best Practices

1. **Never commit connection strings to Git**
   - Use environment variables
   - Add `.env` to `.gitignore`

2. **Rotate passwords regularly**
   - Change database user passwords periodically

3. **Limit IP access**
   - In production, only allow specific IPs
   - Remove "0.0.0.0/0" access

4. **Use read-only users for queries**
   - Create separate users with read-only access for analytics

## Next Steps

- Set up MongoDB Compass (GUI) for easier data exploration
- Create aggregation pipelines for analytics
- Build a REST API with Flask/FastAPI to query the data
- Set up automated backups
