import React from 'react';
import { useBooking } from './context/BookingContext';
import Navbar from './components/Navbar';
import HotelHero from './components/HotelHero';
import SearchFilterBar from './components/SearchFilterBar';
import RoomList from './components/RoomList';
import BookingModal from './components/BookingModal';
import BookingConfirmationModal from './components/BookingConfirmationModal';
import MyBookingsDrawer from './components/MyBookingsDrawer';
import Footer from './components/Footer';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const { notification } = useBooking();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-[#0e4860] selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center space-x-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-xs font-semibold text-white">
            {notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{notification.msg}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navbar />

      {/* Hero */}
      <HotelHero />

      {/* Floating Search Bar */}
      <SearchFilterBar />

      {/* Room Inventory Catalog */}
      <main className="flex-1">
        <RoomList />
      </main>

      {/* Modals & Drawers */}
      <BookingModal />
      <BookingConfirmationModal />
      <MyBookingsDrawer />

      {/* Footer */}
      <Footer />
    </div>
  );
}
