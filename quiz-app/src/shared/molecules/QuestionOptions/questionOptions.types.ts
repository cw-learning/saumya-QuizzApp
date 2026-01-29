export interface QuestionOptionsProps {
  options: string[]
  selectedOption: string | undefined
  correctOption: string
  showFeedback: boolean
  onSelect: (option: string) => void
}
