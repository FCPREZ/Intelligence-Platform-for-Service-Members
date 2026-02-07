
import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Users, 
  Target, 
  Banknote,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  Cell
} from 'recharts';

interface DashboardProps {
  profile: any;
  onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, onNavigate }) => {
  const readinessData = [
    { subject: 'Financial', A: 85, fullMark: 100 },
    { subject: 'Professional', A: 40, fullMark: 100 },
    { subject: 'Networking', A: 65, fullMark: 100 },
    { subject: 'Skills', A: 75, fullMark: 100 },
    { subject: 'Docs', A: 30, fullMark: 100 },
  ];

  const salaryBenchmarks = [
    { name: 'Military Base', salary: 65000, color: '#94a3b8' },
    { name: 'Target Role (Median)', salary: 115000, color: '#2563eb' },
    { name: 'Target Role (High)', salary: 145000, color: '#059669' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header / Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Welcome Back, Chief.</h2>
          <p className="text-slate-500 mt-1">Your civilian transition is <span className="text-blue-600 font-semibold">62% underway</span>. Keep pushing.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => onNavigate('translator')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all active:scale-95"
          >
            Update Profile
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Readiness Score', value: '74/100', icon: Target, color: 'blue' },
          { label: 'Saved Months', value: '4.5 Mo', icon: Banknote, color: 'emerald' },
          { label: 'Open Apps', value: '12', icon: FileText, color: 'amber' },
          { label: 'Network Size', value: '158', icon: Users, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className={`p-2 w-fit rounded-lg bg-${stat.color}-50 text-${stat.color}-600 mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Readiness Radar */}
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-bold text-lg text-slate-900">Transition Readiness</h4>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">+5% this week</span>
          </div>
          <div className="flex-1 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={readinessData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <Radar
                  name="Current Status"
                  dataKey="A"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-4">
             <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
               <div className="flex items-start gap-3">
                 <AlertCircle size={18} className="text-amber-500 mt-0.5" />
                 <div>
                   <p className="text-sm font-semibold text-slate-900">Immediate Action Required</p>
                   <p className="text-xs text-slate-600 mt-1">Your resume hasn't been optimized for your target roles in Logistics.</p>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Salary Projections */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-lg text-slate-900 mb-8">Estimated Salary Growth</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryBenchmarks} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={140} tick={{ fill: '#64748b', fontSize: 13 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Annual']}
                />
                <Bar dataKey="salary" radius={[0, 8, 8, 0]} barSize={40}>
                  {salaryBenchmarks.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-semibold">Estimated Net Increase</p>
                <p className="text-lg font-bold text-emerald-600">+$72,400 / yr</p>
              </div>
              <TrendingUp className="text-emerald-500" size={24} />
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-semibold">Match Probability</p>
                <p className="text-lg font-bold text-blue-600">88.4%</p>
              </div>
              <CheckCircle2 className="text-blue-500" size={24} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
