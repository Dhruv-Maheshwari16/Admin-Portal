import { 
  Palette, Bell, HelpCircle, Mail, FileText, Shield, Wallet, LogOut, ChevronRight 
} from 'lucide-react';
import HyperIcon from '../components/HyperIcon';

export default function Settings({ onLogout }) {
  
  const groups = [
    {
      title: 'GENERAL',
      items: [
        { id: 'theme', label: 'Theme Settings', subLabel: 'Customize app appearance', icon: Palette },
        { id: 'notifications', label: 'Notifications', subLabel: 'Manage notification preferences', icon: Bell },
      ]
    },
    {
      title: 'SUPPORT',
      items: [
        { id: 'help', label: 'Help & FAQ', subLabel: 'Get help and find answers', icon: HelpCircle },
        { id: 'contact', label: 'Contact Support', subLabel: 'Get in touch with our team', icon: Mail },
      ]
    },
    {
      title: 'ABOUT',
      items: [
        { id: 'terms', label: 'Terms of Service', subLabel: 'Read our terms and conditions', icon: FileText },
        { id: 'privacy', label: 'Privacy Policy', subLabel: 'Read our privacy policy', icon: Shield },
      ]
    },
    {
      title: 'FINANCE',
      items: [
        { id: 'financial_dashboard', label: 'Financial Dashboard', subLabel: 'Revenue, profit & losses', icon: Wallet },
      ]
    }
  ];

  return (
    <div className="flex-1 bg-dark-bg min-h-screen pb-24 md:pb-8 text-white">
      {/* Header */}
      <header className="p-6 border-b border-zinc-800/80 sticky top-0 bg-dark-bg/80 backdrop-blur-md z-30 flex items-center space-x-3">
        <div className="w-8 h-8 flex items-center justify-center">
          <HyperIcon size={22} className="text-brand-gold" />
        </div>
        <h1 className="text-xl font-bold tracking-wider uppercase">Settings</h1>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-6">
        
        {/* User Card */}
        <section className="p-5 bg-zinc-900/40 border border-zinc-850 rounded-2xl flex items-center space-x-4">
          <div className="w-14 h-14 rounded-xl bg-brand-gold text-black flex items-center justify-center select-none overflow-hidden">
            <HyperIcon size={32} className="text-black" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-extrabold tracking-wide uppercase">House of Pool</h2>
            <p className="text-[10px] font-bold text-zinc-550 tracking-wider">
              HOUSEOFPOOL27@GMAIL.COM
            </p>
            <div className="pt-1">
              <span className="px-2 py-0.5 bg-brand-gold text-black text-[9px] font-black tracking-wider rounded uppercase">
                Administrator
              </span>
            </div>
          </div>
        </section>

        {/* Settings Categories List */}
        <section className="space-y-6">
          {groups.map((group) => (
            <div key={group.title} className="space-y-2.5">
              <h3 className="text-[10px] font-bold text-muted-text uppercase tracking-wider pl-1">
                {group.title}
              </h3>
              
              <div className="bg-zinc-900/30 border border-zinc-850 rounded-2xl overflow-hidden divide-y divide-zinc-900">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => alert(`Opening Settings: ${item.label}`)}
                      className="w-full flex items-center justify-between p-4 hover:bg-zinc-900/50 transition group text-left"
                    >
                      <div className="flex items-center space-x-3.5">
                        <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 text-brand-gold flex items-center justify-center group-hover:bg-brand-gold group-hover:text-black transition">
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-brand-gold transition duration-150">
                            {item.label}
                          </p>
                          <p className="text-[9.5px] font-bold text-zinc-500 tracking-wider mt-0.5">
                            {item.subLabel}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-650 group-hover:text-white transition" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* Log Out button triggers */}
        <section className="pt-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-red-500/20 hover:bg-red-500/5 text-red-500 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-inner"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </section>

        {/* Footer Brand Info */}
        <footer className="text-center space-y-1 py-4">
          <p className="text-[9.5px] font-bold text-zinc-500 tracking-wider uppercase">Version 1.0.0 (GOLD)</p>
          <p className="text-[8px] font-bold text-zinc-650 tracking-wide uppercase">Hyper Chief • All Rights Reserved</p>
        </footer>

      </main>
    </div>
  );
}
