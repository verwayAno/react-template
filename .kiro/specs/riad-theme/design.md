# Design Document — Riad Theme ("Dar Zellige")

## 1. Overview

The Riad theme is a single-file React + Vite boutique-riad website built on top of the existing `react-template`. It conforms to `THEME_BLUEPRINT.md` (one `App.jsx`, one `App.css`, 4 color modes, inline data arrays, `react-router-dom`, `react-datepicker`, GSAP via CDN, Remix Icon via CDN) while delivering a visually distinct identity: editorial Moorish typography, horseshoe-arch card frames, zellige tile backdrops, and arch-clip motion.

Brand direction: **Dar Zellige — A Collection of Restored Riads**.

## 2. Visual System

### 2.1 Typography
- Headings: **Fraunces** (contemporary serif with optical sizing — not `Cormorant Garamond`).
- Body: **DM Sans** (clean geometric sans — not `Nunito Sans`).
- Eyebrow / micro: **Fraunces** small-caps for labels.

### 2.2 Color palettes (four modes on `[data-mode]`)
All accents avoid the banned OUZAFT hex values.

| Var | light | dark | classic | modern |
|---|---|---|---|---|
| `--bg` | `#f3ece0` | `#14100c` | `#ead9b8` | `#eef3f0` |
| `--surface` | `#fbf6ec` | `#1c1712` | `#f3e6c8` | `#ffffff` |
| `--surface-soft` | `#ece0c8` | `#221b15` | `#e0cba4` | `#dfeae3` |
| `--heading` | `#2b1a11` | `#f4e4c9` | `#2a1d0e` | `#0f2a22` |
| `--text` | `#5a3e27` | `#d9c6a8` | `#4a3318` | `#2a4a40` |
| `--text-soft` | `#876549` | `#a68f6e` | `#7a5a30` | `#5a7a6e` |
| `--line` | `#d9c69a` | `#3a2e22` | `#c8a872` | `#bfd4c9` |
| `--accent` | `#c0412c` | `#e0683a` | `#b73228` | `#1f7a5e` |

Rationale: terracotta/cinnabar tones for light/classic (earth + tadelakt plaster), warm amber on deep walnut for dark (lantern glow), verdigris-teal for modern (patinated copper). All accents differ numerically from OUZAFT's `#b87d2a / #d49a40 / #e8b84c / #e0a840`.

### 2.3 Decorative motifs (recurring, used on ≥3 sections each)
1. **Moorish arch frame** (`clip-path: path(...)`) — top of riad cards, hero portrait, team portraits.
2. **Zellige tile strip** (SVG repeating star-8 pattern) — topbar accent, footer divider, section dividers, hero corner ornament.
3. **Muqarnas / keyhole ornament** (inline SVG) — eyebrow prefix, booking engine corners, testimonial quote mark, blog sidebar header.

### 2.4 CSS class prefix
All component-level class names prefixed `rd-` (riad). No `oz-` classes. Utilities (`reveal`, `contain`, `full-bleed`, `section`) kept blueprint-neutral.

### 2.5 Corner-radius scale
- `--rd-r-sm: 8px`, `--rd-r-md: 18px`, `--rd-r-lg: 28px`, `--rd-r-xl: 42px` — numerically distinct from OUZAFT in ≥2 tokens, PLUS primary cards use an arch-topped `clip-path` mask that does not appear in OUZAFT.

## 3. Layout & Pages

### 3.1 App Shell
Structure: `<TopBar>` → `<SiteHeader>` → `<main><Routes>…</Routes></main>` → `<Footer>`. Sticky header with backdrop-filter. Scroll-to-top on route change (y=0, before paint).

### 3.2 Routes
- `/` HomePage (editorial hero, booking engine, featured riads, brand story, experiences, full-bleed CTA, amenities, testimonials, latest stories, newsletter)
- `/rooms` RiadsPage (listings, sort control, empty state)
- `/about` AboutPage (intro + experience badge, stats bar, Why Us grid, tabbed activities, hosts grid, article teaser, newsletter)
- `/blog` BlogPage (posts grid + sidebar with combined category AND search filter + empty state)
- `/contact` ContactPage (info + form, FAQ accordion, map embed)
- `*` → HomePage

### 3.3 Home hero (distinct from OUZAFT's centered+dots slider)
**Editorial split**: 60/40 columns desktop. Left = large left-aligned serif headline + numbered preview rail (01 / 02 / 03) + arrow controls. Right = arch-masked portrait photo that cross-fades per slide with a tile-mosaic reveal. Corner muqarnas ornament in top-right. Text mask-wipe on headline change.

### 3.4 Booking engine
Tabs: **Stay** | **Experience** | **Hammam**. Each tab: `react-datepicker` range picker (check-in + check-out required), guest stepper 1–10 default 2, submit. Validation covers empty dates, past check-in, check-in ≥ check-out. Valid submit navigates to `/rooms?checkIn=…&checkOut=…&guests=…&tab=…`.

### 3.5 Riad cards
Horizontal on >920px (image left, content right), stacked on ≤920px. Arch-topped image mask. Displays name, category, location, bed/size/capacity, price + struck original, rating, review count, ≥3 amenities, badge, cancellation. Reserve button scrolls to y=0 and opens a details modal.

## 4. Animation System

### 4.1 CSS baseline
`.reveal` starts at opacity:0 translateY(24px); when in viewport (IntersectionObserver, ≥10% threshold), transitions to opacity:1, y:0 over 600ms (within 200–800ms bound). Re-triggers on re-entry.

### 4.2 GSAP-layered effects (mode=modern and `window.gsap` present)
1. **Arch-clip reveal** on section dividers (clip-path animation).
2. **Tile-mosaic stagger** on card groups (staggered fade+scale).
3. **Parallax courtyard depth** on the hero image on pointer move.
All wrapped in try/catch; failure silently falls back to CSS baseline.

### 4.3 Reduced motion
`@media (prefers-reduced-motion: reduce)` caps duration at 200ms and displacement at 8px, and the GSAP layer is skipped entirely.

## 5. Theme Mode System

```js
const MODES = ['light', 'dark', 'classic', 'modern']
```

On mount (before paint, via inline script in `index.html`): read `localStorage['riad-mode']`; if valid → set `document.body.dataset.mode`; else → fallback `light` and overwrite invalid. Try/catch the entire localStorage block. AppShell `useState` initializer mirrors this. Mode switcher updates `dataset.mode`, persists to `localStorage`, and marks the active option with `aria-pressed="true"` + distinct visual state.

## 6. Data Arrays

Defined as top-of-file `const`s in `App.jsx` (before any component):

| Array | Count | Used by |
|---|---|---|
| `heroSlides` | 3 | Hero |
| `allRiads` | 6 (w/ `featured` flags) | RiadsPage + HomePage featured |
| `experiences` | 4 | HomePage experiences |
| `amenities` | 6 | HomePage amenities |
| `testimonials` | 4 | HomePage testimonials carousel |
| `blogPosts` | 6 | HomePage + BlogPage |
| `team` | 4 | AboutPage hosts |
| `whyUsFeatures` | 4 | AboutPage |
| `stats` | 4 | AboutPage |
| `activityItems` | 4 | AboutPage tabs |
| `faqs` | 6 | ContactPage |
| `megaMenus` | 1 key (stays) | SiteHeader |

Every entry uses Riad vocabulary (riad, zellige, medina, courtyard, hammam, tadelakt, souk, Moorish). Unsplash URLs for images.

## 7. Component Inventory (all inside `src/App.jsx`)

Utilities: `I`, `Stars`, `Reveal`, `BreadcrumbHero`, `ArchMask` (SVG), `ZelligeStrip` (SVG), `Muqarnas` (SVG).
Chrome: `TopBar`, `SiteHeader` (with `MegaMenu`), `Footer`.
Pages: `HomePage`, `RiadsPage`, `AboutPage`, `BlogPage`, `ContactPage`.
Root: `AppShell` (default export).

## 8. Correctness Properties (PBT candidates for future)

1. **Mode persistence**: after setting any valid mode, `localStorage['riad-mode']` equals that mode AND `document.body.dataset.mode` equals that mode.
2. **Invalid mode recovery**: for any string s ∉ MODES, `localStorage` ends with `'light'` and `dataset.mode === 'light'`.
3. **Blog filter AND invariant**: for any category c and query q, the visible-posts set equals `{ p ∈ posts : normalize(p.category) === normalize(c) ∧ (q === '' ∨ contains(p.title+p.excerpt, q, ci)) }`.
4. **Hero auto-advance wrap**: at step N, shown slide is `N mod slides.length`.
5. **Booking validation**: submit with (start ≥ end) ⟹ no navigation; submit with valid dates ⟹ navigation with the supplied params as query string.
6. **Accordion single-open**: at most one FAQ panel expanded at any time.

## 9. Responsive Strategy

| Breakpoint | Changes |
|---|---|
| >1240 | 3–4 col grids |
| 921–1240 | 2 col grids, stats 2-col |
| 641–920 | mobile menu visible, primary nav hidden, horizontal cards stack vertically, booking form single-column |
| 320–640 | single column, `clamp()` typography contracts |
| >1920 | container capped at 1440 max-width, centered |

## 10. Accessibility

- All content images: non-empty 4–150 char `alt`; decorative motifs: `alt=""` or `aria-hidden`.
- Focus indicator: 2px solid `color-mix(var(--accent), transparent 0%)`, contrast ≥3:1.
- Mobile menu: `aria-expanded`, Escape closes and restores focus to toggle.
- Mode switcher buttons: `aria-pressed`, `aria-label`.
- Tab controls: `role="tab"`, Enter/Space activation.

## 11. Entry Points

- `index.html`: title `Dar Zellige — A Collection of Restored Riads`, `html lang="en"`, `body data-mode="light"` (pre-paint set by inline script for stored mode), Remix Icon CDN in `<head>`, GSAP CDN before module script, Riad favicon.
- `src/index.css`: only global reset + Google Fonts (`Fraunces`, `DM Sans`) + base body/html/#root.
- `src/main.jsx`: `<StrictMode><BrowserRouter><App/></BrowserRouter></StrictMode>`.
- `src/App.jsx`, `src/App.css`: all components + all styles.
- No new dependencies added.
