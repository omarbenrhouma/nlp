import fitz
from datetime import datetime
from utils.nlp_utils import (
    clean_text, extract_resume_info, extract_job_details,
    compute_similarity_score, format_info,
    get_section_embeddings, merge_embeddings
)

def extract_text_from_pdf(file):
    text = ""
    pdf = fitz.open(stream=file.read(), filetype="pdf")
    for page in pdf:
        text += page.get_text()
    pdf.close()
    return text

def process_full_resume_data(file, offre=None):
    try:
        raw_text = extract_text_from_pdf(file)
        cleaned_text = clean_text(raw_text)

        # 🔍 Extraction infos
        resume_info = extract_resume_info(cleaned_text)
        job_info = extract_job_details(offre["description"]) if offre else {}

        print("✅ DEBUG - Matched experiences:", resume_info.get("Experience"))

        # 🔢 Embeddings par section
        resume_embeddings = get_section_embeddings(resume_info)
        job_embeddings = get_section_embeddings(job_info)

        resume_vector = merge_embeddings(resume_embeddings)
        job_vector = merge_embeddings(job_embeddings)

        score = compute_similarity_score(resume_info, job_info) if job_info else 0.0

        return {
            "raw_text": raw_text,
            "cleaned_text": cleaned_text,
            "resume_info": resume_info,
            "job_info": job_info,
            "score": round(score, 4),
            "resume_embedding": resume_vector.tolist() if resume_vector is not None else [],
            "job_embedding": job_vector.tolist() if job_vector is not None else [],
        }

    except Exception as e:
        print("❌ Erreur dans process_full_resume_data:", repr(e))
        raise e
