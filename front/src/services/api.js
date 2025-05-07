import axios from "axios";

// Point de base de ton API Flask :
const API = axios.create({
  baseURL: "http://localhost:5000/api", // Ajuste si nécessaire
});

// Auth
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

// Offres
export const addOffre = (data) => API.post("/offres/ajouter", data);
export const getOffres = () => API.get("/offres");

// Candidatures
export const uploadCV = (formData) =>
  API.post("/candidatures/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  export const getCandidaturesForOffre = (offreId) => API.get(`/offres/${offreId}/candidatures`);

  export const getCandidature = (candidatureId) => 
    API.get(`/candidatures/${candidatureId}`);
  
  // Quiz
  export const generateQuiz = (candidatureId) =>
    API.post("/quiz/generate", { candidature_id: candidatureId });