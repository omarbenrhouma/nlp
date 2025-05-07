from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from db import offres_col
from datetime import datetime
from db import offres_col, candidatures_col  # importer candidatures_col
from bson import ObjectId

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


@offres_bp.route("/<offre_id>/candidatures", methods=["GET"])
def get_candidatures_for_offre(offre_id):
    """
    Renvoie toutes les candidatures (y compris score) pour une offre donnée
    """
    # On suppose que offre_id est déjà sous forme de string
    # (ex: "645ab123..."). Si besoin, on convertit en ObjectId
    # Si offre_id est un simple string, pas besoin de conversion
    # A adapter selon votre schema

    candidatures = list(candidatures_col.find({"offre_id": offre_id}))
    for c in candidatures:
        c["_id"] = str(c["_id"])
        # Convertir user_id si besoin
        if "user_id" in c:
            c["user_id"] = str(c["user_id"])
    return jsonify(candidatures), 200