// src/components/ui/CVUploader.js
import React, { useState, useEffect } from "react";
import { uploadCV, getOffres } from "../../services/api";

const CVUploader = () => {
  const [file, setFile] = useState(null);
  const [offres, setOffres] = useState([]);
  const [offreId, setOffreId] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getOffres().then((res) => setOffres(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !offreId || !candidateName || !candidateEmail) {
      return alert("Remplissez tous les champs !");
    }

    const formData = new FormData();
    formData.append("cv", file);
    formData.append("offre_id", offreId);
    formData.append("candidate_name", candidateName);
    formData.append("candidate_email", candidateEmail);

    try {
      setLoading(true);
      await uploadCV(formData);
      alert("✅ CV envoyé avec succès !");
      setFile(null);
      setOffreId("");
      setCandidateName("");
      setCandidateEmail("");
    } catch (error) {
      console.error("❌ Erreur envoi du CV:", error);
      alert("Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mt-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
        📄 Postuler à une Offre
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Nom</label>
          <input
            type="text"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={candidateEmail}
            onChange={(e) => setCandidateEmail(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            placeholder="john.doe@example.com"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Offre</label>
          <select
            value={offreId}
            onChange={(e) => setOffreId(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            required
          >
            <option value="">-- Sélectionnez une offre --</option>
            {offres.map((o) => (
              <option key={o._id} value={o._id}>
                {o.titre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">CV (PDF uniquement)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded font-semibold text-white ${
            loading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "⏳ Envoi en cours..." : "📤 Envoyer CV"}
        </button>
      </form>
    </div>
  );
};

export default CVUploader;
