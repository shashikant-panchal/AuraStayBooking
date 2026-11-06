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
  ExternalLink,
  User,
  LogOut,
  LogIn
} from 'lucide-react';

export default function Navbar() {
  const { 
    hotels, 
    selectedHotel, 
    setSelectedHotel, 
    setIsMyBookingsOpen,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode,
    signOut,
    userBookings
  } = useBooking();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2">
        {/* Left: Hotel Brand & Selector */}
        <div className="flex items-center space-x-2.5 sm:space-x-4 min-w-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-slate-900 border border-slate-200 overflow-hidden shadow-xs flex items-center justify-center shrink-0">
            {selectedHotel.logoUrl ? (
              <img 
                src={selectedHotel.logoUrl} 
                alt={selectedHotel.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#0e4860]" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <h1 className="text-sm sm:text-lg font-black text-slate-900 tracking-tight font-serif truncate">
                {selectedHotel.name}
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                ★ 4.9 Superb
              </span>
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate max-w-[140px] sm:max-w-[280px]">{selectedHotel.city || 'Bhubaneswar'}, {selectedHotel.address || 'India'}</span>
            </div>
          </div>

          {/* Hotel Switcher Dropdown (for Multi-Tenant selection) */}
          {hotels.length > 1 && (
            <div className="relative hidden lg:block pl-3 border-l border-slate-200">
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
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Direct contact */}
          <div className="hidden xl:flex flex-col text-right pr-3 border-r border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Direct Front Desk</span>
            <a href={`tel:${selectedHotel.mobile || '7978578046'}`} className="text-xs font-bold text-slate-800 hover:text-[#0e4860] flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#0e4860]" />
              <span>{selectedHotel.mobile || '+91 79785 78046'}</span>
            </a>
          </div>

          {/* User Sign In / Profile */}
          {currentUser ? (
            <div className="flex items-center space-x-2 bg-slate-100 py-1 px-2.5 rounded-2xl border border-slate-200">
              <div className="w-7 h-7 rounded-xl bg-[#0e4860] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left text-xs leading-none">
                <span className="font-bold text-slate-800 block truncate max-w-[100px]">{currentUser.name}</span>
                <span className="text-[10px] text-slate-500 font-mono truncate block max-w-[100px]">{currentUser.email}</span>
              </div>
              <button
                onClick={signOut}
                className="p-1 text-slate-400 hover:text-rose-600 transition ml-1"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-[#0e4860]" />
              <span>Sign In</span>
            </button>
          )}

          {/* My Bookings Button */}
          <button
            onClick={() => setIsMyBookingsOpen(true)}
            className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#0e4860] hover:bg-[#135d7c] text-white text-xs font-bold shadow-sm shadow-[#0e4860]/20 transition cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">My Bookings</span>
            {userBookings.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-cyan-400 text-slate-900 font-black text-[10px] flex items-center justify-center font-mono">
                {userBookings.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
