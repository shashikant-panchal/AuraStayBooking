# AuraStayBooking

**AuraStay Booking** is the direct, guest-facing hotel & room booking engine for the AuraStay Hospitality SaaS ecosystem.

## Features
- **Multi-Tenant Hotel Discovery**: Dynamically loads hotel branding, logo, contact, and amenities by slug (`?hotel=slug`).
- **Dynamic Live Inventory**: Queries Supabase for vacant, ready rooms matching stay dates; excludes conflicting or occupied rooms.
- **Instant Booking & Room Lock**: Immediately creates a confirmed reservation in the backend and locks the room across the hotel PMS and booking engine.
- **Official Stay Voucher**: Produces a downloadable, printable booking confirmation voucher with Reference ID.
- **My Bookings Portal**: Allows guests to lookup their active reservations using their Reference ID or Phone number.
- **Real-Time WebSockets**: Powered by Supabase Realtime for instant synchronization with Hotel PMS Admin.

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- Lucide React
- Supabase Realtime Client

