
import React, { useState } from 'react';
import { FileText, Wand2, Copy, Check, Loader2, Info } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const ResumeOptimizer: React.FC = () => {
  const [content, setContent] = useState('');
  const [industry, setIndustry] = useState('Technology');
  const [optimized, setOptimized] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOptimize = async () => {
    if (!content) return;
    setLoading(true);
    try {
      const res = await geminiService.optimizeResume(content, industry);
      setOptimized(res);
    } catch (err) {
      console.error(err);
      alert("Failed to optimize resume content.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(optimized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Resume AI Optimizer</h2>
          <p className="text-slate-500">Translate military jargon into high-impact civilian language.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-slate-700">Target Industry:</label>
          <select 
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {['Technology', 'Defense Contracting', 'Logistics', 'Healthcare', 'Finance', 'Energy'].map(i => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <FileText size={18} className="text-slate-400" />
              Raw Military Content
            </h4>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Input your bullets or brag sheet</span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[400px] p-6 bg-white border border-slate-200 rounded-3xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 leading-relaxed font-mono text-sm"
            placeholder="e.g. Served as Platoon Sergeant for 3rd Platoon. Responsible for 40 soldiers and $4M in gear. Conducted 15 missions..."
          />
          <button
            onClick={handleOptimize}
            disabled={loading || !content}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
            {loading ? 'Optimizing for ATS...' : 'Optimize Content'}
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <Check size={18} className="text-emerald-500" />
              Civilian Optimized Output
            </h4>
            {optimized && (
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Result'}
              </button>
            )}
          </div>
          <div className="relative group">
            <div className={`w-full min-h-[400px] p-8 bg-slate-900 text-slate-300 rounded-3xl shadow-xl leading-relaxed whitespace-pre-wrap ${!optimized && 'flex flex-col items-center justify-center text-center'}`}>
              {loading ? (
                <div className="space-y-4 w-full">
                  <div className="h-4 bg-slate-800 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-slate-800 rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-slate-800 rounded animate-pulse w-2/3"></div>
                  <div className="h-4 bg-slate-800 rounded animate-pulse w-1/2"></div>
                </div>
              ) : optimized ? (
                <div className="text-sm sm:text-base">{optimized}</div>
              ) : (
                <div className="text-slate-600 max-w-xs space-y-4">
                  <Wand2 size={48} className="mx-auto opacity-20" />
                  <p className="text-sm italic">"The AI will convert operational military activities into business-focused outcomes like efficiency gains, cost savings, and risk management."</p>
                </div>
              )}
            </div>
            {optimized && (
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                  Quantified Impact
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
             <Info className="text-blue-500 mt-1 shrink-0" size={20} />
             <p className="text-xs text-blue-700 leading-relaxed">
               <strong>Pro-Tip:</strong> Review each bullet point. Ensure the quantified metrics (percentages, dollar amounts) accurately reflect your actual performance. MissionBridge AI focuses on <strong>Action → Result</strong> frameworks.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeOptimizer;
