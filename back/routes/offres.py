from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from db import offres_col
from datetime import datetime

offres_bp = Blueprint("offres", __name__)

@offres_bp.route("/ajouter", methods=["POST", "OPTIONS"])
@cross_origin(origin="http://localhost:3000")
def ajouter_offre():
    if request.method == "OPTIONS":
        return '', 200
    data = request.get_json()
    if not data.get("titre") or not data.get("description"):
        return jsonify({"error": "Champs requis"}), 400
    data["date_publication"] = datetime.utcnow()
    offres_col.insert_one(data)
    return jsonify({"message": "Offre ajoutée"}), 201

@offres_bp.route("/", methods=["GET"])
def get_offres():
    offres = list(offres_col.find())
    for o in offres:
        o["_id"] = str(o["_id"])
    return jsonify(offres)
