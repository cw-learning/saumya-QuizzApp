import { ReactElement } from 'react'
import clsx from 'clsx'
import type { ResultSummaryProps } from './resultSummary.types'
import {
  containerStyles,
  emojiStyles,
  messageBaseStyles,
  messageGradientStyles,
} from './resultSummary.styles'

export function ResultSummary({
  emoji,
  message,
  colorClass,
}: ResultSummaryProps): ReactElement {
  const messageClasses = clsx(
    messageBaseStyles,
    colorClass ?? messageGradientStyles
  )

  return (
    <div className={containerStyles}>
      <div className={emojiStyles}>{emoji}</div>
      <h2 className={messageClasses}>{message}</h2>
    </div>
  )
}