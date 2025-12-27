from pymongo import MongoClient
import os

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://mongodb:27017/ctf")

client = MongoClient(MONGODB_URI)
db = client.get_database()

# Collections
users_collection = db["users"]
sessions_collection = db["sessions"]
oauth_states = db["oauth_states"]
