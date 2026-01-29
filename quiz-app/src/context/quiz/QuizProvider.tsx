import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { QuizContext } from './QuizContext'
import type { QuizContextValue } from './quizContext.types'
import { useQuizApi } from '../../core/hooks/useQuizApi'
import type {
  QuizQuestion,
  FetchQuizOptions,
} from '../../core/hooks/types/quiz.types'

interface QuizProviderProps {
  children: ReactNode
}

export function QuizProvider({ children }: QuizProviderProps) {
  const { fetchQuestions, isLoading, error } = useQuizApi()

  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [score, setScore] = useState(0)
  const [isQuizComplete, setIsQuizComplete] = useState(false)

  /**
   * Load quiz questions.
   * - Never swallow errors
   * - Keep local state consistent on failure
   */
  const loadQuestions = useCallback(
    async (options: FetchQuizOptions) => {
      try {
        const fetchedQuestions = await fetchQuestions(options)

        setQuestions(fetchedQuestions)
        setCurrentQuestionIndex(0)
        setUserAnswers({})
        setScore(0)
        setIsQuizComplete(false)
      } catch (err) {
        // keep provider state consistent even when loading fails
        setQuestions([])
        setCurrentQuestionIndex(0)
        setUserAnswers({})
        setScore(0)
        setIsQuizComplete(false)

        // ❗ important: propagate failure
        throw err
      }
    },
    [fetchQuestions]
  )

  /**
   * Select an answer for the current question.
   * Atomic update prevents double-scoring even if called rapidly.
   */
  const selectAnswer = useCallback(
    (answer: string) => {
      const currentQuestion = questions[currentQuestionIndex]
      if (!currentQuestion) return

      setUserAnswers((prev) => {
        // 🛑 atomic guard — safe even with rapid repeated calls
        if (prev[currentQuestion.id] !== undefined) {
          return prev
        }

        if (answer === currentQuestion.correctAnswer) {
          setScore((s) => s + 1)
        }

        return {
          ...prev,
          [currentQuestion.id]: answer,
        }
      })
    },
    [questions, currentQuestionIndex]
  )

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => {
      const nextIndex = prev + 1

      if (nextIndex >= questions.length) {
        setIsQuizComplete(true)
        return prev
      }

      return nextIndex
    })
  }, [questions.length])

  const resetQuiz = useCallback(() => {
    setQuestions([])
    setCurrentQuestionIndex(0)
    setUserAnswers({})
    setScore(0)
    setIsQuizComplete(false)
  }, [])

  const value: QuizContextValue = useMemo(
    () => ({
      questions,
      currentQuestionIndex,
      userAnswers,
      score,
      isQuizComplete,
      isLoading,
      error,
      loadQuestions,
      selectAnswer,
      nextQuestion,
      resetQuiz,
    }),
    [
      questions,
      currentQuestionIndex,
      userAnswers,
      score,
      isQuizComplete,
      isLoading,
      error,
      loadQuestions,
      selectAnswer,
      nextQuestion,
      resetQuiz,
    ]
  )

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  )
}
