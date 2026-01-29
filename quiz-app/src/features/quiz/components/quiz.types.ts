import type { QuizDifficulty } from '../../../core/hooks/types/quiz.types'

export interface QuizFormValues
  extends Record<string, unknown> {
  numberOfQuestions: number
  category: string
  difficulty: QuizDifficulty | ''
}
