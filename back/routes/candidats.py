from flask import Blueprint, request, jsonify
from db import candidats_col

candidats_bp = Blueprint("candidats", __name__)

@candidats_bp.route("/ajouter", methods=["POST"])
def ajouter_candidat():
    data = request.get_json()
    if not data.get("nom") or not data.get("email"):
        return jsonify({"error": "Champs requis"}), 400
    candidats_col.insert_one(data)
    return jsonify({"message": "Candidat ajouté"}), 201

@candidats_bp.route("/", methods=["GET"])
def get_candidats():
    candidats = list(candidats_col.find())
    for c in candidats:
        c["_id"] = str(c["_id"])
    return jsonify(candidats)
