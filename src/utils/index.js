// Base-path aware helpers for GitHub Pages deployments.
// Works with Vite (import.meta.env.BASE_URL) and CRA (process.env.PUBLIC_URL).

const BASE =
  (typeof import !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.PUBLIC_URL) ||
  '';

// Build app-internal URLs by route name used across RentKit.
export function createPageUrl(pageName) {
  const routes = {
    Home: '/',
    Browse: '/browse',
    Equipment: '/equipment',
    Dashboard: '/dashboard',
    MyBookings: '/my-bookings',
    MyListings: '/my-listings',
    Profile: '/profile',
    ListEquipment: '/list-equipment',
    HowItWorks: '/how-it-works'
  };
  const path = routes[pageName] || '/';
  return (BASE.replace(/\/$/, '') + path).replace(/\/+/g, '/');
}

// Re-export as default namespace if your code imports `@/utils` default.
const Utils = { createPageUrl };
export default Utils;
