import React from 'react';
import { useBooking } from '../context/BookingContext';
import { 
  ShieldCheck, 
  Wifi, 
  Coffee, 
  Car, 
  Sparkles, 
  Clock, 
  CheckCircle2,
  MapPin
} from 'lucide-react';

export default function HotelHero() {
  const { selectedHotel } = useBooking();

  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-[#0a2331] to-[#0e4860] text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background ambient pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-cyan-200 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Direct Booking Channel • Best Rate Guaranteed</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-serif text-white leading-tight">
            Experience Unrivaled Comfort & Elegance at {selectedHotel.name}
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-200 leading-relaxed font-light">
            Welcome to {selectedHotel.name}. Discover curated accommodations, bespoke hospitality, and effortless room reservations with instant confirmation and locked inventory.
          </p>

          {/* Highlights */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <Clock className="w-3.5 h-3.5 text-cyan-300" />
              <span>Check-in: 12:00 PM | Check-out: 11:00 AM</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <Wifi className="w-3.5 h-3.5 text-cyan-300" />
              <span>Free High-Speed Wi-Fi</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <Coffee className="w-3.5 h-3.5 text-cyan-300" />
              <span>Breakfast Included Options</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pay at Hotel Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

