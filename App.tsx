import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import Profile from './components/Profile';
import { View, Opportunity, UserProfile, AppStatus } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.CHAT); // Default to chat for "Ingestion first" feel
  
  // Initialize State from LocalStorage or Defaults
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('oppTracker_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Alex Developer',
      cvText: 'Senior Full Stack Engineer with 5 years experience in React, Node.js, and Python. Passionate about AI integration and scalable systems.',
      linkedinUrl: '',
      interests: ['Remote', 'AI', 'Startups']
    };
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem('oppTracker_opps');
    // Seed some data if empty
    if (!saved) return [
      {
        id: '1',
        title: 'Senior Product Manager',
        company: 'TechCorp Inc.',
        status: AppStatus.DRAFTING,
        fitScore: 85,
        fitReasoning: 'Strong match for PM skills, but domain is FinTech which is not in interests.',
        scamRiskScore: 5,
        deadline: '2023-12-31',
        dateAdded: new Date().toISOString(),
        notes: 'Referral from Sarah.',
        url: 'https://example.com/job'
      },
      {
        id: '2',
        title: 'Data Entry Clerk ($100/hr)',
        company: 'Unknown LLC',
        status: AppStatus.INTERESTED,
        fitScore: 20,
        fitReasoning: 'Role is below experience level.',
        scamRiskScore: 95,
        scamReason: 'Unrealistic salary, generic email.',
        deadline: null,
        dateAdded: new Date().toISOString(),
        notes: 'Looks suspicious.',
      }
    ];
    return JSON.parse(saved);
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('oppTracker_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('oppTracker_opps', JSON.stringify(opportunities));
  }, [opportunities]);

  const handleProfileSave = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
  };

  const handleOpportunityFound = (opp: Opportunity) => {
    setOpportunities(prev => [opp, ...prev]);
  };

  const updateStatus = (id: string, status: AppStatus) => {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const deleteOpportunity = (id: string) => {
      setOpportunities(prev => prev.filter(o => o.id !== id));
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <NavBar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 h-full overflow-hidden md:ml-64 relative">
        {currentView === View.CHAT && (
          <ChatInterface 
            userProfile={userProfile} 
            onOpportunityFound={handleOpportunityFound} 
          />
        )}
        
        {currentView === View.DASHBOARD && (
          <Dashboard 
            opportunities={opportunities} 
            updateStatus={updateStatus}
            deleteOpportunity={deleteOpportunity}
          />
        )}
        
        {currentView === View.PROFILE && (
          <div className="h-full overflow-y-auto no-scrollbar">
            <Profile profile={userProfile} onSave={handleProfileSave} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;