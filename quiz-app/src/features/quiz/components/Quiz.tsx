import { Question } from '../../../shared/organisms/Question/Question'
import { Result } from '../../../shared/organisms/Result/Result'
import { Button } from '../../../shared/atoms/button/Button'
import { Input } from '../../../shared/atoms/input/Input'
import { Select } from '../../../shared/atoms/select/Select'

import { useQuizContext } from '../../../context/quiz/useQuizContext'
import { useForm } from '../../../core/hooks/useForm'
import type { FetchQuizOptions } from '../../../core/hooks/types/quiz.types'
import QuizGrid from '../../../features/data-grid/QuizGrid'

import { QUIZ_UI_TEXT } from '../constants/quizUi.constants'
import { quizStyles } from './quiz.styles'
import type { QuizFormValues } from './quiz.types'

export function Quiz() {
  const {
    questions,
    isLoading,
    error,
    isQuizComplete,
    loadQuestions,
  } = useQuizContext()

  const { values, handleChange, handleSubmit } =
    useForm<QuizFormValues>({
      initialValues: {
        numberOfQuestions: 10,
        category: '',
        difficulty: '',
      },
      onSubmit: async (formValues) => {
        const amount =
          Number(formValues.numberOfQuestions) || 10

        const options: FetchQuizOptions = {
          numberOfQuestions: amount,
        }

        if (formValues.category !== '') {
          options.category = formValues.category
        }

        if (formValues.difficulty !== '') {
          options.difficulty = formValues.difficulty
        }

        return loadQuestions(options)
      },
    })

  /* Loading */
  if (isLoading) {
    return (
      <div className={quizStyles.screenCenter}>
        <p className={quizStyles.loadingText}>
          Loading quiz…
        </p>
      </div>
    )
  }

  /* Error */
  if (error) {
    return (
      <div className={quizStyles.screenCenter}>
        <p className={quizStyles.errorText}>
          {error}
        </p>
      </div>
    )
  }

  /* Result */
  if (isQuizComplete) {
    return (
      <>
        <Result />
        <QuizGrid />
      </>
    )
  }

  /* Setup */
  if (questions.length === 0) {
    return (
      <div className={quizStyles.page}>
        <div className={quizStyles.container}>
          {/* Hero */}
          <div className={quizStyles.hero}>
            <div className={quizStyles.heroIcon}>💡</div>

            <h1 className={quizStyles.heroTitle}>
              {QUIZ_UI_TEXT.TITLE}
            </h1>

            <p className={quizStyles.heroSubtitle}>
              Test your knowledge!
            </p>

            <div className={quizStyles.heroFeatures}>
              <span className={quizStyles.featureItem}>
                ⚡ Multiple Categories
              </span>
              <span className={quizStyles.featureItem}>
                📊 Track Your Score
              </span>
              <span className={quizStyles.featureItem}>
                🎯 Difficulty Levels
              </span>
            </div>
          </div>

          {/* Card */}
          <div className={quizStyles.setupContainer}>
            <form
              onSubmit={handleSubmit}
              className={quizStyles.form}
            >
              {/* Number of Questions */}
              <div className={quizStyles.fieldGroup}>
                <label className={quizStyles.label}>
                  Number of Questions
                </label>
                <Input
                  name="numberOfQuestions"
                  type="number"
                  value={values.numberOfQuestions}
                  onChange={handleChange}
                  min={1}
                  max={50}
                />
              </div>

              {/* Category */}
              <div className={quizStyles.fieldGroup}>
                <label className={quizStyles.label}>
                  Category (Optional)
                </label>
                <Select
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  options={[
                    { label: 'Any Category', value: '' },
                    {
                      label: 'Science: Computers',
                      value: 'Science: Computers',
                    },
                    {
                      label: 'Science & Nature',
                      value: 'Science & Nature',
                    },
                    {
                      label: 'General Knowledge',
                      value: 'General Knowledge',
                    },
                    { label: 'Sports', value: 'Sports' },
                    { label: 'History', value: 'History' },
                    {
                      label: 'Entertainment: Music',
                      value: 'Entertainment: Music',
                    },
                    {
                      label: 'Entertainment: Film',
                      value: 'Entertainment: Film',
                    },
                  ]}
                />
              </div>

              {/* Difficulty */}
              <div className={quizStyles.fieldGroup}>
                <label className={quizStyles.label}>
                  Difficulty (Optional)
                </label>
                <Select
                  name="difficulty"
                  value={values.difficulty}
                  onChange={handleChange}
                  options={[
                    { label: 'Any Difficulty', value: '' },
                    { label: 'Easy', value: 'easy' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Hard', value: 'hard' },
                  ]}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                fullWidth
                className={quizStyles.primaryButton}
              >
                Start Quiz →
              </Button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  /* Question */
  return <Question />
}
