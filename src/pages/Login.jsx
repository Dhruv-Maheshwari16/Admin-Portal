import React, { useState } from 'react';
import { Mail, Activity } from 'lucide-react';
import HyperIcon from '../components/HyperIcon';

export default function Login({ onEmailSubmit }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email address is required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    onEmailSubmit(email);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col justify-between p-6 md:justify-center md:items-center">
      {/* Spacer for mobile alignment */}
      <div className="hidden md:block" />

      {/* Main Content Card */}
      <div className="w-full max-w-md mx-auto space-y-8 mt-12 md:mt-0 md:bg-card-bg md:p-8 md:rounded-2xl md:border md:border-zinc-800 md:shadow-xl">
        
        {/* Logo */}
        <div className="flex flex-col items-start md:items-center space-y-4 py-2">
          <HyperIcon size={40} className="text-brand-gold" />
        </div>

        {/* Header Titles */}
        <div className="space-y-2 md:text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">Partner Login</h1>
          <p className="text-sm text-muted-text">
            Enter your registered email to receive a verification code
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-zinc-500 pointer-events-none">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-[#18181b] border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition"
              />
            </div>
            {error && (
              <p className="text-xs text-red-500 font-semibold">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-brand-gold hover:bg-brand-gold-hover text-black py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm transition shadow-md shadow-brand-gold/10 hover:shadow-brand-gold/20"
          >
            Continue
          </button>
        </form>

        {/* Help/Hint box */}
        <div className="p-4 bg-zinc-900/50 border border-zinc-850 rounded-xl text-center">
          <p className="text-[10px] font-bold text-brand-gold uppercase tracking-wider mb-1">
            Sandbox Test Credentials
          </p>
          <p className="text-[11px] text-zinc-400 font-semibold">
            Test OTP: <span className="text-white font-bold">000000</span>
          </p>
          <p className="text-[9px] text-muted-text mt-1">
            Emails: vellore.admin@hyper.com, mumbai.admin@hyper.com
          </p>
        </div>
      </div>

      {/* Footer text */}
      <div className="text-[10px] text-zinc-500 text-center font-medium py-4">
        By continuing, you agree to our{' '}
        <a href="#terms" className="text-brand-gold hover:underline">
          Terms & Conditions
        </a>
      </div>
    </div>
  );
}
