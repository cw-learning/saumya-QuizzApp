import { useQuizContext } from '../../context/QuizContext';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, ClientSideRowModelModule, ValidationModule } from 'ag-grid-community';
import { useMemo } from 'react';
import { decodeHtmlEntities } from '../../services/quizApi';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// Register necessary AG Grid modules
ModuleRegistry.registerModules([ClientSideRowModelModule, ValidationModule]);

const SCORE_THRESHOLDS = {
  PERFECT: 100,
  EXCELLENT: 80,
  GOOD: 60,
  OK: 40,
};

export default function Result() {
  const { questions, score, userAnswers, resetQuiz } = useQuizContext();
  const totalQuestions = questions?.length ?? 0;

  // Safe percentage
  const rawPercentage = totalQuestions === 0 ? 0 : Math.round((score / totalQuestions) * 100);
  const percentage = Math.min(100, Math.max(0, rawPercentage));

  // Result message
  const getResultMessage = () => {
    if (percentage === SCORE_THRESHOLDS.PERFECT) return { emoji: '🏆', message: 'Perfect Score!', color: 'text-yellow-600' };
    if (percentage >= SCORE_THRESHOLDS.EXCELLENT) return { emoji: '🎉', message: 'Excellent!', color: 'text-green-600' };
    if (percentage >= SCORE_THRESHOLDS.GOOD) return { emoji: '👍', message: 'Good Job!', color: 'text-blue-600' };
    if (percentage >= SCORE_THRESHOLDS.OK) return { emoji: '😊', message: 'Not Bad!', color: 'text-orange-600' };
    return { emoji: '💪', message: 'Keep Trying!', color: 'text-red-600' };
  };
  const result = getResultMessage();

  // Progress bar color
  const progressBarColorClass =
    percentage >= SCORE_THRESHOLDS.EXCELLENT
      ? 'bg-green-500'
      : percentage >= SCORE_THRESHOLDS.GOOD
      ? 'bg-blue-500'
      : percentage >= SCORE_THRESHOLDS.OK
      ? 'bg-orange-500'
      : 'bg-red-500';

  // Prepare AG Grid row data
  const rowData = useMemo(() => {
    return questions.map((q, index) => {
      const userAnswer = userAnswers[index] || '';
      const isCorrect = userAnswer === q.correctAnswer;
      return {
        question: decodeHtmlEntities(q.question),
        userAnswer: decodeHtmlEntities(userAnswer),
        correctAnswer: decodeHtmlEntities(q.correctAnswer),
        isCorrect,
        difficulty: q.difficulty
      };
    });
  }, [questions, userAnswers]);

  // Column definitions 
const columnDefs = useMemo(() => [
  { field: 'question' },
  { field: 'userAnswer' },
  { field: 'correctAnswer' },
  { field: 'isCorrect', cellRenderer: params => 
    <span>{params.value ? 'Yes' : 'No'}</span>
  },
  { field: 'difficulty' }
], []);

  // Default column definition
  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 100,
    resizable: true
  }), []);

  return (
    <div className="w-screen min-h-screen bg-gray-50 relative">
     
      {/* Retake Quiz Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={resetQuiz}
          className="py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 shadow-md hover:shadow-xl"
        >
          🔄 Retake Quiz
        </button>
      </div>

      {/* Summary Section */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className="text-8xl mb-6">{result.emoji}</div>
            <h2 className={`text-4xl font-bold mb-4 ${result.color}`}>{result.message}</h2>

            <div className="grid grid-cols-3 gap-6 my-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-4xl font-bold text-blue-600">{score}</div>
                <p className="text-gray-600 mt-2">Correct</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <div className="text-4xl font-bold text-purple-600">{percentage}%</div>
                <p className="text-gray-600 mt-2">Score</p>
              </div>

              <div className="bg-red-50 rounded-lg p-6">
                <div className="text-4xl font-bold text-red-600">{totalQuestions - score}</div>
                <p className="text-gray-600 mt-2">Incorrect</p>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
              <div 
                className={`h-4 rounded-full transition-all duration-1000 ${
                  percentage >= 80 ? 'bg-green-500' : 
                  percentage >= 60 ? 'bg-blue-500' : 
                  percentage >= 40 ? 'bg-orange-500' : 
                  'bg-red-500'
                }`} 
                style={{ width: `${percentage}%` }} 
              />
            </div>
            <p className="text-lg text-gray-600">{score} out of {totalQuestions} questions answered correctly</p>
          </div>
        </div>
      </div>

      {/* Detailed Question Grid */}
      <div className="w-full bg-white py-12 px-4">
        <div className="w-full">
          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center px-4">
            📊 Detailed Question Review
          </h3>
          <div className="ag-theme-alpine w-full" style={{ height: '600px' }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              domLayout="normal"
              rowHeight={60}
              headerHeight={50}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
