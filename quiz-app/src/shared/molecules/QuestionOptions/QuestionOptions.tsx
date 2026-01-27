import { JSX } from 'react'
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
}: QuestionOptionsProps): JSX.Element {
  return (
    <div className={listContainerStyles}>
      {options.map((option) => {
        const isSelected = selectedOption === option
        const isCorrect = option === correctOption

        let stateStyle = defaultOptionStyles
        if (!showFeedback && isSelected) stateStyle = selectedOptionStyles

        if (showFeedback) {
          if (isCorrect) stateStyle = correctOptionStyles
          else if (isSelected && !isCorrect) stateStyle = incorrectOptionStyles
          else stateStyle = disabledOptionStyles
        }

        const optionClasses = clsx(baseOptionStyles, stateStyle)

        return (
          <Button
            key={option}
            type="button"
            disabled={showFeedback}
            onClick={() => {
              if (showFeedback) return
              onSelect(option)
            }}
            className={optionClasses}
          >
            {option}
          </Button>
        )
      })}
    </div>
  )
}
