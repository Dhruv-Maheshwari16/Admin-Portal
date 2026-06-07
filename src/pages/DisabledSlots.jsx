import { useState } from 'react';
import { ArrowLeft, Calendar, Building2, Trash2 } from 'lucide-react';
import { mockVenues } from '../data/mockData';
import { adminAPI, hasApiConfig } from '../services/api';
import { toDisabledSlots } from '../services/adapters';

export default function DisabledSlots({ onBack, service = mockVenues[0] }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [disabledList, setDisabledList] = useState([
    { id: 'db1', time: '10:00 AM - 11:00 AM', resource: 'TURF', reason: 'MAINTENANCE', date: '2026-06-07' },
    { id: 'db2', time: '6:00 PM - 7:00 PM', resource: 'TT TABLE 2', reason: 'STAFF SHORTAGE', date: '2026-06-07' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async (id) => {
    if (!hasApiConfig()) {
      setDisabledList(disabledList.filter(item => item.id !== id));
      return;
    }

    try {
      await adminAPI.deleteDisabledSlots([id]);
      setDisabledList(disabledList.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete disabled slot.');
    }
  };

  const handlePickDate = async () => {
    const date = '2026-06-07';
    setSelectedDate(date);
    setError('');

    if (!hasApiConfig() || !service?.id) return;

    setLoading(true);
    try {
      setDisabledList(toDisabledSlots(await adminAPI.getServiceDisabledSlots(service.id, date)));
    } catch (err) {
      setError(err.message || 'Failed to load disabled slots.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = disabledList.filter(item => item.date === selectedDate);

  return (
    <div className="flex-1 bg-dark-bg min-h-screen pb-12 text-white">
      {/* Header */}
      <header className="p-4 border-b border-zinc-800/80 sticky top-0 bg-dark-bg/85 backdrop-blur-md z-30 flex items-center space-x-3">
        <button 
          onClick={onBack}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-extrabold tracking-wide uppercase">Disabled Slots</h1>
          <p className="text-[10px] text-muted-text mt-0.5 uppercase tracking-wider">Manage blocked times</p>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-6">
        
        {/* Select Service Dropdown */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider pl-1">
            Select Service
          </label>
          <div className="flex items-center space-x-3 p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-zinc-950 flex items-center justify-center text-zinc-500">
              <Building2 className="w-4.5 h-4.5" />
            </div>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {service.name}
            </span>
          </div>
        </div>

        {/* Date Selector empty vs populated */}
        {!selectedDate ? (
          /* Empty prompt state matching Screen 11 */
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="w-16 h-16 rounded-full bg-zinc-900/80 border border-zinc-850 flex items-center justify-center text-brand-gold">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h2 className="text-lg font-bold text-white uppercase tracking-wide">Select A Date</h2>
              <p className="text-[11px] text-muted-text max-w-[240px] leading-relaxed mx-auto font-medium">
                PLEASE CHOOSE A DATE TO VIEW ITS DISABLED SLOTS
              </p>
            </div>
            <button
              onClick={handlePickDate}
              className="py-3 px-8 bg-brand-gold hover:bg-brand-gold-hover text-black font-extrabold rounded-lg text-xs uppercase tracking-wider shadow"
            >
              Pick Date
            </button>
          </div>
        ) : (
          /* Populated List view for sandbox date */
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Blocked slots for JUN 07, 2026
              </span>
              <button 
                onClick={() => setSelectedDate('')}
                className="text-[9px] font-bold text-brand-gold uppercase hover:underline"
              >
                Change Date
              </button>
            </div>

            {filtered.length === 0 ? (
              <p className="text-center py-8 text-xs text-zinc-500">
                {error || (loading ? 'Loading blocked slots...' : 'No blocked slots for this date.')}
              </p>
            ) : (
              <div className="space-y-3">
                {error && (
                  <p className="text-xs text-red-500 font-semibold">{error}</p>
                )}
                {filtered.map(item => (
                  <div 
                    key={item.id}
                    className="p-4 bg-zinc-900/50 border border-zinc-850 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-extrabold text-white uppercase tracking-wide">{item.time}</h4>
                      <p className="text-[9.5px] font-bold text-brand-gold tracking-wider mt-1">
                        RESOURCE: {item.resource}
                      </p>
                      <span className="inline-block mt-2 text-[8px] font-extrabold text-red-400 bg-red-500/10 px-2 py-0.5 rounded uppercase border border-red-500/20">
                        REASON: {item.reason}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 text-zinc-500 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
