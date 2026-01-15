import { QuizProvider } from './context/quizContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Quiz from './components/Quiz/Quiz';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <QuizProvider>
        <Quiz />
      </QuizProvider>
    </ErrorBoundary>
  );
}
export default App;
