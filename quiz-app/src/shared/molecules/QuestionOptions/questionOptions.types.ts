export interface QuestionOptionsProps {
  options: string[]
  selectedOption?: string
  correctOption?: string
  showFeedback: boolean
  onSelect: (option: string) => void
}
