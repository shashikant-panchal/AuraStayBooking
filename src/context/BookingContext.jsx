import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const BookingContext = createContext(null);

const DEFAULT_HOTEL = {
  id: 'hotel_aurastay_01',
  slug: 'aurastay-suite',
  name: 'AuraStay Suite',
  shortName: 'AST',
  logoUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80',
  ownerName: 'AuraStay Admin',
  address: 'DLF Cyber City, Patia, Bhubaneswar, Odisha, India - 751024',
  city: 'Bhubaneswar',
  mobile: '7978578046',
  currency: 'INR',
  currencySymbol: '₹'
};

export function BookingProvider({ children }) {
  // 1. Hotels List
  const [hotels, setHotels] = useState(() => {
    try {
      const saved = localStorage.getItem('aurastay_saas_hotels');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [DEFAULT_HOTEL];
  });

  // Selected Hotel (from URL ?hotel=slug or ?hotelId=id or default)
  const [selectedHotel, setSelectedHotel] = useState(DEFAULT_HOTEL);

  // 2. Stay Search Parameters
  const [checkIn, setCheckIn] = useState(() => new Date().toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [guestsCount, setGuestsCount] = useState(2);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Compute stay nights
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut]);

  // 3. Rooms and Reservations Data for Selected Hotel
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals, Drawers and Auth state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aurastay_guest_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'signup'
  const [pendingRoomToBook, setPendingRoomToBook] = useState(null);

  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
  const [confirmedBookingVoucher, setConfirmedBookingVoucher] = useState(null);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type, id: Date.now() });
    setTimeout(() => setNotification(null), 4000);
  };

  // 4. Read Hotel from URL query params on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hotelSlug = params.get('hotel');
    const hotelId = params.get('hotelId');

    if (hotelSlug) {
      const match = hotels.find(h => h.slug === hotelSlug);
      if (match) setSelectedHotel(match);
    } else if (hotelId) {
      const match = hotels.find(h => h.id === hotelId);
      if (match) setSelectedHotel(match);
    }
  }, [hotels]);

  // 5. Fetch Hotels from Supabase
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    async function loadHotels() {
      try {
        const { data, error } = await supabase.from('hotels').select('*').eq('status', 'ACTIVE');
        if (!error && data && data.length > 0) {
          const mapped = data.map(h => ({
            id: h.id,
            slug: h.slug,
            name: h.name,
            shortName: h.short_name || 'AST',
            logoUrl: h.logo_url || DEFAULT_HOTEL.logoUrl,
            ownerName: h.owner_name,
            address: h.address,
            city: h.city,
            mobile: h.mobile,
            currency: h.currency || 'INR',
            currencySymbol: h.currency_symbol || '₹'
          }));
          setHotels(mapped);

          // If current selected hotel isn't in mapped, set first
          const currentInList = mapped.find(h => h.id === selectedHotel.id || h.slug === selectedHotel.slug);
          if (currentInList) {
            setSelectedHotel(currentInList);
          } else if (mapped.length > 0) {
            setSelectedHotel(mapped[0]);
          }
        }
      } catch (e) {
        console.warn('Could not load hotels from Supabase', e);
      }
    }

    loadHotels();
  }, []);

  // 6. Fetch Rooms & Reservations for Selected Hotel
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let isMounted = true;
    setIsLoading(true);

    async function loadHotelInventory() {
      try {
        // Fetch rooms (scoped to selected hotel or default)
        const { data: roomsData, error: roomsErr } = await supabase
          .from('rooms')
          .select('*')
          .order('room_number');

        // Fetch reservations
        const { data: resData } = await supabase
          .from('reservations')
          .select('*')
          .order('created_at', { ascending: false });

        if (isMounted) {
          if (roomsData) {
            // Filter rooms for selected hotel if hotel_id is present, or fallback
            const filteredRooms = roomsData.filter(r => !r.hotel_id || r.hotel_id === selectedHotel.id);
            setRooms(filteredRooms.map(r => ({
              id: r.id,
              hotelId: r.hotel_id || selectedHotel.id,
              roomNumber: r.room_number,
              floor: r.floor,
              type: r.type,
              bed: r.bed,
              status: r.status,
              price: Number(r.price) || 2000,
              amenities: r.amenities || [
                'Free High-Speed Wi-Fi',
                'Air Conditioning',
                'Flat-screen Smart TV',
                'Private Bathroom',
                'Daily Housekeeping'
              ],
              imageUrl: r.image_url || null
            })));
          }

          if (resData) {
            const filteredRes = resData.filter(r => !r.hotel_id || r.hotel_id === selectedHotel.id);
            setReservations(filteredRes);
          }
        }
      } catch (err) {
        console.warn('Inventory fetch error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadHotelInventory();

    // Setup Supabase Realtime channel for instant room locking
    const channel = supabase.channel(`booking_live_${selectedHotel.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => loadHotelInventory())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => loadHotelInventory())
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [selectedHotel]);

  // 7. Compute available rooms (Filter out occupied/maintenance & date-conflicted rooms)
  const availableRooms = useMemo(() => {
    return rooms.filter(room => {
      // 1. Must be VACANT_READY
      if (room.status !== 'VACANT_READY') return false;

      // 2. Category filter
      if (categoryFilter !== 'ALL' && room.type !== categoryFilter) return false;

      // 3. Date conflict check with confirmed reservations
      const hasConflict = reservations.some(res => {
        if (res.status === 'CANCELLED') return false;
        // Check if room matches
        const roomMatches = res.room?.includes(room.roomNumber);
        if (!roomMatches) return false;

        // Date overlap check: (StartA < EndB) and (EndA > StartB)
        const rCheckIn = new Date(res.check_in || res.checkIn);
        const rCheckOut = new Date(res.check_out || res.checkOut);
        const sCheckIn = new Date(checkIn);
        const sCheckOut = new Date(checkOut);

        return sCheckIn < rCheckOut && sCheckOut > rCheckIn;
      });

      return !hasConflict;
    });
  }, [rooms, reservations, categoryFilter, checkIn, checkOut]);

  // 8. Guest User Authentication Methods
  const signUp = async ({ name, email, phone, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanPass = password.trim();

    const guestId = `guest_${Date.now().toString().slice(-6)}`;
    const newGuest = {
      id: guestId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password: cleanPass,
      createdAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('aurastay_guest_accounts') || '[]');
      if (existing.some(g => g.email.toLowerCase() === cleanEmail)) {
        throw new Error('An account with this email already exists. Please Sign In.');
      }
      localStorage.setItem('aurastay_guest_accounts', JSON.stringify([...existing, newGuest]));
    } catch (e) {
      if (e.message.includes('already exists')) throw e;
    }

    setCurrentUser(newGuest);
    localStorage.setItem('aurastay_guest_session', JSON.stringify(newGuest));
    setIsAuthModalOpen(false);
    showNotification(`Welcome to AuraStay, ${cleanName}!`);

    if (pendingRoomToBook) {
      setSelectedRoomForBooking(pendingRoomToBook);
      setPendingRoomToBook(null);
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('guest_users').insert({
          id: guestId,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          password: cleanPass
        });
      } catch (err) {
        console.warn('Supabase guest_users insert synced locally', err);
      }
    }

    return true;
  };

  const signIn = async ({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Check Supabase
    if (isSupabaseConfigured) {
      try {
        const { data: user, error } = await supabase
          .from('guest_users')
          .select('*')
          .eq('email', cleanEmail)
          .eq('password', cleanPass)
          .maybeSingle();

        if (user && !error) {
          const authUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone
          };
          setCurrentUser(authUser);
          localStorage.setItem('aurastay_guest_session', JSON.stringify(authUser));
          setIsAuthModalOpen(false);
          showNotification(`Signed in as ${user.name}`);
          if (pendingRoomToBook) {
            setSelectedRoomForBooking(pendingRoomToBook);
            setPendingRoomToBook(null);
          }
          return true;
        }
      } catch (e) {}
    }

    // 2. Check local registered accounts
    try {
      const accounts = JSON.parse(localStorage.getItem('aurastay_guest_accounts') || '[]');
      const match = accounts.find(a => a.email.toLowerCase() === cleanEmail && a.password === cleanPass);
      if (match) {
        setCurrentUser(match);
        localStorage.setItem('aurastay_guest_session', JSON.stringify(match));
        setIsAuthModalOpen(false);
        showNotification(`Signed in as ${match.name}`);
        if (pendingRoomToBook) {
          setSelectedRoomForBooking(pendingRoomToBook);
          setPendingRoomToBook(null);
        }
        return true;
      }
    } catch (e) {}

    // 3. Fallback demo guest account
    if (cleanEmail && cleanPass.length >= 3) {
      const demoUser = {
        id: `guest_${Date.now().toString().slice(-4)}`,
        name: cleanEmail.split('@')[0].replace(/[._]/g, ' '),
        email: cleanEmail,
        phone: '+91 98765 43210'
      };
      setCurrentUser(demoUser);
      localStorage.setItem('aurastay_guest_session', JSON.stringify(demoUser));
      setIsAuthModalOpen(false);
      showNotification(`Signed in as ${demoUser.name}`);
      if (pendingRoomToBook) {
        setSelectedRoomForBooking(pendingRoomToBook);
        setPendingRoomToBook(null);
      }
      return true;
    }

    throw new Error('Invalid email or password.');
  };

  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('aurastay_guest_session');
    showNotification('Signed out from AuraStay Booking');
  };

  // Guard: Selecting a room requires login/signup
  const handleSelectRoom = (room) => {
    if (!currentUser) {
      setPendingRoomToBook(room);
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      showNotification('Please Sign In or Create an Account to reserve this room.', 'info');
    } else {
      setSelectedRoomForBooking(room);
    }
  };

  // User-specific bookings list
  const userBookings = useMemo(() => {
    if (!currentUser) return [];
    return reservations.filter(r => 
      (r.guest_email && r.guest_email.toLowerCase() === currentUser.email.toLowerCase()) ||
      (r.guest_phone && currentUser.phone && r.guest_phone === currentUser.phone)
    );
  }, [reservations, currentUser]);

  // 9. Instant Booking & Room Locking
  const confirmBooking = async ({ guestName, guestEmail, guestPhone, specialRequests, paymentMethod }) => {
    if (!selectedRoomForBooking) return;

    const room = selectedRoomForBooking;
    const bookingId = `AST-B-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalAmount = (room.price * nights);
    const taxAmount = Math.round(totalAmount * 0.12);
    const grandTotal = totalAmount + taxAmount;

    const newReservation = {
      id: bookingId,
      hotel_id: selectedHotel.id,
      guest: currentUser?.name || guestName,
      guest_email: currentUser?.email || guestEmail,
      guest_phone: currentUser?.phone || guestPhone,
      room: `${room.roomNumber} (${room.type})`,
      check_in: checkIn,
      check_out: checkOut,
      source: 'AuraStay Direct Guest Portal',
      amount: grandTotal,
      status: 'CONFIRMED',
      payment: paymentMethod === 'ONLINE' ? 'PAID' : 'PENDING',
      special_requests: specialRequests || null,
      created_at: new Date().toISOString()
    };

    // 1. Instantly LOCK the room in local state so UI updates without flicker
    setRooms(prev => prev.map(r => r.roomNumber === room.roomNumber ? { ...r, status: 'OCCUPIED' } : r));
    setReservations(prev => [newReservation, ...prev]);

    // 2. Prepare Voucher for Guest
    const voucher = {
      bookingId,
      hotel: selectedHotel,
      room,
      guestName: currentUser?.name || guestName,
      guestEmail: currentUser?.email || guestEmail,
      guestPhone: currentUser?.phone || guestPhone,
      specialRequests,
      checkIn,
      checkOut,
      nights,
      grandTotal,
      taxAmount,
      paymentMethod,
      paymentStatus: newReservation.payment,
      bookedAt: new Date().toLocaleString('en-IN')
    };

    setConfirmedBookingVoucher(voucher);
    setSelectedRoomForBooking(null);
    showNotification(`Booking ${bookingId} confirmed! Room ${room.roomNumber} is locked for your stay.`);

    // 3. Write directly to Supabase to persist & lock in database
    if (isSupabaseConfigured) {
      try {
        await supabase.from('reservations').insert(newReservation);
        await supabase
          .from('rooms')
          .update({
            status: 'OCCUPIED',
            guest: currentUser?.name || guestName,
            booking_id: bookingId,
            check_out: checkOut
          })
          .eq('room_number', room.roomNumber);
      } catch (err) {
        console.warn('Supabase booking lock sync error:', err);
      }
    }
  };

  return (
    <BookingContext.Provider value={{
      hotels,
      selectedHotel,
      setSelectedHotel,
      checkIn,
      setCheckIn,
      checkOut,
      setCheckOut,
      nights,
      guestsCount,
      setGuestsCount,
      categoryFilter,
      setCategoryFilter,
      rooms,
      availableRooms,
      reservations,
      isLoading,
      selectedRoomForBooking,
      setSelectedRoomForBooking,
      confirmedBookingVoucher,
      setConfirmedBookingVoucher,
      isMyBookingsOpen,
      setIsMyBookingsOpen,
      notification,
      showNotification,
      confirmBooking,
      currentUser,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authModalMode,
      setAuthModalMode,
      signUp,
      signIn,
      signOut,
      handleSelectRoom,
      userBookings
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}

