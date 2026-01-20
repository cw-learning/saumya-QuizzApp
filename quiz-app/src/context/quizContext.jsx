import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { fetchQuizQuestions } from '../services/quizApi';

const QuizContext = createContext(null);

// Quiz states
const QUIZ_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_QUESTIONS: 'SET_QUESTIONS',
  SET_ERROR: 'SET_ERROR',
  NEXT_QUESTION: 'NEXT_QUESTION',
  SELECT_ANSWER: 'SELECT_ANSWER',
  RESET_QUIZ: 'RESET_QUIZ',
};

// Initial state factory
const getInitialState = () => ({
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  userAnswers: [],
  isLoading: false,
  error: null,
  isQuizComplete: false,
});

const initialState = getInitialState();

// Reducer
function quizReducer(state, action) {
  switch (action.type) {
    case QUIZ_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null,
      };

    case QUIZ_ACTIONS.SET_QUESTIONS: {
      return {
        ...state,
        questions: action.payload,
        currentQuestionIndex: 0,
        score: 0,
        userAnswers: [],
        isQuizComplete: false,
        isLoading: false,
        error: null,
      };
    }

    case QUIZ_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case QUIZ_ACTIONS.SELECT_ANSWER: {
      const currentQuestion = state.questions[state.currentQuestionIndex];
      if (!currentQuestion || state.isQuizComplete) return state;

      // Prevent double-answering
      const hasAnswered = state.userAnswers[state.currentQuestionIndex] != null;
      if (hasAnswered) return state;

      const correctAnswer = currentQuestion.correctAnswer ?? currentQuestion.correct_answer;
      const nextUserAnswers = [...state.userAnswers];
      nextUserAnswers[state.currentQuestionIndex] = action.payload;

      return {
        ...state,
        userAnswers: nextUserAnswers,
        score: action.payload === correctAnswer ? state.score + 1 : state.score,
      };
    }

    case QUIZ_ACTIONS.NEXT_QUESTION: {
      if (state.isQuizComplete || state.questions.length === 0) return state;

      const nextIndex = state.currentQuestionIndex + 1;
      const isQuizComplete = nextIndex >= state.questions.length;

      return {
        ...state,
        currentQuestionIndex: isQuizComplete ? state.currentQuestionIndex : nextIndex,
        isQuizComplete,
      };
    }

    case QUIZ_ACTIONS.RESET_QUIZ:
      return getInitialState();

    default:
      return state;
  }
}

// Provider
export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const loadQuestions = useCallback(async (amount = 10, category = '', difficulty = '') => {
    dispatch({ type: QUIZ_ACTIONS.SET_LOADING, payload: true });

    try {
      const questions = await fetchQuizQuestions({
        numberOfQuestions: amount,
        category,
        difficulty,
      });
      dispatch({ type: QUIZ_ACTIONS.SET_QUESTIONS, payload: questions });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load questions';
      dispatch({ type: QUIZ_ACTIONS.SET_ERROR, payload: message });
    }
  }, []);

  const selectAnswer = useCallback((answer) => {
    dispatch({ type: QUIZ_ACTIONS.SELECT_ANSWER, payload: answer });
  }, []);

  const nextQuestion = useCallback(() => {
    dispatch({ type: QUIZ_ACTIONS.NEXT_QUESTION });
  }, []);

  const resetQuiz = useCallback(() => {
    dispatch({ type: QUIZ_ACTIONS.RESET_QUIZ });
  }, []);

  // Memoize value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({ ...state, loadQuestions, selectAnswer, nextQuestion, resetQuiz }),
    [state, loadQuestions, selectAnswer, nextQuestion, resetQuiz]
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

// Custom hook
export function useQuizContext() {
  const context = useContext(QuizContext);
  if (context === null) {
    throw new Error('useQuizContext must be used within QuizProvider');
  }
  return context;
}
