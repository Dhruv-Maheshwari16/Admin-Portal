export default function ComingSoonOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1.5px] rounded-lg z-10 pointer-events-none select-none">
      <div className="coming-soon-stamp border-brand-gold text-brand-gold font-extrabold px-3 py-1 text-sm border-2 rounded tracking-widest bg-[#0a0a0a] shadow-lg transform -rotate-12 uppercase">
        Coming_Soon
      </div>
    </div>
  );
}
