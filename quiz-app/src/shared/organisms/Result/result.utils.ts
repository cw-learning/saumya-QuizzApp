import type { ResultSummary } from './result.types'
import { SCORE_THRESHOLDS } from '../../../core/constants/quiz.constants'

export function getResultSummary(
  percentage: number
): ResultSummary {
  if (percentage === SCORE_THRESHOLDS.PERFECT) {
    return {
      emoji: '🏆',
      message: 'Perfect Score!',
      colorClass: 'text-yellow-600',
    }
  }

  if (percentage >= SCORE_THRESHOLDS.EXCELLENT) {
    return {
      emoji: '🎉',
      message: 'Excellent!',
      colorClass: 'text-green-600',
    }
  }

  if (percentage >= SCORE_THRESHOLDS.GOOD) {
    return {
      emoji: '👍',
      message: 'Good Job!',
      colorClass: 'text-blue-600',
    }
  }

  if (percentage >= SCORE_THRESHOLDS.OK) {
    return {
      emoji: '😊',
      message: 'Not Bad!',
      colorClass: 'text-orange-600',
    }
  }

  return {
    emoji: '💪',
    message: 'Keep Trying!',
    colorClass: 'text-red-600',
  }
}
