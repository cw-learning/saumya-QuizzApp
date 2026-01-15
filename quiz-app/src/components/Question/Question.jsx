import { useState, useEffect } from 'react';
import { useQuizContext } from '../../context/quizContext';

export default function Question() {
  const { questions, currentQuestionIndex, selectAnswer, nextQuestion } = useQuizContext();
  const [selectedOption, setSelectedOption] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  // Shuffle and combine answers
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    if (currentQuestion) {
      const correct = currentQuestion.correctAnswer || currentQuestion.correct_answer;
      const incorrect = currentQuestion.incorrectAnswers || currentQuestion.incorrect_answers || [];
      
      const options = [correct, ...incorrect];
      setShuffledOptions(options.sort(() => Math.random() - 0.5));
      setSelectedOption('');
      setShowFeedback(false);
    }
  }, [currentQuestion]);

  if (!currentQuestion) return null;

  const handleSelectOption = (option) => {
    if (showFeedback) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    selectAnswer(selectedOption);
    setShowFeedback(true);
  };

  const handleNext = () => nextQuestion();

  const isCorrect = selectedOption === (currentQuestion.correctAnswer || currentQuestion.correct_answer);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-3xl flex flex-col justify-between">
        
        {}
        <div className="mb-4 flex justify-between items-center w-full">
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Question {currentQuestionIndex + 1} / {questions.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {}
        <div className="bg-white rounded-xl shadow-md p-6 mb-4">
          <h2
            className="text-2xl font-semibold text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
          />
        </div>

        {}
        <div className="space-y-3 mb-4">
          {shuffledOptions.map((option, index) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = option === (currentQuestion.correctAnswer || currentQuestion.correct_answer);

            let optionClasses = 'w-full p-4 text-left rounded-xl transition-all duration-200 font-medium ';

            if (!showFeedback) {
              optionClasses += isSelected
                ? 'bg-blue-500 text-white shadow-md transform scale-[1.02]'
                : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md text-gray-700';
            } else {
              if (isCorrectOption) {
                optionClasses += 'bg-green-500 text-white shadow-md';
              } else if (isSelected && !isCorrect) {
                optionClasses += 'bg-red-500 text-white shadow-md';
              } else {
                optionClasses += 'bg-gray-100 border-2 border-gray-200 text-gray-500';
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectOption(option)}
                disabled={showFeedback}
                className={optionClasses}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      !showFeedback && isSelected ? 'bg-white text-blue-500' :
                      !showFeedback ? 'bg-gray-100 text-gray-600' :
                      isCorrectOption ? 'bg-white text-green-500' :
                      isSelected && !isCorrect ? 'bg-white text-red-500' :
                      'bg-gray-200 text-gray-400'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: option }} />
                  </span>
                  {showFeedback && isCorrectOption && <span className="text-xl">✓</span>}
                  {showFeedback && isSelected && !isCorrect && <span className="text-xl">✗</span>}
                </div>
              </button>
            );
          })}
        </div>

        {}
        {!showFeedback ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className={`w-full py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${
              selectedOption
                ? 'bg-blue-500 text-white hover:scale-[1.02]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Submit Answer
          </button>
        ) : (
          <div className="space-y-3">
            <div
              className={`p-4 rounded-xl text-center font-semibold text-lg ${
                isCorrect
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {isCorrect ? '🎉 Correct Answer!' : '❌ Wrong Answer!'}
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl font-semibold bg-blue-500 text-white hover:scale-[1.02] transition-all duration-200"
            >
              {currentQuestionIndex === questions.length - 1 ? 'View Results' : 'Next Question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
