import React, { useState, useEffect } from 'react';
import './MultiplicationTestQuiz.css';

const MultiplicationQuiz = () => {
  // Game states
  const [gameState, setGameState] = useState('setup'); // setup, playing, gameOver
  const [selectedTable, setSelectedTable] = useState(1); // Default start number is now 1
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [feedback, setFeedback] = useState('');

  // Generate a set of 10 unique questions for the selected table
  const generateQuestions = (tableNumber) => {
    const numbers = Array.from({ length: 10 }, (_, i) => i + 1);
    const shuffledNumbers = [...numbers].sort(() => 0.5 - Math.random());
    return shuffledNumbers.map((num) => ({
      num1: tableNumber,
      num2: num,
      answer: tableNumber * num,
      userAnswered: false,
      correct: false,
    }));
  };

  const startGame = () => {
    const newQuestions = generateQuestions(selectedTable);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    setUserAnswer('');
    setFeedback('');
  };

  const submitAnswer = () => {
    if (userAnswer === '') return;

    const answer = parseInt(userAnswer);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.answer;

    // Update the current question
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      userAnswered: true,
      correct: isCorrect,
    };

    setQuestions(updatedQuestions);

    // Update score
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
      setFeedback('Correct!');
    } else {
      setFeedback('Incorrect!');
    }

    // Clear input and feedback after a delay
    setUserAnswer('');
    setTimeout(() => setFeedback(''), 1000);

    // Move to next question
    if (currentQuestionIndex < questions.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const endGame = () => {
    setFinalScore(score); // Set final score based on the latest score
    setGameState('gameOver');
  };

  // Effect to handle game over when all questions are answered
  useEffect(() => {
    if (gameState === 'playing' && currentQuestionIndex === questions.length) {
      endGame();
    }
  }, [currentQuestionIndex, gameState, questions.length]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            endGame();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Handle enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  };

  return (
    <div className="quiz-container">
      <h1>Multiplication Speed Test</h1>

      {gameState === 'setup' && (
        <div className="setup-screen">
          <h2>Select a multiplication table</h2>
          <div className="number-selection">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9,10].map((num) => (
              <button
                key={num}
                className={selectedTable === num ? 'number-btn selected' : 'number-btn'}
                onClick={() => setSelectedTable(num)}
              >
                {num}
              </button>
            ))}
          </div>
          <button className="start-btn" onClick={startGame}>
            Start Quiz
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-screen">
          <div className="game-header">
            <div className="timer">
              <span>Time: </span>
              <span className="time-value">{timeLeft}s</span>
            </div>
            <div className="score">
              <span>Score: </span>
              <span className="score-value">{score}/{questions.length}</span>
            </div>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(timeLeft / 60) * 100}%` }}
            ></div>
          </div>

          <div className="question-counter">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>

          <div className="question">
            {questions[currentQuestionIndex]?.num1} × {questions[currentQuestionIndex]?.num2} = ?
          </div>

          <div className="answer-input">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              placeholder="?"
            />
            <button onClick={submitAnswer}>Submit</button>
          </div>

          {feedback && (
            <div className={`feedback ${feedback === 'Correct!' ? 'correct' : 'incorrect'}`}>
              {feedback}
            </div>
          )}
        </div>
      )}

      {gameState === 'gameOver' && (
        <div className="game-over-screen">
          <h2>Game Over!</h2>
          <p className="final-score">Final Score: {finalScore}/{questions.length}</p>
          <p className="accuracy">
            Accuracy: {questions.length > 1 ? ((finalScore / questions.length) * 100).toFixed(1) : 0}%
          </p>
          <button className="restart-btn" onClick={startGame}>
            Play Again
          </button>
          <button className="home-btn" onClick={() => setGameState('setup')}>
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default MultiplicationQuiz;