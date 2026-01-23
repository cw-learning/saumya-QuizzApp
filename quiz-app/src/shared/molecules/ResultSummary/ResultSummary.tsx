import type { ResultSummaryProps } from './resultSummary.types'
import {
  containerStyles,
  emojiStyles,
  messageBaseStyles,
} from './resultSummary.styles'

export function ResultSummary({
  emoji,
  message,
  colorClass,
}: ResultSummaryProps) {
  return (
    <div className={containerStyles}>
      <div className={emojiStyles}>{emoji}</div>
      <h2 className={`${messageBaseStyles} ${colorClass}`}>
        {message}
      </h2>
    </div>
  )
}
