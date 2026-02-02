import { ReactElement } from 'react'
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
}: QuestionOptionsProps): ReactElement {
  return (
    <div className={listContainerStyles}>
      {options.map((option) => {
        const isOptionSelected = selectedOption === option
        const isOptionCorrect = option === correctOption

        let stateStyle = defaultOptionStyles
        if (!showFeedback && isOptionSelected) stateStyle = selectedOptionStyles

        if (showFeedback) {
          if (isOptionCorrect) stateStyle = correctOptionStyles
          else if (isOptionSelected && !isOptionCorrect) stateStyle = incorrectOptionStyles
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