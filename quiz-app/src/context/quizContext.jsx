import { createContext, useContext, useReducer, useCallback } from 'react';
import { fetchQuizQuestions } from '../services/quizApi';

const QuizContext = createContext();

// Quiz states
const QUIZ_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_QUESTIONS: 'SET_QUESTIONS',
  SET_ERROR: 'SET_ERROR',
  NEXT_QUESTION: 'NEXT_QUESTION',
  SELECT_ANSWER: 'SELECT_ANSWER',
  RESET_QUIZ: 'RESET_QUIZ',
};

const initialState = {
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  userAnswers: [],
  isLoading: false,
  error: null,
  isQuizComplete: false,
};

function quizReducer(state, action) {
  switch (action.type) {
    case QUIZ_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null,
      };

    case QUIZ_ACTIONS.SET_QUESTIONS:
      return {
        ...state,
        questions: action.payload,
        isLoading: false,
        error: null,
      };

    case QUIZ_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case QUIZ_ACTIONS.SELECT_ANSWER:
      const currentQuestion = state.questions[state.currentQuestionIndex];
      const isCorrect = action.payload === (currentQuestion?.correctAnswer || currentQuestion?.correct_answer);
      return {
        ...state,
        userAnswers: [...state.userAnswers, action.payload],
        score: isCorrect ? state.score + 1 : state.score,
      };

    case QUIZ_ACTIONS.NEXT_QUESTION:
      const nextIndex = state.currentQuestionIndex + 1;
      return {
        ...state,
        currentQuestionIndex: nextIndex,
        isQuizComplete: nextIndex >= state.questions.length,
      };

    case QUIZ_ACTIONS.RESET_QUIZ:
      return initialState;

    default:
      return state;
  }
}

export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const loadQuestions = useCallback(async (amount = 10, category = '', difficulty = '') => {
    console.log('loadQuestions called with:', { amount, category, difficulty });
    dispatch({ type: QUIZ_ACTIONS.SET_LOADING, payload: true });
    
    try {
      const questions = await fetchQuizQuestions({ 
        numberOfQuestions: amount, 
        category, 
        difficulty 
      });
      console.log('Questions loaded:', questions);
      dispatch({ type: QUIZ_ACTIONS.SET_QUESTIONS, payload: questions });
    } catch (error) {
      console.error('Error loading questions:', error);
      dispatch({ type: QUIZ_ACTIONS.SET_ERROR, payload: error.message });
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

  const value = {
    ...state,
    loadQuestions,
    selectAnswer,
    nextQuestion,
    resetQuiz,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuizContext() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizContext must be used within QuizProvider');
  }
  return context;
}
