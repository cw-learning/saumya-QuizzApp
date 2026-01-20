import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import QuizGrid from './QuizGrid';
import * as QuizContext from '../../context/QuizContext';
import * as quizApi from '../../services/quizApi';

vi.mock('../../services/quizApi');
vi.mock('../../context/QuizContext', async () => {
  const actual = await vi.importActual('../../context/QuizContext');
  return {
    ...actual,
    useQuizContext: vi.fn(),
  };
});

// Mock AG Grid React component
vi.mock('ag-grid-react', () => ({
  AgGridReact: ({ rowData, columnDefs }) => (
    <div data-testid="ag-grid-mock">
      <table>
        <thead>
          <tr>
            {columnDefs.map((col) => (
              <th key={col.field}>{col.headerName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowData.map((row, index) => (
            <tr key={index}>
              {columnDefs.map((col) => (
                <td key={col.field}>
                  {col.cellRenderer
                    ? col.cellRenderer({ value: row[col.field] })
                    : row[col.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
}));

vi.mock('ag-grid-community', () => ({
  AllCommunityModule: {},
  ModuleRegistry: {
    registerModules: vi.fn(),
  },
}));

const mockQuestions = [
  {
    question: 'What is 2+2?',
    correctAnswer: '4',
    incorrectAnswers: ['3', '5', '6'],
    difficulty: 'easy',
  },
  {
    question: 'What is the capital of France?',
    correctAnswer: 'Paris',
    incorrectAnswers: ['London', 'Berlin', 'Madrid'],
    difficulty: 'medium',
  },
  {
    question: 'What is quantum mechanics?',
    correctAnswer: 'Physics theory',
    incorrectAnswers: ['Math theory', 'Chemistry theory', 'Biology theory'],
    difficulty: 'hard',
  },
];

const mockUserAnswers = ['4', 'London', 'Physics theory'];

const renderWithContext = (contextValue = {}) => {
  const defaultContext = {
    questions: mockQuestions,
    userAnswers: mockUserAnswers,
    score: 2,
    currentQuestionIndex: 0,
    isQuizComplete: false,
    isLoading: false,
    error: null,
    resetQuiz: vi.fn(),
    selectAnswer: vi.fn(),
    nextQuestion: vi.fn(),
    loadQuestions: vi.fn(),
    ...contextValue,
  };

  QuizContext.useQuizContext.mockReturnValue(defaultContext);
  return render(<QuizGrid />);
};

describe('QuizGrid Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    quizApi.decodeHtmlEntities = vi.fn((str) => str);
  });

  it('should render the grid title', () => {
    renderWithContext();
    expect(screen.getByText('Detailed Question Review')).toBeInTheDocument();
  });

  it('should render AG Grid with correct data', () => {
    renderWithContext();
    const grid = screen.getByTestId('ag-grid-mock');
    expect(grid).toBeInTheDocument();
  });

  it('should render all column headers', () => {
    renderWithContext();
    expect(screen.getByText('Question')).toBeInTheDocument();
    expect(screen.getByText('Your Answer')).toBeInTheDocument();
    expect(screen.getByText('Correct Answer')).toBeInTheDocument();
    expect(screen.getByText('Correct')).toBeInTheDocument();
    expect(screen.getByText('Difficulty')).toBeInTheDocument();
  });

  it('should display questions in the grid', () => {
    renderWithContext();
    expect(screen.getByText('What is 2+2?')).toBeInTheDocument();
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
    expect(screen.getByText('What is quantum mechanics?')).toBeInTheDocument();
  });

  it('should display user answers in the grid', () => {
    renderWithContext();
    expect(screen.getAllByText('4').length).toBeGreaterThan(0);
    expect(screen.getByText('London')).toBeInTheDocument();
    const physicsTheoryElements = screen.getAllByText('Physics theory');
    expect(physicsTheoryElements.length).toBeGreaterThan(0);
  });

  it('should display correct answers in the grid', () => {
    renderWithContext();
    expect(screen.getByText('Paris')).toBeInTheDocument();
  });

  it('should display difficulty levels', () => {
    renderWithContext();
    expect(screen.getByText('easy')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('hard')).toBeInTheDocument();
  });

  it('should show "✅ Yes" for correct answers', () => {
    renderWithContext();
    const yesElements = screen.getAllByText('✅ Yes');
    expect(yesElements.length).toBeGreaterThan(0);
  });

  it('should show "❌ No" for incorrect answers', () => {
    renderWithContext();
    const noElements = screen.getAllByText('❌ No');
    expect(noElements.length).toBeGreaterThan(0);
  });

  it('should render correct number of rows', () => {
    renderWithContext();
    const grid = screen.getByTestId('ag-grid-mock');
    const rows = grid.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(3);
  });

  it('should handle empty questions array', () => {
    renderWithContext({ questions: [], userAnswers: [] });
    const grid = screen.getByTestId('ag-grid-mock');
    const rows = grid.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(0);
  });

  it('should handle missing user answers', () => {
    renderWithContext({
      questions: mockQuestions,
      userAnswers: ['4'], // Only one answer
    });
    const grid = screen.getByTestId('ag-grid-mock');
    expect(grid).toBeInTheDocument();
  });

  it('should decode HTML entities in questions', () => {
    quizApi.decodeHtmlEntities = vi.fn((str) => str.replace('&amp;', '&'));
    
    const questionsWithEntities = [
      {
        question: 'What is A &amp; B?',
        correctAnswer: 'C &amp; D',
        incorrectAnswers: ['E', 'F'],
        difficulty: 'easy',
      },
    ];

    renderWithContext({
      questions: questionsWithEntities,
      userAnswers: ['C & D'],
    });

    expect(quizApi.decodeHtmlEntities).toHaveBeenCalled();
  });

  it('should correctly identify correct answers', () => {
    const questions = [
      {
        question: 'Test question',
        correctAnswer: 'Correct',
        incorrectAnswers: ['Wrong1', 'Wrong2'],
        difficulty: 'easy',
      },
    ];

    renderWithContext({
      questions,
      userAnswers: ['Correct'],
    });

    expect(screen.getByText('✅ Yes')).toBeInTheDocument();
  });

  it('should correctly identify incorrect answers', () => {
    const questions = [
      {
        question: 'Test question',
        correctAnswer: 'Correct',
        incorrectAnswers: ['Wrong1', 'Wrong2'],
        difficulty: 'easy',
      },
    ];

    renderWithContext({
      questions,
      userAnswers: ['Wrong1'],
    });

    expect(screen.getByText('❌ No')).toBeInTheDocument();
  });

  it('should apply correct column definitions', () => {
    renderWithContext();
    
    // Check all required columns are present
    expect(screen.getByText('Question')).toBeInTheDocument();
    expect(screen.getByText('Your Answer')).toBeInTheDocument();
    expect(screen.getByText('Correct Answer')).toBeInTheDocument();
    expect(screen.getByText('Correct')).toBeInTheDocument();
    expect(screen.getByText('Difficulty')).toBeInTheDocument();
  });

  it('should render with ag-theme-alpine class', () => {
    const { container } = renderWithContext();
    const themeDiv = container.querySelector('.ag-theme-alpine');
    expect(themeDiv).toBeInTheDocument();
  });

  it('should have correct height styling', () => {
    const { container } = renderWithContext();
    const themeDiv = container.querySelector('.ag-theme-alpine');
    expect(themeDiv).toHaveStyle({ height: '600px' });
  });
});
