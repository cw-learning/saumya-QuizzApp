import { createContext } from 'react'
import type { QuizContextValue } from './quizContext.types'

export const QuizContext = createContext<QuizContextValue | undefined>(
  undefined
)
