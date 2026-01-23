import type { QuestionOptionsProps } from './questionOptions.types'
import { Button } from '../../atoms/button/Button'
import {
  listContainerStyles,
  baseOptionStyles,
  defaultOptionStyles,
  selectedOptionStyles,
  correctOptionStyles,
  incorrectOptionStyles,
  disabledOptionStyles,
} from './questionOptions.styles'

export function QuestionOptions({
  options,
  selectedOption,
  correctOption,
  showFeedback,
  onSelect,
}: QuestionOptionsProps) {
  return (
    <div className={listContainerStyles}>
      {options.map((option) => {
        const isSelected = selectedOption === option
        const isCorrect = option === correctOption

        let optionStyles = defaultOptionStyles

        if (!showFeedback && isSelected) {
          optionStyles = selectedOptionStyles
        }

        if (showFeedback) {
          if (isCorrect) {
            optionStyles = correctOptionStyles
          } else if (isSelected && !isCorrect) {
            optionStyles = incorrectOptionStyles
          } else {
            optionStyles = disabledOptionStyles
          }
        }

        return (
          <Button
            key={option}
            type="button"
            disabled={showFeedback}
            onClick={() => onSelect(option)}
            className={`${baseOptionStyles} ${optionStyles}`}
          >
            {option}
          </Button>
        )
      })}
    </div>
  )
}
