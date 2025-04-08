import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import OffreForm from "./OffreForm";
import CVUploader from "./CVUploader";
import OffresList from "./OffresList";

const Dashboard = () => {
  const [view, setView] = useState("home");

  const renderContent = () => {
    switch (view) {
      case "postuler":
        return <CVUploader />;
      case "recruter":
        return <OffreForm />;
      case "offres":
        return <OffresList />;
      default:
        return (
          <div className="text-center mt-20">
            <h2 className="text-3xl font-bold text-gray-700 mb-6">
              Bienvenue sur <span className="text-indigo-600">SmartRecruit</span>
            </h2>
            <p className="mb-10 text-gray-500">Choisissez une action :</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button onClick={() => setView("postuler")} className="bg-green-500 hover:bg-green-600">
                Postuler
              </Button>
              <Button onClick={() => setView("recruter")} className="bg-blue-600 hover:bg-blue-700">
                Publier une offre
              </Button>
              <Button onClick={() => setView("offres")} className="bg-purple-600 hover:bg-purple-700">
                Voir les offres
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-indigo-600">SmartRecruit</h1>
        <Button className="bg-indigo-600 text-white" onClick={() => setView("home")}>
          Accueil
        </Button>
      </nav>

      <main className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
