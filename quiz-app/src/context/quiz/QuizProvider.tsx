import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { QuizContext } from './QuizContext'
import type { QuizContextValue } from './quizContext.types'
import { useQuizApi } from '../../core/hooks/useQuizApi'
import type {
  QuizQuestionType,
  FetchQuizOptionsType,
} from '../../core/hooks/types/quiz.types'

interface QuizProviderProps {
  children: ReactNode
}

export function QuizProvider({ children }: QuizProviderProps) {
  const { fetchQuestions, isLoading, error } = useQuizApi()

  const [questions, setQuestions] = useState<QuizQuestionType[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [isQuizComplete, setIsQuizComplete] = useState(false)

  const resetLocalQuizState = useCallback(
    (nextQuestions: QuizQuestionType[] = []) => {
      setQuestions(nextQuestions)
      setCurrentQuestionIndex(0)
      setUserAnswers({})
      setIsQuizComplete(false)
    },
    []
  )
  const loadQuestions = useCallback(
    async (options: FetchQuizOptionsType) => {
      try {
        const fetchedQuestions = await fetchQuestions(options)
        resetLocalQuizState(fetchedQuestions)
      } catch (err) {
        resetLocalQuizState([])
        throw err instanceof Error
          ? err
          : new Error('Failed to load quiz questions')
      }
    },
    [fetchQuestions, resetLocalQuizState]
  )

  const selectAnswer = useCallback(
    (answer: string) => {
      const currentQuestion = questions[currentQuestionIndex]
      if (!currentQuestion) return

      setUserAnswers((prev) => {
        if (prev[currentQuestion.id] !== undefined) {
          return prev
        }

        return {
          ...prev,
          [currentQuestion.id]: answer,
        }
      })
    },
    [questions, currentQuestionIndex]
  )

  const onNextQuestion = useCallback(() => {
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
    resetLocalQuizState([])
  }, [resetLocalQuizState])

  const score = useMemo(() => {
    return questions.reduce((total, question) => {
      const answer = userAnswers[question.id]
      return total +
        (answer !== undefined && answer === question.correctAnswer ? 1 : 0)
    }, 0)
  }, [questions, userAnswers])

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
      onNextQuestion,
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
      onNextQuestion,
      resetQuiz,
    ]
  )

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  )
}