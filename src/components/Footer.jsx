import React from 'react';
import { useBooking } from '../context/BookingContext';
import { Building2, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const { selectedHotel } = useBooking();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Building2 className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="font-serif font-black text-white text-base tracking-tight">
                {selectedHotel.name}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Official guest booking portal powered by AuraStay Hospitality Ecosystem. Verified direct bookings, locked inventory, zero hidden commissions, and seamless check-in.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Secure Instant Room Reservation</span>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Front Desk</h4>
            <div className="space-y-1.5 text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{selectedHotel.mobile || '+91 79785 78046'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{selectedHotel.city || 'Bhubaneswar'}, Odisha</span>
              </div>
            </div>
          </div>

          {/* Hospitality Policies */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Stay Policies</h4>
            <div className="space-y-1 text-slate-400 text-[11px]">
              <div>• Check-in: 12:00 PM onwards</div>
              <div>• Check-out: 11:00 AM</div>
              <div>• Government Photo ID required at check-in</div>
              <div>• Cancellation: Flexible policy</div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-4">
          <div>
            © {new Date().getFullYear()} {selectedHotel.name}. All rights reserved.
          </div>
          <div className="flex items-center space-x-2">
            <span>Powered by</span>
            <span className="font-black text-white">AuraStay</span>
            <span>Hospitality Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
