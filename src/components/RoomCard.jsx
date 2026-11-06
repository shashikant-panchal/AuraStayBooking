import React from 'react';
import { useBooking } from '../context/BookingContext';
import { 
  Bed, 
  Wifi, 
  Tv, 
  Wind, 
  Coffee, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const CATEGORY_IMAGES = {
  'Standard Room': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  'Deluxe King': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  'Super Deluxe': 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
  'Executive Suite': 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
  'Presidential Suite': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'
};

export default function RoomCard({ room }) {
  const { nights, handleSelectRoom } = useBooking();

  const imageUrl = room.imageUrl || CATEGORY_IMAGES[room.type] || CATEGORY_IMAGES['Standard Room'];
  const totalAmount = room.price * nights;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Room Image Container */}
      <div className="relative h-56 overflow-hidden bg-slate-900">
        <img
          src={imageUrl}
          alt={room.type}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Room number pill */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl shadow-md text-xs font-black text-slate-900 flex items-center gap-1.5">
          <Bed className="w-3.5 h-3.5 text-[#0e4860]" />
          <span>Room {room.roomNumber}</span>
          <span className="text-slate-400 font-normal">({room.floor})</span>
        </div>

        {/* Live vacant status */}
        <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          <span>Available Now</span>
        </div>

        {/* Room Category Label */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h3 className="text-xl font-black font-serif tracking-tight drop-shadow-sm">
            {room.type}
          </h3>
          <div className="text-xs text-slate-200 flex items-center gap-1.5 mt-0.5">
            <span>{room.bed}</span>
            <span>•</span>
            <span>Up to 2 Adults + 1 Child</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Amenities badges */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Included Amenities
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(room.amenities || ['Free Wi-Fi', 'Air Conditioning', 'Flat-screen TV', 'Private Bath']).slice(0, 4).map((amenity, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>{amenity}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Price & Booking CTA */}
        <div className="pt-4 border-t border-slate-100 flex items-end justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Nightly Rate</div>
            <div className="flex items-baseline space-x-1 mt-0.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                ₹{room.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ night</span>
            </div>
            {nights > 1 && (
              <div className="text-[11px] font-semibold text-[#0e4860] mt-0.5">
                ₹{totalAmount.toLocaleString('en-IN')} for {nights} nights
              </div>
            )}
          </div>

          <button
            onClick={() => handleSelectRoom(room)}
            className="px-5 py-2.5 bg-[#0e4860] hover:bg-[#135d7c] text-white rounded-2xl text-xs font-bold shadow-md shadow-[#0e4860]/20 flex items-center space-x-1.5 transition group/btn cursor-pointer"
          >
            <span>Book Room</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition" />
          </button>
        </div>
      </div>
    </div>
  );
}

