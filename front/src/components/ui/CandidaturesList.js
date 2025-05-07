import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCandidaturesForOffre } from "../../services/api";

function CandidaturesList() {
  const { offreId } = useParams();
  const navigate = useNavigate();
  const [candidatures, setCandidatures] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    if (!offreId) return;
    getCandidaturesForOffre(offreId)
      .then((res) => {
        const sorted = [...res.data].sort((a, b) => (b.score || 0) - (a.score || 0)); // 🔥 Tri décroissant sur le score
        setCandidatures(sorted);
      })
      .catch((err) => console.error("Erreur récupération candidatures:", err));
  }, [offreId]);

  const toggleDetails = (index) =>
    setExpandedIndex((prev) => (prev === index ? null : index));

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <button
          onClick={() => navigate("/")}
          className="mb-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
        >
          ← Retour à la liste d'offres
        </button>

        <h2 className="text-xl font-bold mb-6 text-blue-700">
          Candidatures pour l'offre ID : {offreId}
        </h2>

        {candidatures.length === 0 ? (
          <p className="text-gray-600">Aucune candidature pour cette offre.</p>
        ) : (
          <div className="space-y-4">
            {candidatures.map((cand, index) => {
              const info = cand.resume_info || {};
              const experience = info.Experience || [];
              const latestExp = experience[0] || {};
              return (
                <div
                  key={cand._id}
                  className="bg-gray-50 border rounded-lg shadow-sm p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {cand.candidate_name || "Nom inconnu"}
                      </h3>
                      <p className="text-sm text-gray-600">{cand.candidate_email}</p>
                      <p className="text-sm mt-1 text-gray-700">
                        <strong>📍 Lieu :</strong> {info.Location || "Non spécifié"}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        <strong>🛠️ Dernière expérience :</strong>{" "}
                        {latestExp.Title} at {latestExp.Company}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        <strong>📄 Score :</strong> {cand.score?.toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleDetails(index)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {expandedIndex === index ? "Réduire ▲" : "Voir les détails ▼"}
                    </button>
                  </div>

                  {expandedIndex === index && (
                    <div className="mt-4 px-4 py-3 bg-gray-100 rounded-md border text-sm space-y-2">
                      <p>
                        <strong>🎓 Diplômes :</strong> {info.Education || "Non spécifié"}
                      </p>
                      <p>
                        <strong>🏫 Institutions :</strong>{" "}
                        {info.Institutions || "Non spécifié"}
                      </p>
                      <p>
                        <strong>💻 Outils logiciels :</strong>{" "}
                        {(info["Tools & Software"] || []).join(", ") || "Non spécifiés"}
                      </p>
                      <p>
                        <strong>⚙️ Compétences techniques :</strong>{" "}
                        {(info["Technical Skills"] || []).join(", ") || "Non spécifiées"}
                      </p>

                      <div>
                        <strong>📋 Expériences professionnelles :</strong>
                        <ul className="list-disc ml-5 mt-2 space-y-2">
                          {(experience || []).map((exp, i) => (
                            <li key={i}>
                              <p className="font-semibold">
                                {exp.Title} at {exp.Company} ({exp.Dates}) –{" "}
                                {exp["Years of Experience"] || "Durée inconnue"} ans
                              </p>
                              <ul className="list-disc ml-6 text-gray-700 text-sm mt-1">
                                {(exp.Responsibilities || []).map((r, ri) => (
                                  <li key={ri}>{r}</li>
                                ))}
                              </ul>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <p className="text-gray-500 text-xs">
                        🕐 Candidature envoyée le :{" "}
                        {new Date(cand.uploaded_at).toLocaleString("fr-FR")}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidaturesList;
