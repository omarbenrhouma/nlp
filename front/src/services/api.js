import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// Entreprises
export const addEntreprise = (data) =>
  axios.post(`${BASE_URL}/entreprises/ajouter`, data);

// Offres
export const addOffre = (data) =>
  axios.post(`${BASE_URL}/offres/ajouter`, data);

export const getOffres = () =>
  axios.get(`${BASE_URL}/offres`);

// Candidatures
export const uploadCV = (formData) =>
  axios.post(`${BASE_URL}/candidatures/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getCandidatures = () =>
  axios.get(`${BASE_URL}/candidatures`);
