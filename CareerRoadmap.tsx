
import React, { useState, useEffect } from 'react';
import { Map, Calendar, Milestone, TrendingUp, Info, Loader2, Target } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { CareerRoadmap, MilitaryProfile } from '../types';

interface RoadmapProps {
  profile: MilitaryProfile | null;
}

const CareerRoadmapUI: React.FC<RoadmapProps> = ({ profile }) => {
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [targetIndustry, setTargetIndustry] = useState('Cybersecurity');
  const [targetSalary, setTargetSalary] = useState('$130,000');

  useEffect(() => {
    if (profile && !roadmap) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleGenerate = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const res = await geminiService.generateRoadmap(profile, targetIndustry, targetSalary);
      setRoadmap(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-6 bg-blue-50 rounded-full text-blue-600">
          <Target size={48} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Profile Required</h3>
        <p className="text-slate-500 max-w-md">Please complete the Skill Translator first so we can map your military experience to your target roadmap.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Strategic Roadmap</h2>
          <p className="text-slate-500 mt-2">A personalized, tactical path from your current MOS to a high-earning civilian career.</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Industry</label>
            <input 
              type="text" 
              value={targetIndustry} 
              onChange={e => setTargetIndustry(e.target.value)}
              className="text-sm font-semibold bg-slate-50 px-3 py-1.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Salary</label>
            <input 
              type="text" 
              value={targetSalary} 
              onChange={e => setTargetSalary(e.target.value)}
              className="text-sm font-semibold bg-slate-50 px-3 py-1.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Map size={16} />}
            Generate Path
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
          <Loader2 size={48} className="text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Modeling career progression and skill gaps...</p>
        </div>
      ) : roadmap ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Main Roadmap */}
          <div className="xl:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <Calendar className="text-blue-600" />
                <h3 className="text-xl font-bold text-slate-900">Phase 1: 0 - 24 Months</h3>
              </div>
              <div className="space-y-8 relative">
                {/* Visual Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-100 z-0"></div>
                
                {roadmap.twoYearPath.map((step, idx) => (
                  <div key={idx} className="relative z-10 pl-16 group">
                    <div className="absolute left-4 top-1 w-4 h-4 rounded-full border-4 border-white bg-blue-600 shadow-md group-hover:scale-125 transition-transform"></div>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{step.period}</span>
                        <h4 className="text-lg font-bold text-slate-900 mt-1">{step.objective}</h4>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {step.actionItems.map((item, i) => (
                            <span key={i} className="px-2 py-1 bg-slate-50 text-slate-600 rounded text-[11px] font-medium border border-slate-100">{item}</span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 shrink-0">
                         <p className="text-[10px] font-bold text-emerald-700 uppercase">Target Salary</p>
                         <p className="text-sm font-bold text-emerald-800">{step.estimatedSalary || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <TrendingUp size={160} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <Milestone className="text-blue-400" />
                  <h3 className="text-xl font-bold">Phase 2: Year 3 - 5</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {roadmap.fiveYearPath.map((step, idx) => (
                    <div key={idx} className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                      <span className="text-[10px] font-bold text-blue-400 uppercase">{step.period}</span>
                      <h4 className="font-bold mt-1 text-slate-100">{step.objective}</h4>
                      <p className="text-sm text-slate-400 mt-2 line-clamp-2">{step.milestone}</p>
                      <div className="mt-4 flex items-center justify-between text-xs font-bold">
                        <span className="text-emerald-400">{step.estimatedSalary}</span>
                        <span className="opacity-50">Lvl: Senior</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Analysis */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Info size={18} className="text-blue-500" />
                Skill Gap Analysis
              </h3>
              <div className="space-y-5">
                {roadmap.skillGapAnalysis.map((gap, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800">{gap.skill}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                        gap.gapLevel === 'High' ? 'bg-red-100 text-red-600' : 
                        gap.gapLevel === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {gap.gapLevel} Gap
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{gap.recommendation}</p>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full transition-all duration-1000 ${
                         gap.gapLevel === 'High' ? 'bg-red-500 w-1/4' : 
                         gap.gapLevel === 'Medium' ? 'bg-amber-500 w-1/2' : 'bg-emerald-500 w-3/4'
                       }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-lg shadow-blue-200">
               <h4 className="font-bold text-lg mb-2">Confidence Level</h4>
               <div className="flex items-baseline gap-1">
                 <span className="text-5xl font-black">{Math.round(roadmap.confidence * 100)}%</span>
               </div>
               <p className="text-xs text-blue-100 mt-4 leading-relaxed">
                 Based on current public labor market data for {targetIndustry}. Roadmaps are projections and may vary based on geographic location and individual interview performance.
               </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CareerRoadmapUI;
