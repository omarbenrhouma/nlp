// src/components/ui/QuizModal.js
import React, { useState, useEffect } from "react";
import { generateQuiz } from "../../services/api";

const QuizModal = ({ visible, onClose, candidatureId }) => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && candidatureId) {
      fetchQuiz();
    }
  }, [visible, candidatureId]);

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const response = await generateQuiz(candidatureId);
      console.log("✅ Quiz reçu:", response.data);

      if (response.data.success) {
        setQuestions(response.data.quiz);  // 🧠 ATTENTION: maintenant une liste de 5 questions
      } else {
        console.error("❌ Erreur dans le quiz:", response.data.error);
      }
    } catch (error) {
      console.error("Erreur fetch quiz:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = () => {
    if (!selected) return;

    const correctAnswer = questions[current]?.answer;
    if (selected === correctAnswer) {
      setScore((prev) => prev + 1);
    }

    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
      setSelected("");
    } else {
      setFinished(true);
    }
  };

  const handleClose = () => {
    setQuestions([]);
    setCurrent(0);
    setSelected("");
    setScore(0);
    setFinished(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative shadow-lg">
        <button onClick={handleClose} className="absolute top-3 right-4 text-gray-400 hover:text-red-500 font-bold">✖</button>

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-opacity-50"></div>
  <p className="text-gray-600 text-lg font-medium">Patientez, préparation du quiz... 🧠</p>
</div>
        ) : finished ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-2">✅ Quiz terminé !</h2>
            <p className="mb-4">Ton score est : <strong>{score}/{questions.length}</strong></p>
            <button onClick={handleClose} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
              Fermer
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">🧠 Quiz ({current + 1}/{questions.length})</h2>
            <p className="mb-3">{questions[current]?.question}</p>
            <div className="space-y-2 mb-4">
              {questions[current]?.choices && Object.entries(questions[current].choices).map(([key, val]) => (
                <label key={key} className="block">
                  <input
                    type="radio"
                    name="option"
                    value={key}
                    checked={selected === key}
                    onChange={(e) => setSelected(e.target.value)}
                    className="mr-2"
                  />
                  {key}. {val}
                </label>
              ))}
            </div>
            <button
              onClick={handleAnswer}
              disabled={!selected}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            >
              {current + 1 < questions.length ? "Suivant" : "Terminer"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizModal;
