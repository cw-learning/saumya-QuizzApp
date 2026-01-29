import type { JSX } from 'react'
import { Quiz } from '../features/quiz/components/Quiz'
import { QuizProvider } from '../context/quiz/QuizProvider'

function App(): JSX.Element {
  return (
    <QuizProvider>
      <Quiz />
    </QuizProvider>
  )
}

export default App