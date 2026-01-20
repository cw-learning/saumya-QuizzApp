import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import QuizGrid from './QuizGrid';
import * as QuizContext from '../../context/QuizContext';
import * as quizApi from '../../services/quizApi';

// Mock services and context
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
    // ESM-safe mock for decodeHtmlEntities
    vi.mocked(quizApi.decodeHtmlEntities).mockImplementation((str) => str);
  });

  it('should render the grid title', () => {
    renderWithContext();
    expect(screen.getByText('Detailed Question Review')).toBeInTheDocument();
  });

  it('should render AG Grid with correct data', () => {
    renderWithContext();
    expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
  });

  it('should render all column headers', () => {
    renderWithContext();
    ['Question', 'Your Answer', 'Correct Answer', 'Correct', 'Difficulty'].forEach((header) =>
      expect(screen.getByText(header)).toBeInTheDocument()
    );
  });

  it('should display questions in the grid', () => {
    renderWithContext();
    mockQuestions.forEach((q) => expect(screen.getByText(q.question)).toBeInTheDocument());
  });

  it('should display user answers in the grid', () => {
    renderWithContext();
    expect(screen.getAllByText('4').length).toBeGreaterThan(0);
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getAllByText('Physics theory').length).toBeGreaterThan(0);
  });

  it('should display correct answers in the grid', () => {
    renderWithContext();
    expect(screen.getByText('Paris')).toBeInTheDocument();
  });

  it('should display difficulty levels', () => {
    renderWithContext();
    ['easy', 'medium', 'hard'].forEach((level) => expect(screen.getByText(level)).toBeInTheDocument());
  });

  it('should show "✅ Yes" for correct answers', () => {
    renderWithContext();
    expect(screen.getAllByText('✅ Yes').length).toBeGreaterThan(0);
  });

  it('should show "❌ No" for incorrect answers', () => {
    renderWithContext();
    expect(screen.getAllByText('❌ No').length).toBeGreaterThan(0);
  });

  it('should render correct number of rows', () => {
    renderWithContext();
    const grid = screen.getByTestId('ag-grid-mock');
    expect(grid.querySelectorAll('tbody tr')).toHaveLength(mockQuestions.length);
  });

  it('should handle empty questions array', () => {
    renderWithContext({ questions: [], userAnswers: [] });
    const grid = screen.getByTestId('ag-grid-mock');
    expect(grid.querySelectorAll('tbody tr')).toHaveLength(0);
  });

  it('should handle missing user answers', () => {
    renderWithContext({ questions: mockQuestions, userAnswers: ['4'] });
    expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
  });

  it('should decode HTML entities in questions', () => {
    // Override mock for this test only
    vi.mocked(quizApi.decodeHtmlEntities).mockImplementation((str) => str.replace('&amp;', '&'));

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
    renderWithContext({
      questions: [
        {
          question: 'Test question',
          correctAnswer: 'Correct',
          incorrectAnswers: ['Wrong1', 'Wrong2'],
          difficulty: 'easy',
        },
      ],
      userAnswers: ['Correct'],
    });
    expect(screen.getByText('✅ Yes')).toBeInTheDocument();
  });

  it('should correctly identify incorrect answers', () => {
    renderWithContext({
      questions: [
        {
          question: 'Test question',
          correctAnswer: 'Correct',
          incorrectAnswers: ['Wrong1', 'Wrong2'],
          difficulty: 'easy',
        },
      ],
      userAnswers: ['Wrong1'],
    });
    expect(screen.getByText('❌ No')).toBeInTheDocument();
  });

  it('should render with ag-theme-alpine class and correct height', () => {
    const { container } = renderWithContext();
    const themeDiv = container.querySelector('.ag-theme-alpine');
    expect(themeDiv).toBeInTheDocument();
    expect(themeDiv).toHaveStyle({ height: '600px' });
  });
});
