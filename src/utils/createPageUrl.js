/**
 * Base-path aware URL builder for GitHub Pages.
 * Works with Vite (import.meta.env.BASE_URL) and CRA (process.env.PUBLIC_URL).
 */
const BASE =
  (typeof import !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.PUBLIC_URL) ||
  '';

/**
 * Build app-internal URLs from a page name used in your app's routing.
 * Example names: "Home", "Browse", "Equipment", "Dashboard", "MyBookings", "MyListings", "Profile", "ListEquipment", "HowItWorks"
 */
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
  // Ensure single slash join: BASE already ends with "/" in Vite, CRA may not.
  return (BASE.replace(/\/$/, '') + path).replace(/\/+/g, '/');
}
