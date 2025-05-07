// src/components/ui/OffreForm.js
import React, { useState } from "react";
import { addOffre } from "../../services/api";

const OffreForm = () => {
  const [formData, setFormData] = useState({ titre: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addOffre(formData);
      alert("✅ Offre créée avec succès !");
      setFormData({ titre: "", description: "" });
    } catch (err) {
      console.error("Erreur lors de la création de l'offre :", err);
      alert("❌ Erreur lors de la création de l'offre.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto mt-8 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">📢 Nouvelle Offre</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Titre de l'offre</label>
          <input
            type="text"
            name="titre"
            placeholder="Ex: Data Scientist"
            value={formData.titre}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded focus:ring-2 focus:ring-purple-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            rows="5"
            placeholder="Description de l'offre..."
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded resize-none focus:ring-2 focus:ring-purple-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded font-semibold text-white ${
            loading
              ? "bg-purple-300 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading ? "⏳ Publication..." : "📤 Publier l'offre"}
        </button>
      </form>
    </div>
  );
};

export default OffreForm;
