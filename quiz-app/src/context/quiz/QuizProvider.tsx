import { useCallback, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'

import { QuizContext } from './QuizContext'
import type { QuizContextValue } from './quizContext.types'
import { useQuizApi } from '../../core/hooks/useQuizApi'
import type {
  QuizQuestion,
  FetchQuizOptions,
} from '../../core/hooks/types/quiz.types'

type QuizState = {
  questions: QuizQuestion[]
  currentQuestionIndex: number
  userAnswers: Record<string, string>
  score: number
  isQuizComplete: boolean
}

type QuizAction =
  | { type: 'LOAD_QUESTIONS'; questions: QuizQuestion[] }
  | { type: 'SELECT_ANSWER'; answer: string }
  | { type: 'NEXT_QUESTION' }
  | { type: 'RESET' }


const initialState: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: {},
  score: 0,
  isQuizComplete: false,
}

function quizReducer(
  state: QuizState,
  action: QuizAction
): QuizState {
  switch (action.type) {
    case 'LOAD_QUESTIONS':
      return {
        ...initialState,
        questions: action.questions,
      }

    case 'SELECT_ANSWER': {
      const currentQuestion =
        state.questions[state.currentQuestionIndex]

      if (!currentQuestion) return state

      if (state.userAnswers[currentQuestion.id] !== undefined) {
        return state
      }

      const isCorrect =
        action.answer === currentQuestion.correctAnswer

      return {
        ...state,
        userAnswers: {
          ...state.userAnswers,
          [currentQuestion.id]: action.answer,
        },
        score: state.score + (isCorrect ? 1 : 0),
      }
    }

    case 'NEXT_QUESTION': {
      const nextIndex = state.currentQuestionIndex + 1

      if (nextIndex >= state.questions.length) {
        return {
          ...state,
          isQuizComplete: true,
        }
      }

      return {
        ...state,
        currentQuestionIndex: nextIndex,
      }
    }

    case 'RESET':
      return initialState

    default:
      return state
  }
}
interface QuizProviderProps {
  children: ReactNode
}

export function QuizProvider({ children }: QuizProviderProps) {
  const { fetchQuestions, isLoading, error } = useQuizApi()
  const [state, dispatch] = useReducer(
    quizReducer,
    initialState
  )

  
  const loadQuestions = useCallback(
    async (options: FetchQuizOptions) => {
      try {
        const fetchedQuestions = await fetchQuestions(options)
        dispatch({
          type: 'LOAD_QUESTIONS',
          questions: fetchedQuestions,
        })
      } catch (err) {
        dispatch({ type: 'RESET' })
        throw err
      }
    },
    [fetchQuestions]
  )

  const selectAnswer = useCallback((answer: string) => {
    dispatch({ type: 'SELECT_ANSWER', answer })
  }, [])

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' })
  }, [])

  const resetQuiz = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  const value: QuizContextValue = useMemo(
    () => ({
      questions: state.questions,
      currentQuestionIndex: state.currentQuestionIndex,
      userAnswers: state.userAnswers,
      score: state.score,
      isQuizComplete: state.isQuizComplete,
      isLoading,
      error,
      loadQuestions,
      selectAnswer,
      nextQuestion,
      resetQuiz,
    }),
    [
      state,
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
