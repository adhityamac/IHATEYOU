'use client';

import { useState } from 'react';

const QUESTIONS = [
  {
    question: 'What is the largest planet in our solar system?',
    options: ['Earth', 'Jupiter', 'Mars', 'Saturn'],
    answer: 'Jupiter',
  },
  {
    question: 'What is the speed of light?',
    options: ['300,000 km/s', '150,000 km/s', '299,792 km/s', 'Light is instant'],
    answer: '299,792 km/s',
  },
  {
    question: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Chloroplast'],
    answer: 'Mitochondrion',
  },
];

export default function TriviaGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (option: string) => {
    if (option === QUESTIONS[currentQuestion].answer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < QUESTIONS.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResult(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <h2 className="text-2xl font-bold text-white">Cosmic Trivia</h2>
      {showResult ? (
        <div className="text-center">
            <p className="text-white">Your score: {score} / {QUESTIONS.length}</p>
            <button onClick={resetGame} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-full">Play Again</button>
        </div>
      ) : (
        <div className="w-full">
          <p className="text-white text-center mb-4">{QUESTIONS[currentQuestion].question}</p>
          <div className="grid grid-cols-2 gap-4">
            {QUESTIONS[currentQuestion].options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className="px-4 py-2 bg-purple-600 text-white rounded-full"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
