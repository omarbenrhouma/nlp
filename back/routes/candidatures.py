from flask import Blueprint, request, jsonify
from bson import ObjectId
from db import candidatures_col
from services.resume_processor import process_resume
from datetime import datetime

candidatures_bp = Blueprint("candidatures", __name__)

@candidatures_bp.route("/upload", methods=["POST"])
def upload_cv():
    file = request.files["cv"]
    offre_id = request.form.get("offre_id")

    if file and offre_id:
        result = process_resume(file, ObjectId(offre_id))
        candidature = {
            "nom_fichier": file.filename,
            "contenu": result["text"],
            "score": result["score"],
            "offre_id": offre_id,
            "date_candidature": datetime.utcnow()
        }
        candidatures_col.insert_one(candidature)
        return jsonify({"message": "CV analysé et stocké"}), 201
    return jsonify({"error": "Fichier ou offre_id manquant"}), 400
