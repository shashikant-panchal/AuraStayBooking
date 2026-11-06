import React from 'react';
import { useBooking } from '../context/BookingContext';
import RoomCard from './RoomCard';
import { BedDouble, Sparkles, RefreshCcw } from 'lucide-react';

export default function RoomList() {
  const { rooms, availableRooms, isLoading, selectedHotel, categoryFilter } = useBooking();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 text-[#0e4860] animate-spin mb-3">
          <RefreshCcw className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Checking Live Room Availability...</h3>
        <p className="text-xs text-slate-500 mt-1">Connecting to {selectedHotel.name} realtime inventory</p>
      </div>
    );
  }

  // Filter rooms by category if active
  const displayedRooms = rooms.filter(room => {
    if (categoryFilter !== 'ALL' && room.type !== categoryFilter) return false;
    return true;
  });

  const availableRoomNumbers = new Set(availableRooms.map(r => String(r.roomNumber)));

  if (displayedRooms.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto mb-4">
          <BedDouble className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 font-serif">
          No Rooms Found
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
          {categoryFilter !== 'ALL' 
            ? `No rooms found matching category "${categoryFilter}". Click "All Rooms" to view all available accommodations.`
            : `No rooms have been added to ${selectedHotel.name} yet.`}
        </p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-serif tracking-tight">
            Available Accommodations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified vacant & sanitized rooms ready for instant booking at {selectedHotel.name}
          </p>
        </div>
        <span className="text-xs font-bold text-[#0e4860] bg-cyan-50 px-3 py-1.5 rounded-xl border border-cyan-200">
          {availableRooms.length} of {displayedRooms.length} Available
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedRooms.map((room) => (
          <RoomCard 
            key={room.id || room.roomNumber} 
            room={room} 
            isAvailable={availableRoomNumbers.has(String(room.roomNumber))}
          />
        ))}
      </div>
    </section>
  );
}
