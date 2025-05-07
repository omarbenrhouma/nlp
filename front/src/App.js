// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Dashboard from "./components/ui/Dashboard";
import PrivateRoute from "./components/ui/PrivateRoute";

// Nouveaux imports
import OffresList from "./components/ui/OffresList";
import CVUploader from "./components/ui/CVUploader";
import OffreForm from "./components/ui/OffreForm";
import CandidaturesList from "./components/ui/CandidaturesList"; // <-- IMPORTANT

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Page d'accueil : Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Profile privé */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Liste des offres, protégée */}
        <Route
          path="/offres"
          element={
            <PrivateRoute>
              <OffresList />
            </PrivateRoute>
          }
        />

        {/* Pour postuler, avec param :offreId si tu veux */}
        <Route
          path="/postuler/:offreId"
          element={
            <PrivateRoute>
              <CVUploader />
            </PrivateRoute>
          }
        />

        {/* Créer une offre */}
        <Route
          path="/ajouter-offre"
          element={
            <PrivateRoute>
              <OffreForm />
            </PrivateRoute>
          }
        />

        {/* Voir candidatures d'une offre, param :offreId */}
        <Route
  path="/candidats/:offreId"
  element={
    <PrivateRoute>
      <CandidaturesList />
    </PrivateRoute>
  }
/>      </Routes>
    </AuthProvider>
  );
}

export default App;
