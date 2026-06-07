import React, { useState } from 'react';
import { X, Calendar, Building2, Check } from 'lucide-react';

export default function DisableSlotsDrawer({ isOpen, onClose, onDisable, selectedService }) {
  const [durationMode, setDurationMode] = useState('single'); // 'single' or 'range'
  const [entireDay, setEntireDay] = useState(true);
  const [selectedReason, setSelectedReason] = useState('MAINTENANCE');
  const [customReason, setCustomReason] = useState('MAINTENANCE');
  const [startDate, setStartDate] = useState('2026-06-07');

  if (!isOpen) return null;

  const reasons = [
    'MAINTENANCE',
    'HOLIDAY',
    'STAFF SHORTAGE',
    'EMERGENCY',
    'PRIVATE EVENT',
    'RENOVATION',
  ];

  const handleReasonClick = (reason) => {
    setSelectedReason(reason);
    setCustomReason(reason);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onDisable) {
      onDisable({
        service: selectedService?.name || "The House of Pool",
        durationMode,
        startDate,
        entireDay,
        reason: customReason,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm">
      {/* Drawer Container */}
      <div 
        className="w-full max-w-lg bg-[#141416] border-t border-zinc-800 rounded-t-2xl overflow-y-auto max-h-[92vh] animate-slide-up pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-zinc-900">
          <div>
            <h2 className="text-xl font-bold text-white">Disable Slots</h2>
            <p className="text-xs text-muted-text mt-1">Bulk disable or block specific times</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
          {/* 1. SELECT SERVICE */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-wider text-muted-text block uppercase">
              1. Select Service
            </label>
            <div className="flex items-center space-x-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-500">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {selectedService?.name || "THE HOUSE OF POOL"}
                </h3>
              </div>
            </div>
          </div>

          {/* 3. DATE & DURATION */}
          <div className="space-y-3">
            <label className="text-xs font-bold tracking-wider text-muted-text block uppercase">
              3. Date & Duration
            </label>
            
            {/* Segmented Picker */}
            <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-850">
              <button
                type="button"
                onClick={() => setDurationMode('single')}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all uppercase ${
                  durationMode === 'single'
                    ? 'bg-brand-gold text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Single Day
              </button>
              <button
                type="button"
                onClick={() => setDurationMode('range')}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-all uppercase ${
                  durationMode === 'range'
                    ? 'bg-brand-gold text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Date Range
              </button>
            </div>

            {/* Date Field Card */}
            <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-zinc-500" />
                <div>
                  <p className="text-[10px] font-bold text-muted-text uppercase tracking-wider">Start Date</p>
                  <p className="text-sm font-semibold text-white mt-0.5">
                    {startDate === '2026-06-07' ? 'JUN 07, 2026' : startDate}
                  </p>
                </div>
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="opacity-0 absolute w-8 h-8 cursor-pointer"
                style={{ right: '2.5rem' }}
              />
            </div>
          </div>

          {/* 4. TIME RANGE */}
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-wider text-muted-text block uppercase">
              4. Time Range
            </label>
            <div 
              onClick={() => setEntireDay(!entireDay)}
              className="flex items-center space-x-3 cursor-pointer py-1"
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                entireDay 
                  ? 'bg-brand-gold border-brand-gold text-black' 
                  : 'bg-transparent border-zinc-700 text-transparent'
              }`}>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Entire Day
              </span>
            </div>
          </div>

          {/* 5. REASON */}
          <div className="space-y-3">
            <label className="text-xs font-bold tracking-wider text-muted-text block uppercase">
              5. Reason
            </label>
            
            {/* Tag Selection Grid */}
            <div className="grid grid-cols-2 gap-2">
              {reasons.map((reason) => (
                <button
                  type="button"
                  key={reason}
                  onClick={() => handleReasonClick(reason)}
                  className={`py-2 px-3 text-[10px] font-bold rounded border text-center transition-all ${
                    selectedReason === reason
                      ? 'border-brand-gold text-brand-gold bg-brand-gold/10'
                      : 'border-zinc-800 text-zinc-400 bg-transparent hover:border-zinc-700'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            {/* Custom Input Box */}
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Reason for blockout"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-gold min-h-[80px]"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex space-x-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-zinc-700 text-zinc-300 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-zinc-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-red-650 hover:bg-red-700 text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-900/20"
              style={{ backgroundColor: '#dc2626' }}
            >
              Disable Slots
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
