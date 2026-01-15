import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import * as QuizContext from './context/quizContext';

// Mock the Quiz component
vi.mock('./components/Quiz/Quiz', () => ({
  default: () => <div data-testid="quiz-component">Quiz Component</div>
}));

// Mock the ErrorBoundary component
vi.mock('./components/ErrorBoundary/ErrorBoundary', () => ({
  default: ({ children }) => <div data-testid="error-boundary">{children}</div>
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('quiz-component')).toBeInTheDocument();
  });

  it('should wrap Quiz component with ErrorBoundary', () => {
    render(<App />);
    expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
    expect(screen.getByTestId('quiz-component')).toBeInTheDocument();
  });

  it('should provide QuizContext to Quiz component', () => {
    const useQuizContextSpy = vi.spyOn(QuizContext, 'useQuizContext');
    render(<App />);
    expect(screen.getByTestId('quiz-component')).toBeInTheDocument();
  });
});
