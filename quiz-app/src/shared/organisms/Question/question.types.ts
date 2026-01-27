export interface QuestionData {
  question: string
  options: string[]
  correctOption: string
}

export interface QuestionProps {
  questionData: QuestionData
  currentQuestion: number
  totalQuestions: number
  onSubmitAnswer: (answer: string) => void
  onNext: () => void
}
