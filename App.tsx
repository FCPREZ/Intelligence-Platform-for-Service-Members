
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Map, 
  Mic2, 
  ChevronRight, 
  LogOut,
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import SkillTranslator from './components/SkillTranslator';
import ResumeOptimizer from './components/ResumeOptimizer';
import CareerRoadmapUI from './components/CareerRoadmap';
import InterviewSim from './components/InterviewSim';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState<any>(null);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'translator', label: 'Skill Translator', icon: Briefcase },
    { id: 'resume', label: 'Resume AI', icon: FileText },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'interview', label: 'Interview Sim', icon: Mic2 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard profile={profile} onNavigate={setActiveTab} />;
      case 'translator': return <SkillTranslator onProfileUpdate={setProfile} />;
      case 'resume': return <ResumeOptimizer />;
      case 'roadmap': return <CareerRoadmapUI profile={profile} />;
      case 'interview': return <InterviewSim />;
      default: return <Dashboard profile={profile} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed inset-y-0 shadow-2xl z-50">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="p-2 bg-blue-600 rounded-lg shadow-inner">
            <Shield size={24} className="text-white" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">MissionBridge</h1>
        </div>
        
        <nav className="flex-1 mt-6 px-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <tab.icon size={20} className={activeTab === tab.id ? 'text-white' : 'group-hover:text-blue-400'} />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-slate-300">Operational</span>
            </div>
          </div>
          <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-full px-2">
            <LogOut size={18} />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 overflow-y-auto">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm font-medium">Platform</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-slate-900 font-semibold">{tabs.find(t => t.id === activeTab)?.label}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <img src="https://picsum.photos/32/32?random=1" className="w-8 h-8 rounded-full border-2 border-white" alt="avatar" />
              <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">+1</div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
