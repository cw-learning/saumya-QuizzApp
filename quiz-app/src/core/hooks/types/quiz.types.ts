import type { QUIZ_DIFFICULTY } from '../../constants/quiz.constants'

export type QuizDifficulty =
  (typeof QUIZ_DIFFICULTY)[keyof typeof QUIZ_DIFFICULTY]

export type QuizType = 'multiple'

export type QuizQuestionType = {
  id: string
  question: string
  correctAnswer: string
  incorrectAnswers: string[]
  allAnswers: string[]
  category: string
  difficulty: QuizDifficulty
  type: QuizType
}

export type FetchQuizOptionsType = {
  numberOfQuestions?: number
  category?: string
  difficulty?: QuizDifficulty
  type?: QuizType
}