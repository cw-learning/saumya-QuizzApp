import { useState } from 'react'
import { QuestionHeader } from '../../molecules/QuestionHeader/QuestionHeader'
import { QuestionOptions } from '../../molecules/QuestionOptions/QuestionOptions'
import { Button } from '../../atoms/button/Button'
import { useQuizContext } from '../../../context/quiz/useQuizContext'

export function Question() {
  const {
    questions,
    currentQuestionIndex,
    selectAnswer,
    nextQuestion,
  } = useQuizContext()

  const [selectedOption, setSelectedOption] = useState<string | undefined>()
  const [showFeedback, setShowFeedback] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]

  if (!currentQuestion) {
    return null
  }

  const handleSelect = (option: string) => {
    if (!showFeedback) {
      setSelectedOption(option)
    }
  }

  const handleSubmit = () => {
    if (!selectedOption) return

    selectAnswer(selectedOption)
    setShowFeedback(true)
  }

  const handleNext = () => {
    nextQuestion()
    setSelectedOption(undefined)
    setShowFeedback(false)
  }

  return (
    <div className="space-y-6">
      <QuestionHeader
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        question={currentQuestion.question}
      />

      <QuestionOptions
        options={currentQuestion.allAnswers}
        selectedOption={selectedOption}
        correctOption={currentQuestion.correctAnswer}
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
          onClick={handleNext}
          fullWidth
        >
          Next Question
        </Button>
      )}
    </div>
  )
}
