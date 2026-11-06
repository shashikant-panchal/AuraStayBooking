import React from 'react';
import { useBooking } from '../context/BookingContext';
import { 
  X, 
  CheckCircle2, 
  Printer, 
  Building2, 
  Calendar, 
  User, 
  MapPin, 
  Phone, 
  ShieldCheck,
  QrCode
} from 'lucide-react';

export default function BookingConfirmationModal() {
  const { confirmedBookingVoucher, setConfirmedBookingVoucher } = useBooking();

  if (!confirmedBookingVoucher) return null;

  const v = confirmedBookingVoucher;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Success Banner */}
        <div className="px-6 py-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-center relative">
          <button
            onClick={() => setConfirmedBookingVoucher(null)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white absolute top-4 right-4 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 text-white shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-black font-serif">Reservation Confirmed!</h2>
          <p className="text-xs text-emerald-100 mt-1">
            Your room has been locked in the hotel PMS and front desk records.
          </p>

          <div className="mt-3 inline-block px-4 py-1.5 rounded-xl bg-white/20 backdrop-blur-md font-mono font-bold text-sm tracking-wider">
            REF: {v.bookingId}
          </div>
        </div>

        {/* Voucher Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Hotel & Guest Details */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2.5">
                <Building2 className="w-4 h-4 text-[#0e4860]" />
                <span className="font-bold text-slate-900 text-sm">{v.hotel.name}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                LOCKED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-600">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Primary Guest</span>
                <span className="font-semibold text-slate-900">{v.guestName}</span>
                <span className="block text-[11px] text-slate-500 font-mono">{v.guestPhone}</span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Allocated Room</span>
                <span className="font-semibold text-slate-900">Room {v.room.roomNumber}</span>
                <span className="block text-[11px] text-slate-500">{v.room.type}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-600 pt-2 border-t border-slate-100">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Check-in</span>
                <span className="font-semibold text-slate-900">{v.checkIn}</span>
                <span className="block text-[11px] text-slate-500">From 12:00 PM</span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400">Check-out</span>
                <span className="font-semibold text-slate-900">{v.checkOut}</span>
                <span className="block text-[11px] text-slate-500">By 11:00 AM</span>
              </div>
            </div>
          </div>

          {/* Payment & Amount */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between font-mono">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Payment Mode</span>
              <span className="font-bold text-slate-800 text-xs">
                {v.paymentMethod === 'ONLINE' ? 'Instant Online (PAID)' : 'Pay At Front Desk'}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Total Amount</span>
              <span className="text-base font-black text-[#0e4860]">
                ₹{v.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-xl font-bold text-slate-700 transition"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print / Download Voucher</span>
            </button>

            <button
              onClick={() => setConfirmedBookingVoucher(null)}
              className="px-6 py-2 bg-[#0e4860] hover:bg-[#135d7c] text-white rounded-xl font-bold shadow-md shadow-[#0e4860]/20 transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

