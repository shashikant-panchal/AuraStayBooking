import React from 'react';
import { useBooking } from '../context/BookingContext';
import { 
  Calendar, 
  Users, 
  Bed, 
  Filter, 
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function SearchFilterBar() {
  const { 
    checkIn, 
    setCheckIn, 
    checkOut, 
    setCheckOut, 
    nights,
    guestsCount, 
    setGuestsCount,
    categoryFilter,
    setCategoryFilter,
    availableRooms
  } = useBooking();

  const categories = [
    { id: 'ALL', label: 'All Rooms' },
    { id: 'Standard Room', label: 'Standard Room' },
    { id: 'Deluxe King', label: 'Deluxe King' },
    { id: 'Super Deluxe', label: 'Super Deluxe' },
    { id: 'Executive Suite', label: 'Executive Suite' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-900/10 border border-slate-200/90 p-4 sm:p-5">
        {/* Search controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Check-In */}
          <div className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 transition">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
              Check-In Date
            </label>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#0e4860] shrink-0" />
              <input
                type="date"
                value={checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent font-bold text-xs text-slate-900 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Check-Out */}
          <div className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 transition">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Check-Out Date
              </label>
              <span className="text-[10px] font-bold text-[#0e4860] bg-cyan-50 px-1.5 py-0.2 rounded font-mono">
                {nights} {nights === 1 ? 'Night' : 'Nights'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#0e4860] shrink-0" />
              <input
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent font-bold text-xs text-slate-900 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Guests */}
          <div className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 transition">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
              Guests & Rooms
            </label>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#0e4860] shrink-0" />
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-full bg-transparent font-bold text-xs text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value={1}>1 Guest • 1 Room</option>
                <option value={2}>2 Guests • 1 Room</option>
                <option value={3}>3 Guests • 1 Room</option>
                <option value={4}>4 Guests • 2 Rooms</option>
                <option value={6}>6+ Guests (Family)</option>
              </select>
            </div>
          </div>

          {/* Availability summary banner */}
          <div className="p-3 bg-gradient-to-br from-[#0e4860] to-[#125875] rounded-2xl text-white flex items-center justify-between shadow-md">
            <div>
              <div className="text-[10px] font-bold text-cyan-200 uppercase tracking-wider">
                Live Inventory
              </div>
              <div className="text-base font-black">
                {availableRooms.length} {availableRooms.length === 1 ? 'Room' : 'Rooms'} Ready
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Bed className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Category:</span>
            </span>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoryFilter(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  categoryFilter === c.id
                    ? 'bg-[#0e4860] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing verified available rooms for <strong className="text-slate-800">{nights} night(s)</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
