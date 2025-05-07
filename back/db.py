from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["smartrecruit"]

users_col = db["users"]
offres_col = db["offres"]
candidatures_col = db["candidatures"]
candidats_col = db["candidats"]

