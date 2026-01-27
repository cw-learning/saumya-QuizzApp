import clsx from 'clsx'
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
      <div className={clsx(cardBaseStyles, correctCardStyles)}>
        <div className={clsx(valueTextStyles, 'text-blue-600')}>
          {correct}
        </div>
        <p className={labelTextStyles}>Correct</p>
      </div>

      <div className={clsx(cardBaseStyles, percentageCardStyles)}>
        <div className={clsx(valueTextStyles, 'text-purple-600')}>
          {percentage}%
        </div>
        <p className={labelTextStyles}>Score</p>
      </div>

      <div className={clsx(cardBaseStyles, incorrectCardStyles)}>
        <div className={clsx(valueTextStyles, 'text-red-600')}>
          {incorrect}
        </div>
        <p className={labelTextStyles}>Incorrect</p>
      </div>
    </div>
  )
}
