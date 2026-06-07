import { useState } from 'react';
import { History, Calendar, Clock, MapPin, CreditCard } from 'lucide-react';
import { mockBookings } from '../data/mockData';

export default function LiveBookings({ 
  onHistoryClick,
  bookingsList = mockBookings 
}) {
  const [selectedDate, setSelectedDate] = useState('2026-06-07'); // Default Sunday 7 selected
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Dates ribbon static range
  const dates = [
    { day: 'FRI', num: '5', fullDate: '2026-06-05', isToday: false },
    { day: 'SAT', num: '6', fullDate: '2026-06-06', isToday: false },
    { day: 'SUN', num: '7', fullDate: '2026-06-07', isToday: true }, // Today
    { day: 'MON', num: '8', fullDate: '2026-06-08', isToday: false },
    { day: 'TUE', num: '9', fullDate: '2026-06-09', isToday: false },
    { day: 'WED', num: '10', fullDate: '2026-06-10', isToday: false },
    { day: 'THU', num: '11', fullDate: '2026-06-11', isToday: false },
  ];

  // Filters setup
  const filteredByDate = bookingsList.filter(b => b.date === selectedDate);
  
  const getFilterCount = (status) => {
    if (status === 'ALL') return filteredByDate.length;
    return filteredByDate.filter(b => b.status === status).length;
  };

  const finalFilteredBookings = filteredByDate.filter(b => {
    if (activeFilter === 'ALL') return true;
    return b.status === activeFilter;
  });

  const filterTabs = [
    { id: 'ALL', label: `ALL (${getFilterCount('ALL')})` },
    { id: 'CONFIRMED', label: `CONFIRMED (${getFilterCount('CONFIRMED')})` },
    { id: 'PENDING', label: `PENDING (${getFilterCount('PENDING')})` },
    { id: 'CANCELLED', label: `CANCELLED (${getFilterCount('CANCELLED')})` },
    { id: 'COMPLETED', label: `COMPLETED (${getFilterCount('COMPLETED')})` },
  ];

  return (
    <div className="flex-1 bg-dark-bg min-h-screen pb-24 md:pb-8 text-white">
      {/* Header */}
      <header className="p-6 border-b border-zinc-800/80 sticky top-0 bg-dark-bg/80 backdrop-blur-md z-30 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-wider uppercase">Live Bookings</h1>
        <button 
          onClick={onHistoryClick}
          className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
        >
          <History className="w-5 h-5" />
        </button>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-4">
        
        {/* Date Selector Ribbon */}
        <section className="flex space-x-2 overflow-x-auto no-scrollbar py-2">
          {dates.map((d) => {
            const isSelected = selectedDate === d.fullDate;
            return (
              <button
                key={d.fullDate}
                onClick={() => {
                  setSelectedDate(d.fullDate);
                  // Optional reset filter
                }}
                className={`flex-shrink-0 flex flex-col items-center justify-center w-14 py-3 rounded-lg border transition relative ${
                  isSelected
                    ? 'bg-brand-gold border-brand-gold text-black shadow-md shadow-brand-gold/15'
                    : 'bg-zinc-900/40 border-zinc-850 text-zinc-400 hover:text-white'
                }`}
              >
                <span className={`text-[9px] font-bold tracking-wider ${isSelected ? 'text-black' : 'text-zinc-500'}`}>
                  {d.day}
                </span>
                <span className="text-base font-extrabold mt-1">{d.num}</span>
                {/* Underline indicator for today if not active */}
                {d.isToday && !isSelected && (
                  <div className="absolute bottom-1 w-5 h-0.5 bg-brand-gold rounded-full" />
                )}
              </button>
            );
          })}
        </section>

        {/* Filter Categories Ribbon */}
        <section className="flex space-x-2 overflow-x-auto no-scrollbar py-1">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex-shrink-0 px-4 py-2 text-[10px] font-extrabold rounded-md uppercase tracking-wider border transition ${
                  isActive
                    ? 'bg-brand-gold border-brand-gold text-black shadow'
                    : 'bg-zinc-900/35 border-zinc-850 text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </section>

        {/* Bookings Feed */}
        <section className="space-y-3 pt-2">
          {finalFilteredBookings.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center py-20 space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-900/80 border border-zinc-850 flex items-center justify-center text-brand-gold shadow-inner">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">No Bookings Found</h3>
                <p className="text-xs text-muted-text mt-1">No all bookings available.</p>
              </div>
            </div>
          ) : (
            /* Cards List */
            finalFilteredBookings.map((booking) => (
              <div 
                key={booking.id}
                className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-4 space-y-4 hover:border-zinc-800 transition"
              >
                {/* Card Header details */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-gold text-black flex items-center justify-center font-bold text-sm">
                      {booking.customerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold tracking-wide text-white truncate max-w-[150px]">
                        {booking.customerName}
                      </h4>
                      <p className="text-[10px] font-bold text-zinc-500 tracking-wider mt-0.5">
                        #{booking.id}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 border border-zinc-750 text-zinc-400 rounded-md text-[9px] font-bold tracking-wider">
                    {booking.status}
                  </span>
                </div>

                {/* 2x2 Details Grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[10px] font-bold text-muted-text border-t border-b border-zinc-900 py-3.5">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-brand-gold/60" />
                    <span className="text-zinc-300 uppercase truncate">{booking.date === '2026-06-07' ? 'JUN 07, 2026' : booking.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-brand-gold/60" />
                    <span className="text-zinc-300">{booking.timeSlot}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-brand-gold/60" />
                    <span className="text-zinc-300 truncate uppercase">{booking.resourceType}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-brand-gold/60" />
                    <span className="text-zinc-300">{booking.price}</span>
                  </div>
                </div>

                {/* Footer details */}
                <div className="flex items-center justify-between text-[10px] pt-1">
                  <span className="px-2.5 py-1 bg-blue-900/10 border border-blue-900/30 text-blue-400 rounded-md font-bold tracking-wider">
                    {booking.paymentMode}
                  </span>
                  <span className="text-[9px] font-bold text-zinc-500 tracking-wider">
                    {booking.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
