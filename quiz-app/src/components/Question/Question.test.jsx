import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Question from './Question';

const baseQuestions = [
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

let mockQuizContext;

vi.mock('../../context/QuizContext', async () => {
  const actual = await vi.importActual('../../context/QuizContext');
  return {
    ...actual,
    useQuizContext: () => mockQuizContext,
  };
});

beforeEach(() => {
  mockQuizContext = {
    questions: baseQuestions,
    currentQuestionIndex: 0,
    selectAnswer: vi.fn(),
    nextQuestion: vi.fn(),
  };

  vi.clearAllMocks();
});

describe('Question component', () => {
  it('renders question text and options', () => {
    render(<Question />);

    expect(
      screen.getByText('What is 2 + 2?')
    ).toBeInTheDocument();

    ['3', '4', '5', '6'].forEach((option) => {
      expect(screen.getByRole('button', { name: option }))
        .toBeInTheDocument();
    });
  });

  it('shows question progress', () => {
    render(<Question />);
    expect(
      screen.getByText('Question 1 of 2')
    ).toBeInTheDocument();
  });

  it('keeps submit disabled until an option is selected', async () => {
    const user = userEvent.setup();
    render(<Question />);

    const submit = screen.getByRole('button', {
      name: /submit answer/i,
    });

    expect(submit).toBeDisabled();

    await user.click(
      screen.getByRole('button', { name: '4' })
    );

    expect(submit).toBeEnabled();
  });

  it('calls selectAnswer on submit', async () => {
    const user = userEvent.setup();
    render(<Question />);

    await user.click(
      screen.getByRole('button', { name: '4' })
    );

    await user.click(
      screen.getByRole('button', { name: /submit answer/i })
    );

    expect(mockQuizContext.selectAnswer)
      .toHaveBeenCalledWith('4');
  });

  it('shows correct feedback for correct answer', async () => {
    const user = userEvent.setup();
    render(<Question />);

    await user.click(
      screen.getByRole('button', { name: '4' })
    );

    await user.click(
      screen.getByRole('button', { name: /submit answer/i })
    );

    expect(
      screen.getByText('🎉 Correct!')
    ).toBeInTheDocument();
  });

  it('shows incorrect feedback for wrong answer', async () => {
    const user = userEvent.setup();
    render(<Question />);

    await user.click(
      screen.getByRole('button', { name: '3' })
    );

    await user.click(
      screen.getByRole('button', { name: /submit answer/i })
    );

    expect(
      screen.getByText('❌ Incorrect!')
    ).toBeInTheDocument();
  });

  it('shows and triggers next question button', async () => {
    const user = userEvent.setup();
    render(<Question />);

    await user.click(
      screen.getByRole('button', { name: '4' })
    );

    await user.click(
      screen.getByRole('button', { name: /submit answer/i })
    );

    const nextButton = screen.getByRole('button', {
      name: /next question/i,
    });

    expect(nextButton).toBeInTheDocument();

    await user.click(nextButton);

    expect(mockQuizContext.nextQuestion)
      .toHaveBeenCalled();
  });

  it('prevents changing selection after submission', async () => {
    const user = userEvent.setup();
    render(<Question />);

    await user.click(
      screen.getByRole('button', { name: '4' })
    );

    await user.click(
      screen.getByRole('button', { name: /submit answer/i })
    );

    await user.click(
      screen.getByRole('button', { name: '3' })
    );

    expect(mockQuizContext.selectAnswer)
      .toHaveBeenCalledTimes(1);
  });

  it('renders nothing when there is no current question', () => {
    mockQuizContext.questions = [];

    const { container } = render(<Question />);
    expect(container.firstChild).toBeNull();
  });
});