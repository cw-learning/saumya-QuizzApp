import { AgGridReact } from 'ag-grid-react'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { useMemo } from 'react'
import { useQuizContext } from '../../context/quiz/useQuizContext'
import { decodeHtmlEntities } from '../../core/utils/decodeHtmlEntities'
import type {
  ColDef,
  ICellRendererParams,
  CellClassParams,
} from 'ag-grid-community'
import type { QuizGridRow } from './quizGrid.types'
import { quizGridStyles } from './quizGrid.styles'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

ModuleRegistry.registerModules([AllCommunityModule])

export default function QuizGrid() {
  const { questions, userAnswers } = useQuizContext()

  const rowData = useMemo<QuizGridRow[]>(() => {
    return questions.map((q) => {
      const rawUserAnswer = userAnswers[q.id]
      const hasUserAnswer =
        rawUserAnswer !== undefined && rawUserAnswer !== ''

      const userAnswer = decodeHtmlEntities(rawUserAnswer ?? '')
      const correctAnswer = decodeHtmlEntities(q.correctAnswer ?? '')

      return {
        question: decodeHtmlEntities(q.question ?? ''),
        userAnswer: hasUserAnswer ? userAnswer : '—',
        correctAnswer,
        isCorrect: hasUserAnswer && userAnswer === correctAnswer,
        difficulty: q.difficulty ?? 'unknown',
      }
    })
  }, [questions, userAnswers])

  if (rowData.length === 0) return null

  const columnDefs = useMemo<ColDef<QuizGridRow>[]>(() => [
    {
      field: 'question',
      headerName: 'Question',
      flex: 3,
    },
    {
      field: 'userAnswer',
      headerName: 'Your Answer',
    },
    {
      field: 'correctAnswer',
      headerName: 'Correct Answer',
    },
    {
      field: 'isCorrect',
      headerName: 'Correct',
      width: 130,
      cellRenderer: (
        params: ICellRendererParams<QuizGridRow, boolean>
      ) => (params.value ? 'Yes' : 'No'),
      cellClass: (
        params: CellClassParams<QuizGridRow, boolean>
      ) =>
        params.value
          ? quizGridStyles.correctCell
          : quizGridStyles.incorrectCell,
    },
    {
      field: 'difficulty',
      headerName: 'Difficulty',
      width: 140,
      cellClass: (
        params: CellClassParams<QuizGridRow, string>
      ) => {
        switch (params.value) {
          case 'easy':
            return quizGridStyles.difficultyEasy
          case 'medium':
            return quizGridStyles.difficultyMedium
          case 'hard':
            return quizGridStyles.difficultyHard
          default:
            return ''
        }
      },
    },
  ], [])

  const defaultColDef = useMemo<ColDef>(() => ({
    flex: 2,
    minWidth: 120,
    sortable: true,
    filter: true,
    resizable: true,
    wrapText: true,
    autoHeight: true,
  }), [])

  return (
    <div className={quizGridStyles.wrapper}>
      <h3 className={quizGridStyles.title}>
        📊 Detailed Question Review
      </h3>

      {}
      <div className={quizGridStyles.gridContainer}>
        <AgGridReact<QuizGridRow>
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowHeight={60}
          headerHeight={48}
          animateRows
        />
      </div>
    </div>
  )
}
