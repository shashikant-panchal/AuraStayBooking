import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { X, Search, CalendarCheck, Bed, User, MapPin, CheckCircle2 } from 'lucide-react';

export default function MyBookingsDrawer() {
  const { isMyBookingsOpen, setIsMyBookingsOpen, reservations, selectedHotel } = useBooking();
  const [query, setQuery] = useState('');

  if (!isMyBookingsOpen) return null;

  const results = reservations.filter(r => {
    if (!query.trim()) return false;
    const q = query.toLowerCase().trim();
    return (r.id && r.id.toLowerCase().includes(q)) ||
           (r.guest_phone && r.guest_phone.includes(q)) ||
           (r.guest_email && r.guest_email.toLowerCase().includes(q)) ||
           (r.guest && r.guest.toLowerCase().includes(q));
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <CalendarCheck className="w-5 h-5 text-[#0e4860]" />
            <h3 className="font-bold text-base text-slate-900 font-serif">Lookup My Bookings</h3>
          </div>
          <button
            onClick={() => setIsMyBookingsOpen(false)}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-5 border-b border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Enter Booking Reference ID or Phone Number
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
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          {!query.trim() ? (
            <div className="text-center py-12 text-slate-400">
              <CalendarCheck className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="font-medium">Type your reservation reference number to see stay details.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="font-bold text-slate-800">No reservations found matching "{query}"</p>
              <p className="text-[11px] text-slate-400 mt-1">Check that you typed the exact Reference ID or Phone.</p>
            </div>
          ) : (
            results.map((r) => (
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
    </div>
  );
}
