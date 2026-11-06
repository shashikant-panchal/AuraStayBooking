import React from 'react';
import { useBooking } from '../context/BookingContext';
import { 
  Building2, 
  MapPin, 
  Phone, 
  CalendarCheck, 
  ChevronDown, 
  Sparkles,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export default function Navbar() {
  const { 
    hotels, 
    selectedHotel, 
    setSelectedHotel, 
    setIsMyBookingsOpen 
  } = useBooking();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Hotel Brand & Selector */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-200 overflow-hidden shadow-sm flex items-center justify-center shrink-0">
              {selectedHotel.logoUrl ? (
                <img 
                  src={selectedHotel.logoUrl} 
                  alt={selectedHotel.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <Building2 className="w-6 h-6 text-[#0e4860]" />
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-black text-slate-900 tracking-tight font-serif">
                  {selectedHotel.name}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  ★ 4.9 Superb
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate max-w-[280px]">{selectedHotel.city || 'Bhubaneswar'}, {selectedHotel.address || 'India'}</span>
              </div>
            </div>
          </div>

          {/* Hotel Switcher Dropdown (for Multi-Tenant selection) */}
          {hotels.length > 1 && (
            <div className="relative hidden md:block pl-3 border-l border-slate-200">
              <label className="block text-[9px] uppercase font-bold text-slate-400">Switch Hotel</label>
              <select
                value={selectedHotel.id}
                onChange={(e) => {
                  const found = hotels.find(h => h.id === e.target.value);
                  if (found) setSelectedHotel(found);
                }}
                className="text-xs font-bold text-[#0e4860] bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-lg border border-slate-200 focus:outline-none cursor-pointer"
              >
                {hotels.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          {/* Direct contact */}
          <div className="hidden lg:flex flex-col text-right pr-3 border-r border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Direct Front Desk</span>
            <a href={`tel:${selectedHotel.mobile || '7978578046'}`} className="text-xs font-bold text-slate-800 hover:text-[#0e4860] flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#0e4860]" />
              <span>{selectedHotel.mobile || '+91 79785 78046'}</span>
            </a>
          </div>

          {/* My Bookings Button */}
          <button
            onClick={() => setIsMyBookingsOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-800 text-xs font-bold transition"
          >
            <CalendarCheck className="w-4 h-4 text-[#0e4860]" />
            <span>My Bookings</span>
          </button>

          {/* Quick link to Hotel PMS */}
          <a
            href="https://shashikant-panchal.github.io/AuraStay/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1 px-3 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold hover:bg-slate-100 transition"
            title="Hotel Admin Login"
          >
            <span>Hotel Admin</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </header>
  );
}
