import { useContext } from 'react'
import { QuizContext } from './QuizContext'
import type { QuizContextValue } from './quizContext.types'

export function useQuizContext(): QuizContextValue {
  const context = useContext(QuizContext)

  if (!context) {
    throw new Error(
      'useQuizContext must be used within a QuizProvider'
    )
  }

  return context
}
