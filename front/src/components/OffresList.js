import React, { useEffect, useState } from 'react';
import { getOffres } from '../services/api';

const OffresList = () => {
  const [offres, setOffres] = useState([]);

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const response = await getOffres();
        setOffres(response.data); // ✅ corriger ici
      } catch (error) {
        console.error("Erreur lors du chargement des offres :", error);
      }
    };
    fetchOffres();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Offres disponibles</h2>
      <ul className="space-y-2">
        {offres.map((offre) => (
          <li key={offre._id} className="p-4 border rounded shadow hover:bg-gray-50 transition">
            <h3 className="font-semibold text-lg">{offre.titre}</h3>
            <p>{offre.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OffresList;
