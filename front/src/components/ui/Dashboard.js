// src/components/ui/Dashboard.js
import React, { useState } from "react";
import Navbar from "./Navbar";
import OffresList from "./OffresList";
import CVUploader from "./CVUploader";
import OffreForm from "./OffreForm";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const { user } = useAuth();
  const [view, setView] = useState("accueil");

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="p-6 text-center text-gray-600">Veuillez vous connecter...</div>
      </div>
    );
  }

  const renderContent = () => {
    switch (view) {
      case "voirOffres":
        return <OffresList />;
      case "postuler":
        return <CVUploader />;
      case "creerOffre":
        return <OffreForm />;
      default:
        return (
          <div className="text-center mt-12">
            <h2 className="text-3xl font-bold text-gray-800">Bienvenue 👋 {user.email}</h2>
            <p className="text-gray-500 mt-2">Sélectionnez une action pour commencer.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 w-full">
      <div className="flex flex-wrap gap-4 mb-6">
          {user.role === "candidat" && (
            <>
              <button
                onClick={() => setView("voirOffres")}
                className={`px-5 py-2 rounded font-semibold transition ${
                  view === "voirOffres"
                    ? "bg-blue-700 text-white"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                📋 Voir les Offres
              </button>
              <button
                onClick={() => setView("postuler")}
                className={`px-5 py-2 rounded font-semibold transition ${
                  view === "postuler"
                    ? "bg-green-700 text-white"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                📤 Postuler (CV)
              </button>
            </>
          )}

          {user.role === "entreprise" && (
            <>
              <button
                onClick={() => setView("voirOffres")}
                className={`px-5 py-2 rounded font-semibold transition ${
                  view === "voirOffres"
                    ? "bg-blue-700 text-white"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                📋 Voir les Offres
              </button>
              <button
                onClick={() => setView("creerOffre")}
                className={`px-5 py-2 rounded font-semibold transition ${
                  view === "creerOffre"
                    ? "bg-purple-700 text-white"
                    : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                }`}
              >
                ➕ Ajouter une Offre
              </button>
            </>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
