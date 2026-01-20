import { useState, useEffect } from 'react';
import { useQuizContext } from '../../context/QuizContext';


const decodeHtmlEntities = (value = '') => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = String(value);
  return textarea.value;
};

const shuffle = (items) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export default function Question() {
  const {
    questions,
    currentQuestionIndex,
    selectAnswer,
    nextQuestion,
  } = useQuizContext();

  const [selectedOption, setSelectedOption] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (!currentQuestion) return;

    const correct =
      currentQuestion.correctAnswer ?? currentQuestion.correct_answer;
    const incorrect =
      currentQuestion.incorrectAnswers ??
      currentQuestion.incorrect_answers ??
      [];

    const options = [correct, ...incorrect].filter(Boolean);

    setShuffledOptions(shuffle(options));
    setSelectedOption('');
    setShowFeedback(false);
  }, [currentQuestion]);

  if (!currentQuestion) return null;

  const handleSelectOption = (option) => {
    if (!showFeedback) setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    selectAnswer(selectedOption);
    setShowFeedback(true);
  };

  const isCorrect =
    selectedOption ===
    (currentQuestion.correctAnswer ?? currentQuestion.correct_answer);

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>

          <div className="w-full bg-gray-200 rounded-full h-2 ml-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / questions.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {decodeHtmlEntities(currentQuestion.question)}
        </h2>
      </div>

      <div className="space-y-3 mb-6">
        {shuffledOptions.map((option) => {
          const isSelected = selectedOption === option;
          const isCorrectOption =
            option ===
            (currentQuestion.correctAnswer ??
              currentQuestion.correct_answer);

          let optionClasses =
            'w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ';

          if (!showFeedback) {
            optionClasses += isSelected
              ? 'border-blue-500 bg-blue-50 text-blue-900'
              : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50';
          } else if (isCorrectOption) {
            optionClasses +=
              'border-green-500 bg-green-50 text-green-900';
          } else if (isSelected && !isCorrect) {
            optionClasses += 'border-red-500 bg-red-50 text-red-900';
          } else {
            optionClasses += 'border-gray-300 bg-gray-100';
          }

          return (
            <button
              key={option}
              onClick={() => handleSelectOption(option)}
              disabled={showFeedback}
              className={optionClasses}
            >
              <div className="flex items-center justify-between">
                <span>{decodeHtmlEntities(option)}</span>

                {showFeedback && isCorrectOption && (
                  <span className="text-green-600">✓</span>
                )}
                {showFeedback && isSelected && !isCorrect && (
                  <span className="text-red-600">✗</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {!showFeedback && (
        <button
          onClick={handleSubmit}
          disabled={!selectedOption}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
            selectedOption
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit Answer
        </button>
      )}

      {showFeedback && (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg text-center font-semibold ${
              isCorrect
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isCorrect ? '🎉 Correct!' : '❌ Incorrect!'}
          </div>

          <button
            onClick={nextQuestion}
            className="w-full py-3 px-6 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  );
}