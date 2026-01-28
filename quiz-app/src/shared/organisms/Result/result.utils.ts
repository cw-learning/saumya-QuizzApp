export function getResultSummary(percentage: number) {
  if (percentage === 100) {
    return { emoji: '🏆', message: 'Perfect Score!', colorClass: 'text-yellow-600' }
  }

  if (percentage >= 80) {
    return { emoji: '🎉', message: 'Excellent!', colorClass: 'text-green-600' }
  }

  if (percentage >= 60) {
    return { emoji: '👍', message: 'Good Job!', colorClass: 'text-blue-600' }
  }

  if (percentage >= 40) {
    return { emoji: '😊', message: 'Not Bad!', colorClass: 'text-orange-600' }
  }

  return { emoji: '💪', message: 'Keep Trying!', colorClass: 'text-red-600' }
}
