
import React, { useState } from 'react';
import { Shield, Search, Send, Loader2, Sparkles, MapPin, Building2, TrendingUp } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { Branch, MilitaryProfile, SkillTranslation } from '../types';

interface SkillTranslatorProps {
  onProfileUpdate: (profile: MilitaryProfile) => void;
}

const SkillTranslator: React.FC<SkillTranslatorProps> = ({ onProfileUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SkillTranslation | null>(null);
  const [formData, setFormData] = useState<MilitaryProfile>({
    branch: 'Army',
    mosCode: '',
    mosTitle: '',
    yearsOfService: 4,
    leadershipScope: '',
    certifications: [],
    platforms: []
  });

  const branches: Branch[] = ['Army', 'Navy', 'Air Force', 'Marine Corps', 'Coast Guard', 'Space Force'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const translation = await geminiService.translateMilitarySkills(formData);
      setResult(translation);
      onProfileUpdate(formData);
    } catch (error) {
      console.error('Translation failed', error);
      alert("Failed to analyze skills. Please check your connection or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Form Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Shield className="text-blue-600" />
              Service Details
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Branch of Service</label>
                <div className="grid grid-cols-2 gap-2">
                  {branches.map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setFormData({...formData, branch: b})}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        formData.branch === b 
                          ? 'bg-blue-600 text-white shadow-md scale-[1.02]' 
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-blue-400'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">MOS/Rate Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 11B, 25B"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    value={formData.mosCode}
                    onChange={(e) => setFormData({...formData, mosCode: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Years of Service</label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    value={formData.yearsOfService}
                    onChange={(e) => setFormData({...formData, yearsOfService: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">MOS Title / Primary Duty</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Infantryman, IT Specialist"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  value={formData.mosTitle}
                  onChange={(e) => setFormData({...formData, mosTitle: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Leadership & Scope</label>
                <textarea
                  placeholder="e.g. Led squad of 9 personnel, managed $2M equipment manifest..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all min-h-[100px]"
                  value={formData.leadershipScope}
                  onChange={(e) => setFormData({...formData, leadershipScope: e.target.value})}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                {loading ? 'Mapping Experience...' : 'Translate to Civilian Skills'}
              </button>
            </form>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-xl font-bold text-slate-900">Career Match Profile</h4>
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                    <TrendingUp size={16} />
                    {result.industryMatch}% Match
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {result.civilianRoles.map((role, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600">
                        <Building2 size={20} />
                      </div>
                      <span className="font-semibold text-slate-800">{role}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h5 className="font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles size={18} className="text-blue-500" />
                    Skill Equivalencies
                  </h5>
                  <div className="space-y-3">
                    {result.transferableSkills.map((s, idx) => (
                      <div key={idx} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                        <p className="text-sm font-bold text-slate-900">{s.skill}</p>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{s.civilianContext}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h4 className="text-lg font-bold opacity-80 uppercase tracking-widest mb-1">Estimated Comp</h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black">${(result.salaryBands.median / 1000).toFixed(0)}K</span>
                      <span className="text-emerald-300 font-bold">/ year</span>
                    </div>
                    <div className="flex gap-4 mt-4 text-sm text-emerald-100 font-medium">
                      <span>Low: ${result.salaryBands.low.toLocaleString()}</span>
                      <span>High: ${result.salaryBands.high.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                    <MapPin size={32} className="text-emerald-400 mb-2" />
                    <p className="text-sm font-semibold">National Average</p>
                    <p className="text-xs opacity-70">Based on BLS 2024 Data</p>
                  </div>
                </div>
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-700/30 rounded-full blur-3xl"></div>
              </div>
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h5 className="font-bold text-slate-900 mb-4">Recommended Certifications</h5>
                <div className="flex flex-wrap gap-2">
                  {result.recommendedCerts.map((cert, i) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-12 text-center">
              <div className="p-6 bg-slate-100 rounded-full mb-6">
                <Search size={48} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">Awaiting Mapping</h4>
              <p className="max-w-xs">Complete the service profile on the left to see your civilian career translation and salary insights.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillTranslator;
