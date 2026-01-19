import { useQuizContext } from '../../context/quizContext';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { useMemo } from 'react';
import { decodeHtmlEntities } from '../../services/quizApi';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const YourAnswerRenderer = (params) => {
  const bg = params.data.isCorrect ? 'bg-green-100' : 'bg-red-100';
  const text = params.data.isCorrect ? 'text-green-800' : 'text-red-800';
  return (
    <div className={`${bg} ${text} px-3 py-2 rounded font-medium`}>
      {params.value}
    </div>
  );
};

const CorrectAnswerRenderer = (params) => {
  return (
    <div className="bg-green-100 text-green-800 px-3 py-2 rounded font-medium">
      {params.value}
    </div>
  );
};

const ResultRenderer = (params) => {
  const icon = params.value ? '✓' : '✗';
  const color = params.value ? 'text-green-600' : 'text-red-600';
  return (
    <div className={`text-center text-2xl font-bold ${color}`}>
      {icon}
    </div>
  );
};

const DifficultyRenderer = (params) => {
  let color = 'text-gray-600';
  if (params.value === 'easy') color = 'text-green-600';
  if (params.value === 'medium') color = 'text-yellow-600';
  if (params.value === 'hard') color = 'text-red-600';
  return (
    <div className={`capitalize font-medium ${color}`}>
      {params.value}
    </div>
  );
};

export default function Result() {
  const { questions, score, userAnswers, resetQuiz } = useQuizContext();
  const totalQuestions = questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  const getResultMessage = () => {
    if (percentage === 100) return { emoji: '🏆', message: 'Perfect Score!', color: 'text-yellow-600' };
    if (percentage >= 80) return { emoji: '🎉', message: 'Excellent!', color: 'text-green-600' };
    if (percentage >= 60) return { emoji: '👍', message: 'Good Job!', color: 'text-blue-600' };
    if (percentage >= 40) return { emoji: '😊', message: 'Not Bad!', color: 'text-orange-600' };
    return { emoji: '💪', message: 'Keep Trying!', color: 'text-red-600' };
  };

  const result = getResultMessage();

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

  const columnDefs = useMemo(() => [
    { headerName: '#', valueGetter: 'node.rowIndex + 1', width: 70 },
    { headerName: 'Question', field: 'question', flex: 3 },
    { headerName: 'Your Answer', field: 'userAnswer', flex: 1, cellRenderer: YourAnswerRenderer },
    { headerName: 'Correct Answer', field: 'correctAnswer', flex: 1, cellRenderer: CorrectAnswerRenderer },
    { headerName: 'Result', field: 'isCorrect', width: 100, cellRenderer: ResultRenderer },
    { headerName: 'Difficulty', field: 'difficulty', width: 130, cellRenderer: DifficultyRenderer }
  ], []);

  const defaultColDef = useMemo(() => ({ resizable: true }), []);

  return (
    <div className="w-screen min-h-screen bg-gray-50 relative">
      <div className="absolute top-4 right-4 pointer-events-auto z-10">
        <button
          onClick={resetQuiz}
          className="py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 shadow-md hover:shadow-xl"
        >
          🔄 Retake Quiz
        </button>
      </div>

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
              domLayout='normal'
              rowHeight={60}
              headerHeight={50}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
