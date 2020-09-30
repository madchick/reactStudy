import pymongo
from pymongo.errors import BulkWriteError

connection = pymongo.MongoClient("mongodb://127.0.0.1", 27017)
db = connection["maintenance"]
collection = db["users"]


data = list()
data.append({
    "id" : "admin",
    "pwd" : "82f6352667b88176d7cda64872e21526f1c4c6174c9fad33f2b0c39a3b7d91e4"
    })



try:
    collection.insert_many(data) 
except BulkWriteError as bwe:
    print(bwe.details)
