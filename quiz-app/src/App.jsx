
import './index.css'

function App() {
  
  return (
    <>
   <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
  <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
    
    {/* The Styled Heading */}
    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 text-center mb-2">
      Quiz App
    </h1>
    
    <p className="text-slate-500 text-center text-sm mb-6">
      Challenge your knowledge in 15 seconds!
    </p>

    <div className="space-y-4">
      {/* This is where your questions will go */}
      <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
        Start Quiz
      </button>
    </div>

  </div>
</div>
    </>
  )
}

export default App
