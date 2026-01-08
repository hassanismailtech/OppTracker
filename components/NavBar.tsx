import React from 'react';
import { View } from '../types';
import { LayoutDashboard, MessageSquarePlus, UserCircle2 } from 'lucide-react';

interface NavBarProps {
  currentView: View;
  setView: (view: View) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: View.CHAT, label: 'Capture', icon: MessageSquarePlus },
    { id: View.DASHBOARD, label: 'Tracker', icon: LayoutDashboard },
    { id: View.PROFILE, label: 'Profile', icon: UserCircle2 },
  ];

  return (
    <>
      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 md:hidden z-50 pb-safe">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200 ${
                currentView === item.id
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <item.icon size={24} />
              <span className="text-xs font-medium mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar (Left) */}
      <div className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
            <h1 className="text-xl font-bold tracking-tight text-brand-500 flex items-center gap-2">
                <div className="w-2 h-8 bg-brand-500 rounded-sm"></div>
                OppTracker
            </h1>
        </div>
        <div className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 gap-3 ${
                currentView === item.id
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
            v1.0.0 &bull; Beta
        </div>
      </div>
    </>
  );
};

export default NavBar;