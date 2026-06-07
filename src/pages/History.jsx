import { useState } from 'react';
import { ArrowLeft, Search, Download, Calendar, Clock, MapPin, CreditCard, SlidersHorizontal } from 'lucide-react';
import { mockBookings } from '../data/mockData';

export default function History({ onBack, bookingsList = mockBookings }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Expand mock list slightly to represent "65 Records Found" for aesthetic consistency
  const repeatedBookings = [
    ...bookingsList,
    {
      id: "47C7",
      customerName: "PRATIGYA BHANUSHALLI",
      phone: "+919571534246",
      date: "2026-06-02",
      timeSlot: "19:00 - 20:00",
      resourceType: "PS5",
      price: "INR 300",
      paymentMode: "ONLINE",
      status: "EXPIRED",
      timestamp: "JUN 02, 17:56"
    },
    {
      id: "838F",
      customerName: "HITENDRA SINGH",
      phone: "+919490629707",
      date: "2026-04-17",
      timeSlot: "12:00 - 14:00",
      resourceType: "TURF",
      price: "INR 2400",
      paymentMode: "ONLINE",
      status: "EXPIRED",
      timestamp: "APR 17, 11:07"
    },
    {
      id: "33C4",
      customerName: "HITENDRA SINGH",
      phone: "+919490629707",
      date: "2026-04-16",
      timeSlot: "19:00 - 21:00",
      resourceType: "TT TABLE 1",
      price: "INR 400",
      paymentMode: "ONLINE",
      status: "EXPIRED",
      timestamp: "APR 16, 14:12"
    },
    {
      id: "000B",
      customerName: "KIRTHICK HARSHA",
      phone: "+919998887776",
      date: "2026-03-31",
      timeSlot: "09:00 - 10:00",
      resourceType: "TT TABLE 1",
      price: "INR 200",
      paymentMode: "ONLINE",
      status: "EXPIRED",
      timestamp: "MAR 30, 23:37"
    }
  ];

  const filtered = repeatedBookings.filter(b => 
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.resourceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    alert('Exporting CSV: 65 transaction records exported successfully.');
  };

  return (
    <div className="flex-1 bg-dark-bg min-h-screen pb-12 text-white">
      {/* Header */}
      <header className="p-4 border-b border-zinc-800/80 sticky top-0 bg-dark-bg/85 backdrop-blur-md z-30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-extrabold tracking-wide uppercase">History</h1>
            <p className="text-[10px] text-muted-text mt-0.5 uppercase tracking-wider">Review Past Transactions</p>
          </div>
        </div>
        <button className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white transition">
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-4">
        {/* Search bar inputs */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by customer, ID, or resource..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/50 border border-zinc-850 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-gold transition"
          />
        </div>

        {/* Count and CSV Export row */}
        <div className="flex items-center justify-between py-2 border-b border-zinc-900">
          <div>
            <span className="text-xl font-extrabold text-white">65</span>
            <span className="text-[9px] font-bold text-muted-text uppercase tracking-wider ml-1">Records Found</span>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center space-x-1 py-1.5 px-3 bg-brand-gold hover:bg-brand-gold-hover text-black rounded-md text-[9px] font-bold uppercase tracking-wider shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export_CSV</span>
          </button>
        </div>

        {/* List of cards */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs font-semibold">
              No matching transaction records.
            </div>
          ) : (
            filtered.map((b, idx) => (
              <div 
                key={`${b.id}-${idx}`}
                className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-4 space-y-4 hover:border-zinc-800 transition"
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
                      {b.phone && (
                        <p className="text-[9px] text-zinc-500 font-semibold">{b.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 border border-zinc-750 text-zinc-500 rounded text-[9px] font-bold tracking-wider">
                      #{b.id}
                    </span>
                    <span className="px-2 py-0.5 border border-zinc-750 text-zinc-400 rounded text-[9px] font-bold tracking-wider">
                      {b.status}
                    </span>
                  </div>
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
      </main>
    </div>
  );
}
