import type { ScoreStatsProps } from './scoreStats.types'
import {
  containerStyles,
  cardBaseStyles,
  correctCardStyles,
  percentageCardStyles,
  incorrectCardStyles,
  valueTextStyles,
  labelTextStyles,
} from './scoreStats.styles'

export function ScoreStats({
  correct,
  incorrect,
  percentage,
}: ScoreStatsProps) {
  return (
    <div className={containerStyles}>
      <div className={`${cardBaseStyles} ${correctCardStyles}`}>
        <div className={`${valueTextStyles} text-blue-600`}>
          {correct}
        </div>
        <p className={labelTextStyles}>Correct</p>
      </div>

      <div className={`${cardBaseStyles} ${percentageCardStyles}`}>
        <div className={`${valueTextStyles} text-purple-600`}>
          {percentage}%
        </div>
        <p className={labelTextStyles}>Score</p>
      </div>

      <div className={`${cardBaseStyles} ${incorrectCardStyles}`}>
        <div className={`${valueTextStyles} text-red-600`}>
          {incorrect}
        </div>
        <p className={labelTextStyles}>Incorrect</p>
      </div>
    </div>
  )
}
