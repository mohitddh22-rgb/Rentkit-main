# RentKit — GitHub Pages Patches

These files make your routing and URL generation **base-path aware** so the app runs under `https://USERNAME.github.io/rentkit/`.

## Files

- `src/utils/createPageUrl.js`
  - Drop-in utility to build internal URLs that automatically include the repo base path on GitHub Pages.
- `src/router/RouterExample.jsx`
  - Shows `BrowserRouter` with a dynamic `basename` derived from Vite/CRA envs.

## How to integrate

1. **Routing**
   - Ensure your entry wraps your routes in `<BrowserRouter basename={...}>` as shown in `RouterExample.jsx`.
   - If you already use `<HashRouter>`, you can keep that and skip 404.html, but BrowserRouter + 404 is cleaner.

2. **URL builder**
   - Replace your existing `createPageUrl` (if any) with the provided one or update it similarly.

3. **Bundler base**
   - Vite: set `base: '/rentkit/'` in `vite.config.js`.
   - CRA: set `"homepage": "https://USERNAME.github.io/rentkit"` in `package.json`.

4. **SPA fallback**
   - Keep a `404.html` at the repo root to redirect deep links back to your SPA entry (already provided in the Deploy Kit).

That’s it — push to `main` and let the GitHub Action publish to `gh-pages`.
