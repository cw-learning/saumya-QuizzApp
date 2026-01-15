import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Quiz from './Quiz';
import { QuizProvider } from '../../context/quizContext';
import * as quizApi from '../../services/quizApi';

vi.mock('../../services/quizApi');

const renderWithProvider = (component) => {
  return render(<QuizProvider>{component}</QuizProvider>);
};

describe('Quiz Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render quiz setup form initially', () => {
    renderWithProvider(<Quiz />);

    expect(screen.getByText('Quiz App')).toBeInTheDocument();
    expect(screen.getByText('Test your knowledge!')).toBeInTheDocument();
    expect(screen.getByLabelText(/number of questions/i)).toBeInTheDocument();
    expect(screen.getByText('Start Quiz')).toBeInTheDocument();
  });

  it('should render amount input with default value', () => {
    renderWithProvider(<Quiz />);

    const amountInput = screen.getByLabelText(/number of questions/i);
    expect(amountInput).toHaveValue(10);
  });

  it('should render category select', () => {
    renderWithProvider(<Quiz />);

    const categorySelect = screen.getByLabelText(/category/i);
    expect(categorySelect).toBeInTheDocument();
    expect(screen.getByText('Any Category')).toBeInTheDocument();
    expect(screen.getByText('General Knowledge')).toBeInTheDocument();
  });

  it('should render difficulty select', () => {
    renderWithProvider(<Quiz />);

    const difficultySelect = screen.getByLabelText(/difficulty/i);
    expect(difficultySelect).toBeInTheDocument();
    expect(screen.getByText('Any Difficulty')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  it('should update amount input value', () => {
    renderWithProvider(<Quiz />);

    const amountInput = screen.getByLabelText(/number of questions/i);
    fireEvent.change(amountInput, { target: { value: '15' } });

    expect(amountInput).toHaveValue(15);
  });

  it('should update category select value', () => {
    renderWithProvider(<Quiz />);

    const categorySelect = screen.getByLabelText(/category/i);
    fireEvent.change(categorySelect, { target: { value: '9' } });

    expect(categorySelect).toHaveValue('9');
  });

  it('should update difficulty select value', () => {
    renderWithProvider(<Quiz />);

    const difficultySelect = screen.getByLabelText(/difficulty/i);
    fireEvent.change(difficultySelect, { target: { value: 'easy' } });

    expect(difficultySelect).toHaveValue('easy');
  });

  it('should show validation error for empty amount', async () => {
    renderWithProvider(<Quiz />);

    const amountInput = screen.getByLabelText(/number of questions/i);
    fireEvent.change(amountInput, { target: { value: '' } });

    const submitButton = screen.getByText('Start Quiz');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/number of questions is required/i)).toBeInTheDocument();
    });
  });

  it('should call loadQuestions with correct options on submit', async () => {
    const mockQuestions = [
      {
        question: 'Test Question?',
        correct_answer: 'Correct',
        incorrect_answers: ['Wrong1', 'Wrong2', 'Wrong3']
      }
    ];

    vi.mocked(quizApi.fetchQuizQuestions).mockResolvedValue(mockQuestions);

    renderWithProvider(<Quiz />);

    const amountInput = screen.getByLabelText(/number of questions/i);
    fireEvent.change(amountInput, { target: { value: '5' } });

    const categorySelect = screen.getByLabelText(/category/i);
    fireEvent.change(categorySelect, { target: { value: '9' } });

    const difficultySelect = screen.getByLabelText(/difficulty/i);
    fireEvent.change(difficultySelect, { target: { value: 'easy' } });

    const submitButton = screen.getByText('Start Quiz');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(quizApi.fetchQuizQuestions).toHaveBeenCalled();
    });
    
    expect(quizApi.fetchQuizQuestions).toHaveBeenCalledWith({
      numberOfQuestions: 5,
      category: '9',
      difficulty: 'easy'
    });
  });

  it('should show loading state', async () => {
    vi.mocked(quizApi.fetchQuizQuestions).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );

    renderWithProvider(<Quiz />);

    const submitButton = screen.getByText('Start Quiz');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Loading quiz...')).toBeInTheDocument();
    });
  });

  it('should show error message on API failure', async () => {
    vi.mocked(quizApi.fetchQuizQuestions).mockRejectedValue(
      new Error('Failed to fetch questions')
    );

    renderWithProvider(<Quiz />);

    const submitButton = screen.getByText('Start Quiz');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch questions/i)).toBeInTheDocument();
    });
  });

  it('should show retry button on error', async () => {
    vi.mocked(quizApi.fetchQuizQuestions).mockRejectedValue(
      new Error('Network error')
    );

    renderWithProvider(<Quiz />);

    const submitButton = screen.getByText('Start Quiz');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });

  it('should allow only numbers in amount input', () => {
    renderWithProvider(<Quiz />);

    const amountInput = screen.getByLabelText(/number of questions/i);
    expect(amountInput).toHaveAttribute('type', 'number');
  });

  it('should have min and max constraints on amount input', () => {
    renderWithProvider(<Quiz />);

    const amountInput = screen.getByLabelText(/number of questions/i);
    expect(amountInput).toHaveAttribute('min', '1');
    expect(amountInput).toHaveAttribute('max', '50');
  });
});
