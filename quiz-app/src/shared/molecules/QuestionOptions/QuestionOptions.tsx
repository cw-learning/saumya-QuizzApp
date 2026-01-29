import clsx from 'clsx'
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
  const optionButtons = []

  for (const option of options) {
    const isSelected = selectedOption === option
    const isCorrect = option === correctOption

    let stateStyle = defaultOptionStyles

    if (!showFeedback && isSelected) {
      stateStyle = selectedOptionStyles
    }

    if (showFeedback) {
      if (isCorrect) {
        stateStyle = correctOptionStyles
      } else if (isSelected && !isCorrect) {
        stateStyle = incorrectOptionStyles
      } else {
        stateStyle = disabledOptionStyles
      }
    }

    const optionClasses = clsx(baseOptionStyles, stateStyle)

    const handleClick = () => {
      onSelect(option)
    }

    optionButtons.push(
      <Button
        key={option}
        type="button"
        disabled={showFeedback}
        onClick={handleClick}
        className={optionClasses}
      >
        {option}
      </Button>
    )
  }

  return <div className={listContainerStyles}>{optionButtons}</div>
}
