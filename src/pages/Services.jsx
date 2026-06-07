import React from 'react';
import { MapPin, Building2, ChevronRight } from 'lucide-react';
import { mockVenues } from '../data/mockData';

export default function Services({ 
  onManageVenue,
  venuesList = mockVenues 
}) {
  return (
    <div className="flex-1 bg-dark-bg min-h-screen pb-24 md:pb-8 text-white">
      {/* Header */}
      <header className="p-6 border-b border-zinc-800/80 sticky top-0 bg-dark-bg/80 backdrop-blur-md z-30">
        <h1 className="text-xl font-bold tracking-wider uppercase">Services</h1>
        <p className="text-xs text-muted-text mt-1">Manage Venue Listings</p>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-4">
        <section className="space-y-3 pt-2">
          {venuesList.map((venue) => (
            <div 
              key={venue.id}
              className="bg-zinc-900/40 border border-zinc-850 rounded-2xl p-5 space-y-6 hover:border-zinc-800 transition relative overflow-hidden group"
            >
              {/* Green status badge */}
              <div className="flex justify-start">
                <span className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-md text-[9px] font-bold tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{venue.status}</span>
                </span>
              </div>

              {/* Title & Address */}
              <div className="space-y-2">
                <h2 className="text-lg font-bold tracking-wide text-white group-hover:text-brand-gold transition duration-200 uppercase">
                  {venue.name}
                </h2>
                <div className="flex items-start space-x-2 text-[10px] font-bold text-muted-text">
                  <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed truncate max-w-[280px] md:max-w-md">
                    {venue.address}
                  </span>
                </div>
              </div>

              {/* Manage link action */}
              <div className="flex justify-end pt-2 border-t border-zinc-900">
                <button
                  onClick={() => onManageVenue(venue)}
                  className="flex items-center space-x-1 py-1.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider text-brand-gold hover:bg-brand-gold/10 transition"
                >
                  <span>Manage</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
