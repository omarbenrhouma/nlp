from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["smartrecruit"]

offres_col = db["offres"]
candidatures_col = db["candidatures"]
candidats_col = db["candidats"]
