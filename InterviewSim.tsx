
import React, { useState } from 'react';
import { Mic2, MessageSquare, Play, RefreshCw, Send, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { InterviewQuestion } from '../types';

const InterviewSim: React.FC = () => {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [history, setHistory] = useState<{q: string, a: string}[]>([]);
  const [role, setRole] = useState('Product Manager');
  const [industry, setIndustry] = useState('Technology');

  const startSim = async () => {
    setLoading(true);
    try {
      const qs = await geminiService.getInterviewQuestions(industry, role);
      setQuestions(qs);
      setSessionStarted(true);
      setCurrentIdx(0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    setHistory([...history, { q: questions[currentIdx].question, a: userAnswer }]);
    setUserAnswer('');
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Completed session
    }
  };

  const isCompleted = currentIdx === questions.length - 1 && history.length === questions.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Interview Simulator</h2>
        <p className="text-slate-500">Sharpen your responses and civilian communication skills.</p>
      </div>

      {!sessionStarted ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-xl flex flex-col items-center gap-8 text-center">
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center animate-bounce duration-[2000ms]">
            <Mic2 size={48} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase text-left mb-1">Target Role</label>
              <input 
                value={role} onChange={e => setRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase text-left mb-1">Industry</label>
              <input 
                value={industry} onChange={e => setIndustry(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          <button 
            onClick={startSim}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-2 active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Play fill="currentColor" size={20} />}
            {loading ? 'Generating Questions...' : 'Begin Simulation'}
          </button>
        </div>
      ) : isCompleted ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center space-y-8">
           <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
             <CheckCircle2 size={40} />
           </div>
           <h3 className="text-2xl font-bold">Session Complete!</h3>
           <p className="text-slate-500">Great work. Your responses are being analyzed for executive presence and impact quantification.</p>
           <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto text-left">
              {history.map((h, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Question {i+1}</p>
                  <p className="font-semibold text-slate-800 mb-2">{h.q}</p>
                  <p className="text-sm text-slate-600 italic">"{h.a}"</p>
                </div>
              ))}
           </div>
           <button 
            onClick={() => { setSessionStarted(false); setHistory([]); }}
            className="flex items-center gap-2 mx-auto text-blue-600 font-bold hover:underline"
           >
             <RefreshCw size={18} />
             Start New Session
           </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg">
             <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                 <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold">Q{currentIdx + 1}</div>
                 <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{questions[currentIdx]?.type}</span>
               </div>
               <div className="flex items-center gap-1">
                 {questions.map((_, i) => (
                   <div key={i} className={`w-8 h-1 rounded-full ${i <= currentIdx ? 'bg-blue-600' : 'bg-slate-100'}`} />
                 ))}
               </div>
             </div>
             
             <h3 className="text-2xl font-bold text-slate-900 mb-6 leading-tight">
               "{questions[currentIdx]?.question}"
             </h3>
             
             <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                <MessageSquare className="text-blue-500 mt-1 shrink-0" size={18} />
                <p className="text-sm text-blue-700 font-medium">
                  <strong>Hint:</strong> {questions[currentIdx]?.hint}
                </p>
             </div>
          </div>

          <div className="space-y-4">
            <textarea
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              className="w-full min-h-[200px] bg-white border border-slate-200 p-8 rounded-3xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg font-medium text-slate-700"
              placeholder="Type your response here or click the mic to speak..."
            />
            <div className="flex justify-between items-center">
              <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold transition-colors">
                <Mic2 size={20} />
                Voice Answer
              </button>
              <button
                onClick={nextQuestion}
                disabled={!userAnswer}
                className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-2xl font-bold shadow-xl transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {currentIdx === questions.length - 1 ? 'Finish Simulation' : 'Next Question'}
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSim;
