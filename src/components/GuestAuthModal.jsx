import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  BedDouble
} from 'lucide-react';

export default function GuestAuthModal() {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    signIn, 
    signUp,
    selectedHotel 
  } = useBooking();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (authModalMode === 'signup') {
        if (!name.trim() || !email.trim() || !password.trim()) {
          setError('Please complete all required fields.');
          setIsLoading(false);
          return;
        }
        await signUp({ name, email, phone, password });
      } else {
        if (!email.trim() || !password.trim()) {
          setError('Please enter your email and password.');
          setIsLoading(false);
          return;
        }
        await signIn({ email, password });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-[#0a2331] to-[#0e4860] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif">
                {authModalMode === 'login' ? 'Guest Sign In' : 'Create Guest Account'}
              </h3>
              <p className="text-[11px] text-cyan-200">
                Securely book and manage your stays at {selectedHotel.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex rounded-none gap-2">
          <button
            type="button"
            onClick={() => { setAuthModalMode('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              authModalMode === 'login'
                ? 'bg-white text-[#0e4860] shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthModalMode('signup'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              authModalMode === 'signup'
                ? 'bg-white text-[#0e4860] shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">
              {error}
            </div>
          )}

          {authModalMode === 'signup' && (
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Shashikant Verma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e4860] font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="guest@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e4860] font-medium"
              />
            </div>
          </div>

          {authModalMode === 'signup' && (
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Mobile Phone (For Booking Confirmation)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e4860] font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e4860] font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#0e4860] hover:bg-[#135d7c] disabled:opacity-50 text-white rounded-xl font-bold shadow-md shadow-[#0e4860]/20 flex items-center justify-center space-x-2 transition mt-2 cursor-pointer"
          >
            <span>
              {isLoading 
                ? 'Processing...' 
                : authModalMode === 'login' 
                ? 'Sign In & Continue' 
                : 'Create Account & Continue'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2 text-[11px] text-slate-500">
            {authModalMode === 'login' ? (
              <span>
                New guest?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthModalMode('signup'); setError(''); }}
                  className="text-[#0e4860] font-bold hover:underline"
                >
                  Create an account
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthModalMode('login'); setError(''); }}
                  className="text-[#0e4860] font-bold hover:underline"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
