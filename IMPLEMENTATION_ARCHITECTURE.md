# Azura Tourism Implementation Architecture

This document explains how the current Azura Tourism project implements the architecture described in [THEME_BLUEPRINT.md](./THEME_BLUEPRINT.md), what was kept intact, what was adapted for the tourism use case, and which deviations are intentional versus worth revisiting.

## 1. Executive Summary

The project follows the blueprint closely at the architectural level:

- React + Vite SPA with client-side routing
- single `App.jsx` file containing the app shell, routes, data arrays, and most page components
- single `App.css` file containing the main styling system
- `index.css` used only for global imports and base utilities
- data-driven UI using inline arrays at the top of `App.jsx`
- 4-mode theming through CSS custom properties and a theme switcher
- CDN-based icons and GSAP integration

The main differences are practical, not architectural:

- three complex UI pieces were extracted from `App.jsx` into `src/components/ui/`
- theme names and brand styling were customized for Azura instead of copied from the Rivora example
- Tailwind utility support exists in the project, but the app is still primarily custom CSS driven
- the route map is tourism-specific and includes detail pages for rooms, activities, and packages

Overall, this is a valid adaptation of the blueprint rather than a drift away from it.

## 2. Actual Project Structure

The current implementation uses this structure:

```text
react-template/
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
├── tailwind.config.js
├── postcss.config.js
├── THEME_BLUEPRINT.md
├── IMPLEMENTATION_ARCHITECTURE.md
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx
    ├── App.css
    ├── assets/
    │   └── rivora/
    └── components/
        └── ui/
            ├── mini-navbar.jsx
            ├── hero-3.jsx
            └── circular-gallery.jsx
```

### Why this still matches the blueprint

The blueprint's core intent is simplicity and portability. This project still preserves that:

- almost all product logic is still centralized in `App.jsx`
- all main page styling still lives in `App.css`
- the extracted UI files are specialized, reusable, and comparatively self-contained

## 3. Entry Flow

### `index.html`

`index.html` acts as the HTML shell and loads global browser-level dependencies:

- Remix Icon CDN stylesheet
- GSAP CDN script
- Vite module entry script for `src/main.jsx`

The document also sets an initial theme attribute:

```html
<html lang="en" data-mode="dark">
```

This establishes the initial visual mode before React mounts.

### `src/main.jsx`

The entry point follows the blueprint exactly:

- imports `index.css`
- wraps the app in `StrictMode`
- wraps the app in `BrowserRouter`
- renders the default export from `App.jsx`

## 4. App Shell Pattern

The blueprint expects a default exported app shell that owns global state and layout. That is what Azura uses.

### Responsibilities of `AppShell`

`AppShell` in `App.jsx` is responsible for:

- storing the active theme mode in React state
- persisting that mode in `localStorage` under `azura-mode`
- updating the runtime theme attribute when the mode changes
- scrolling the page to the top on route changes
- rendering global layout chrome around routed pages

### Render structure

The shell composes the site in this order:

1. `AnnouncementBar`
2. `SiteHeader`
3. `main` with routed pages
4. `SiteFooter`

This is a direct extension of the blueprint's header-main-footer shell model.

## 5. Routing Architecture

The blueprint describes a multi-page marketing and booking site with client-side routing. Azura implements that pattern with a broader tourism-specific route map:

```text
/
/about
/accommodations
/accommodations/:id
/activities
/activities/:id
/packages
/packages/:id
/contact
*
```

### Why this is a blueprint-compliant adaptation

The blueprint's route examples are illustrative, not restrictive. Azura preserves the same architectural idea:

- list pages
- detail pages
- marketing pages
- fallback route for missing pages

The implementation simply swaps hotel/blog terminology for tourism product categories.

## 6. Data Architecture

One of the blueprint's most important rules is inline content arrays at the top of `App.jsx`. Azura follows that pattern.

### Current top-level data sets

- `ROOMS`
- `ACTIVITIES`
- `PACKAGES`
- `TEAM`
- `TESTIMONIALS`
- `STATS`
- `AMENITIES`

### Why this matters

These arrays drive the UI in the same way an API response would. Components consume structured objects rather than hard-coded copy scattered across JSX.

That means the current implementation is still easy to evolve in either direction:

- keep it as a static demo theme
- replace the arrays with async fetch calls later

### Practical note

The data model is internally coherent overall, but there is one known content mismatch:

- the `wellness-reset` package references `Cave Hideaway` as its included room by name
- this is handled gracefully in the current UI if lookup fails

At present the project is resilient to missing relationships, which is good implementation hygiene for a static-theme architecture.

## 7. Component Organization

The blueprint prefers a single large `App.jsx`. Azura mostly follows this, with one pragmatic exception.

### Components that remain inside `App.jsx`

Most of the site still lives in one file, including:

- page components
- shared cards
- header and footer
- booking cards
- detail page layouts
- reusable sections like `NewsletterBar` and `PageHero`

### Components extracted into `src/components/ui/`

Three files live outside `App.jsx`:

- `hero-3.jsx`
- `circular-gallery.jsx`
- `mini-navbar.jsx` (kept in the repo, but no longer mounted in `AppShell`)

### Why this deviation is justified

This is the most important structural deviation from the blueprint, but it is reasonable.

`circular-gallery.jsx` in particular contains:

- GSAP integration
- circular reveal behavior
- lightbox state
- keyboard navigation
- `createPortal` usage
- scroll locking

Keeping that logic out of `App.jsx` improves maintainability without changing the overall architectural style of the project.

## 8. Styling Architecture

The styling model remains very close to the blueprint.

### `src/index.css`

This file is intentionally light. It contains:

- Google Font imports
- Tailwind utilities import
- base body typography/background setup

This still aligns with the blueprint expectation that `index.css` stays small and foundational.

### `src/App.css`

`App.css` is the true styling system for the site. It includes:

- CSS custom properties
- resets and layout rules
- typography
- buttons
- page-level sections
- cards
- detail pages
- gallery styles
- responsive breakpoints

This is exactly the blueprint's main styling philosophy: one large, centralized CSS file.

### Naming style

The current CSS naming uses a hybrid approach:

- brand-prefixed blocks like `az-header`, `az-footer`
- semantic page/detail classes like `rd-body`, `pkd-stats-bar`, `act-stats-bar`
- feature-scoped gallery classes like `cg-lb`, `cg-nav`

This is a healthy evolution of the blueprint, because it keeps the stylesheet understandable even as the project grows.

## 9. Theme System

The blueprint calls for 4 theme modes driven by CSS variables. Azura fully implements that idea.

### Current modes

- `light`
- `dark`
- `nature`
- `sand`

### Current variables

Each mode defines more variables than the blueprint example, including:

- `--bg`
- `--bg2`
- `--surface`
- `--surface-soft`
- `--heading`
- `--text`
- `--text-soft`
- `--line`
- `--accent`
- `--accent2`
- `--accent-glow`
- `--hero-text`

### Interpretation

This is not an architectural problem. It is a good sign.

The blueprint defines the theming mechanism. Azura extends the variable vocabulary so the design system can support richer surfaces, glow states, alternate accents, and branded hero treatments.

### Theme target consistency

The project now uses a single theme target consistently:

- `index.html` starts with `data-mode` on the `<html>` element
- `AppShell` updates that same element with `document.documentElement.setAttribute('data-mode', mode)`

That keeps the initial static state and runtime React state aligned.

## 10. Icons and External Dependencies

### Icons

The blueprint uses Remix Icon via CDN, and Azura follows that directly.

The project wraps icon usage in a small helper component:

```jsx
const I = ({ n, className }) => <i className={`ri-${n} ${className || ''}`} />
```

The only difference from the blueprint example is the prop name:

- blueprint example: `name`
- actual project: `n`

This is a small internal API choice, not a structural issue.

### GSAP

GSAP is loaded the same way the blueprint describes:

- CDN script in `index.html`
- runtime access via `window.gsap`

Azura adds a further safeguard by checking for library availability inside `circular-gallery.jsx` before running animation logic.

That is a stronger implementation than the baseline blueprint, not a divergence in architecture.

## 11. Booking and Detail Page Pattern

The project applies a consistent detail page architecture across the three main product domains:

- accommodations
- activities
- packages

### Shared pattern

Each detail page uses the same high-level composition:

1. hero or gallery surface
2. a two-column `rd-body` layout
3. main content on the left
4. sticky booking or inquiry card on the right
5. related-item suggestions beneath the main content

This is a strong architectural sign because it shows the blueprint was adapted as a repeatable pattern, not copied page by page without structure.

## 12. Notable Enhancements Beyond the Blueprint

These changes are additions, not violations:

### `ErrorBoundary`

The app is wrapped with an error boundary class component. The blueprint does not require this, but it improves resilience and debugging.

### `AnnouncementBar`

The site includes a ticker-like top announcement bar. This adds useful merchandising and promotional capacity without affecting architectural integrity.

### Circular lightbox gallery

The gallery goes beyond the blueprint's baseline animation expectations by including:

- full-screen overlay viewer
- thumbnail strip
- keyboard controls
- portal rendering

This is a feature enhancement implemented within the existing architecture rather than a change in architecture itself.

## 13. Tailwind Status

Tailwind is present in the repository through:

- `tailwind.config.js`
- `postcss.config.js`
- `@tailwind utilities;` in `index.css`

### What this means in practice

The current app is still primarily written as a custom-CSS system. Tailwind does not appear to be the main styling engine of the UI.

So the architecture remains blueprint-like, but the repository now has optional Tailwind capability.

### Recommendation

Choose one of these directions:

1. keep Tailwind and document it as optional support tooling
2. remove it if it is not being used

The current state is not broken, but it is slightly ambiguous for future contributors.

## 14. Known Gaps and Cleanup Opportunities

These are the main implementation details worth tightening.

### 1. Unify theme attribute target

Use one element for `data-mode`, preferably `<html>`.

### 2. Replace placeholder stars in booking card headers

Some booking card headers currently render placeholder characters where a visual star display should exist.

This should be replaced with a real star string or a proper rating presentation.

### 3. Document the extracted UI components

Because the blueprint suggests a fully monolithic `App.jsx`, the extracted UI components should be treated as intentional exceptions, not accidental drift.

This file serves that purpose, but the README can also mention it.

### 4. Clarify Tailwind usage

If Tailwind remains installed, note whether it is expected to be used in future themes or is only legacy scaffolding.

## 15. Compliance Verdict

### Architecture verdict

The project is properly adapted to the blueprint.

It preserves the blueprint's real architectural contract:

- centralized app shell
- centralized data arrays
- centralized CSS architecture
- route-driven marketing site structure
- mode-based theme system
- CDN-first external dependency approach

### Deviation verdict

The major deviations are sensible and controlled:

- extracted UI files improve maintainability for complex interactive components
- expanded theme tokens improve design flexibility
- tourism-specific routes and data models correctly specialize the template

### Final assessment

This should be viewed as a mature theme implementation built on the blueprint, not as a project that failed to follow it.

## 16. Short Version for Future Contributors

If you are modifying this project, the safest mental model is:

- `App.jsx` is still the core application file
- `App.css` is still the core styling file
- the project uses inline arrays as its content source
- theme mode is a first-class global concern
- extracted UI files exist only for more complex interactive surfaces
- this codebase is blueprint-compliant in structure, with a few intentional upgrades

If you extend the project further, preserve that balance: keep the architecture simple, but do not force everything back into one file when complexity clearly benefits from isolation.