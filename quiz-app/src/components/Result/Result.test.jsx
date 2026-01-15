import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Result from './Result';

// Mock the context
const mockQuizContext = {
  questions: [
    { question: 'Q1' },
    { question: 'Q2' },
    { question: 'Q3' },
    { question: 'Q4' },
    { question: 'Q5' },
    { question: 'Q6' },
    { question: 'Q7' },
    { question: 'Q8' },
    { question: 'Q9' },
    { question: 'Q10' },
  ],
  score: 8,
  resetQuiz: vi.fn(),
};

vi.mock('../../context/QuizContext', () => ({
  useQuizContext: () => mockQuizContext,
}));

describe('Result Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render score and total questions', () => {
    render(<Result />);

    expect(screen.getByText('8/10')).toBeInTheDocument();
  });

  it('should display percentage score', () => {
    render(<Result />);

    expect(screen.getByText('80% Score')).toBeInTheDocument();
  });

  it('should show correct and incorrect counts', () => {
    render(<Result />);

    expect(screen.getByText('8')).toBeInTheDocument(); // Correct
    expect(screen.getByText('2')).toBeInTheDocument(); // Incorrect
    expect(screen.getByText('Correct')).toBeInTheDocument();
    expect(screen.getByText('Incorrect')).toBeInTheDocument();
  });

  it('should display "Excellent!" message for 80% or above', () => {
    render(<Result />);

    expect(screen.getByText('Excellent!')).toBeInTheDocument();
    expect(screen.getByText('🎉')).toBeInTheDocument();
  });

  it('should display "Perfect Score!" for 100%', () => {
    mockQuizContext.score = 10;
    render(<Result />);

    expect(screen.getByText('Perfect Score!')).toBeInTheDocument();
    expect(screen.getByText('🏆')).toBeInTheDocument();
  });

  it('should display "Good Job!" for 60-79%', () => {
    mockQuizContext.score = 7;
    render(<Result />);

    expect(screen.getByText('Good Job!')).toBeInTheDocument();
    expect(screen.getByText('👍')).toBeInTheDocument();
  });

  it('should display "Not Bad!" for 40-59%', () => {
    mockQuizContext.score = 5;
    render(<Result />);

    expect(screen.getByText('Not Bad!')).toBeInTheDocument();
    expect(screen.getByText('😊')).toBeInTheDocument();
  });

  it('should display "Keep Trying!" for below 40%', () => {
    mockQuizContext.score = 3;
    render(<Result />);

    expect(screen.getByText('Keep Trying!')).toBeInTheDocument();
    expect(screen.getByText('💪')).toBeInTheDocument();
  });

  it('should call resetQuiz when "Take Another Quiz" is clicked', () => {
    mockQuizContext.score = 8;
    render(<Result />);

    const resetButton = screen.getByText('Take Another Quiz');
    fireEvent.click(resetButton);

    expect(mockQuizContext.resetQuiz).toHaveBeenCalled();
  });

  it('should render "Take Another Quiz" button', () => {
    render(<Result />);

    expect(screen.getByText('Take Another Quiz')).toBeInTheDocument();
  });

  it('should calculate percentage correctly', () => {
    mockQuizContext.score = 6;
    render(<Result />);

    expect(screen.getByText('60% Score')).toBeInTheDocument();
  });

  it('should handle edge case of 0 score', () => {
    mockQuizContext.score = 0;
    render(<Result />);

    expect(screen.getByText('0/10')).toBeInTheDocument();
    expect(screen.getByText('0% Score')).toBeInTheDocument();
    expect(screen.getByText('Keep Trying!')).toBeInTheDocument();
  });

  it('should show progress bar with correct width', () => {
    mockQuizContext.score = 8;
    const { container } = render(<Result />);

    const progressBar = container.querySelector('[style*="width: 80%"]');
    expect(progressBar).toBeInTheDocument();
  });
});
