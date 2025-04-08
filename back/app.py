from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

    from routes.offres import offres_bp
    from routes.candidatures import candidatures_bp
    from routes.candidats import candidats_bp

    app.register_blueprint(offres_bp, url_prefix="/api/offres")
    app.register_blueprint(candidatures_bp, url_prefix="/api/candidatures")
    app.register_blueprint(candidats_bp, url_prefix="/api/candidats")

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
