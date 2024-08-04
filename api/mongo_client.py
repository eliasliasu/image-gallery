import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv(dotenv_path="./.env.local")

MONGO_URL = os.environ.get("MONGO_URL", "mongo")
MONGO_USERNAME = os.environ.get("MONGO_USERNAME", "root")
MONGO_PASSWORD = os.environ.get("MONGO_PASSWORD", "")
MONGO_PORT = os.environ.get("MONGO_PORT", 27017)




mongo_client = MongoClient(
  host=MONGO_URL,
  port=MONGO_PORT,
  username=MONGO_USERNAME,
  password=MONGO_PASSWORD
)

def insert_test_document():
  """Inserts sample document to the test_collection in the test database"""
  db = mongo_client.test
  test_collection = db.test_collection
  record = {"name": "Elias", "developer": True}
  res = test_collection.insert_one(record)
  print(res)