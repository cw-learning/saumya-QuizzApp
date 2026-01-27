export interface ResultSummaryData {
  emoji: string
  message: string
  colorClass: string
}

export interface ResultProps {
  correct: number
  total: number
  percentage: number
  summary: ResultSummaryData
  onRetake: () => void
}
