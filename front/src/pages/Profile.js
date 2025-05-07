import React from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-6 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold">Profil</h2>
        <p>Aucun utilisateur connecté.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-6 bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-2xl font-bold">Mon Profil</h2>
      <p><strong>Nom :</strong> {user.name || "N/A"}</p>
      <p><strong>Email :</strong> {user.email || "N/A"}</p>
      {/* Affiche d'autres infos si besoin, ex: user.role */}
    </div>
  );
};

export default Profile;
