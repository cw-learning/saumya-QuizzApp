import { memo } from 'react'
import type { ProgressBarProps } from './progressBar.types'
import {
  progressContainer,
  progressBaseFill,
  progressColors,
} from './progressBar.styles'
import { SCORE_THRESHOLDS } from '../../../core/constants/quiz.constants'

const LOW_THRESHOLD = SCORE_THRESHOLDS.OK
const HIGH_THRESHOLD = SCORE_THRESHOLDS.EXCELLENT

function ProgressBarComponent({ value = 0 }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value))

  const colorClass =
    clampedValue >= HIGH_THRESHOLD
      ? progressColors.high
      : clampedValue >= LOW_THRESHOLD
        ? progressColors.medium
        : progressColors.low

  return (
    <div
      className={progressContainer}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clampedValue}
    >
      <div
        className={`${progressBaseFill} ${colorClass}`}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  )
}

export const ProgressBar = memo(ProgressBarComponent)
