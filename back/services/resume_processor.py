import fitz  # PyMuPDF
from utils.nlp_utils import compute_similarity
from db import offres_col

# 🧠 Fonction d’extraction brute
def extract_text_from_pdf(path):
    text = ""
    doc = fitz.open(path)
    for page in doc:
        text += page.get_text()
    doc.close()
    return text

# 📥 Fonction appelée lors de l’upload d’un CV
def process_resume(file, offre_id=None):
    text = ""
    pdf = fitz.open(stream=file.read(), filetype="pdf")
    for page in pdf:
        text += page.get_text()

    # Matching avec une offre si ID fourni
    score = None
    if offre_id:
        offre = offres_col.find_one({"_id": offre_id})  # ObjectId si nécessaire
        if offre and "description" in offre:
            score = compute_similarity(text, offre["description"])
    
    return {
        "text": text,
        "score": round(score, 2) if score else None
    }
