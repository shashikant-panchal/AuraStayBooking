import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { 
  X, 
  Search, 
  CalendarCheck, 
  Bed, 
  User, 
  MapPin, 
  CheckCircle2, 
  LogIn, 
  Clock, 
  Calendar,
  ShieldCheck,
  Receipt
} from 'lucide-react';

export default function MyBookingsDrawer() {
  const { 
    isMyBookingsOpen, 
    setIsMyBookingsOpen, 
    reservations, 
    selectedHotel,
    currentUser,
    userBookings,
    openAuthModal
  } = useBooking();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState(currentUser ? 'my_account' : 'search');

  if (!isMyBookingsOpen) return null;

  // Search filter results
  const searchResults = reservations.filter(r => {
    if (!query.trim()) return false;
    const q = query.toLowerCase().trim();
    return (r.id && r.id.toLowerCase().includes(q)) ||
           (r.guest_phone && r.guest_phone.includes(q)) ||
           (r.guest_email && r.guest_email.toLowerCase().includes(q)) ||
           (r.guest && r.guest.toLowerCase().includes(q));
  });

  const displayedAccountBookings = userBookings || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end">
      <div className="bg-white w-full sm:max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0e4860]/10 flex items-center justify-center text-[#0e4860]">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 font-serif leading-tight">My Reservations</h3>
              <p className="text-[11px] text-slate-500">{selectedHotel.name}</p>
            </div>
          </div>
          <button
            onClick={() => setIsMyBookingsOpen(false)}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch if logged in */}
        {currentUser ? (
          <div className="p-3 bg-white border-b border-slate-100">
            <div className="flex items-center space-x-2 mb-3 px-2 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span className="truncate">
                Logged in as <strong>{currentUser.name || currentUser.email}</strong>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('my_account')}
                className={`py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'my_account'
                    ? 'bg-white text-[#0e4860] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                My Account ({displayedAccountBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === 'search'
                    ? 'bg-white text-[#0e4860] shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Lookup by ID
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gradient-to-r from-cyan-50 to-emerald-50 border-b border-slate-200">
            <div className="flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-[#0e4860] shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-slate-900">Sign In to View All Stays</p>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Access your upcoming bookings, download vouchers, and track past stays.
                </p>
                <button
                  onClick={() => openAuthModal('signin')}
                  className="mt-2.5 inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#0e4860] text-white rounded-lg font-bold text-xs shadow-xs hover:bg-[#135d7c] transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In or Register</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content View */}
        {activeTab === 'my_account' && currentUser ? (
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 text-xs">
            {displayedAccountBookings.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <CalendarCheck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="font-bold text-slate-700">No active bookings found</p>
                <p className="text-slate-500 text-[11px] mt-1">
                  You haven't booked any rooms with {currentUser.email} yet.
                </p>
              </div>
            ) : (
              displayedAccountBookings.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-slate-300 transition">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-mono font-bold text-sm text-[#0e4860]">{r.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      r.status === 'CONFIRMED' || r.status === 'CHECKED_IN'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {r.status || 'CONFIRMED'}
                    </span>
                  </div>

                  <div className="text-slate-700 space-y-1">
                    <div className="font-bold text-sm text-slate-900">{r.guest}</div>
                    <div className="text-slate-600 font-medium flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5 text-slate-400" />
                      <span>{r.room}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{r.check_in || r.checkIn} → {r.check_out || r.checkOut}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-mono">
                    <span className="text-[11px] text-slate-500">Total Tariff</span>
                    <span className="font-bold text-slate-900">
                      ₹{Number(r.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Payment Status:</span>
                    <span className="font-bold text-slate-800 uppercase">{r.payment || 'PENDING'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Search Input */}
            <div className="p-4 sm:p-5 border-b border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Enter Booking Reference ID, Phone, or Email
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. AST-B-861 or phone number"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0e4860]"
                />
              </div>
            </div>

            {/* Results */}
            <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 text-xs">
              {!query.trim() ? (
                <div className="text-center py-12 text-slate-400">
                  <CalendarCheck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  <p className="font-medium">Type your reservation reference number to see stay details.</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p className="font-bold text-slate-800">No reservations found matching "{query}"</p>
                  <p className="text-[11px] text-slate-400 mt-1">Check that you typed the exact Reference ID or Phone.</p>
                </div>
              ) : (
                searchResults.map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="font-mono font-bold text-sm text-[#0e4860]">{r.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {r.status || 'CONFIRMED'}
                      </span>
                    </div>

                    <div className="text-slate-700 space-y-1">
                      <div className="font-bold text-sm text-slate-900">{r.guest}</div>
                      <div className="text-slate-500">{r.room}</div>
                      <div className="text-[11px] text-slate-600 font-semibold">
                        {r.check_in || r.checkIn} → {r.check_out || r.checkOut}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-mono">
                      <span className="text-[11px] text-slate-500">Amount Paid / Due</span>
                      <span className="font-bold text-slate-900">
                        ₹{Number(r.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
