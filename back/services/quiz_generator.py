# services/quiz_generator.py

import requests
import json

class DolphinChatbot:
    def __init__(self, server_url="http://127.0.0.1:1234/v1/chat/completions"):
        self.api_url = server_url
        self.model_name = "dolphin-2.9.3-mistral-7b-32k"

    def generate_questions(self, resume_info, job_info, question_type="technical", num_questions=5):
        candidate_skills = ", ".join(resume_info.get("Technical Skills", []))
        candidate_experience = resume_info.get("Experience", "")
        candidate_education = resume_info.get("Education", "")

        job_skills = ", ".join(job_info.get("Skills", []))
        job_experience = job_info.get("Experience", "")
        job_education = job_info.get("Education", "")

        prompt = f"""
You are a professional technical interviewer chatbot. Your task is to generate {num_questions} quiz-style multiple-choice questions.

Job Requirements:
- Skills: {job_skills}
- Experience: {job_experience}
- Education: {job_education}

Candidate Profile:
- Skills: {candidate_skills}
- Experience: {candidate_experience}
- Education: {candidate_education}

 Task:
Generate a {question_type} question related to the job and candidate profile.

Instructions:
- Generate {num_questions} completely DIFFERENT questions (no repetition).
- Each question MUST be directly addressed to the candidate (use "you" form).
- Each question must be focused on a different skill.
- Each question must have multiple choices (A, B, C, D).
- Only 1 correct answer per question.
- Keep questions and choices SHORT and CLEAR.
- Do NOT add any explanations.

Output Format:
[
  {{
    "question": "...",
    "type": "{question_type}",
    "choices": {{
      "A": "...",
      "B": "...",
      "C": "...",
      "D": "..."
    }},
    "answer": "A"
  }},
  ...
]
Important: Return ONLY the JSON list above. No explanation, no additional text.
"""


        response = requests.post(
            self.api_url,
            headers={"Content-Type": "application/json"},
            json={
                "model": self.model_name,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.5
            }
        )

        content = response.json()["choices"][0]["message"]["content"]
        return content  # 🛑 On laisse le backend parser ce JSON plus proprement
