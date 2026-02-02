import type { QuizQuestionType, FetchQuizOptionsType } from '../../core/hooks/types/quiz.types'

export interface QuizContextState {
  questions: QuizQuestionType[]
  currentQuestionIndex: number
  userAnswers: Record<string, string>
  score: number
  isQuizComplete: boolean
  isLoading: boolean
  error: string | null
}

export interface QuizContextActions {
  loadQuestions: (options: FetchQuizOptionsType) => Promise<void>
  selectAnswer: (answer: string) => void
  onNextQuestion: () => void
  resetQuiz: () => void
}

export type QuizContextValue = QuizContextState & QuizContextActions