import { ResultSummary } from '../../molecules/ResultSummary/ResultSummary'
import { ScoreStats } from '../../molecules/ScoreStats/ScoreStats'
import { ProgressBar } from '../../atoms/progress-bar/ProgressBar'
import { Button } from '../../atoms/button/Button'
import { useQuizContext } from '../../../context/quiz/useQuizContext'
import { getResultSummary } from './result.utils'

export function Result() {
  const { score, questions, resetQuiz } = useQuizContext()

  const totalQuestions = questions.length
  const percentage =
    totalQuestions > 0
      ? Math.round((score / totalQuestions) * 100)
      : 0


  const { emoji, message, colorClass } =
    getResultSummary(percentage)

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
