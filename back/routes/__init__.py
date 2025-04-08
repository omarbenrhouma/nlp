from .offres import offres_bp
from .candidats import candidats_bp
from .candidatures import candidatures_bp

def register_routes(app):
    app.register_blueprint(offres_bp, url_prefix="/api/offres")
    app.register_blueprint(candidats_bp, url_prefix="/api/candidats")
    app.register_blueprint(candidatures_bp, url_prefix="/api/candidatures")
