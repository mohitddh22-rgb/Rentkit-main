import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

/**
 * BrowserRouter basename ensures routes work under /rentkit/ on GitHub Pages.
 * For Vite: import.meta.env.BASE_URL is automatically the repo name when 'base' is set in vite.config.js.
 * For CRA: set process.env.PUBLIC_URL via "homepage" field in package.json.
 */
const basename =
  (typeof import !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.PUBLIC_URL) ||
  '/';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
