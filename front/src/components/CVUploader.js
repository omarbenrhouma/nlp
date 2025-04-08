import React, { useState, useEffect } from "react";
import { uploadCV } from "../services/api";
import axios from "axios";

const CVUploader = () => {
  const [file, setFile] = useState(null);
  const [selectedOfferId, setSelectedOfferId] = useState("");
  const [offres, setOffres] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/offres")
      .then(res => setOffres(res.data))
      .catch(err => console.error("Erreur chargement offres", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !selectedOfferId) return alert("Choisis une offre et un fichier.");

    const formData = new FormData();
    formData.append("cv", file);
    formData.append("offre_id", selectedOfferId);  // ✅ ICI on ajoute l'offre liée

    await uploadCV(formData);
    alert("CV envoyé avec succès !");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl bg-white shadow rounded mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4">Uploader un CV</h2>

      <label className="block mb-2 font-medium">Choisir une offre :</label>
      <select
        value={selectedOfferId}
        onChange={(e) => setSelectedOfferId(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      >
        <option value="">-- Sélectionner une offre --</option>
        {offres.map((offre, idx) => (
          <option key={idx} value={offre._id}>{offre.titre} ({offre.localisation})</option>
        ))}
      </select>

      <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="mb-4" />
      <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Envoyer</button>
    </form>
  );
};

export default CVUploader;
