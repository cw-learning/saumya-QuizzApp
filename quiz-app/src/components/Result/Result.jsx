import { useQuizContext } from '../../context/quizContext';

const SCORE_THRESHOLDS = {
  PERFECT: 100,
  EXCELLENT: 80,
  GOOD: 60,
  OK: 40,
};

export default function Result() {
  const { questions, score, resetQuiz } = useQuizContext();

  const totalQuestions = questions?.length ?? 0;

  const rawPercentage =
    totalQuestions === 0
      ? 0
      : Math.round((score / totalQuestions) * 100);

  const percentage = Math.min(100, Math.max(0, rawPercentage));

  const getResultMessage = () => {
    if (percentage === SCORE_THRESHOLDS.PERFECT) {
      return { emoji: '🏆', message: 'Perfect Score!', color: 'text-yellow-600' };
    }
    if (percentage >= SCORE_THRESHOLDS.EXCELLENT) {
      return { emoji: '🎉', message: 'Excellent!', color: 'text-green-600' };
    }
    if (percentage >= SCORE_THRESHOLDS.GOOD) {
      return { emoji: '👍', message: 'Good Job!', color: 'text-blue-600' };
    }
    if (percentage >= SCORE_THRESHOLDS.OK) {
      return { emoji: '😊', message: 'Not Bad!', color: 'text-orange-600' };
    }
    return { emoji: '💪', message: 'Keep Trying!', color: 'text-red-600' };
  };

  const progressBarColorClass =
    percentage >= SCORE_THRESHOLDS.EXCELLENT
      ? 'bg-green-500'
      : percentage >= SCORE_THRESHOLDS.GOOD
        ? 'bg-blue-500'
        : percentage >= SCORE_THRESHOLDS.OK
          ? 'bg-orange-500'
          : 'bg-red-500';

  const handleResetQuiz = () => {
    resetQuiz();
  };

  const result = getResultMessage();

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <span className="text-8xl">{result.emoji}</span>
        </div>

        <h2 className={`text-4xl font-bold mb-4 ${result.color}`}>
          {result.message}
        </h2>

        <div className="mb-8">
          <div className="text-6xl font-bold text-gray-800 mb-2">
            {score}/{totalQuestions}
          </div>
          <p className="text-xl text-gray-600">Questions Correct</p>
        </div>

        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              role="progressbar"
              aria-label="Score progress"
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              className={`h-4 rounded-full transition-all duration-1000 ${progressBarColorClass}`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="text-2xl font-semibold text-gray-700 mt-2">
            {percentage}% Score
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleResetQuiz}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
          >
            Take Another Quiz
          </button>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {Math.max(0, totalQuestions - score)}
              </div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
