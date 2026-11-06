import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { 
  X, 
  Bed, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  CheckCircle2,
  Sparkles,
  FileText
} from 'lucide-react';

export default function BookingModal() {
  const { 
    selectedRoomForBooking, 
    setSelectedRoomForBooking, 
    selectedHotel,
    checkIn, 
    checkOut, 
    nights,
    confirmBooking 
  } = useBooking();

  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('HOTEL'); // 'HOTEL' | 'ONLINE'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!selectedRoomForBooking) return null;

  const room = selectedRoomForBooking;
  const roomTariff = room.price * nights;
  const tax = Math.round(roomTariff * 0.12);
  const grandTotal = roomTariff + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
      setError('Please provide Guest Full Name, Email, and Mobile Phone.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await confirmBooking({
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        specialRequests: specialRequests.trim(),
        paymentMethod
      });
    } catch (err) {
      setError('Booking processing failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0a2331] to-[#0e4860] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Bed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif">Confirm Room Reservation</h3>
              <p className="text-xs text-cyan-200">
                {selectedHotel.name} • Room {room.roomNumber} ({room.type})
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedRoomForBooking(null)}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">
              {error}
            </div>
          )}

          {/* Stay Summary Card */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="font-extrabold text-sm text-slate-900 font-serif">
                {room.type} (Room {room.roomNumber})
              </div>
              <div className="text-slate-500 text-xs mt-0.5 flex items-center gap-2">
                <span>{room.bed}</span>
                <span>•</span>
                <span>{room.floor}</span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs font-bold text-slate-800">
                {checkIn} → {checkOut}
              </div>
              <div className="text-[11px] font-bold text-[#0e4860] mt-0.5">
                {nights} Night(s) Stay
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Primary Guest Details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shashikant Verma"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0e4860]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mobile Phone *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0e4860]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email Address (For Voucher) *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="guest@example.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#0e4860]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Special Requests (Optional)</label>
              <textarea
                rows={2}
                placeholder="e.g. Quiet room preferred, early check-in requested..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0e4860]"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Payment Choice
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-2xl border flex items-center space-x-3 cursor-pointer transition ${
                  paymentMethod === 'HOTEL'
                    ? 'border-[#0e4860] bg-cyan-50/50 ring-2 ring-[#0e4860]'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'HOTEL'}
                  onChange={() => setPaymentMethod('HOTEL')}
                  className="text-[#0e4860] focus:ring-[#0e4860]"
                />
                <div>
                  <div className="font-bold text-slate-900">Pay at Hotel</div>
                  <div className="text-[11px] text-slate-500">Cash, UPI, or Card upon check-in</div>
                </div>
              </label>

              <label
                className={`p-3 rounded-2xl border flex items-center space-x-3 cursor-pointer transition ${
                  paymentMethod === 'ONLINE'
                    ? 'border-[#0e4860] bg-cyan-50/50 ring-2 ring-[#0e4860]'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'ONLINE'}
                  onChange={() => setPaymentMethod('ONLINE')}
                  className="text-[#0e4860] focus:ring-[#0e4860]"
                />
                <div>
                  <div className="font-bold text-slate-900">Online Payment</div>
                  <div className="text-[11px] text-slate-500">Instant confirmation demo</div>
                </div>
              </label>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 font-mono">
            <div className="flex justify-between text-slate-600">
              <span>Room Tariff ({nights} nights @ ₹{room.price}/night):</span>
              <span>₹{roomTariff.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST & Hospitality Taxes (12%):</span>
              <span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
              <span>Grand Total:</span>
              <span className="text-[#0e4860]">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-[11px] text-emerald-700 font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Instantly locks room on confirmation</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setSelectedRoomForBooking(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#0e4860] hover:bg-[#135d7c] disabled:opacity-50 text-white rounded-xl font-bold shadow-md shadow-[#0e4860]/20 flex items-center space-x-2 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Locking Room...' : 'Confirm & Lock Reservation'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
