import type { QuizQuestion, FetchQuizOptions } from '../../core/hooks/types/quiz.types'

export interface QuizContextState {
  questions: QuizQuestion[]
  currentQuestionIndex: number
  userAnswers: Record<string, string>
  score: number
  isQuizComplete: boolean
  isLoading: boolean
  error: string | null
}

export interface QuizContextActions {
  loadQuestions: (options: FetchQuizOptions) => Promise<void>
  selectAnswer: (answer: string) => void
  nextQuestion: () => void
  resetQuiz: () => void
}

export type QuizContextValue = QuizContextState & QuizContextActions
