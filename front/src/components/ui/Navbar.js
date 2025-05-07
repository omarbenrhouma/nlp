// src/components/ui/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white p-4 flex justify-between items-center shadow">
      <Link to="/" className="text-2xl font-bold text-indigo-600">
        SmartRecruit
      </Link>
      <div className="space-x-4">
        {user ? (
          <>
            {/* Rôle affiché */}
            <span className="text-gray-700 font-medium">
              {user.role === "candidat" ? "Candidat" : "Entreprise"}
            </span>
            <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-indigo-600 text-white px-3 py-1 rounded">
              Connexion
            </Link>
            <Link to="/register" className="bg-gray-600 text-white px-3 py-1 rounded">
              Inscription
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
