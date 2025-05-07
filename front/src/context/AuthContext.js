import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Lecture depuis localStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (!savedUser || savedUser === "undefined") {
        return null;
      }
      return JSON.parse(savedUser);
    } catch (err) {
      console.error("Erreur parsing user:", err);
      return null;
    }
  });

  // Lecture du token depuis localStorage (optionnel)
  const [token, setToken] = useState(() => {
    try {
      const savedToken = localStorage.getItem("token");
      if (!savedToken || savedToken === "undefined") {
        return null;
      }
      return savedToken;
    } catch (err) {
      console.error("Erreur parsing token:", err);
      return null;
    }
  });

  // Méthode de connexion - on stocke user et token si le backend en renvoie
  const login = (data) => {
    // data peut contenir { user: {...}, token: '...' }
    if (data.user) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    if (data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
    }
    navigate("/");
  };

  // Méthode de déconnexion
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
