import React, { useState } from 'react';
import { Opportunity, AppStatus } from '../types';
import { ExternalLink, Trash2, Clock, AlertTriangle, CheckCircle2, ChevronRight, Briefcase } from 'lucide-react';

interface DashboardProps {
  opportunities: Opportunity[];
  updateStatus: (id: string, status: AppStatus) => void;
  deleteOpportunity: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ opportunities, updateStatus, deleteOpportunity }) => {
  const [activeTab, setActiveTab] = useState<AppStatus>(AppStatus.INTERESTED);

  const filteredOpps = opportunities.filter(opp => opp.status === activeTab);

  const getStatusColor = (status: AppStatus) => {
    switch (status) {
      case AppStatus.INTERESTED: return 'text-blue-600 bg-blue-50 border-blue-200';
      case AppStatus.DRAFTING: return 'text-amber-600 bg-amber-50 border-amber-200';
      case AppStatus.SUBMITTED: return 'text-green-600 bg-green-50 border-green-200';
      case AppStatus.REJECTED: return 'text-red-600 bg-red-50 border-red-200';
      case AppStatus.OFFER: return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getFitColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 h-full flex flex-col pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Application Tracker</h2>
          <p className="text-slate-500 text-sm">Manage your pipeline.</p>
        </div>
        
        {/* Stats Summary */}
        <div className="flex gap-4">
            <div className="text-center px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="text-xl font-bold text-slate-900">{opportunities.length}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Total</div>
            </div>
            <div className="text-center px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="text-xl font-bold text-green-600">
                    {opportunities.filter(o => o.status === AppStatus.SUBMITTED).length}
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-wide">Sent</div>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 mb-6 pb-2">
        {Object.values(AppStatus).map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              activeTab === status
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {status} <span className="ml-1 opacity-60 text-xs">
                ({opportunities.filter(o => o.status === status).length})
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
        {filteredOpps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
            <Briefcase size={48} className="mb-4 opacity-50" />
            <p>No opportunities in {activeTab}</p>
            <p className="text-sm">Capture new ones via the Chat tab.</p>
          </div>
        ) : (
          filteredOpps.map((opp) => (
            <div
              key={opp.id}
              className="group bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Scam Warning Banner */}
              {opp.scamRiskScore > 70 && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-red-500"></div>
              )}

              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{opp.title}</h3>
                    {opp.url && (
                        <a href={opp.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-600">
                            <ExternalLink size={14} />
                        </a>
                    )}
                  </div>
                  <div className="text-slate-600 font-medium text-sm mb-3 flex items-center gap-2">
                    <Briefcase size={14} />
                    {opp.company}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                     {/* Fit Badge */}
                    <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${getFitColor(opp.fitScore)}`}>
                        {opp.fitScore}% Match
                    </div>
                    
                    {/* Deadline Badge */}
                    {opp.deadline && (
                         <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                             <Clock size={12} className="mr-1" />
                             Due: {opp.deadline}
                         </div>
                    )}
                    
                    {/* Scam Badge */}
                     {opp.scamRiskScore > 50 && (
                         <div className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700">
                             <AlertTriangle size={12} className="mr-1" />
                             Risk: {opp.scamRiskScore}%
                         </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 italic border-l-2 border-slate-200 pl-3">
                    "{opp.fitReasoning}"
                  </p>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                    <button 
                        onClick={() => deleteOpportunity(opp.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between">
                 <span className="text-xs text-slate-400">Added {new Date(opp.dateAdded).toLocaleDateString()}</span>
                 
                 <div className="flex items-center gap-2">
                    {activeTab !== AppStatus.SUBMITTED && (
                        <button
                            onClick={() => updateStatus(opp.id, activeTab === AppStatus.INTERESTED ? AppStatus.DRAFTING : AppStatus.SUBMITTED)}
                            className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors"
                        >
                            Move to {activeTab === AppStatus.INTERESTED ? 'Drafting' : 'Submitted'}
                            <ChevronRight size={16} />
                        </button>
                    )}
                     {activeTab === AppStatus.SUBMITTED && (
                        <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                            <CheckCircle2 size={16} />
                            Completed
                        </div>
                    )}
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;