// src/pages/Login.js
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(form); 
      console.log("Réponse API login:", res.data);
  
      // res.data doit contenir user et éventuellement token
      login(res.data); 
      // ou login({ user: res.data.user, token: res.data.token })
      // selon la structure
    } catch (err) {
      console.error("Erreur de connexion:", err);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-bold text-center">Connexion</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="votre@email"
              className="border rounded w-full p-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Mot de passe</label>
            <input
              type="password"
              placeholder="********"
              className="border rounded w-full p-2"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Se connecter
          </button>
        </form>
        <div className="text-center text-sm text-gray-600">
          Pas de compte ?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Créez-en un
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
