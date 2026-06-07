import React from 'react';
import { Home, Calendar, Clock, ClipboardList, User } from 'lucide-react';
import HyperIcon from './HyperIcon';

export default function BottomNav({ activeTab, setActiveTab, onNavigate }) {
  const tabs = [
    { id: 'dashboard', label: 'HOME', icon: Home },
    { id: 'bookings', label: 'BOOKINGS', icon: Calendar },
    { id: 'slots', label: 'SLOTS', icon: Clock },
    { id: 'ledger', label: 'LEDGER', icon: ClipboardList },
    { id: 'profile', label: 'PROFILE', icon: User },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (onNavigate) {
      onNavigate(tabId);
    }
  };

  return (
    <>
      {/* Desktop Sidebar Navbar */}
      <aside className="hidden md:flex flex-col w-64 bg-card-bg border-r border-zinc-800 h-screen sticky top-0 shrink-0">
        <div className="p-6 border-b border-zinc-800 flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <HyperIcon size={22} className="text-brand-gold" />
          </div>
          <span className="text-xl font-bold uppercase tracking-wider text-white">Hyper Chief</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-gold text-black shadow-md shadow-brand-gold/20'
                    : 'text-muted-text hover:text-white hover:bg-zinc-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-zinc-800 text-xs text-muted-text text-center font-medium">
          VERSION 1.0.0 (GOLD)
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card-bg border-t border-zinc-800 px-2 pb-safe-bottom z-40">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className="flex flex-col items-center justify-center flex-1 h-full relative"
              >
                {/* Yellow indicator line above selected tab */}
                {isActive && (
                  <div className="absolute top-0 left-1/4 right-1/4 h-[3px] bg-brand-gold rounded-full" />
                )}
                <Icon
                  className={`w-5 h-5 mb-1 transition-colors ${
                    isActive ? 'text-brand-gold' : 'text-zinc-500'
                  }`}
                />
                <span
                  className={`text-[9px] font-bold tracking-wider ${
                    isActive ? 'text-brand-gold' : 'text-zinc-500'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
