import React, { useEffect, useState } from "react";
import { getOffres, uploadCV } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import QuizModal from "./QuizModal";
import SelectionCard from "./SelectionCard";  // ✅ Ta carte stylée pour score

const OffresList = () => {
  const [offres, setOffres] = useState([]);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [file, setFile] = useState(null);
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [quizVisible, setQuizVisible] = useState(false);
  const [candidatureId, setCandidatureId] = useState(null);
  const [showSelectionCard, setShowSelectionCard] = useState(false);
  const [pendingScore, setPendingScore] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const response = await getOffres();
        setOffres(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des offres:", error);
      }
    };
    fetchOffres();
  }, []);

  const handleOpenPostuler = (offre) => {
    setSelectedOffre(offre);
    setFile(null);
    setCandidateName("");
    setCandidateEmail("");
  };

  const handleCloseCard = () => {
    setSelectedOffre(null);
  };

  const handleSubmitPostuler = async (e) => {
    e.preventDefault();
    if (!file || !selectedOffre?._id || !user?._id) {
      return alert("Formulaire incomplet");
    }

    const formData = new FormData();
    formData.append("cv", file);
    formData.append("offre_id", selectedOffre._id);
    formData.append("user_id", user._id);
    formData.append("candidate_name", candidateName);
    formData.append("candidate_email", candidateEmail);

    try {
      const res = await uploadCV(formData);
      const score = res?.data?.score ?? 0;
      const cId = res?.data?.candidature_id;

      if (!cId) {
        console.error("❌ Pas de candidature_id !");
        return;
      }

      setPendingScore(score);
      setCandidatureId(cId);

      if (res.data.launch_quiz) {
        setShowSelectionCard(true);

        // Attendre 3 secondes ➔ puis lancer quiz
        setTimeout(() => {
          setShowSelectionCard(false);
          setQuizVisible(true);
        }, 3000);
      } else {
        alert(`✅ CV envoyé avec succès ! Score: ${score.toFixed(2)}`);
      }

      setSelectedOffre(null);
    } catch (error) {
      console.error("Erreur envoi du CV:", error);
      alert("Erreur lors de l'envoi du CV");
    }
  };

  const handleCloseQuiz = () => {
    setQuizVisible(false);
    setCandidatureId(null);
  };

  const handleShowCandidats = (offre) => {
    navigate(`/candidats/${offre._id}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">📄 Liste des Offres</h2>

      {/* 🎯 Carte score */}
      {showSelectionCard && <SelectionCard score={pendingScore} />}

      {/* 📋 Liste des offres */}
      <div className="space-y-4">
        {offres.map((offre) => (
          <div
            key={offre._id}
            className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{offre.titre}</h3>
                <p className="text-gray-600 text-sm">{offre.description}</p>
              </div>
              <div className="flex-shrink-0 space-x-2 mt-1">
                <button
                  onClick={() => handleOpenPostuler(offre)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded text-sm font-medium"
                >
                  Postuler
                </button>
                <button
                  onClick={() => handleShowCandidats(offre)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium"
                >
                  Voir Candidats
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 📨 Formulaire Postuler */}
      {selectedOffre && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative animate-fadeIn">
            <button
              onClick={handleCloseCard}
              className="absolute top-2 right-3 text-gray-400 hover:text-black text-lg font-bold"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Postuler à : {selectedOffre.titre}
            </h2>
            <form onSubmit={handleSubmitPostuler} className="space-y-4">
              <input
                type="text"
                placeholder="Votre nom"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="border w-full p-2 rounded"
                required
              />
              <input
                type="email"
                placeholder="Votre e-mail"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                className="border w-full p-2 rounded"
                required
              />
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="border w-full p-2 rounded"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded font-semibold"
              >
                📤 Envoyer mon CV
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🧠 Modale Quiz */}
      {quizVisible && candidatureId && (
        <QuizModal
          visible={quizVisible}
          onClose={handleCloseQuiz}
          candidatureId={candidatureId}
        />
      )}
    </div>
  );
};

export default OffresList;
