import type { QUIZ_DIFFICULTY } from '../../constants/quiz.constants'

export type QuizDifficulty =
  (typeof QUIZ_DIFFICULTY)[keyof typeof QUIZ_DIFFICULTY]

export type QuizQuestionType = 'multiple'

export interface QuizQuestion {
  id: string
  question: string
  correctAnswer: string
  incorrectAnswers: string[]
  allAnswers: string[]
  category: string
  difficulty: QuizDifficulty
  type: QuizQuestionType
}

export interface FetchQuizOptions {
  numberOfQuestions?: number
  category?: string
  difficulty?: QuizDifficulty
  type?: QuizQuestionType
}
