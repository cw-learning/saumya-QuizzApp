import clsx from 'clsx'
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
  const messageClasses = clsx(messageBaseStyles, colorClass)

  return (
    <div className={containerStyles}>
      <div className={emojiStyles}>{emoji}</div>
      <h2 className={messageClasses}>
        {message}
      </h2>
    </div>
  )
}
