import { ResultSummary } from '../../molecules/ResultSummary/ResultSummary'
import { ScoreStats } from '../../molecules/ScoreStats/ScoreStats'
import { ProgressBar } from '../../atoms/progress-bar/ProgressBar'
import { Button } from '../../atoms/button/Button'
import { useQuizContext } from '../../../context/quiz/useQuizContext'

export function Result() {
  const { score, questions, resetQuiz } = useQuizContext()

  const totalQuestions = questions.length
  const percentage =
    totalQuestions > 0
      ? Math.round((score / totalQuestions) * 100)
      : 0

  let emoji = '💪'
  let message = 'Keep Trying!'
  let colorClass = 'text-red-600'

  if (percentage === 100) {
    emoji = '🏆'
    message = 'Perfect Score!'
    colorClass = 'text-yellow-600'
  } else if (percentage >= 80) {
    emoji = '🎉'
    message = 'Excellent!'
    colorClass = 'text-green-600'
  } else if (percentage >= 60) {
    emoji = '👍'
    message = 'Good Job!'
    colorClass = 'text-blue-600'
  } else if (percentage >= 40) {
    emoji = '😊'
    message = 'Not Bad!'
    colorClass = 'text-orange-600'
  }

  const handleRetake = () => {
    resetQuiz()
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-end">
        <Button type="button" onClick={handleRetake}>
          🔄 Retake Quiz
        </Button>
      </div>

      <ResultSummary
        emoji={emoji}
        message={message}
        colorClass={colorClass}
      />

      <ScoreStats
        correct={score}
        incorrect={totalQuestions - score}
        percentage={percentage}
      />

      <ProgressBar value={percentage} />
    </div>
  )
}
