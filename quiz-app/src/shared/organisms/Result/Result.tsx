import type { ResultProps } from './result.types'
import { ResultSummary } from '../../molecules/ResultSummary/ResultSummary'
import { ScoreStats } from '../../molecules/ScoreStats/ScoreStats'
import { ProgressBar } from '../../atoms/progress-bar/ProgressBar'
import { Button } from '../../atoms/button/Button'

export function Result({
  correct,
  total,
  percentage,
  summary,
  onRetake,
}: ResultProps) {
  return (
    <div className="space-y-10">
      <div className="flex justify-end">
        <Button type="button" onClick={onRetake}>
          🔄 Retake Quiz
        </Button>
      </div>

      <ResultSummary
        emoji={summary.emoji}
        message={summary.message}
        colorClass={summary.colorClass}
      />

      <ScoreStats
        correct={correct}
        incorrect={total - correct}
        percentage={percentage}
      />

      <ProgressBar value={percentage} />
    </div>
  )
}
