import { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function VerifyOtp({ email, onBack, onVerifySuccess, onResendOtp }) {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  // Auto-focus on the first field
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow digits
    if (value && isNaN(value)) return;

    const newOtp = [...otpDigits];
    newOtp[index] = value.substring(value.length - 1); // take only the last digit
    setOtpDigits(newOtp);

    // Auto-focus next input if we entered a digit
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace back-focus
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otpDigits.join('');
    if (otpString.length < 6) {
      setError('Please enter all 6 digits of the code');
      return;
    }

    setLoading(true);
    try {
      await onVerifySuccess(otpString);
      setError('');
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!onResendOtp) return;

    setResending(true);
    setError('');
    try {
      await onResendOtp(email);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg p-6 flex flex-col justify-between md:justify-center md:items-center">
      
      {/* Top Header Row */}
      <div className="w-full max-w-md mx-auto">
        <button 
          onClick={onBack}
          className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition self-start"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-md mx-auto space-y-8 mt-12 md:mt-6 md:bg-card-bg md:p-8 md:rounded-2xl md:border md:border-zinc-800 md:shadow-xl">
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Verify Email</h1>
          <p className="text-sm text-muted-text leading-relaxed">
            We've sent a 6-digit verification code to <span className="text-white font-semibold">{email}</span>
          </p>
        </div>

        {/* 6-Digit input container */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between gap-2 p-4 bg-zinc-900/50 border border-zinc-850 rounded-xl">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(input) => {
                    inputRefs.current[idx] = input;
                  }}
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={digit}
                  maxLength={1}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  placeholder="0"
                  className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-lg text-center font-bold text-xl text-brand-gold focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition placeholder-zinc-700"
                />
              ))}
            </div>
            {error && (
              <p className="text-xs text-red-500 font-semibold text-center">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gold hover:bg-brand-gold-hover disabled:opacity-60 disabled:cursor-not-allowed text-black py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm transition shadow-md shadow-brand-gold/10 hover:shadow-brand-gold/20"
          >
            {loading ? 'Verifying...' : 'Verify & Login'}
          </button>
        </form>

        {/* Resend Action */}
        <div className="text-center">
          <button 
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-xs font-semibold text-zinc-400 hover:text-white transition"
          >
            Didn't receive the code? <span className="text-brand-gold hover:underline ml-1">{resending ? 'Sending...' : 'Resend OTP'}</span>
          </button>
        </div>
      </div>

      <div className="py-4" /> {/* Spacer */}
    </div>
  );
}
