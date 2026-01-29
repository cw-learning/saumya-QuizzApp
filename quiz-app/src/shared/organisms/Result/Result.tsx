import { ResultSummary } from '../../molecules/ResultSummary/ResultSummary'
import { ScoreStats } from '../../molecules/ScoreStats/ScoreStats'
import { ProgressBar } from '../../atoms/progress-bar/ProgressBar'
import { Button } from '../../atoms/button/Button'

import { useQuizContext } from '../../../context/quiz/useQuizContext'
import { getResultSummary } from './result.utils'
import { resultStyles } from './Result.styles'

export function Result() {
  const { score, questions, resetQuiz } = useQuizContext()

  const totalQuestions = questions.length
  const percentage =
    totalQuestions > 0
      ? Math.round((score / totalQuestions) * 100)
      : 0

  const { emoji, message, colorClass } =
    getResultSummary(percentage)

  return (
    <div className={resultStyles.page}>
      <div className={resultStyles.wrapper}>
        <div className={resultStyles.card}>
          {/* Retake button */}
          <div className={resultStyles.retakeButton}>
            <Button type="button" onClick={resetQuiz}>
              🔄 Retake Quiz
            </Button>
          </div>

          {/* Summary */}
          <ResultSummary
            emoji={emoji}
            message={message}
            colorClass={colorClass}
          />

          {/* Stats */}
          <div className={resultStyles.statsSection}>
            <ScoreStats
              correct={score}
              incorrect={totalQuestions - score}
              percentage={percentage}
            />
          </div>

          {/* Progress */}
          <div className={resultStyles.progressSection}>
            <ProgressBar value={percentage} />
            <p className={resultStyles.progressText}>
              {score} out of {totalQuestions} questions answered correctly
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
