import type { QuizDifficulty } from '../../core/hooks/types/quiz.types'

export type QuizGridRow = {
  question: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  difficulty: QuizDifficulty | 'unknown'
}