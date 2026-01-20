import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Result from './Result';

// Original mock
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
  userAnswers: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  resetQuiz: vi.fn(),
};

vi.mock('../../context/QuizContext', () => ({
  useQuizContext: () => mockQuizContext,
}));

describe('Result Component', () => {
  beforeEach(() => {
    
    vi.clearAllMocks();
    mockQuizContext.score = 8;
    mockQuizContext.resetQuiz = vi.fn();
  });

  it('renders score and total questions', () => {
    render(<Result />);
    expect(
      screen.getByText(`${mockQuizContext.score} out of 10 questions answered correctly`)
    ).toBeInTheDocument();
  });

  it('renders correct percentage', () => {
    render(<Result />);
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('renders correct counts for correct and incorrect', () => {
    render(<Result />);
    expect(screen.getByText('Correct')).toBeInTheDocument();
    expect(screen.getByText('Incorrect')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument(); // Correct count
    expect(screen.getByText('2')).toBeInTheDocument(); // Incorrect count
  });

  it('shows the correct result message for 80%', () => {
    render(<Result />);
    expect(screen.getByText('Excellent!')).toBeInTheDocument();
    expect(screen.getByText('🎉')).toBeInTheDocument();
  });

  it('shows "Perfect Score!" message for 100%', () => {
  
    mockQuizContext.score = 10;
    render(<Result />);
    expect(screen.getByText('Perfect Score!')).toBeInTheDocument();
    expect(screen.getByText('🏆')).toBeInTheDocument();
  });

  it('shows "Good Job!" for 60-79%', () => {
    mockQuizContext.score = 7;
    render(<Result />);
    expect(screen.getByText('Good Job!')).toBeInTheDocument();
    expect(screen.getByText('👍')).toBeInTheDocument();
  });

  it('shows "Not Bad!" for 40-59%', () => {
    mockQuizContext.score = 5;
    render(<Result />);
    expect(screen.getByText('Not Bad!')).toBeInTheDocument();
    expect(screen.getByText('😊')).toBeInTheDocument();
  });

  it('shows "Keep Trying!" for below 40%', () => {
    mockQuizContext.score = 3;
    render(<Result />);
    expect(screen.getByText('Keep Trying!')).toBeInTheDocument();
    expect(screen.getByText('💪')).toBeInTheDocument();
  });

  it('calls resetQuiz when retake button is clicked', () => {
    render(<Result />);
    const button = screen.getByRole('button', { name: /retake quiz/i });
    fireEvent.click(button);
    expect(mockQuizContext.resetQuiz).toHaveBeenCalled();
  });

  it('renders the progress bar with correct width', () => {
    const { container } = render(<Result />);
    const progressBar = container.querySelector('[style*="width: 80%"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('renders QuizGrid component', () => {
    render(<Result />);
    expect(screen.getByText('Detailed Question Review')).toBeInTheDocument();
  });
});
