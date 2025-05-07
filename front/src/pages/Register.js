// src/pages/Register.js
import React, { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "candidat",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await registerUser(form);
      setSuccess(true);
      // on peut rediriger après 2 secondes, par exemple
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Erreur lors de l'inscription. Retentez !");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-bold text-center">Inscription</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && (
          <p className="text-green-500 text-center">
            Inscription réussie ! Vous allez être redirigé...
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="Votre email"
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
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Rôle</label>
            <select
              className="border rounded w-full p-2"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="candidat">Candidat</option>
              <option value="entreprise">Entreprise</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            S'inscrire
          </button>
        </form>
        <div className="text-center text-sm text-gray-600">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Connectez-vous
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
