import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; 
import Quiz from './Quiz';
import { QuizProvider } from '../../context/QuizContext';
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

  it('should update amount input value', async () => {
    const user = userEvent.setup(); 
    renderWithProvider(<Quiz />);

    const amountInput = screen.getByLabelText(/number of questions/i);
    await user.clear(amountInput);
    await user.type(amountInput, '15');

    expect(amountInput).toHaveValue(15);
  });

  it('should update category select value', async () => {
    const user = userEvent.setup(); 
    renderWithProvider(<Quiz />);

    const categorySelect = screen.getByLabelText(/category/i);
    await user.selectOptions(categorySelect, 'General Knowledge');

    expect(categorySelect).toHaveValue('General Knowledge');
  });

  it('should update difficulty select value', async () => {
    const user = userEvent.setup(); 
    renderWithProvider(<Quiz />);

    const difficultySelect = screen.getByLabelText(/difficulty/i);
    await user.selectOptions(difficultySelect, 'easy');

    expect(difficultySelect).toHaveValue('easy');
  });

  it('should show validation error for empty amount', async () => {
    const user = userEvent.setup(); 
    renderWithProvider(<Quiz />);

    const amountInput = screen.getByLabelText(/number of questions/i);
    await user.clear(amountInput);

    const submitButton = screen.getByText('Start Quiz');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/number of questions is required/i)).toBeInTheDocument();
    });
  });

  it('should call loadQuestions with correct options on submit', async () => {
    const user = userEvent.setup(); 
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
    await user.clear(amountInput);
    await user.type(amountInput, '5');

    const categorySelect = screen.getByLabelText(/category/i);
    await user.selectOptions(categorySelect, 'Science: Computers');

    const difficultySelect = screen.getByLabelText(/difficulty/i);
    await user.selectOptions(difficultySelect, 'easy');

    const submitButton = screen.getByText('Start Quiz');
    await user.click(submitButton);

    await waitFor(() => {
      expect(quizApi.fetchQuizQuestions).toHaveBeenCalled();
    });

    expect(quizApi.fetchQuizQuestions).toHaveBeenCalledWith({
      numberOfQuestions: 5,
      category: 'Science: Computers',
      difficulty: 'easy'
    });
  });

  it('should show loading state', async () => {
    const user = userEvent.setup(); 
    vi.mocked(quizApi.fetchQuizQuestions).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );

    renderWithProvider(<Quiz />);

    const submitButton = screen.getByText('Start Quiz');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Loading quiz...')).toBeInTheDocument();
    });
  });

  it('should show error message on API failure', async () => {
    const user = userEvent.setup(); 
    vi.mocked(quizApi.fetchQuizQuestions).mockRejectedValue(
      new Error('Failed to fetch questions')
    );

    renderWithProvider(<Quiz />);

    const submitButton = screen.getByText('Start Quiz');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch questions/i)).toBeInTheDocument();
    });
  });

  it('should show retry button on error', async () => {
    const user = userEvent.setup(); 
    vi.mocked(quizApi.fetchQuizQuestions).mockRejectedValue(
      new Error('Network error')
    );

    renderWithProvider(<Quiz />);

    const submitButton = screen.getByText('Start Quiz');
    await user.click(submitButton);

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
