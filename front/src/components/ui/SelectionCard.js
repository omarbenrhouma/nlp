import React from "react";

const SelectionCard = ({ score, onContinue }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-lg w-full animate-fadeIn">
        <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Félicitations !</h2>
        <p className="text-lg text-gray-800 mb-2">
          Vous avez été sélectionné avec un score de <strong>{score}</strong>
        </p>
        <p className="text-gray-600">Vous allez maintenant passer un petit quiz.</p>
        <button
          onClick={onContinue}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
        >
          👉 Commencer le Quiz
        </button>
      </div>
    </div>
  );
};

export default SelectionCard;
