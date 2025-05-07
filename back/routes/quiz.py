from flask import Blueprint, request, jsonify
from bson import ObjectId
from db import candidatures_col
from services.quiz_generator import DolphinChatbot
import json

quiz_bp = Blueprint("quiz", __name__)
chatbot = DolphinChatbot()

@quiz_bp.route("/generate", methods=["OPTIONS", "POST"])
def generate_quiz():
    if request.method == "OPTIONS":
        return '', 200

    try:
        data = request.get_json()
        candidature_id = data.get("candidature_id")

        if not candidature_id:
            return jsonify({"error": "Candidature ID manquant", "success": False}), 400

        candidature = candidatures_col.find_one({"_id": ObjectId(candidature_id)})

        if not candidature:
            return jsonify({"error": "Candidature non trouvée", "success": False}), 404

        resume_info = candidature.get("resume_info")
        job_info = candidature.get("job_info")

        if not resume_info or not job_info:
            return jsonify({"error": "Informations incomplètes", "success": False}), 400

        # ✅ Ici on génère directement toutes les questions
        quiz_text = chatbot.generate_questions(resume_info, job_info)  # Attention: pas "generate_question" mais "generate_questions"
        
        # ✅ Parser directement
        quiz = json.loads(quiz_text)

        return jsonify({
            "quiz": quiz,
            "success": True
        }), 200

    except Exception as e:
        print(f"❌ Erreur generate_quiz: {str(e)}")
        return jsonify({"error": str(e), "success": False}), 500
