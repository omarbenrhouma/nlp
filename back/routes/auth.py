# routes/auth.py
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from db import users_col
import jwt, datetime
from flask import current_app

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "candidat")  # défaut : 'candidat'

    if users_col.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = generate_password_hash(password)
    user_doc = {
        "email": email,
        "password": hashed_password,
        "role": role,
    }
    users_col.insert_one(user_doc)

    return jsonify({"message": "Inscription réussie", "user": {
        "email": email,
        "role": role
    }}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = users_col.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    if not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid password"}), 401

    # Génération d’un token JWT si nécessaire
    # (ou on peut juste renvoyer user info)
    token = jwt.encode(
        {
            "user_id": str(user["_id"]),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        },
        current_app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return jsonify({
      "token": token,
      "user": {
        "_id": str(user["_id"]),
        "email": user["email"],
        "role": user["role"]
      }
    }), 200
