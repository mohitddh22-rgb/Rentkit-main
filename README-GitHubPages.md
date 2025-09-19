# GitHub Pages Deploy Kit (for RentKit)

This kit helps you deploy your React SPA (with React Router) to **GitHub Pages** using a `gh-pages` branch and a single workflow. It also includes a `404.html` SPA fallback so deep links work (e.g., `/Equipment?id=123`).

## What you need

1. A **buildable** project with `npm run build` that outputs one of:
   - `dist/` (Vite)
   - `build/` (CRA)
   - `out/` (Next.js export)

2. A `package.json` with a valid `build` script.

3. If your site is at `https://USERNAME.github.io/rentkit/` (a subfolder), make sure your bundler is aware of the **base path**:

### Vite (recommended)
- Add `vite.config.js` with:
  ```js
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'

  export default defineConfig({
    plugins: [react()],
    base: '/rentkit/', // IMPORTANT: repo name
  })
  ```

### Create React App (CRA)
- In `package.json`, set `"homepage": "https://USERNAME.github.io/rentkit"`
- CRA will build correct asset URLs.

### Next.js (static export)
- Use `next.config.js`:
  ```js
  /** @type {import('next').NextConfig} */
  module.exports = {
    output: 'export',
    basePath: '/rentkit',
    assetPrefix: '/rentkit/',
    trailingSlash: true,
  }
  ```
- Then `npm run build && npx next export` → outputs `out/`

> If you are **using a custom domain** (no `/rentkit/` subpath), do NOT set base/homepage/basePath.

## Install the kit

Copy these files/folders into your repo **root**:
```
.github/workflows/gh-pages.yml
404.html
```

> If your router needs special handling, edit `404.html` and set `redirectTo` to your subpath (e.g., `/rentkit/`).

## Deploy

1. Push to `main`. The workflow will:
   - Install deps (`npm ci`)
   - Run `npm run build`
   - Detect your build folder (`dist` / `build` / `out`)
   - Publish to `gh-pages` branch

2. In GitHub → **Settings → Pages**:
   - Source: **Deploy from a branch**
   - Branch: **gh-pages**, Folder: **/**

Your site will be at: `https://USERNAME.github.io/rentkit/`

## Notes for your current codebase

- Your app uses **React Router** (e.g., `react-router-dom`) and client-side routes (e.g., Home, Browse, Equipment, Dashboard). GitHub Pages needs the included `404.html` to handle deep links.
- If you **fetch local JSON** or use a custom entities layer, ensure requests use **relative paths** (e.g., `./entities/equipments.json`) and that the bundler copies JSON to the final build. With Vite, add `public/entities/...` or import JSONs directly.
- If you need help wiring your exact data layer (e.g., `Equipment.list()`, `Booking.create()`) to static JSON / APIs, share your repo and I’ll adapt it.
