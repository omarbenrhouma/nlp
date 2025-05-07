import re
import spacy
import torch
import numpy as np
from sentence_transformers import SentenceTransformer
from transformers import BertTokenizer, BertModel
from torch.nn.functional import cosine_similarity
from dateutil import parser
from datetime import datetime
import spacy
nlp = spacy.load("en_core_web_sm")

MODEL_NAME = "bert-base-uncased"
tokenizer = BertTokenizer.from_pretrained(MODEL_NAME)
model = BertModel.from_pretrained(MODEL_NAME)
def clean_text(text):
    return " ".join(str(text).split()) if text else ""

def extract_location(text):
    # Use regex to extract location after "Location:"
    location_match = re.search(r"Location:\s*([A-Za-z]+\s*(?:[A-Za-z]+)?(?:,\s*[A-Za-z]+)?)", text)
    if location_match:
        return location_match.group(1).strip()

    # Fallback: Use spaCy to extract the first GPE entity
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == "GPE":  # GPE = Geopolitical Entity (City, Country, etc.)
            return ent.text

    # If no location is found, return 'unknown'
    return "unknown"


def calculate_experience(dates):
    """
    Calculate the number of years from the given date range.
    Supports formats like: "TX, February 2011 - March 2013", "April 2010 - January 2011", etc.
    """
    try:
        # Supprimer un éventuel lieu au début (ex: "TX, ")
        dates = re.sub(r"^[A-Za-z]{2,},\s*", "", dates).strip()

        # Découpe par '-'
        parts = [p.strip() for p in dates.split('-')]

        if len(parts) != 2:
            return "Unknown"

        # Convertit les deux dates
        start_date = parser.parse(parts[0])
        end_date = datetime.today() if "present" in parts[1].lower() else parser.parse(parts[1])

        # Durée en années
        months = (end_date.year - start_date.year) * 12 + (end_date.month - start_date.month)
        return round(months / 12, 1)

    except Exception as e:
        print("❌ Error parsing experience dates:", e)
        return "Unknown"

def extract_work_experience(text):
    """
    Extracts multiple job experiences from flattened CV text like:
    'Job Title at Company (Location, Dates) - responsibility1. - responsibility2.'
    """
    pattern = re.compile(
        r"(?P<title>.*?)\s+at\s+(?P<company>[^(\n\r]{2,100})\s*\((?P<location>[^,]+?),\s*(?P<dates>[^)]+)\)\s*((?:-\s?.+?\.\s*)+)",
        re.MULTILINE
    )

    matches = pattern.finditer(text)
    experiences = []

    for idx, match in enumerate(matches):
        title = match.group("title").strip()
        company = match.group("company").strip()
        location = match.group("location").strip()
        dates = match.group("dates").strip()
        responsibilities_block = match.group(5).strip()

        # ✂️ Nettoyage si le titre contient des sections non valides (souvent au début)
        if idx == 0 and any(keyword in title.lower() for keyword in ["resume name", "summary", "aws and azure", "work experience"]):
            parts = title.split("Work Experience:")
            if len(parts) > 1:
                title = parts[-1].strip()
            else:
                title = title.split(".")[-1].strip()  # Si aucun 'Work Experience', on garde que la dernière phrase

        # 🔍 Responsabilités
        responsibilities = re.findall(r"-\s*(.+?)(?:\.|$)", responsibilities_block)

        # ⏳ Années d’expérience
        years_exp = calculate_experience(dates)

        experiences.append({
            "Title": title,
            "Company": company,
            "Location": location,
            "Dates": dates,
            "Years of Experience": years_exp,
            "Responsibilities": responsibilities
        })

    print("✅ DEBUG - Matched experiences (cleaned titles):", experiences)
    return experiences

def extract_education(text):
    """
    Extracts the education section from CV text and identifies institutions and degrees.
    Works even if formatting is inconsistent or labels vary.
    """
    if not isinstance(text, str):
        return None

    # 🔍 Regex plus robuste pour extraire la section Education (minuscule ou sans espace)
    education_pattern = re.compile(r"(education:)(.*?)(skills:|$)", re.IGNORECASE | re.DOTALL)
    match = education_pattern.search(text)

    if not match:
        return None

    education_section = match.group(2).strip()

    doc = nlp(education_section)

    institutions = set()
    degrees = set()

    # Mots-clés typiques de diplômes
    degree_keywords = [
        "bachelor", "master", "ph.d", "phd", "associate", "diploma", "degree",
        "m.sc", "b.sc", "msc", "bsc", "mba", "b.tech", "m.tech"
    ]

    for sent in doc.sents:
        sentence_text = sent.text.lower()

        # 🎓 Détection de diplôme (si un mot-clé apparaît dans la phrase)
        if any(deg in sentence_text for deg in degree_keywords):
            degrees.add(sent.text.strip())

        # 🏛️ Détection d’institutions via entités
        for ent in sent.ents:
            if ent.label_ in {"ORG", "GPE", "FAC"}:
                institutions.add(ent.text.strip())

    return {
        "Institutions": " | ".join(sorted(institutions)) if institutions else None,
        "Degrees": " | ".join(sorted(degrees)) if degrees else None
    }


def extract_skills(text):
    """
    Extracts Technical Skills and Tools & Software from the given resume text.
    Handles variations like "- Tools and Software", quotes, special characters.
    """
    text = text.lower()

    # Extract the Skills section
    skills_section = re.search(r"skills:(.*?)(?:education:|$)", text, re.DOTALL)
    if not skills_section:
        return [], []

    skills_text = skills_section.group(1)

    # Technical Skills
    tech_skills_match = re.search(
        r"(?:technical skills|programming languages|technologies):\s*([\w\s,;|\"/\-]+)",
        skills_text,
        re.IGNORECASE
    )
    if tech_skills_match:
        technical_skills = re.split(r"[,;|]\s*", tech_skills_match.group(1).replace('"', '').strip())
        technical_skills = [re.sub(r"-\s*tools$", "", skill.strip()) for skill in technical_skills if skill.strip()]
    else:
        technical_skills = []

    # Tools & Software (corrigé ici)
    tools_match = re.search(
        r"(?:-?\s*tools\s*(?:&|and)?\s*software)\s*:\s*([\w\s,;|\"/\-]+)", 
        skills_text,
        re.IGNORECASE
    )
    if tools_match:
        tools_software = re.split(r"[,;|]\s*", tools_match.group(1).replace('"', '').strip())
        tools_software = [tool.strip() for tool in tools_software if tool.strip()]
    else:
        tools_software = []

    return technical_skills, tools_software

def extract_resume_info(text):
    if not isinstance(text, str):
        return {}

    # Nettoyage de base
    text = clean_text(text)

    # 🔍 Extraction des éléments clés
    location = extract_location(text)
    experience = extract_work_experience(text)
    education_dict = extract_education(text)
    tech_skills, tools_software = extract_skills(text)

    return {
        "Location": location,
        "Experience": experience,
        "Education": education_dict.get("Degrees") if education_dict else None,
        "Institutions": education_dict.get("Institutions") if education_dict else None,
        "Technical Skills": tech_skills,
        "Tools & Software": tools_software
    }



def extract_job_details(text):
    return {
        "Location": extract_job_location(text),
        "Experience": extract_job_experience(text),
        "Education": extract_job_education(text),
        "Skills": extract_job_skills(text)
    }

def extract_job_location(text):
    """ Extrait la localisation d'une description de poste """
    location_pattern = re.compile(r"(?:located in|based in|location:)\s*([\w\s,]+)", re.IGNORECASE)
    match = location_pattern.search(text)
    return match.group(1).strip() if match else "Not specified"


def extract_job_experience(text):
    """ Extrait les années et le domaine d'expérience """
    experience_pattern = re.compile(r"(\d+)\s*(?:\+|-)?\s*(?:years?|yrs?)\s*of experience\s*(?:in|with)?\s*([\w\s,]*)?", re.IGNORECASE)
    match = experience_pattern.search(text)

    if match:
        years = match.group(1)
        domain = match.group(2).strip() if match.group(2) else "Not specified"
        return f"{years} years in {domain}"

    return "Not specified"

def extract_job_education(text):
    """ Extrait les diplômes et spécialités sans texte inutile """
    education_pattern = re.compile(r"(bachelor|master|phd|degree)\s*(?:in|of)?\s*([\w\s]+)?", re.IGNORECASE)
    matches = education_pattern.findall(text)

    degrees = []
    for match in matches:
        degree = match[0].capitalize()
        field = match[1].strip() if match[1] else "Not specified"
        degrees.append(f"{degree} in {field}" if field != "Not specified" else degree)

    return degrees if degrees else ["Not specified"]

def extract_job_skills(text):
    """ Extrait les compétences techniques en utilisant des regex """
    skill_pattern = re.compile(r"(?:skills required:|required skills:|technologies:|experience with)\s*([\w\s,]+)", re.IGNORECASE)
    match = skill_pattern.search(text)

    if match:
        skills_text = match.group(1)
        skills = [skill.strip() for skill in re.split(r",|\band\b", skills_text) if skill.strip()]
        return list(set(skills)) if skills else ["Not specified"]

    return ["Not specified"]



# 🧠 Formatage
def format_info(info_dict):
    # 🔍 Convertit Experience (liste de dicts) en texte lisible
    experience_list = info_dict.get("Experience", "")
    if isinstance(experience_list, list):
        experience = " | ".join(
            f"{item.get('Title', '')} at {item.get('Company', '')} ({item.get('Dates', '')}) - "
            f"{'; '.join(item.get('Responsibilities', []))}"
            for item in experience_list
        )
    else:
        experience = experience_list or ""

    return f"""
    Location: {info_dict.get('Location', '')}
    Experience: {experience}
    Education: {info_dict.get('Education', '')}
    Institutions: {info_dict.get('Institutions', '')}
    Skills: {', '.join(info_dict.get('Technical Skills', []))}
    Tools: {', '.join(info_dict.get('Tools & Software', []))}
    """.strip()


# 💡 Embedding section
def get_section_embeddings(info_dict):
    embeddings = {}
    for key, value in info_dict.items():
        # 💥 Cas spécial : liste de dictionnaires (comme "Experience")
        if isinstance(value, list):
            if all(isinstance(item, dict) for item in value):  # Liste de dicts
                # Convertir chaque expérience en texte concaténé
                value = " | ".join(
                    f"{item.get('Title', '')} at {item.get('Company', '')} ({item.get('Dates', '')}) - "
                    f"{'; '.join(item.get('Responsibilities', []))}"
                    for item in value
                )
            else:
                value = ", ".join(map(str, value))  # Liste de strings

        text = clean_text(str(value))
        if not text.strip():
            continue

        inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
        with torch.no_grad():
            outputs = model(**inputs)
        embeddings[key] = outputs.last_hidden_state.mean(dim=1).squeeze().detach().numpy()

    return embeddings

# 🔀 Fusion des embeddings
def merge_embeddings(section_embeddings):
    vectors = [v for v in section_embeddings.values() if v is not None]
    if not vectors:
        return None
    return np.mean(vectors, axis=0)

# 🔗 Similarité finale
def compute_similarity_score(resume_info, job_info):
    resume_sections = get_section_embeddings(resume_info)
    job_sections = get_section_embeddings(job_info)

    resume_vec = merge_embeddings(resume_sections)
    job_vec = merge_embeddings(job_sections)

    if resume_vec is None or job_vec is None:
        return 0.0

    return float(cosine_similarity(
        torch.tensor(resume_vec).unsqueeze(0),
        torch.tensor(job_vec).unsqueeze(0)
    ).item())
