import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Result from './Result';

const DEFAULT_QUESTIONS = Array.from({ length: 10 }, (_, i) => ({
  question: `Q${i + 1}`,
}));

let mockQuizContext;

vi.mock('../../context/quizContext', () => ({
  useQuizContext: () => mockQuizContext,
}));

beforeEach(() => {
  mockQuizContext = {
    questions: DEFAULT_QUESTIONS,
    score: 8,
    resetQuiz: vi.fn(),
  };
  vi.clearAllMocks();
});

describe('Result Component', () => {
  it('renders score and total questions', () => {
    render(<Result />);
    expect(screen.getByText('8/10')).toBeInTheDocument();
  });

  it('displays percentage score', () => {
    render(<Result />);
    expect(screen.getByText('80% Score')).toBeInTheDocument();
  });

  it('shows correct and incorrect counts', () => {
    render(<Result />);
    expect(screen.getByText('8')).toBeInTheDocument(); // Correct
    expect(screen.getByText('2')).toBeInTheDocument(); // Incorrect
    expect(screen.getByText('Correct')).toBeInTheDocument();
    expect(screen.getByText('Incorrect')).toBeInTheDocument();
  });

  it('displays proper result message based on score', () => {
    const testCases = [
      { score: 10, message: 'Perfect Score!', emoji: '🏆' },
      { score: 8, message: 'Excellent!', emoji: '🎉' },
      { score: 7, message: 'Good Job!', emoji: '👍' },
      { score: 5, message: 'Not Bad!', emoji: '😊' },
      { score: 3, message: 'Keep Trying!', emoji: '💪' },
    ];

    for (const { score, message, emoji } of testCases) {
      mockQuizContext.score = score;
      render(<Result />);
      expect(screen.getByText(message)).toBeInTheDocument();
      expect(screen.getByText(emoji)).toBeInTheDocument();
    }
  });

  it('calls resetQuiz when "Take Another Quiz" is clicked', async () => {
    const user = userEvent.setup();
    render(<Result />);
    const resetButton = screen.getByRole('button', {
      name: /take another quiz/i,
    });
    await user.click(resetButton);
    expect(mockQuizContext.resetQuiz).toHaveBeenCalledTimes(1);
  });

  it('shows progress bar with correct width', () => {
    mockQuizContext.score = 8;
    render(<Result />);
    const progressBar = screen.getByRole('progressbar', {
      name: /score progress/i,
    });
    expect(progressBar).toHaveStyle({ width: '80%' });
  });

  it('handles edge case of 0 score', () => {
    mockQuizContext.score = 0;
    render(<Result />);
    expect(screen.getByText('0/10')).toBeInTheDocument();
    expect(screen.getByText('0% Score')).toBeInTheDocument();
    expect(screen.getByText('Keep Trying!')).toBeInTheDocument();
  });
});
