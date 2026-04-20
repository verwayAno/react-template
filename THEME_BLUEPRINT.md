# React Theme Blueprint — Architecture & Initialization Guide

> **Purpose**: This document fully describes the architecture, file structure, naming conventions, data patterns, component hierarchy, styling system, and tooling of the **Rivora** theme built on `react-template`. Any AI agent (Copilot, Cursor, etc.) or developer can use this file to **scaffold a brand-new theme** that follows the exact same pattern, then customize its visual identity and content independently.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [File & Folder Structure](#3-file--folder-structure)
4. [Tooling & Configuration Files](#4-tooling--configuration-files)
5. [Entry Points & App Shell](#5-entry-points--app-shell)
6. [Data Architecture (Inline Data Objects)](#6-data-architecture-inline-data-objects)
7. [Component Hierarchy](#7-component-hierarchy)
8. [Page Structure & Routing](#8-page-structure--routing)
9. [CSS Architecture & Theming System](#9-css-architecture--theming-system)
10. [Icon System](#10-icon-system)
11. [Animation System (GSAP)](#11-animation-system-gsap)
12. [Responsive Design Strategy](#12-responsive-design-strategy)
13. [Asset Management](#13-asset-management)
14. [Step-by-Step: Creating a New Theme](#14-step-by-step-creating-a-new-theme)
15. [Theme Ideas (5 Suggested Themes)](#15-theme-ideas-5-suggested-themes)
16. [Checklist for Theme Completion](#16-checklist-for-theme-completion)

---

## 1. Project Overview

This is a **single-page React application** (with client-side routing) designed as a **multi-page marketing/booking website**. The entire UI lives in **two files**: `App.jsx` (all components + data) and `App.css` (all styles). This monolithic-but-simple approach makes themes **self-contained and easy to duplicate**.

### Key Principles
- **Single JSX file**: All components, data arrays, and page functions live in `App.jsx`
- **Single CSS file**: All styles (variables, layout, components, responsive) live in `App.css`
- **Global reset CSS**: `index.css` handles only base resets and font imports
- **Multi-mode theming**: 4 color modes (light/dark/classic/modern) via CSS custom properties on `[data-mode]`
- **No component library**: Pure custom CSS with CSS Grid + Flexbox
- **Inline data**: All content (rooms, tours, blog posts, testimonials, etc.) defined as JS arrays at the top of `App.jsx`
- **CDN-loaded icons**: Remix Icon via CDN link in `index.html`
- **CDN-loaded animations**: GSAP loaded via CDN `<script>` tag in `index.html`
- **Backend-ready**: Data arrays mirror the shape you'd get from an API — easy to swap with `fetch()` calls to `project-backend`

---

## 2. Technology Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| **Framework** | React | ^19.x | Functional components + hooks only |
| **Build Tool** | Vite | ^8.x | With `@vitejs/plugin-react` |
| **Routing** | react-router-dom | ^7.x | `BrowserRouter` + `Routes`/`Route` |
| **Date Picker** | react-datepicker | ^7.x | Used in booking engine forms |
| **Animations** | GSAP | ^3.12 | Loaded via CDN, accessed as `window.gsap` |
| **Icons** | Remix Icon | ^4.6 | CDN stylesheet, used via `<i className="ri-{name}">` |
| **Fonts** | Google Fonts | — | Manrope (body) + Playfair Display (headings) |
| **Linting** | ESLint | ^9.x | Flat config with react-hooks + react-refresh plugins |
| **Package Manager** | npm | — | `package-lock.json` committed |

### package.json Dependencies

```json
{
  "dependencies": {
    "gsap": "^3.15.0",
    "react": "^19.2.4",
    "react-datepicker": "^7.6.0",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.14.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.4",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^9.39.4",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.4.0",
    "vite": "^8.0.4"
  }
}
```

### Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

---

## 3. File & Folder Structure

```
<theme-name>/
├── .gitignore
├── index.html              ← HTML shell: meta, CDN links (icons, GSAP, fonts), #root
├── package.json            ← Dependencies + scripts
├── vite.config.js          ← Vite + React plugin (minimal)
├── eslint.config.js        ← ESLint flat config
├── README.md               ← Theme documentation
├── public/
│   ├── favicon.svg         ← Brand favicon
│   └── icons.svg           ← Optional SVG sprite sheet
└── src/
    ├── main.jsx            ← React entry: StrictMode + BrowserRouter + <App />
    ├── index.css           ← Global reset: font import, box-sizing, body base styles
    ├── App.jsx             ← ALL components, data, pages, utilities
    ├── App.css             ← ALL styles: variables, layout, components, responsive
    └── assets/
        └── <theme-name>/   ← Theme-specific SVGs/images (optional)
            ├── hero-*.svg
            ├── room-*.svg
            ├── feature-*.svg
            └── ...
```

### Why This Structure?

- **Simplicity**: A new developer (or AI agent) can read 2 files to understand the entire theme
- **Portability**: Copy a folder, rename, and start editing
- **Backend-swappable**: Data arrays at the top of `App.jsx` can be replaced with API calls without changing component structure
- **No abstraction overhead**: No component folder trees, no barrel exports, no context providers (beyond BrowserRouter)

---

## 4. Tooling & Configuration Files

### index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{Theme Name} Demo</title>
    <!-- Icon library CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
  </head>
  <body>
    <div id="root"></div>
    <!-- GSAP CDN (before module script) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### vite.config.js
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### eslint.config.js
```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
```

---

## 5. Entry Points & App Shell

### src/main.jsx
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

### src/index.css (Global Reset)
```css
@import url('https://fonts.googleapis.com/css2?family={BodyFont}:wght@400;500;600;700;800&family={HeadingFont}:wght@600;700;800&display=swap');

* { box-sizing: border-box; }
html, body, #root { min-height: 100%; }
html { overflow-x: hidden; }

body {
  margin: 0;
  font-family: '{BodyFont}', sans-serif;
  line-height: 1.6;
  background:
    radial-gradient(circle at 12% 16%, color-mix(in srgb, var(--accent), transparent 88%) 0%, transparent 30%),
    radial-gradient(circle at 86% 10%, color-mix(in srgb, var(--line), transparent 55%) 0%, transparent 28%),
    var(--bg);
  color: var(--text);
  transition: background 250ms ease, color 250ms ease;
}

a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }
button, input, textarea { font: inherit; }
```

### AppShell Component (default export in App.jsx)
The default export is always an `AppShell` component that:
1. Manages the current **theme mode** (`light`/`dark`/`classic`/`modern`) in `useState`, persisted to `localStorage`
2. Sets `document.body.dataset.mode` on mode change
3. Scrolls to top on route change
4. Optionally triggers GSAP reveal animations
5. Renders: `<TopBar>` → `<SiteHeader>` → `<main><Routes>...</Routes></main>` → `<Footer>`

```jsx
function AppShell() {
  const location = useLocation()
  const [mode, setMode] = useState(() => {
    const saved = window.localStorage.getItem('{theme}-mode')
    return MODES.includes(saved) ? saved : 'light'
  })

  useEffect(() => {
    document.body.dataset.mode = mode
    window.localStorage.setItem('{theme}-mode', mode)
  }, [mode])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // optional: trigger GSAP animations
  }, [mode, location.pathname])

  return (
    <div className="app-shell">
      <TopBar mode={mode} setMode={setMode} />
      <SiteHeader />
      <main>
        <Routes>
          <Route path="/" element={<HomePage mode={mode} />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage mode={mode} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default AppShell
```

---

## 6. Data Architecture (Inline Data Objects)

All content is defined as **const arrays/objects** at the top of `App.jsx`, before any component. This makes it trivial to:
- Replace with API fetch calls to `project-backend`
- Swap content for a different theme/industry
- Validate data shapes

### Required Data Arrays

| Array Name | Shape | Used By |
|-----------|-------|---------|
| `heroSlides` | `[{ title, subtitle, description, image }]` | Hero slider on HomePage |
| `allRoomListings` | `[{ name, type, bed, bedDetail, capacity, nights, size, price, originalPrice, rating, reviews, image, address, distance, amenities[], amenityLabels[], badge, cancellation }]` | RoomsPage listings |
| `featuredRooms` | Slice of `allRoomListings` (first 3) | HomePage featured cards |
| `tourPackages` | `[{ title, duration, spots, guide, price, image, difficulty, groupSize, rating, reviews, highlights[], includes[] }]` | HomePage tour cards |
| `amenities` | `[{ icon, title, description }]` | HomePage amenities grid |
| `testimonials` | `[{ name, role, avatar, review, rating }]` | HomePage testimonial carousel |
| `blogPosts` | `[{ title, excerpt, image, date, category, readTime, author }]` | HomePage blog + BlogPage |
| `team` | `[{ name, role, image }]` | AboutPage guides grid |
| `whyUsFeatures` | `[{ icon, title, desc }]` | AboutPage "Why Us" section |
| `stats` | `[{ icon, value, label }]` | AboutPage stats bar |
| `activityItems` | `[{ icon, label, title, desc, tags[] }]` | AboutPage activities tabs |
| `megaMenus` | `{ [key]: { heading, columns[], promo } }` | Header mega menu panels |
| `MODES` | `['light', 'dark', 'classic', 'modern']` | Theme mode switcher |

### Data Shape Examples

```js
// Hero slide
{ title: 'Main headline text', subtitle: 'Eyebrow label', description: 'Supporting paragraph.', image: 'https://...' }

// Room listing
{ name: 'Room Name', type: 'Room Type', bed: 'Bed Style', bedDetail: '1 king bed', capacity: '2 Adults', nights: '1 Night', size: '58 m²', price: 126, originalPrice: 160, rating: 5, reviews: 12, image: 'https://...', address: 'Full address', distance: '2 km to center', amenities: ['icon-name-1', 'icon-name-2'], amenityLabels: ['Label 1', 'Label 2'], badge: 'Badge Text', cancellation: 'Cancellation policy text' }

// Tour package
{ title: 'Tour Name', duration: '3 hours', spots: '7 landmarks', guide: 'Guide description', price: '$49', image: 'https://...', difficulty: 'Easy', groupSize: 'Max 12', rating: 4.9, reviews: 214, highlights: ['Point 1', 'Point 2'], includes: ['icon-1', 'icon-2'] }
```

---

## 7. Component Hierarchy

All components are **function components** defined in `App.jsx`:

```
AppShell (default export)
├── TopBar({ mode, setMode })
│   ├── Slogan text
│   ├── Hotline phone link
│   ├── Social media links
│   └── Mode switcher (pill buttons)
├── SiteHeader()
│   ├── Brand link
│   ├── Nav (NavLink items)
│   │   └── MegaMenu({ menuKey, openMenu, setOpenMenu })
│   ├── Mobile menu toggle button
│   └── Reservation CTA button
├── <Routes>
│   ├── HomePage({ mode })
│   │   ├── Hero Slider (with dots/arrows + auto-advance)
│   │   ├── Booking Engine (tabbed: rooms/tours/dining forms)
│   │   ├── Featured Rooms grid (room cards)
│   │   ├── Mini About section
│   │   ├── Tours grid (tour cards)
│   │   ├── Full-bleed banner CTA
│   │   ├── Amenities grid
│   │   ├── Testimonial carousel (auto-advance)
│   │   ├── Blog grid (latest 3 posts)
│   │   └── Newsletter section
│   ├── RoomsPage()
│   │   ├── BreadcrumbHero
│   │   └── Room listing cards (horizontal layout)
│   ├── AboutPage()
│   │   ├── BreadcrumbHero
│   │   ├── About intro (text + image w/ experience badge)
│   │   ├── Stats bar
│   │   ├── Why Us grid
│   │   ├── Activities section (tabbed)
│   │   ├── Team/Guides grid
│   │   ├── Blog articles (2-col)
│   │   └── Newsletter full-width
│   ├── BlogPage()
│   │   ├── BreadcrumbHero
│   │   ├── Blog listing grid (with category filter)
│   │   └── Sidebar (search, categories, popular, newsletter CTA)
│   └── ContactPage()
│       ├── BreadcrumbHero
│       ├── Contact info + form (2-col)
│       ├── FAQ accordion (2-col grid)
│       └── Map embed
└── Footer()
    ├── 4-column grid (brand, links, contact info, payment)
    └── Bottom bar (copyright, legal links)
```

### Utility Components
```
Stars({ rating, size })        — Renders star icons (full/half/empty) for ratings
I({ name, className })         — Shorthand for <i className={`ri-${name} ...`} />
BreadcrumbHero({ title, current, image }) — Inner page hero with overlay
```

---

## 8. Page Structure & Routing

| Route | Component | Description |
|-------|----------|-------------|
| `/` | `HomePage` | Landing page with all major sections |
| `/rooms` | `RoomsPage` | Full room listings (horizontal cards) |
| `/about` | `AboutPage` | Company info, stats, team, activities |
| `/blog` | `BlogPage` | Blog listing with sidebar & category filter |
| `/contact` | `ContactPage` | Contact form, FAQ accordion, map |
| `*` | `HomePage` | Catch-all fallback |

### Page Section Pattern
Every page section follows this pattern:
```jsx
<section className="section contain reveal section-spaced">
  <div className="section-heading">
    <p className="eyebrow"><I name="icon-name" /> Section Label</p>
    <h2>Section title describing the content</h2>
    <p>Optional supporting description text.</p>
  </div>
  {/* Section content (grid, cards, form, etc.) */}
</section>
```

---

## 9. CSS Architecture & Theming System

### CSS Variable System (4 Modes)

Each theme mode defines **8 CSS custom properties** on `[data-mode='...']`:

```css
[data-mode='light'] {
  --bg:           /* Page background */
  --surface:      /* Card / panel backgrounds */
  --surface-soft: /* Subtle surface variant (topbar, footer) */
  --heading:      /* Heading text color */
  --text:         /* Body text color */
  --text-soft:    /* Muted/secondary text */
  --line:         /* Border / divider color */
  --accent:       /* Primary brand color (buttons, links, badges) */
}
```

**All 4 modes must be defined**: `light`, `dark`, `classic`, `modern`

### Rivora's Color Palettes (Reference)

| Variable | Light | Dark | Classic | Modern |
|----------|-------|------|---------|--------|
| `--bg` | `#f5f2ea` | `#09111a` | `#f1eadc` | `#eaf3f5` |
| `--surface` | `#fcf8f0` | `#121c27` | `#fbf3e4` | `#f9fdfe` |
| `--surface-soft` | `#efe7d8` | `#0f1720` | `#e7d8bd` | `#d9edf2` |
| `--heading` | `#231711` | `#eef1f7` | `#1b3643` | `#0f2e3a` |
| `--text` | `#5f4e3e` | `#c5cddd` | `#524739` | `#2e5260` |
| `--text-soft` | `#7e6b57` | `#96a2b8` | `#746956` | `#496d79` |
| `--line` | `#dbc8ad` | `#2c3a4f` | `#ccb895` | `#b7d4dd` |
| `--accent` | `#c5964d` | `#d49b4f` | `#2d6176` | `#0d97a8` |

### CSS File Organization (Order in App.css)

1. **Theme Variables** — `[data-mode]` blocks
2. **Base / Layout** — `.app-shell`, `.contain`, `main`, `.section`, `.section-heading`
3. **Typography** — `.eyebrow`, `h1`–`h4`, `p`
4. **Full-bleed utility** — `.full-bleed`
5. **TopBar** — `.topbar-wrap`, `.topbar`, `.socials`, `.mode-switcher`, `.mode-pill`
6. **Header** — `.header-wrap`, `.site-header`, `.brand`, `.site-nav`, `.nav-link`, `.mega-panel`
7. **Buttons** — `.btn-primary`, `.btn-ghost`, `.text-button`, `.btn-play`
8. **Hero Slider** — `.slider-section`, `.home-slider`, `.home-slide-*`, `.slider-arrow`, `.dot`
9. **Booking Engine** — `.booking-engine`, `.booking-tabs`, `.booking-form`, `.form-field`, `.counter-row`
10. **Cards** — `.cards-grid`, `.card`, `.card-img-wrap`, `.card-badge`, `.card-copy`
11. **Section-specific** — Mini about, full banner, amenities, testimonials, newsletter
12. **Breadcrumb Hero** — `.breadcrumb-hero`, `.breadcrumb-overlay`, `.breadcrumb-content`
13. **Room Listings** — `.room-listings`, `.rl-card`, `.rl-*`
14. **About Page** — `.about-intro`, `.stats-bar`, `.why-us-grid`, `.activities-*`, `.guides-grid`
15. **Contact Page** — `.contact-grid`, `.contact-form`, `.faq-list`, `.faq-item`, `.map-container`
16. **Blog Page** — `.blog-layout`, `.blog-sidebar`, `.sidebar-card`, `.sidebar-*`
17. **Footer** — `.footer-wrap`, `.footer-grid`, `.footer-bottom`
18. **Tour Card Details** — `.tour-meta-row`, `.tour-highlights`, `.tour-includes`
19. **Mobile Menu** — `.mobile-menu-btn`
20. **Responsive Breakpoints** — `@media` at `1240px`, `920px`, `640px`

### Key Design Tokens / Patterns

| Pattern | CSS |
|---------|-----|
| Card radius | `border-radius: 22px` (cards), `18px` (smaller) |
| Pill buttons | `border-radius: 999px` |
| Surface borders | `1px solid var(--line)` |
| Surface shadow | `0 12px 36px color-mix(in srgb, var(--heading), transparent 88%)` |
| Hover lift | `transform: translateY(-5px)` |
| Container | `max-width: 1320px`, `padding: clamp(0.8rem, 2.6vw, 2rem)` |
| Font sizes | `clamp()` for responsive, `rem` otherwise |
| Accent backgrounds | `color-mix(in srgb, var(--accent), transparent 85%)` |
| Sticky header | `position: sticky; top: 0; backdrop-filter: blur(10px)` |
| Full-width sections | `.full-bleed { width: 100vw; margin-left: calc(50% - 50vw) }` |

---

## 10. Icon System

Uses **Remix Icon** via CDN. A helper component wraps the usage:

```jsx
const I = ({ name, className }) => <i className={`ri-${name} ${className || ''}`} />
```

Usage: `<I name="hotel-bed-line" />`, `<I name="star-fill" />`

Browse icons at: https://remixicon.com/

---

## 11. Animation System (GSAP)

- GSAP is loaded via CDN `<script>` in `index.html` (before the module script)
- Accessed as `window.gsap` (not imported)
- Only activates in `modern` mode for progressive enhancement
- Used for:
  - Hero text stagger entrance on slide change
  - Hero parallax mouse-move effect
  - Section reveal on route change (`.reveal` class selector)

```js
// Guard pattern used throughout:
if (mode !== 'modern' || !window.gsap) return

// Stagger entrance
window.gsap.fromTo(els, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: 'power2.out' })

// Mouse parallax
window.gsap.to('.home-slide-image', { x: x * 18, y: y * 14, duration: 0.45, ease: 'power2.out', overwrite: true })
```

---

## 12. Responsive Design Strategy

Three breakpoints, **desktop-first**:

| Breakpoint | Key Changes |
|-----------|-------------|
| `≤ 1240px` | Grids → 2 columns, topbar slogan hidden, stats bar 2-col |
| `≤ 920px` | Mobile menu visible, all 2-col grids → 1 column, mega menu goes static, room card stacks, booking form vertical |
| `≤ 640px` | Single column everything, topbar hotline hidden, slider smaller radius |

---

## 13. Asset Management

### Public Assets (`public/`)
- `favicon.svg` — Theme brand mark (SVG for crisp rendering)
- `icons.svg` — Optional SVG sprite sheet

### Theme-Specific Assets (`src/assets/<theme-name>/`)
- **Optional** SVG illustrations matching the theme's visual identity
- Naming convention: `{context}-{subject}.svg` (e.g., `hero-suite.svg`, `room-standard.svg`)
- In Rivora: 15 SVG illustrations for hero, rooms, features, offers, articles

### Content Images
All large imagery (hero, rooms, tours, team, blog) uses **Unsplash URLs** with `auto=format&fit=crop` parameters. When building a real theme:
- Replace with actual photography or stock images
- Use `loading="lazy"` on all below-fold images
- Use `loading="eager"` on hero/first-visible images

---

## 14. Step-by-Step: Creating a New Theme

### 1. Scaffold the Project

```bash
# Clone or copy the template
cp -r react-template <new-theme-name>
cd <new-theme-name>

# Clean theme-specific files
rm -rf src/assets/rivora
mkdir -p src/assets/<new-theme-name>

# Install dependencies
npm install
```

### 2. Update Metadata

- **`package.json`**: Change `"name"` to `"<new-theme-name>"`
- **`index.html`**: Change `<title>` to your theme's title
- **`public/favicon.svg`**: Replace with new brand mark

### 3. Define Brand Identity (App.css)

Replace the 4 mode blocks at the top of `App.css`:

```css
[data-mode='light'] {
  --bg: #______;
  --surface: #______;
  --surface-soft: #______;
  --heading: #______;
  --text: #______;
  --text-soft: #______;
  --line: #______;
  --accent: #______;
}
/* Repeat for dark, classic, modern */
```

### 4. Update Fonts (index.css)

Change the Google Fonts import and `font-family` declarations:
```css
@import url('https://fonts.googleapis.com/css2?family={NewBodyFont}:wght@400;500;600;700;800&family={NewHeadingFont}:wght@600;700;800&display=swap');

body { font-family: '{NewBodyFont}', sans-serif; }
```
Also update `h1, h2, h3, h4 { font-family: '{NewHeadingFont}', serif; }` in `App.css`.

### 5. Replace Content Data (App.jsx)

Replace every data array at the top of `App.jsx` with your theme's content:
- `heroSlides` — New hero headlines and images
- `allRoomListings` / product array — Your listings
- `tourPackages` / services array — Your services
- `amenities` — Your features
- `testimonials` — Your reviews
- `blogPosts` — Your articles
- `team` — Your team members
- `whyUsFeatures` — Your selling points
- `stats` — Your metrics
- `activityItems` — Your activities/services
- `megaMenus` — Your navigation structure

### 6. Update Component Text

Find and replace these brand references in `App.jsx`:
- Brand name (e.g., "Rivora" → your brand) — appears in `<Link className="brand">`, Footer, BreadcrumbHero, eyebrow texts
- Contact details (phone, email, address)
- Social media URLs
- CTA button labels

### 7. Update localStorage Key

In `AppShell`, change the localStorage key:
```js
window.localStorage.getItem('rivora-mode')  →  window.localStorage.getItem('<theme>-mode')
```

### 8. Customize Visual Details (App.css)

- **Border radius**: Adjust card/button radii for your aesthetic
- **Shadows**: Tweak shadow depth/spread
- **Spacing**: Adjust section gaps and padding
- **Grid columns**: Modify card grid layouts if needed
- **Special effect CSS**: Add/remove `[data-mode='modern']` shadow overrides

### 9. Add Theme Assets

Place theme-specific SVGs/images in `src/assets/<theme-name>/`

### 10. Test & Build

```bash
npm run dev      # Development with HMR
npm run lint     # Check for issues
npm run build    # Production build
npm run preview  # Preview production build
```

---

## 15. Theme Ideas (5 Suggested Themes)

Below are 5 industry themes that follow the exact same architecture. Each reuses the same component hierarchy, routing, and 4-mode color system — only the data, colors, fonts, and copy change.

### Theme 1: **Velora** — Luxury Real Estate Listings

| Aspect | Details |
|--------|---------|
| **Industry** | Luxury real estate / property listings |
| **Brand Font** | DM Serif Display (headings) + Inter (body) |
| **Accent** | Deep emerald `#1a7a5c` |
| **Hero** | Full-bleed property showcase slides |
| **"Rooms" → "Properties"** | Listings with sq ft, beds, baths, location, price |
| **"Tours" → "Open Houses"** | Viewing schedule cards with date/time/agent |
| **"Amenities" → "Features"** | Smart home, pool, garage, security, garden |
| **Booking Engine** | Property inquiry: location selector, budget range, property type |
| **Blog** | Market trends, investment tips, neighborhood guides |

### Theme 2: **Curina** — Medical Clinic & Wellness Center

| Aspect | Details |
|--------|---------|
| **Industry** | Healthcare / medical clinic |
| **Brand Font** | Outfit (headings) + Plus Jakarta Sans (body) |
| **Accent** | Calming teal `#0891b2` |
| **Hero** | Trustworthy clinic imagery, patient care focus |
| **"Rooms" → "Services"** | Medical services: consultation, diagnostics, specialty care |
| **"Tours" → "Departments"** | Cardiology, dermatology, pediatrics, etc. |
| **"Amenities" → "Facilities"** | Lab, pharmacy, emergency, imaging, rehab |
| **Booking Engine** | Appointment booking: department, doctor, date, patient info |
| **Blog** | Health tips, medical news, wellness articles |

### Theme 3: **Luminar** — Creative Agency / Portfolio

| Aspect | Details |
|--------|---------|
| **Industry** | Digital agency / design studio |
| **Brand Font** | Space Grotesk (headings) + Satoshi/General Sans (body) |
| **Accent** | Electric violet `#7c3aed` |
| **Hero** | Bold case study showcase with text overlays |
| **"Rooms" → "Projects"** | Portfolio cards: client, category, year, tools used |
| **"Tours" → "Services"** | Branding, web design, development, video, strategy |
| **"Amenities" → "Capabilities"** | Tech stack, tools, specialties |
| **Booking Engine** | Project inquiry: service type, budget range, timeline, brief |
| **Blog** | Design trends, case studies, behind-the-scenes |

### Theme 4: **Terranova** — Travel & Adventure Tours

| Aspect | Details |
|--------|---------|
| **Industry** | Adventure travel / ecotourism |
| **Brand Font** | Sora (headings) + Nunito Sans (body) |
| **Accent** | Sunrise orange `#ea580c` |
| **Hero** | Dramatic landscape photography slider |
| **"Rooms" → "Lodges"** | Eco-lodges, glamping tents, treehouses |
| **"Tours" → "Expeditions"** | Multi-day treks, safari, diving, cultural immersion |
| **"Amenities" → "Included"** | Gear, guides, meals, transport, insurance |
| **Booking Engine** | Trip booking: destination, difficulty, group size, dates |
| **Blog** | Destination guides, packing lists, traveler stories |

### Theme 5: **Aethon** — Fitness & Sports Academy

| Aspect | Details |
|--------|---------|
| **Industry** | Gym / sports academy / fitness studio |
| **Brand Font** | Clash Display (headings) + Work Sans (body) |
| **Accent** | Energetic red `#dc2626` |
| **Hero** | High-energy training footage and athlete portraits |
| **"Rooms" → "Programs"** | Training programs: HIIT, strength, yoga, crossfit |
| **"Tours" → "Classes"** | Class schedule with instructor, time, level |
| **"Amenities" → "Facilities"** | Pool, sauna, courts, track, recovery room |
| **Booking Engine** | Membership inquiry: program type, start date, trial class |
| **Blog** | Workout tips, nutrition, athlete spotlights |

---

## 16. Checklist for Theme Completion

Use this checklist when building any new theme from this blueprint:

### Setup
- [ ] Project scaffolded from template
- [ ] `package.json` name updated
- [ ] `npm install` successful
- [ ] `npm run dev` starts without errors

### Branding
- [ ] `index.html` title updated
- [ ] `public/favicon.svg` replaced
- [ ] 4 color mode palettes defined in `App.css` (light/dark/classic/modern)
- [ ] Google Fonts updated in `index.css`
- [ ] Heading font-family updated in `App.css`
- [ ] Brand name updated in all components

### Data
- [ ] `heroSlides` populated with theme content
- [ ] Main listing data array populated (rooms/properties/services/etc.)
- [ ] Tour/service packages populated
- [ ] Amenities/features populated
- [ ] Testimonials populated
- [ ] Blog posts populated
- [ ] Team members populated
- [ ] Stats/metrics populated
- [ ] Activity/service tabs populated
- [ ] Mega menu structure updated

### Components
- [ ] `TopBar` — slogan and hotline updated
- [ ] `SiteHeader` — navigation labels match theme
- [ ] `HomePage` — all sections render correctly
- [ ] `RoomsPage` (or equivalent) — listings display properly
- [ ] `AboutPage` — all sections match theme
- [ ] `BlogPage` — categories and filtering work
- [ ] `ContactPage` — form fields, FAQ, and map updated
- [ ] `Footer` — links, contact info, brand text updated
- [ ] `localStorage` key renamed

### Testing
- [ ] All 4 color modes look correct
- [ ] Mobile responsive at 640px, 920px, 1240px
- [ ] All routes navigate correctly
- [ ] Booking engine form validation works
- [ ] No console errors
- [ ] `npm run build` produces clean output
- [ ] `npm run lint` passes

---

## Backend Integration Notes

The data arrays in `App.jsx` are deliberately shaped to mirror REST API responses. When connecting to `project-backend`:

1. **Replace each `const` array** with a `useState` + `useEffect` fetch pattern:
   ```jsx
   const [rooms, setRooms] = useState([])
   useEffect(() => {
     fetch('/api/rooms').then(r => r.json()).then(setRooms)
   }, [])
   ```

2. **Booking engine forms** already have `handleBookingSubmit` — change from client-only alerts to:
   ```jsx
   const handleBookingSubmit = async (ev) => {
     ev.preventDefault()
     if (!validateBooking()) return
     const res = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
     // handle response
   }
   ```

3. **Contact form** and **Newsletter form** follow the same pattern — swap `e.preventDefault()` no-ops for real POST requests.

---

*Generated from the Rivora theme in `react-template`. Use this blueprint to create new themes with the same architecture.*
