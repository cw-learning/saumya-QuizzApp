import { AgGridReact } from 'ag-grid-react';

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

import { useMemo } from 'react';

import { useQuizContext } from '../../context/QuizContext';

import { decodeHtmlEntities } from '../../services/quizApi';

import 'ag-grid-community/styles/ag-theme-alpine.css';



// Register AG Grid modules

ModuleRegistry.registerModules([AllCommunityModule]);



export default function QuizGrid() {

  const { questions, userAnswers } = useQuizContext();



  // Prepare AG Grid row data

  const rowData = useMemo(

    () =>

      questions.map((q, index) => {

        const userAnswer = userAnswers[index] || '';

        const isCorrect = userAnswer === q.correctAnswer;

        return {

          question: decodeHtmlEntities(q.question),

          userAnswer: decodeHtmlEntities(userAnswer),

          correctAnswer: decodeHtmlEntities(q.correctAnswer),

          isCorrect,

          difficulty: q.difficulty,

        };

      }),

    [questions, userAnswers]

  );
    const columnDefs = useMemo(

    () => [

      { field: 'question', headerName: 'Question' },

      { field: 'userAnswer', headerName: 'Your Answer' },

      { field: 'correctAnswer', headerName: 'Correct Answer' },

      { 

        field: 'isCorrect', 

        headerName: 'Correct',

        cellRenderer: (params) => params.value ? '✅ Yes' : '❌ No'

      },

      { field: 'difficulty', headerName: 'Difficulty' },

    ],

    []

  );



  

  const defaultColDef = useMemo(

    () => ({

      flex: 2,

      minWidth: 100,

      resizable: true,

      filter: true,

    }),

    []

  );



  return (

    <div className="w-full bg-white py-12 px-4">

      <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center"> Detailed Question Review</h3>

      <div className="ag-theme-alpine w-full" style={{ height: '600px' }}>

        <AgGridReact

          rowData={rowData}

          columnDefs={columnDefs}

          defaultColDef={defaultColDef}

          rowHeight={60}

          headerHeight={50}

          domLayout="normal"

        />

      </div>

    </div>

  );

}

