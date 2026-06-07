import React, { useState } from 'react';
import { 
  ArrowLeft, Plus, Ban, QrCode, Power, Calendar, Clock, MapPin, 
  CreditCard, Wallet, HelpCircle, Mail, Phone, Info, Check, AlertCircle 
} from 'lucide-react';
import { mockBookings, mockResources, getSlotsForResource } from '../data/mockData';

export default function VenueDetail({ 
  venue, 
  onBack, 
  onOpenDisableDrawer, 
  onOpenManualBooking 
}) {
  const [activeTab, setActiveTab] = useState('SCHEDULE');
  const [selectedDate, setSelectedDate] = useState('2026-06-07');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [expenseSubTab, setExpenseSubTab] = useState('expenses'); // 'expenses' or 'categories'
  
  // Local state for interactive expenses
  const [expenses, setExpenses] = useState([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseReason, setExpenseReason] = useState('');
  
  // Local state for interactive slots matrix
  const [blockedSlots, setBlockedSlots] = useState({
    'turf': ['s2'], // s2 (10:00 - 11:00) is blocked by default
    'ps5': [],
    'tt1': [],
    'tt2': ['s13'] // s13 is blocked
  });

  const [bookedSlots, setBookedSlots] = useState({
    'turf': ['s1', 's11', 's12'],
    'ps5': ['s1', 's2'],
    'tt1': ['s1', 's2'],
    'tt2': ['s4', 's5']
  });

  // Toggle slot state (interactive availability click)
  const handleSlotClick = (resourceId, slotId) => {
    // If it's already booked, don't allow modifying
    if (bookedSlots[resourceId]?.includes(slotId)) return;

    const currentBlocked = blockedSlots[resourceId] || [];
    let updated;
    if (currentBlocked.includes(slotId)) {
      updated = currentBlocked.filter(id => id !== slotId);
    } else {
      updated = [...currentBlocked, slotId];
    }
    setBlockedSlots({
      ...blockedSlots,
      [resourceId]: updated
    });
  };

  // Schedule filtering logic
  const venueBookings = mockBookings.filter(b => b.date === selectedDate);
  const getFilterCount = (status) => {
    if (status === 'ALL') return venueBookings.length;
    return venueBookings.filter(b => b.status === status).length;
  };
  const filteredBookings = venueBookings.filter(b => {
    if (activeFilter === 'ALL') return true;
    return b.status === activeFilter;
  });

  const dates = [
    { day: 'FRI', num: '5', fullDate: '2026-06-05', isToday: false },
    { day: 'SAT', num: '6', fullDate: '2026-06-06', isToday: false },
    { day: 'SUN', num: '7', fullDate: '2026-06-07', isToday: true },
    { day: 'MON', num: '8', fullDate: '2026-06-08', isToday: false },
    { day: 'TUE', num: '9', fullDate: '2026-06-09', isToday: false },
    { day: 'WED', num: '10', fullDate: '2026-06-10', isToday: false },
  ];

  const filterTabs = [
    { id: 'ALL', label: `ALL (${getFilterCount('ALL')})` },
    { id: 'CONFIRMED', label: `CONFIRMED (${getFilterCount('CONFIRMED')})` },
    { id: 'PENDING', label: `PENDING (${getFilterCount('PENDING')})` },
  ];

  // Quick Action Buttons definitions
  const quickActions = [
    { id: 'manual', label: 'MANUAL B...', icon: Plus, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', action: onOpenManualBooking },
    { id: 'bulk_disable', label: 'BULK DISA...', icon: Ban, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', action: onOpenDisableDrawer },
    { id: 'scan_ticket', label: 'SCAN TIC...', icon: QrCode, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', action: () => alert('Scanning ticket... Camera simulation active.') },
    { id: 'availability', label: 'AVAILABIL...', icon: Power, color: 'text-red-500 bg-red-500/10 border-red-500/20', action: () => alert('Toggle service availability status') },
  ];

  const navTabs = ['SCHEDULE', 'SLOTS', 'EXPENSES', 'ANALYTICS', 'DETAILS'];

  // Handle logging new expense
  const handleAddExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseAmount || !expenseReason) return;
    const newExp = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      reason: expenseReason,
      amount: expenseAmount,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };
    setExpenses([newExp, ...expenses]);
    setExpenseAmount('');
    setExpenseReason('');
    setShowAddExpense(false);
  };

  return (
    <div className="flex-1 bg-dark-bg min-h-screen pb-24 md:pb-8 text-white">
      {/* Header */}
      <header className="p-4 border-b border-zinc-800/80 sticky top-0 bg-dark-bg/85 backdrop-blur-md z-30 flex items-start space-x-3">
        <button 
          onClick={onBack}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition shrink-0 mt-1"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="overflow-hidden flex-1">
          <h1 className="text-base font-extrabold tracking-wide uppercase text-white truncate">
            {venue.name}
          </h1>
          <p className="text-[9px] font-bold text-muted-text uppercase truncate tracking-wider mt-0.5">
            {venue.address}
          </p>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-6">

        {/* Metrics Grid */}
        <section className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl">
            <p className="text-2xl font-extrabold text-white">₹0</p>
            <p className="text-[9px] font-bold text-muted-text mt-1 uppercase tracking-wider">Today Revenue</p>
            <span className="text-[8px] font-bold text-emerald-400 mt-2 block bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded w-max">
              +12%
            </span>
          </div>

          <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl">
            <p className="text-2xl font-extrabold text-white">0</p>
            <p className="text-[9px] font-bold text-muted-text mt-1 uppercase tracking-wider">Bookings</p>
            <span className="text-[8px] font-bold text-emerald-400 mt-2 block bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded w-max">
              +5
            </span>
          </div>

          <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl">
            <p className="text-2xl font-extrabold text-white">₹0</p>
            <p className="text-[9px] font-bold text-muted-text mt-1 uppercase tracking-wider">Amount Due</p>
          </div>

          <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl">
            <p className="text-2xl font-extrabold text-white">₹0</p>
            <p className="text-[9px] font-bold text-muted-text mt-1 uppercase tracking-wider">Pending Venue</p>
          </div>
        </section>

        {/* Action Hub */}
        <section className="grid grid-cols-4 gap-2.5">
          {quickActions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={act.action}
                className="flex flex-col items-center justify-center p-3 bg-white hover:bg-zinc-100 rounded-xl transition duration-150 shadow"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${act.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[8px] font-extrabold text-zinc-800 mt-2 uppercase tracking-wide text-center">
                  {act.label}
                </span>
              </button>
            );
          })}
        </section>

        {/* Tab Ribbon Navbar */}
        <section className="border-b border-zinc-900">
          <div className="flex space-x-6 overflow-x-auto no-scrollbar py-1">
            {navTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 pb-3 text-xs font-bold uppercase tracking-wider transition relative ${
                  activeTab === tab 
                    ? 'text-brand-gold font-extrabold' 
                    : 'text-muted-text hover:text-white'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-gold rounded-full" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Inner Tabs Display */}
        <section className="min-h-[250px]">
          
          {/* TAB 1: SCHEDULE */}
          {activeTab === 'SCHEDULE' && (
            <div className="space-y-4">
              {/* Date selector ribbon */}
              <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1">
                {dates.map((d) => {
                  const isSelected = selectedDate === d.fullDate;
                  return (
                    <button
                      key={d.fullDate}
                      onClick={() => setSelectedDate(d.fullDate)}
                      className={`flex-shrink-0 flex flex-col items-center justify-center w-14 py-3 rounded-lg border transition ${
                        isSelected
                          ? 'bg-brand-gold border-brand-gold text-black shadow-md shadow-brand-gold/15'
                          : 'bg-zinc-900/40 border-zinc-850 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className={`text-[9px] font-bold tracking-wider ${isSelected ? 'text-black' : 'text-zinc-550'}`}>
                        {d.day}
                      </span>
                      <span className="text-sm font-extrabold mt-1">{d.num}</span>
                    </button>
                  );
                })}
              </div>

              {/* Status filter tabs */}
              <div className="flex space-x-2 py-1">
                {filterTabs.map((tab) => {
                  const isActive = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilter(tab.id)}
                      className={`px-3 py-1.5 text-[9px] font-extrabold rounded-md uppercase tracking-wider border transition ${
                        isActive
                          ? 'bg-brand-gold border-brand-gold text-black'
                          : 'bg-zinc-900/35 border-zinc-850 text-zinc-450 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Booking logs cards list */}
              <div className="space-y-3 pt-2">
                {filteredBookings.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500 text-xs font-semibold">
                    No bookings found for this day.
                  </div>
                ) : (
                  filteredBookings.map((b) => (
                    <div 
                      key={b.id}
                      className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-brand-gold text-black flex items-center justify-center font-bold text-sm">
                            {b.customerName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold tracking-wide text-white truncate max-w-[150px]">
                              {b.customerName}
                            </h4>
                            <p className="text-[10px] font-bold text-zinc-500 tracking-wider mt-0.5">
                              #{b.id}
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 border border-zinc-750 text-zinc-400 rounded-md text-[9px] font-bold tracking-wider">
                          {b.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[10px] font-bold text-muted-text border-t border-b border-zinc-900 py-3.5">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-brand-gold/60" />
                          <span className="text-zinc-300 uppercase truncate">
                            {b.date === '2026-06-07' ? 'JUN 07, 2026' : b.date}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-brand-gold/60" />
                          <span className="text-zinc-300">{b.timeSlot}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-brand-gold/60" />
                          <span className="text-zinc-300 truncate uppercase">{b.resourceType}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-brand-gold/60" />
                          <span className="text-zinc-300">{b.price}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] pt-1">
                        <span className="px-2.5 py-1 bg-blue-900/10 border border-blue-900/30 text-blue-400 rounded-md font-bold tracking-wider">
                          {b.paymentMode}
                        </span>
                        <span className="text-[9px] font-bold text-zinc-500 tracking-wider">
                          {b.timestamp}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SLOTS */}
          {activeTab === 'SLOTS' && (
            <div className="space-y-6">
              {/* Legend row */}
              <div className="flex items-center justify-around p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl">
                <div className="flex items-center space-x-1.5 text-[9px] font-bold tracking-wider uppercase text-zinc-300">
                  <div className="w-3.5 h-3.5 rounded bg-emerald-500" />
                  <span>Available</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[9px] font-bold tracking-wider uppercase text-zinc-300">
                  <div className="w-3.5 h-3.5 rounded bg-red-650" style={{ backgroundColor: '#dc2626' }} />
                  <span>Booked</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[9px] font-bold tracking-wider uppercase text-zinc-300">
                  <div className="w-3.5 h-3.5 rounded bg-zinc-650" style={{ backgroundColor: '#4b5563' }} />
                  <span>Blocked</span>
                </div>
              </div>

              {/* Interactive Slots Config Matrix */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold tracking-wider uppercase text-zinc-300">Interactive Slot Matrix</h3>
                  <span className="text-[9px] font-bold text-muted-text italic">Click cell to block/unblock</span>
                </div>
                
                <div className="space-y-3">
                  {mockResources.map((res) => {
                    const slots = getSlotsForResource(res.id).slice(0, 4); // show 4 slots for UI simplicity
                    return (
                      <div key={res.id} className="p-3.5 bg-zinc-900/20 border border-zinc-850 rounded-xl space-y-2">
                        <span className="text-[10px] font-extrabold text-white tracking-wider uppercase">{res.name}</span>
                        <div className="grid grid-cols-4 gap-1.5">
                          {slots.map((s) => {
                            const isBooked = bookedSlots[res.id]?.includes(s.id);
                            const isBlocked = blockedSlots[res.id]?.includes(s.id);
                            
                            let bgClass = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25';
                            if (isBooked) bgClass = 'bg-red-500/10 border-red-500/25 text-red-400 cursor-not-allowed';
                            if (isBlocked) bgClass = 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700';

                            return (
                              <button
                                key={s.id}
                                disabled={isBooked}
                                onClick={() => handleSlotClick(res.id, s.id)}
                                className={`py-2 px-1 text-[8px] font-bold text-center border rounded-md transition ${bgClass}`}
                              >
                                <span className="block truncate">{s.time.split(' - ')[0]}</span>
                                <span className="block opacity-80 mt-0.5">₹{s.price}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXPENSES */}
          {activeTab === 'EXPENSES' && (
            <div className="space-y-4">
              
              {/* Add Expense Drawer Trigger */}
              {showAddExpense ? (
                <form onSubmit={handleAddExpenseSubmit} className="p-4 bg-zinc-900/70 border border-zinc-800 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gold">Log Service Expense</h4>
                    <button 
                      type="button" 
                      onClick={() => setShowAddExpense(false)}
                      className="text-[10px] font-bold text-zinc-500 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Expense Reason (e.g. Cleaning Supplies)"
                      value={expenseReason}
                      onChange={(e) => setExpenseReason(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                    />
                    <input
                      type="number"
                      required
                      placeholder="Amount (₹)"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-brand-gold hover:bg-brand-gold-hover text-black rounded-lg text-xs font-bold uppercase tracking-wider"
                    >
                      Confirm Expense
                    </button>
                  </div>
                </form>
              ) : (
                /* Sub Tab Toggle */
                <div className="flex items-center justify-between p-2.5 bg-zinc-900/50 border border-zinc-850 rounded-xl">
                  {/* Sliding Picker */}
                  <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-900">
                    <button
                      onClick={() => setExpenseSubTab('expenses')}
                      className={`px-3 py-1.5 text-[9px] font-bold rounded-md uppercase tracking-wider transition ${
                        expenseSubTab === 'expenses'
                          ? 'bg-brand-gold text-black shadow'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Expenses
                    </button>
                    <button
                      onClick={() => setExpenseSubTab('categories')}
                      className={`px-3 py-1.5 text-[9px] font-bold rounded-md uppercase tracking-wider transition ${
                        expenseSubTab === 'categories'
                          ? 'bg-brand-gold text-black shadow'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Categories
                    </button>
                  </div>

                  <button
                    onClick={() => setShowAddExpense(true)}
                    className="flex items-center space-x-1 py-1.5 px-3 bg-red-650 hover:bg-red-750 text-white rounded-md text-[9.5px] font-bold uppercase tracking-wider"
                    style={{ backgroundColor: '#dc2626' }}
                  >
                    <span>+ Log Expense</span>
                  </button>
                </div>
              )}

              {/* Transactions Title area */}
              <div className="pt-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Transactions</h3>
                <p className="text-[10px] text-muted-text mt-0.5">Recent expenses for this service</p>
              </div>

              {/* Expenses List */}
              <div className="space-y-2.5">
                {expenses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-3">
                    <Wallet className="w-8 h-8 text-zinc-700" />
                    <p className="text-xs font-semibold text-zinc-500">No expenses logged</p>
                  </div>
                ) : (
                  expenses.map((exp) => (
                    <div 
                      key={exp.id} 
                      className="p-3.5 bg-zinc-900/40 border border-zinc-850 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-extrabold text-white uppercase tracking-wide">{exp.reason}</h4>
                        <p className="text-[9px] text-zinc-500 font-bold tracking-wider mt-0.5">{exp.date} • ID: {exp.id}</p>
                      </div>
                      <span className="text-xs font-black text-red-400">-₹{exp.amount}</span>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 4: ANALYTICS */}
          {activeTab === 'ANALYTICS' && (
            <div className="space-y-4">
              
              {/* Occupancy card widgets */}
              <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl space-y-4">
                <h4 className="text-[10px] font-bold text-muted-text uppercase tracking-wider">Occupancy Rate</h4>
                <div className="space-y-2">
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-black text-white">0%</span>
                    <span className="text-[9px] font-bold text-zinc-500 tracking-wider">0/96 SLOTS BOOKED</span>
                  </div>
                  {/* Slider bar mockup */}
                  <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-gold w-0" />
                  </div>
                </div>
              </div>

              {/* Stats details grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl">
                  <p className="text-[9px] font-bold text-muted-text uppercase tracking-wider">Peak Hour</p>
                  <p className="text-lg font-black text-white mt-1 uppercase">6:00 PM</p>
                </div>

                <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl">
                  <p className="text-[9px] font-bold text-muted-text uppercase tracking-wider">Avg. Booking</p>
                  <p className="text-lg font-black text-brand-gold mt-1">₹1,200</p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: DETAILS */}
          {activeTab === 'DETAILS' && (
            <div className="space-y-4">
              {/* Venue Cover Image */}
              <div className="relative rounded-2xl overflow-hidden h-44 bg-zinc-900 border border-zinc-850">
                <img 
                  src={venue.image} 
                  alt={venue.name} 
                  className="w-full h-full object-cover opacity-80"
                />
                <span className="absolute top-3 left-3 flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-500 text-black rounded-md text-[9px] font-black tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>Live</span>
                </span>
              </div>

              {/* Operational card parameters */}
              <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                  <span className="flex items-center space-x-1.5 text-emerald-400 font-extrabold text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>OPERATIONAL</span>
                  </span>
                  <span className="text-[9.5px] font-extrabold px-2 py-0.5 border border-zinc-800 text-zinc-500 rounded-md">
                    #1
                  </span>
                </div>

                <div className="space-y-3.5 text-[10px] font-bold text-muted-text">
                  <div className="flex items-start space-x-3">
                    <Building2Icon className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="uppercase text-[8px] text-zinc-500">Service Name</p>
                      <p className="text-white mt-0.5">{venue.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="uppercase text-[8px] text-zinc-500">Connect</p>
                      <p className="text-white mt-0.5">{venue.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="uppercase text-[8px] text-zinc-500">Location</p>
                      <p className="text-white mt-0.5 leading-relaxed">{venue.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Service Paragraph */}
              <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl space-y-2">
                <div className="flex items-center space-x-1.5 text-zinc-300 font-extrabold text-[10px] uppercase tracking-wider">
                  <Info className="w-4 h-4 text-zinc-500" />
                  <span>About Service</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed font-medium">
                  {venue.about}
                </p>
              </div>

              {/* Amenities Grid */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-muted-text uppercase tracking-wider">Amenities</h4>
                <div className="flex flex-wrap gap-1.5">
                  {venue.amenities.map((item) => (
                    <span 
                      key={item} 
                      className="px-3 py-1.5 bg-blue-500/5 border border-blue-500/25 text-blue-400 rounded-md text-[9px] font-bold tracking-wider uppercase"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Activities Grid */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-muted-text uppercase tracking-wider">Activities</h4>
                <div className="flex flex-wrap gap-1.5">
                  {venue.activities.map((item) => (
                    <span 
                      key={item} 
                      className="px-3 py-1.5 bg-purple-500/5 border border-purple-500/25 text-purple-400 rounded-md text-[9px] font-bold tracking-wider uppercase"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

// Temporary inline custom icons to prevent import mismatches
function Building2Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
