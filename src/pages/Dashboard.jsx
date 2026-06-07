import React, { useState } from 'react';
import { List, QrCode, PlusCircle, Ban, TrendingUp, DollarSign } from 'lucide-react';
import ComingSoonOverlay from '../components/ComingSoonOverlay';
import { mockDashboardStats } from '../data/mockData';
import HyperIcon from '../components/HyperIcon';

export default function Dashboard({ 
  onQuickAction, 
  stats = mockDashboardStats 
}) {
  const [revenueFilter, setRevenueFilter] = useState('WEEKLY');

  // Custom quick actions list
  const actions = [
    { id: 'disabled_slots', label: 'DISABLED', icon: List },
    { id: 'scan_qr', label: 'SCAN QR', icon: QrCode },
    { id: 'manual_booking', label: 'MANUAL', icon: PlusCircle },
    { id: 'bulk_disable', label: 'DISABLE', icon: Ban },
  ];

  return (
    <div className="flex-1 bg-dark-bg min-h-screen pb-24 md:pb-8 text-white">
      {/* Header */}
      <header className="p-6 border-b border-zinc-800/80 sticky top-0 bg-dark-bg/80 backdrop-blur-md z-30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <HyperIcon size={22} className="text-brand-gold" />
          </div>
          <h1 className="text-xl font-bold tracking-wider uppercase">Dashboard</h1>
        </div>
      </header>

      <main className="p-4 max-w-5xl mx-auto space-y-6">
        
        {/* Quick Actions Row */}
        <section className="grid grid-cols-4 gap-2.5">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => onQuickAction(act.id)}
                className="flex flex-col items-center justify-center p-3 bg-zinc-900/50 border border-brand-gold/10 hover:border-brand-gold/40 hover:bg-zinc-900/80 rounded-xl transition duration-205 group"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-black transition">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[9px] md:text-xs font-bold text-brand-gold mt-2 uppercase tracking-wider">
                  {act.label}
                </span>
              </button>
            );
          })}
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-3">
          
          {/* Today Bookings Card */}
          <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl">
            <p className="text-3xl font-extrabold">{stats.todayBookings.count}</p>
            <p className="text-[10px] md:text-xs font-bold text-muted-text mt-1 uppercase tracking-wider">
              Today Bookings
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-zinc-800/60 text-center">
              <div>
                <p className="text-[9px] font-bold text-muted-text uppercase tracking-wider">Online</p>
                <p className="text-xs font-extrabold text-white mt-0.5">{stats.todayBookings.online}</p>
              </div>
              <div className="border-l border-zinc-800/80">
                <p className="text-[9px] font-bold text-muted-text uppercase tracking-wider">Offline</p>
                <p className="text-xs font-extrabold text-white mt-0.5">{stats.todayBookings.offline}</p>
              </div>
            </div>
          </div>

          {/* Monthly Bookings Card */}
          <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl">
            <p className="text-3xl font-extrabold">{stats.monthlyBookings.count}</p>
            <p className="text-[10px] md:text-xs font-bold text-muted-text mt-1 uppercase tracking-wider">
              Monthly Bookings
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-zinc-800/60 text-center">
              <div>
                <p className="text-[9px] font-bold text-muted-text uppercase tracking-wider">Online</p>
                <p className="text-xs font-extrabold text-white mt-0.5">{stats.monthlyBookings.online}</p>
              </div>
              <div className="border-l border-zinc-800/80">
                <p className="text-[9px] font-bold text-muted-text uppercase tracking-wider">Offline</p>
                <p className="text-xs font-extrabold text-white mt-0.5">{stats.monthlyBookings.offline}</p>
              </div>
            </div>
          </div>

          {/* Today's Revenue Card */}
          <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl">
            <p className="text-3xl font-extrabold text-brand-gold">₹{stats.todayRevenue.count}</p>
            <p className="text-[10px] md:text-xs font-bold text-muted-text mt-1 uppercase tracking-wider">
              Today's Revenue
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-zinc-800/60 text-center">
              <div>
                <p className="text-[9px] font-bold text-muted-text uppercase tracking-wider">Online</p>
                <p className="text-xs font-extrabold text-white mt-0.5">₹{stats.todayRevenue.online}</p>
              </div>
              <div className="border-l border-zinc-800/80">
                <p className="text-[9px] font-bold text-muted-text uppercase tracking-wider">Offline</p>
                <p className="text-xs font-extrabold text-white mt-0.5">₹{stats.todayRevenue.offline}</p>
              </div>
            </div>
          </div>

          {/* Monthly Revenue Card */}
          <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl">
            <p className="text-3xl font-extrabold text-brand-gold">₹{stats.monthlyRevenue.count}</p>
            <p className="text-[10px] md:text-xs font-bold text-muted-text mt-1 uppercase tracking-wider">
              Monthly Revenue
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-zinc-800/60 text-center">
              <div>
                <p className="text-[9px] font-bold text-muted-text uppercase tracking-wider">Online</p>
                <p className="text-xs font-extrabold text-white mt-0.5">₹{stats.monthlyRevenue.online}</p>
              </div>
              <div className="border-l border-zinc-800/80">
                <p className="text-[9px] font-bold text-muted-text uppercase tracking-wider">Offline</p>
                <p className="text-xs font-extrabold text-white mt-0.5">₹{stats.monthlyRevenue.offline}</p>
              </div>
            </div>
          </div>

        </section>

        {/* Revenue Chart Filters Toggle Bar */}
        <section className="flex items-center justify-between py-2 border-b border-zinc-900">
          <h2 className="text-xs font-bold tracking-wider uppercase text-zinc-300">Revenue</h2>
          <div className="flex bg-zinc-900 border border-zinc-850 p-0.5 rounded-lg">
            {['MONTHLY', 'WEEKLY', 'TODAY'].map((filter) => (
              <button
                key={filter}
                onClick={() => setRevenueFilter(filter)}
                className={`px-3 py-1.5 text-[9px] font-extrabold rounded-md uppercase tracking-wider transition ${
                  revenueFilter === filter
                    ? 'bg-brand-gold text-black font-extrabold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* Performance Sections with COMING_SOON Overlays */}
        <section className="space-y-4">
          <h2 className="text-xs font-bold tracking-wider uppercase text-zinc-300">Performance</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Occupancy Rate */}
            <div className="p-4 bg-zinc-900/30 border border-zinc-850 rounded-xl relative overflow-hidden min-h-[160px] flex flex-col justify-between">
              <ComingSoonOverlay />
              <h3 className="text-[10px] font-bold text-muted-text uppercase tracking-wider">
                Occupancy Rate
              </h3>
              {/* Fake circular chart illustration */}
              <div className="flex items-center justify-center my-2">
                <div className="w-16 h-16 rounded-full border-4 border-zinc-850 border-t-brand-gold flex items-center justify-center">
                  <span className="text-xs font-bold">78%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-zinc-400 border-t border-zinc-900 pt-2">
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-brand-gold mr-1.5" />
                  {stats.occupancy.booked} SLOTS BOOKED
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-zinc-700 mr-1.5" />
                  {stats.occupancy.free} SLOTS FREE
                </span>
              </div>
            </div>

            {/* Peak Hours */}
            <div className="p-4 bg-zinc-900/30 border border-zinc-850 rounded-xl relative overflow-hidden min-h-[160px] flex flex-col justify-between">
              <ComingSoonOverlay />
              <h3 className="text-[10px] font-bold text-muted-text uppercase tracking-wider">
                Peak Hours
              </h3>
              {/* Fake bar chart illustration */}
              <div className="flex items-end justify-between h-20 px-2 my-2">
                {[15, 30, 25, 45, 90, 60, 20].map((h, i) => (
                  <div key={i} className="flex flex-col items-center w-6">
                    <div 
                      className={`w-2.5 rounded-t-sm transition-all ${
                        i === 4 ? 'bg-red-500' : 'bg-brand-gold/60'
                      }`} 
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[8px] text-zinc-500 px-1 border-t border-zinc-900 pt-2 uppercase tracking-wider">
                <span>6am</span>
                <span>9am</span>
                <span>12pm</span>
                <span>3pm</span>
                <span>6pm</span>
                <span>9pm</span>
                <span>12am</span>
              </div>
            </div>

            {/* Top 3 Sports */}
            <div className="p-4 bg-zinc-900/30 border border-zinc-850 rounded-xl relative overflow-hidden min-h-[150px] flex flex-col justify-between">
              <ComingSoonOverlay />
              <h3 className="text-[10px] font-bold text-muted-text uppercase tracking-wider mb-3">
                Top 3 Sports
              </h3>
              <div className="space-y-3 flex-1 justify-center flex flex-col">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center text-zinc-300">
                    <span className="w-4 h-4 rounded bg-brand-gold/10 text-brand-gold flex items-center justify-center font-bold text-[9px] mr-2">1</span>
                    FOOTBALL
                  </span>
                  <span className="font-extrabold text-white">40%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center text-zinc-300">
                    <span className="w-4 h-4 rounded bg-brand-gold/10 text-brand-gold flex items-center justify-center font-bold text-[9px] mr-2">2</span>
                    CRICKET
                  </span>
                  <span className="font-extrabold text-white">30%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center text-zinc-300">
                    <span className="w-4 h-4 rounded bg-brand-gold/10 text-brand-gold flex items-center justify-center font-bold text-[9px] mr-2">3</span>
                    TENNIS
                  </span>
                  <span className="font-extrabold text-white">20%</span>
                </div>
              </div>
            </div>

            {/* Top 3 Venues */}
            <div className="p-4 bg-zinc-900/30 border border-zinc-850 rounded-xl relative overflow-hidden min-h-[150px] flex flex-col justify-between">
              <ComingSoonOverlay />
              <h3 className="text-[10px] font-bold text-muted-text uppercase tracking-wider mb-3">
                Top 3 Venues
              </h3>
              <div className="space-y-3 flex-1 justify-center flex flex-col">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center text-zinc-300">
                    <span className="w-4 h-4 rounded bg-brand-gold/10 text-brand-gold flex items-center justify-center font-bold text-[9px] mr-2">1</span>
                    ARENA PRIME
                  </span>
                  <span className="font-extrabold text-brand-gold">₹15k</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center text-zinc-300">
                    <span className="w-4 h-4 rounded bg-brand-gold/10 text-brand-gold flex items-center justify-center font-bold text-[9px] mr-2">2</span>
                    TURF
                  </span>
                  <span className="font-extrabold text-brand-gold">₹12k</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center text-zinc-300">
                    <span className="w-4 h-4 rounded bg-brand-gold/10 text-brand-gold flex items-center justify-center font-bold text-[9px] mr-2">3</span>
                    CITY COURTS
                  </span>
                  <span className="font-extrabold text-brand-gold">₹9k</span>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
