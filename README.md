# Silvassa — React + TypeScript

The Silvassa food menu site, converted from plain HTML/CSS/JS to a React app.
Only TypeScript, CSS and HTML are used. There are no UI, icon, router or state libraries.

## Run

```bash
npm install     # installs only react, react-dom, vite, typescript (standard React-TS template)
npm run dev     # http://localhost:5173
npm run build   # type-checks and builds to /dist
```

## Structure

```
public/img/            all images (served as /img/...)
src/
  main.tsx             entry point
  App.tsx              page state: cart, modals, menu drawer, toast
  types.ts             shared TypeScript types
  data/menu.ts         menu items + portion sizes
  utils/               pricing helpers, asset URL helper
  components/          Navbar, MobileMenu, Hero, CategoryStrip, FoodGrid, FoodCard,
                       WhySilvassa, StoryTrust, CartSidebar, DetailsModal,
                       CustomizeModal, SuccessModal, FloatingCartBar, Toast, Icon
  styles.css           original stylesheet, unchanged
  icons.css            built-in icons (replaces the Bootstrap Icons CDN)
```

## Editing the menu

Add or change items in `src/data/menu.ts`; put new photos in `public/img/` and reference them as `img/your-file.jpg`.
