import clsx from 'clsx'
import type { QuestionHeaderProps } from './questionHeader.types'
import {
  CONTAINER_STYLES,
  META_ROW_STYLES,
  COUNTER_TEXT_STYLES,
  QUESTION_TEXT_STYLES,
} from './questionHeader.styles'

export function QuestionHeader({
  currentQuestion,
  totalQuestions,
  question,
}: QuestionHeaderProps) {
  const containerClasses = clsx(CONTAINER_STYLES)
  const metaRowClasses = clsx(META_ROW_STYLES)
  const counterTextClasses = clsx(COUNTER_TEXT_STYLES)
  const questionTextClasses = clsx(QUESTION_TEXT_STYLES)

  return (
    <div className={containerClasses}>
      <div className={metaRowClasses}>
        <span className={counterTextClasses}>
          Question {currentQuestion} of {totalQuestions}
        </span>
      </div>

      <h2 className={questionTextClasses}>{question}</h2>
    </div>
  )
}
