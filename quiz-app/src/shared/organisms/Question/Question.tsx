import { useState } from 'react'
import type { QuestionProps } from './question.types'
import { QuestionHeader } from '../../molecules/QuestionHeader/QuestionHeader'
import { QuestionOptions } from '../../molecules/QuestionOptions/QuestionOptions'
import { Button } from '../../atoms/button/Button'

export function Question({
  questionData,
  currentQuestion,
  totalQuestions,
  onSubmitAnswer,
  onNext,
}: QuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | undefined>()
  const [showFeedback, setShowFeedback] = useState(false)

  const handleSelect = (option: string) => {
    if (!showFeedback) {
      setSelectedOption(option)
    }
  }

  const handleSubmit = () => {
    if (!selectedOption) return
    onSubmitAnswer(selectedOption)
    setShowFeedback(true)
  }

  return (
    <div className="space-y-6">
      <QuestionHeader
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        question={questionData.question}
      />

      <QuestionOptions
        options={questionData.options}
        selectedOption={selectedOption}
        correctOption={questionData.correctOption}
        showFeedback={showFeedback}
        onSelect={handleSelect}
      />

      {!showFeedback && (
        <Button
          type="button"
          disabled={!selectedOption}
          onClick={handleSubmit}
          fullWidth
        >
          Submit Answer
        </Button>
      )}

      {showFeedback && (
        <Button
          type="button"
          onClick={onNext}
          fullWidth
        >
          Next Question
        </Button>
      )}
    </div>
  )
}
