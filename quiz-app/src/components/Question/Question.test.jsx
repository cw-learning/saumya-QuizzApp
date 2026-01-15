import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Question from './question';


// Mock the context
const mockQuizContext = {
  questions: [
    {
      question: 'What is 2 + 2?',
      correct_answer: '4',
      incorrect_answers: ['3', '5', '6'],
    },
    {
      question: 'What is the capital of France?',
      correct_answer: 'Paris',
      incorrect_answers: ['London', 'Berlin', 'Madrid'],
    },
  ],
  currentQuestionIndex: 0,
  selectAnswer: vi.fn(),
  nextQuestion: vi.fn(),
};

vi.mock('../../context/quizContext', async () => {
  const actual = await vi.importActual('../../context/quizContext');
  return {
    ...actual,
    useQuizContext: () => mockQuizContext,
  };
});

describe('Question Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render question and options', () => {
    render(<Question />);

    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('should show question progress', () => {
    render(<Question />);

    expect(screen.getByText(/Question/)).toBeInTheDocument();
    expect(screen.getByText(/% Complete/)).toBeInTheDocument();
  });

  it('should select an option when clicked', () => {
    render(<Question />);

    const option = screen.getByText('4');
    fireEvent.click(option);

    expect(option.closest('button')).toHaveClass('bg-blue-500');
  });

  it('should disable submit button when no option selected', () => {
    render(<Question />);

    const submitButton = screen.getByText('Submit Answer');
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when option selected', () => {
    render(<Question />);

    const option = screen.getByText('4');
    fireEvent.click(option);

    const submitButton = screen.getByText('Submit Answer');
    expect(submitButton).not.toBeDisabled();
  });

  it('should call selectAnswer when submitted', () => {
    render(<Question />);

    const option = screen.getByText('4');
    fireEvent.click(option);

    const submitButton = screen.getByText('Submit Answer');
    fireEvent.click(submitButton);

    expect(mockQuizContext.selectAnswer).toHaveBeenCalledWith('4');
  });

  it('should show correct feedback when answer is correct', () => {
    render(<Question />);

    const correctOption = screen.getByText('4');
    fireEvent.click(correctOption);

    const submitButton = screen.getByText('Submit Answer');
    fireEvent.click(submitButton);

    expect(screen.getByText('🎉 Correct Answer!')).toBeInTheDocument();
  });

  it('should show incorrect feedback when answer is wrong', () => {
    render(<Question />);

    const wrongOption = screen.getByText('3');
    fireEvent.click(wrongOption);

    const submitButton = screen.getByText('Submit Answer');
    fireEvent.click(submitButton);

    expect(screen.getByText('❌ Wrong Answer!')).toBeInTheDocument();
  });

  it('should show next question button after submission', () => {
    render(<Question />);

    const option = screen.getByText('4');
    fireEvent.click(option);

    const submitButton = screen.getByText('Submit Answer');
    fireEvent.click(submitButton);

    expect(screen.getByText(/Next Question/)).toBeInTheDocument();
  });

  it('should advance to next question when next button clicked', () => {
    render(<Question />);

    const option = screen.getByText('4');
    fireEvent.click(option);

    const submitButton = screen.getByText('Submit Answer');
    fireEvent.click(submitButton);

    const nextButton = screen.getByText(/Next Question/);
    fireEvent.click(nextButton);

    expect(mockQuizContext.nextQuestion).toHaveBeenCalled();
  });

  it('should prevent selecting different option after submission', () => {
    render(<Question />);

    const option1 = screen.getByText('4');
    fireEvent.click(option1);

    const submitButton = screen.getByText('Submit Answer');
    fireEvent.click(submitButton);

    // Try to select different option
    const option2 = screen.getByText('3');
    fireEvent.click(option2);

    // Should still show first selection
    expect(mockQuizContext.selectAnswer).toHaveBeenCalledTimes(1);
    expect(mockQuizContext.selectAnswer).toHaveBeenCalledWith('4');
  });

  it('should render null when no current question', () => {
    // Simply test with empty questions array
    mockQuizContext.questions = [];
    
    const { container } = render(<Question />);
    expect(container.firstChild).toBeNull();
    
    // Restore original questions
    mockQuizContext.questions = [
      {
        question: 'What is 2 + 2?',
        correct_answer: '4',
        incorrect_answers: ['3', '5', '6'],
      },
      {
        question: 'What is the capital of France?',
        correct_answer: 'Paris',
        incorrect_answers: ['London', 'Berlin', 'Madrid'],
      },
    ];
  });
});
