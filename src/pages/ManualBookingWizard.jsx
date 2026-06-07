import { useEffect, useState } from 'react';
import { ArrowLeft, Layers, ChevronRight, User, Phone } from 'lucide-react';
import { mockResources, getSlotsForResource } from '../data/mockData';
import { adminAPI, hasApiConfig } from '../services/api';
import { toBookingList, toResourceList, toSlotList } from '../services/adapters';

const parseSlotTimes = (slot) => {
  if (slot.startTime && slot.endTime) {
    return { startTime: slot.startTime, endTime: slot.endTime };
  }

  const [startTime = '', endTime = ''] = String(slot.time || '').split(' - ');
  return { startTime, endTime };
};

export default function ManualBookingWizard({ onBack, onBookingCreated, service }) {
  const [step, setStep] = useState(1); // 1: Resource, 2: Slot, 3: Confirm Form
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedDate, setSelectedDate] = useState('2026-06-07');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMode, setPaymentMode] = useState('ONLINE');
  const [resources, setResources] = useState(mockResources);
  const [slots, setSlots] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadResources = async () => {
      if (!hasApiConfig() || !service?.id) return;

      setLoadingResources(true);
      setError('');
      try {
        setResources(toResourceList(await adminAPI.getResources(service.id)));
      } catch (err) {
        setError(err.message || 'Failed to load resources.');
      } finally {
        setLoadingResources(false);
      }
    };

    loadResources();
  }, [service?.id]);

  useEffect(() => {
    const loadSlots = async () => {
      if (!selectedResource) return;

      if (!hasApiConfig()) {
        setSlots(getSlotsForResource(selectedResource.id));
        return;
      }

      setLoadingSlots(true);
      setError('');
      try {
        setSlots(toSlotList(await adminAPI.getResourceSlots(selectedResource.id, selectedDate), selectedResource.price));
      } catch (err) {
        setError(err.message || 'Failed to load slots.');
      } finally {
        setLoadingSlots(false);
      }
    };

    loadSlots();
  }, [selectedResource, selectedDate]);

  const dates = [
    { day: 'SUN', num: '07', fullDate: '2026-06-07' },
    { day: 'MON', num: '08', fullDate: '2026-06-08' },
    { day: 'TUE', num: '09', fullDate: '2026-06-09' },
    { day: 'WED', num: '10', fullDate: '2026-06-10' },
    { day: 'THU', num: '11', fullDate: '2026-06-11' }
  ];

  // Resource click handler
  const handleResourceSelect = (res) => {
    setSelectedResource(res);
    setStep(2);
  };

  // Slot click handler
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStep(3);
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName) return;

    setSubmitting(true);
    setError('');
    try {
      let newBooking;

      if (hasApiConfig() && service?.id && selectedResource?.id) {
        const { startTime, endTime } = parseSlotTimes(selectedSlot);
        const response = await adminAPI.manualBooking({
          serviceId: Number(service.id),
          resourceId: Number(selectedResource.id),
          activityCode: selectedResource.activityCode || selectedResource.name,
          bookingDate: selectedDate,
          startTime,
          endTime,
          amount: Number(selectedSlot.price || selectedResource.price || 0),
          onlineAmountPaid: paymentMode === 'ONLINE' ? Number(selectedSlot.price || selectedResource.price || 0) : 0,
          venueAmountCollected: paymentMode === 'OFFLINE' ? Number(selectedSlot.price || selectedResource.price || 0) : 0,
          remarks: `Manual booking for ${customerName}${phone ? ` (${phone})` : ''}`,
        });
        newBooking = toBookingList([response])[0];
      } else {
        newBooking = {
          id: Math.random().toString(36).substr(2, 4).toUpperCase(),
          customerName: customerName.toUpperCase(),
          phone: phone || "+919876543210",
          date: selectedDate,
          timeSlot: selectedSlot.time,
          resourceType: selectedResource.name,
          price: `INR ${selectedResource.price}`,
          paymentMode: paymentMode,
          status: "CONFIRMED",
          timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) + `, ` + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        };
      }

      if (onBookingCreated) {
        onBookingCreated(newBooking);
      }
    } catch (err) {
      setError(err.message || 'Failed to create manual booking.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-dark-bg min-h-screen pb-12 text-white">
      {/* Header */}
      <header className="p-4 border-b border-zinc-800/80 sticky top-0 bg-dark-bg/85 backdrop-blur-md z-30 flex items-center space-x-3">
        <button 
          onClick={() => {
            if (step === 1) onBack();
            else setStep(step - 1);
          }}
          className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-base font-extrabold tracking-wide uppercase">
            {step === 1 ? 'Select Resource' : step === 2 ? 'Select Slot' : 'Confirm Details'}
          </h1>
          <p className="text-[9px] text-muted-text mt-0.5 uppercase tracking-wider">
            {step === 1 ? 'The House of Pool' : step === 2 ? selectedResource?.name : 'Create Manual Booking'}
          </p>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-6">
        
        {/* STEP 1: SELECT RESOURCE */}
        {step === 1 && (
          <section className="space-y-3 pt-2">
            {loadingResources && (
              <p className="text-xs text-muted-text p-4">Loading resources...</p>
            )}
            {!loadingResources && resources.map((res) => (
              <button
                key={res.id}
                onClick={() => handleResourceSelect(res)}
                className="w-full flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-850 rounded-xl hover:border-zinc-800 hover:bg-zinc-900/60 transition group text-left"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider group-hover:text-brand-gold transition duration-150">
                      {res.name}
                    </h3>
                    <p className="text-[10px] text-zinc-550 font-bold tracking-wider mt-0.5">
                      NA
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition" />
              </button>
            ))}
          </section>
        )}

        {/* STEP 2: SELECT SLOT */}
        {step === 2 && (
          <section className="space-y-5">
            {/* Date Picker Ribbon */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider pl-1">
                Select Date
              </label>
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
            </div>

            {/* Slots Grid */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider pl-1">
                Available Slots
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                {loadingSlots && (
                  <p className="col-span-3 text-xs text-muted-text p-4">Loading slots...</p>
                )}
                {!loadingSlots && slots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => handleSlotSelect(slot)}
                    disabled={slot.disabled}
                    className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-xl hover:border-brand-gold/45 hover:bg-zinc-900/80 text-center transition flex flex-col items-center justify-center"
                  >
                    <span className="text-[9px] font-extrabold text-white leading-relaxed">{slot.time}</span>
                    <span className="text-[9.5px] font-black text-brand-gold mt-1.5">₹{slot.price}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* STEP 3: CONFIRMATION FORM */}
        {step === 3 && (
          <section className="bg-zinc-900/35 border border-zinc-850 rounded-2xl p-5 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-brand-gold border-b border-zinc-900 pb-3">
              Customer & Payment Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <p className="text-xs text-red-500 font-semibold">{error}</p>
              )}
              {/* Customer Name Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider block">
                  Customer Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Enter Customer Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-brand-gold transition"
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider block">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500 pointer-events-none">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-brand-gold transition"
                  />
                </div>
              </div>

              {/* Readonly Summary Info */}
              <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-zinc-900 text-[10px] font-bold text-muted-text">
                <div>
                  <p className="uppercase text-[8px] text-zinc-550">Resource</p>
                  <p className="text-white mt-1 uppercase">{selectedResource?.name}</p>
                </div>
                <div>
                  <p className="uppercase text-[8px] text-zinc-550">Price</p>
                  <p className="text-brand-gold mt-1 font-extrabold">INR {selectedResource?.price}</p>
                </div>
                <div className="mt-2">
                  <p className="uppercase text-[8px] text-zinc-550">Date</p>
                  <p className="text-white mt-1 uppercase">JUN 07, 2026</p>
                </div>
                <div className="mt-2">
                  <p className="uppercase text-[8px] text-zinc-550">Time Slot</p>
                  <p className="text-white mt-1">{selectedSlot?.time}</p>
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-text uppercase tracking-wider block">
                  Payment Mode
                </label>
                <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-900">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('ONLINE')}
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all uppercase ${
                      paymentMode === 'ONLINE'
                        ? 'bg-brand-gold text-black shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Online
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('OFFLINE')}
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all uppercase ${
                      paymentMode === 'OFFLINE'
                        ? 'bg-brand-gold text-black shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Offline
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-gold hover:bg-brand-gold-hover disabled:opacity-60 disabled:cursor-not-allowed text-black py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm transition shadow-md shadow-brand-gold/10 hover:shadow-brand-gold/20"
              >
                {submitting ? 'Creating...' : 'Confirm Booking'}
              </button>
            </form>
          </section>
        )}

      </main>
    </div>
  );
}
