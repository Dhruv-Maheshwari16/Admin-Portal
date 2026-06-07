import React, { useState } from 'react';
import { Download, Landmark, ArrowUpRight, ArrowDownRight, FileText } from 'lucide-react';
import { mockBookings } from '../data/mockData';

export default function Ledger() {
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'INFLOW', 'OUTFLOW'

  // Construct ledger transactions from bookings + mock expenses
  const transactions = [
    { id: 'TXN102', description: 'BOOKING DEPOSIT: MAHESH GOWDA', type: 'IN', amount: 1200, date: 'JUN 07, 2026', mode: 'ONLINE' },
    { id: 'TXN101', description: 'BOOKING DEPOSIT: MAHESH GOWDA', type: 'IN', amount: 1200, date: 'JUN 07, 2026', mode: 'ONLINE' },
    { id: 'TXN099', description: 'SERVICE EXPENSE: RENOVATION SUPPLIES', type: 'OUT', amount: 4500, date: 'JUN 05, 2026', mode: 'CASH' },
    { id: 'TXN098', description: 'BOOKING DEPOSIT: PRATIGYA B...', type: 'IN', amount: 300, date: 'JUN 02, 2026', mode: 'ONLINE' },
    { id: 'TXN097', description: 'SERVICE EXPENSE: STAFF SALARY', type: 'OUT', amount: 8000, date: 'MAY 31, 2026', mode: 'BANK_TRANSFER' },
    { id: 'TXN096', description: 'BOOKING DEPOSIT: HITENDRA SINGH', type: 'IN', amount: 2400, date: 'APR 17, 2026', mode: 'ONLINE' }
  ];

  const filtered = transactions.filter(t => {
    if (filter === 'ALL') return true;
    if (filter === 'INFLOW') return t.type === 'IN';
    return t.type === 'OUT';
  });

  const totals = transactions.reduce((acc, t) => {
    if (t.type === 'IN') {
      acc.inflow += t.amount;
    } else {
      acc.outflow += t.amount;
    }
    return acc;
  }, { inflow: 0, outflow: 0 });

  return (
    <div className="flex-1 bg-dark-bg min-h-screen pb-24 md:pb-8 text-white">
      {/* Header */}
      <header className="p-6 border-b border-zinc-800/80 sticky top-0 bg-dark-bg/85 backdrop-blur-md z-30 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-wider uppercase">Ledger</h1>
          <p className="text-xs text-muted-text mt-0.5">Financial Transactions Log</p>
        </div>
        <button 
          onClick={() => alert('Ledger CSV summary generated.')}
          className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
        >
          <Download className="w-5 h-5" />
        </button>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-6">
        
        {/* Ledger Summary Cards */}
        <section className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[8px] font-bold text-muted-text uppercase tracking-wider">Total Inflows</p>
              <p className="text-lg font-black text-emerald-400 mt-0.5">₹{totals.inflow}</p>
            </div>
          </div>

          <div className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[8px] font-bold text-muted-text uppercase tracking-wider">Total Outflows</p>
              <p className="text-lg font-black text-red-400 mt-0.5">₹{totals.outflow}</p>
            </div>
          </div>
        </section>

        {/* Ledger Filters toggle bar */}
        <section className="flex bg-zinc-900 border border-zinc-850 p-1 rounded-lg">
          {['ALL', 'INFLOW', 'OUTFLOW'].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`flex-1 py-2 text-[10px] font-extrabold rounded-md uppercase tracking-wider transition ${
                filter === opt
                  ? 'bg-brand-gold text-black shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </section>

        {/* Transactions List */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Logs</h3>
            <span className="text-[9px] font-bold text-zinc-550 italic">Recent movements</span>
          </div>

          <div className="space-y-2.5">
            {filtered.map((txn) => (
              <div 
                key={txn.id}
                className="p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl flex items-center justify-between hover:border-zinc-800 transition"
              >
                <div className="space-y-1 overflow-hidden flex-1 mr-4">
                  <h4 className="text-xs font-extrabold text-white truncate uppercase tracking-wide">
                    {txn.description}
                  </h4>
                  <p className="text-[9px] text-zinc-500 font-semibold tracking-wider">
                    {txn.date} • ID: {txn.id} • MODE: {txn.mode}
                  </p>
                </div>
                <span className={`text-sm font-black shrink-0 ${
                  txn.type === 'IN' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {txn.type === 'IN' ? '+' : '-'}₹{txn.amount}
                </span>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
