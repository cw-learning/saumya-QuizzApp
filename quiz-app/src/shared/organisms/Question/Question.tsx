import { useState } from 'react'
import { QuestionHeader } from '../../molecules/QuestionHeader/QuestionHeader'
import { QuestionOptions } from '../../molecules/QuestionOptions/QuestionOptions'
import { Button } from '../../atoms/button/Button'
import { useQuizContext } from '../../../context/quiz/useQuizContext'
import { questionStyles } from './question.styles'

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
    <div className={questionStyles.container}>
      <div className={questionStyles.wrapper}>
        <div className={questionStyles.content}>
          <div className={questionStyles.questionSection}>
            <QuestionHeader
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              question={currentQuestion.question}
            />
          </div>

          <div className={questionStyles.optionsSection}>
            <QuestionOptions
              options={currentQuestion.allAnswers}
              selectedOption={selectedOption}
              correctOption={currentQuestion.correctAnswer}
              showFeedback={showFeedback}
              onSelect={handleSelect}
            />
          </div>

          <div className={questionStyles.buttonSection}>
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
                {currentQuestionIndex + 1 === questions.length ? 'View Results' : 'Next Question'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
