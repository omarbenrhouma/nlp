import React, { useState } from "react";
import { addOffre } from "../services/api";

const OffreForm = () => {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addOffre(formData);
      alert("Offre ajoutée !");
      setFormData({ titre: "", description: "" }); // Réinitialiser le formulaire
    } catch (err) {
      console.error("Erreur lors de l'ajout :", err);
      alert("Erreur lors de l'ajout");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Publier une offre</h2>
      <input
        type="text"
        name="titre"
        value={formData.titre}
        onChange={handleChange}
        placeholder="Titre de l'offre"
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full mb-4 p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
      >
        Publier
      </button>
    </form>
  );
};

export default OffreForm;
