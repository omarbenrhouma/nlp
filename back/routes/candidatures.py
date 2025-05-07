from flask import Blueprint, request, jsonify
from bson import ObjectId
from db import candidatures_col, offres_col
from services.resume_processor import process_full_resume_data
from werkzeug.utils import secure_filename
from datetime import datetime
import os

candidatures_bp = Blueprint("candidatures", __name__)
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploaded_cvs")

@candidatures_bp.route("/upload", methods=["POST"])
def upload_cv():
    try:
        cv_file = request.files.get("cv")
        offre_id = request.form.get("offre_id")
        user_id = request.form.get("user_id")
        candidate_name = request.form.get("candidate_name")
        candidate_email = request.form.get("candidate_email")

        if not cv_file or not offre_id or not user_id:
            return jsonify({"error": "Champs requis manquants"}), 400

        filename = secure_filename(cv_file.filename)
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
        path = os.path.join(UPLOAD_FOLDER, filename)
        cv_file.save(path)
        cv_file.seek(0)

        offre = offres_col.find_one({"_id": ObjectId(offre_id)})
        result = process_full_resume_data(cv_file, offre)

        score = result["score"]
        launch_quiz = score > 0.2

        candidature = {
            "offre_id": offre_id,
            "user_id": user_id,
            "candidate_name": candidate_name,
            "candidate_email": candidate_email,
            "cv_filename": filename,
            "score": score,
            "contenu": result["cleaned_text"],
            "uploaded_at": datetime.utcnow(),
            "resume_info": result["resume_info"],
            "job_info": result["job_info"],
            "resume_embedding": result["resume_embedding"],
            "job_embedding": result["job_embedding"]
        }

        # ✅ Ici on stocke le résultat
        saved = candidatures_col.insert_one(candidature)

        return jsonify({
            "message": "CV traité avec succès",
            "score": score,
            "launch_quiz": launch_quiz,
            "candidature_id": str(saved.inserted_id)  # ✅ ici corrigé
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@candidatures_bp.route("/<candidature_id>", methods=["GET"])
def get_candidature(candidature_id):
    try:
        candidature = candidatures_col.find_one({"_id": ObjectId(candidature_id)})
        if not candidature:
            return jsonify({"error": "Candidature non trouvée"}), 404

        candidature["_id"] = str(candidature["_id"])  # Convertir ObjectId en string
        return jsonify(candidature), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500