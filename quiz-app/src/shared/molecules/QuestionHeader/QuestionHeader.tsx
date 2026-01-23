import type { QuestionHeaderProps } from './questionHeader.types'
import {
  containerStyles,
  metaRowStyles,
  counterTextStyles,
  questionTextStyles,
} from './questionHeader.styles'

export function QuestionHeader({
  currentQuestion,
  totalQuestions,
  question,
}: QuestionHeaderProps) {
  return (
    <div className={containerStyles}>
      <div className={metaRowStyles}>
        <span className={counterTextStyles}>
          Question {currentQuestion} of {totalQuestions}
        </span>
      </div>

      <h2 className={questionTextStyles}>{question}</h2>
    </div>
  )
}
