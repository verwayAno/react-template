# Implementation Plan — Riad Theme

- [ ] 1. Create branch and scaffold theme assets
  - [ ] 1.1 Create `theme/Riad` branch from `main` (skip if already on it)
  - [ ] 1.2 Replace `public/favicon.svg` with a Riad arch-motif favicon
  - [ ] 1.3 Update `package.json` `name` to `riad-theme`
  - _Requirements: 1, 15_

- [ ] 2. Update project entry points
  - [ ] 2.1 Update `index.html` title, initial data-mode, pre-paint script, keep Remix Icon + GSAP CDN
  - [ ] 2.2 Update `src/index.css` to import Fraunces + DM Sans and keep resets only
  - [ ] 2.3 `src/main.jsx` already compliant — verify no changes needed
  - _Requirements: 2, 15_

- [ ] 3. Write `src/App.css` (complete design system)
  - [ ] 3.1 Define 4 `[data-mode]` CSS variable blocks + root radius scale
  - [ ] 3.2 Base/layout: `.rd-app-shell`, `.contain`, `.section`, `.reveal`, `.full-bleed`
  - [ ] 3.3 Typography: Fraunces/DM Sans stacks, eyebrow, headings
  - [ ] 3.4 TopBar + SiteHeader + MegaMenu + mobile drawer + mode switcher
  - [ ] 3.5 Buttons: `.rd-btn-primary`, `.rd-btn-ghost`
  - [ ] 3.6 Hero: editorial split, arch-mask portrait, numbered rail, muqarnas corner
  - [ ] 3.7 Booking engine (tabs, react-datepicker overrides, stepper, validation message)
  - [ ] 3.8 Cards: riad, experience, testimonial, blog, team — all with arch-mask
  - [ ] 3.9 Page-specific: Riads listing, About intro+stats+why+tabs+hosts, Blog layout + sidebar, Contact form + FAQ + map
  - [ ] 3.10 Footer
  - [ ] 3.11 Responsive @media at 1240 / 920 / 640 and >1920 cap
  - [ ] 3.12 Reduced-motion overrides
  - _Requirements: 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13_

- [ ] 4. Write `src/App.jsx` — data arrays
  - [ ] 4.1 MODES constant
  - [ ] 4.2 `heroSlides` (3 editorial slides, Moroccan imagery)
  - [ ] 4.3 `allRiads` (6 with featured flags)
  - [ ] 4.4 `experiences` (4), `amenities` (6), `testimonials` (4), `blogPosts` (6), `team` (4), `whyUsFeatures` (4), `stats` (4), `activityItems` (4), `faqs` (6), `megaMenus`
  - _Requirements: 14_

- [ ] 5. Write `src/App.jsx` — utilities + chrome
  - [ ] 5.1 `I`, `Stars`, `Reveal` (IntersectionObserver), `BreadcrumbHero`
  - [ ] 5.2 SVG motif components: `ArchMask`, `ZelligeStrip`, `Muqarnas`
  - [ ] 5.3 `TopBar` with slogan, hotline tel link, 4 social links, ModeSwitcher (aria-pressed, aria-label)
  - [ ] 5.4 `SiteHeader` with brand, primary nav, MegaMenu (100ms hover + keyboard focus, 200ms close), mobile toggle (aria-expanded, Escape handler), reservation CTA
  - [ ] 5.5 `Footer` with 4-col grid + bottom bar (current year, Privacy, Terms)
  - _Requirements: 5, 13_

- [ ] 6. Write `src/App.jsx` — HomePage
  - [ ] 6.1 Editorial hero: headline text-mask-wipe, numbered rail, arrows, 7s auto-advance w/ pause on interaction
  - [ ] 6.2 BookingEngine (tabs, react-datepicker range, stepper 1–10, validation messages, valid-submit navigate)
  - [ ] 6.3 Featured Riads (3 by featured flag, arch-masked cards)
  - [ ] 6.4 Brand story mini-about
  - [ ] 6.5 Experiences cards (4)
  - [ ] 6.6 Full-bleed CTA banner
  - [ ] 6.7 Amenities grid (6)
  - [ ] 6.8 Testimonials auto-advance 7s
  - [ ] 6.9 Latest stories (3)
  - [ ] 6.10 Newsletter signup
  - _Requirements: 6, 11_

- [ ] 7. Write `src/App.jsx` — RiadsPage
  - [ ] 7.1 BreadcrumbHero
  - [ ] 7.2 Sort control (low→high, high→low, Recommended)
  - [ ] 7.3 Horizontal listing cards with all required fields; stack on ≤920px
  - [ ] 7.4 Reserve button → scrolls y=0 and opens in-page details panel
  - [ ] 7.5 Empty-state message
  - _Requirements: 7_

- [ ] 8. Write `src/App.jsx` — AboutPage
  - [ ] 8.1 BreadcrumbHero, intro text + arch image + experience badge
  - [ ] 8.2 Stats bar (4)
  - [ ] 8.3 Why Us grid (4)
  - [ ] 8.4 Activities tabbed section (keyboard Enter/Space; first tab active; revert on failure)
  - [ ] 8.5 Team grid (4) with image-error placeholder
  - [ ] 8.6 Article teaser (exactly 2 posts), newsletter
  - _Requirements: 8_

- [ ] 9. Write `src/App.jsx` — BlogPage
  - [ ] 9.1 BreadcrumbHero
  - [ ] 9.2 Sidebar: search (100-char), category list (All + unique), popular (≤5), newsletter card
  - [ ] 9.3 Posts grid with truncation (title 120, excerpt 200)
  - [ ] 9.4 Category + search filter combined via AND
  - [ ] 9.5 Empty-state message
  - _Requirements: 9_

- [ ] 10. Write `src/App.jsx` — ContactPage
  - [ ] 10.1 BreadcrumbHero
  - [ ] 10.2 Two-col info + form with full validation (required, max-length, email pattern)
  - [ ] 10.3 Success message visible ≥5s
  - [ ] 10.4 FAQ accordion (6, start collapsed, single-open)
  - [ ] 10.5 Map embed (iframe OSM) with marker + zoom
  - _Requirements: 10_

- [ ] 11. AppShell integration + animation hooks
  - [ ] 11.1 `AppShell` with mode state (fallback `light`, invalid handling, try/catch localStorage)
  - [ ] 11.2 Route-change scroll-to-top (y=0)
  - [ ] 11.3 GSAP enhancements guarded by mode==='modern' && window.gsap
  - [ ] 11.4 Default export
  - _Requirements: 3, 11, 5_

- [ ] 12. Verify build and runtime
  - [ ] 12.1 Run `npm run lint` — resolve any errors
  - [ ] 12.2 Run `npm run build` — resolve any errors
  - [ ] 12.3 Start `npm run dev` for reviewer preview
  - _Requirements: 2, 16_

- [ ] 13. Pause for reviewer
  - [ ] 13.1 Do NOT commit until reviewer approves
  - _Requirements: 1, 16_
