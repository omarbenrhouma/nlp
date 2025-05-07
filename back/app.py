from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp
from routes.offres import offres_bp
from routes.candidatures import candidatures_bp
from routes.candidats import candidats_bp
from routes.quiz import quiz_bp

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "CHANGE_THIS_SECRET"

    # ✅ Activer CORS pour autoriser uniquement le front React
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

    # ✅ Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(offres_bp, url_prefix="/api/offres")
    app.register_blueprint(candidatures_bp, url_prefix="/api/candidatures")
    app.register_blueprint(candidats_bp, url_prefix="/api/candidats")
    app.register_blueprint(quiz_bp, url_prefix="/api/quiz")  # 🔥 corrigé ici

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
