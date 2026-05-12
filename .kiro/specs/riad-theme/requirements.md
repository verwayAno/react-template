# Requirements Document

## Introduction

The **Riad theme** is a brand-new React + Vite theme built on the existing `react-template` project, scaffolded according to the architecture defined in `THEME_BLUEPRINT.md`. The theme celebrates the traditional Moroccan **riad** — a courtyard house organised around an interior garden — and presents a boutique collection of restored riads as a visually distinct, editorial website.

The Riad theme MUST follow the blueprint's architecture exactly (single `App.jsx`, single `App.css`, 4 color modes, inline data arrays, react-router, GSAP via CDN, Remix Icon) while introducing a **completely different visual identity, typography, component styling, and motion vocabulary** from the existing OUZAFT theme currently in the repository. The work is carried out on a dedicated feature branch and MUST NOT be committed until the user reviews the result.

### Scope
- Applies to the five standard pages (Home, Rooms, About, Blog, Contact) plus TopBar, SiteHeader, and Footer.
- Includes the 4-mode theming system, booking engine, mega menu, reveal animations, and responsive breakpoints.
- Excludes: backend/API integration, real authentication, real payments, CMS integration, i18n beyond a single language.

### Creative direction (proposed — subject to user confirmation)
- **Identity**: "Dar Zellige — A Collection of Restored Riads". Focus is on the architecture, light, and stillness of the riad itself rather than general Moroccan travel.
- **Distinction from OUZAFT**: different palettes, different fonts, different card language (rounded arches and zellige motifs rather than soft pills), different hero treatment (editorial magazine-layout vs. full-bleed slider), different motion vocabulary (arch-reveal, tile-mosaic stagger vs. simple fade-up).

## Glossary

- **Riad_Theme**: The complete new theme being built in this spec. Default brand name: "Dar Zellige".
- **Blueprint**: The architecture document at `THEME_BLUEPRINT.md` that every new theme MUST conform to.
- **Existing_Theme**: The current OUZAFT theme already implemented in `src/App.jsx` and `src/App.css`.
- **App_Shell**: The default-exported root React component that manages mode state, route transitions, and layout composition.
- **TopBar**: The topmost bar containing slogan, hotline, social links, and the mode switcher.
- **Site_Header**: The main navigation bar containing brand link, primary nav with mega menu, mobile toggle, and reservation CTA.
- **Footer**: The site-wide footer with 4-column grid and bottom legal/copyright bar.
- **Home_Page**: The `/` route landing page.
- **Rooms_Page**: The `/rooms` route listing page (renamed in content to "Riads" or "Suites" but routed at `/rooms`).
- **About_Page**: The `/about` route.
- **Blog_Page**: The `/blog` route.
- **Contact_Page**: The `/contact` route.
- **Mode_Switcher**: The UI control that cycles among the four theme modes: `light`, `dark`, `classic`, `modern`.
- **Booking_Engine**: The multi-tab reservation form on the Home page (rooms / experiences / dining or equivalent Riad-specific tabs).
- **Animation_System**: The combination of CSS reveal transitions and GSAP-based enhancements (loaded via CDN as `window.gsap`).
- **Mega_Menu**: The expanded hover panel rendered beneath selected top-level nav items.
- **Breadcrumb_Hero**: The inner-page hero component used on Rooms, About, Blog, Contact.
- **Storage_Key**: The localStorage key used to persist the active mode. For this theme it MUST be `riad-mode`.
- **Git_Branch**: The feature branch for all Riad theme work. Name: `theme/Riad`.
- **Developer**: The engineer (or AI agent) scaffolding and implementing the theme.
- **Reviewer**: The user who inspects the finished theme before any commit is created.
- **Data_Arrays**: The `const` arrays/objects defined at the top of `App.jsx` before any component definition.
- **Zellige**: Traditional Moroccan geometric terracotta tilework used as a visual reference for the theme's decorative motifs.
- **Moorish_Arch**: A horseshoe / keyhole arch shape used as a recurring motif for card tops, image masks, and reveal transitions.
- **Reviewer_Approval**: An explicit written approval statement from the Reviewer (for example "approved", "LGTM", "ship it") issued in the current review channel.

## Requirements

### Requirement 1: Git branch isolation

**User Story:** As a reviewer, I want all Riad theme work done on a dedicated feature branch, so that I can review changes in isolation before they touch `main`.

#### Acceptance Criteria

1. WHEN work on the Riad theme begins AND no `theme/Riad` branch yet exists locally, THE Developer SHALL create a new Git branch named `theme/Riad` from the tip of the `main` branch and check it out before creating or modifying any file in the workspace for the Riad theme.
2. WHILE implementing the Riad theme, THE Developer SHALL perform every file creation, file modification, and Git commit on the `theme/Riad` branch only, and SHALL NOT create, modify, or commit files on any other branch.
3. WHILE Reviewer_Approval has not been issued, THE Developer SHALL NOT create any Git commit on the `theme/Riad` branch.
4. WHILE Reviewer_Approval has not been issued, THE Developer SHALL NOT push the `theme/Riad` branch to any Git remote.
5. IF the `theme/Riad` branch already exists locally at the start of the work, THEN THE Developer SHALL check out the existing branch, notify the Reviewer in writing that the branch was reused, and SHALL NOT delete, reset, or force-update the existing branch.

### Requirement 2: Blueprint architectural compliance

**User Story:** As a reviewer, I want the Riad theme to follow the exact architecture defined in `THEME_BLUEPRINT.md`, so that the theme remains consistent with the template and easily swappable.

#### Acceptance Criteria

1. THE Riad_Theme SHALL define every React component, page function, and utility (including the `AppShell`, `TopBar`, `SiteHeader`, `Footer`, page components, `Stars`, `I`, and `BreadcrumbHero`) inside the single file `src/App.jsx`.
2. THE Riad_Theme SHALL define every style rule (CSS variables, base, layout, components, responsive) inside the single file `src/App.css`.
3. THE Riad_Theme SHALL keep `src/index.css` limited to global resets, Google Fonts `@import`, and base `html`/`body`/`#root` rules, and SHALL NOT define any component-specific selector in that file.
4. THE Riad_Theme SHALL declare all content as `const` Data_Arrays at the top of `src/App.jsx`, before the first component definition.
5. THE Riad_Theme SHALL export the App_Shell as the default export of `src/App.jsx`.
6. THE Riad_Theme SHALL load Remix Icon (`remixicon.min.css`, version 4.6.0 or later) via a `<link rel="stylesheet">` tag in the `<head>` of `index.html`.
7. THE Riad_Theme SHALL load GSAP (version 3.12 or later) via a `<script>` tag in `index.html` placed before the `<script type="module" src="/src/main.jsx">` tag, so that GSAP is accessed as `window.gsap` at runtime.
8. THE Riad_Theme SHALL use `react-router-dom` with `BrowserRouter` wrapping `<App />` in `src/main.jsx`, and `<Routes>`/`<Route>` inside the App_Shell.
9. THE Riad_Theme SHALL use `react-datepicker` for every date input rendered by the Booking_Engine on the Home_Page.
10. THE Riad_Theme SHALL NOT introduce any additional runtime dependency beyond the set already declared in `package.json` (`react`, `react-dom`, `react-router-dom`, `react-datepicker`, `gsap`), and SHALL NOT add any additional devDependency beyond the current ESLint and Vite toolchain.
11. THE Riad_Theme SHALL NOT create any new source file under `src/` beyond `src/App.jsx`, `src/App.css`, `src/index.css`, `src/main.jsx`, and theme assets under `src/assets/<theme-name>/`.
12. WHEN the Reviewer runs `npm run build`, THE Riad_Theme SHALL complete the build with exit code 0 and no error-level output.
13. WHEN the Reviewer runs `npm run lint`, THE Riad_Theme SHALL complete with exit code 0 and zero ESLint errors.
14. WHEN the Reviewer runs `npm run dev` and visits `/`, `/rooms`, `/about`, `/blog`, and `/contact` in turn, THE Riad_Theme SHALL render each page without producing any uncaught exception or error-level message in the browser console.

### Requirement 3: Four color modes

**User Story:** As a visitor, I want to switch between four visual modes, so that I can view the site in the appearance that suits my context.

#### Acceptance Criteria

1. THE Riad_Theme SHALL define CSS variable blocks for exactly four modes identified by `data-mode` attribute values: `light`, `dark`, `classic`, `modern`.
2. THE Riad_Theme SHALL define, in each of the four mode blocks, values for exactly the following CSS custom properties: `--bg`, `--surface`, `--surface-soft`, `--heading`, `--text`, `--text-soft`, `--line`, `--accent`.
3. THE Riad_Theme SHALL use, as the `--accent` value in each of the four mode blocks, a color whose hex value is not equal to any of `#b87d2a`, `#d49a40`, `#e8b84c`, or `#e0a840` (the OUZAFT accent values currently in `src/App.css`).
4. WHEN the Reviewer clicks a mode option in the Mode_Switcher, THE App_Shell SHALL set `document.body.dataset.mode` to the selected mode within 100ms.
5. WHEN the Reviewer selects a mode, THE App_Shell SHALL persist the selected mode value to `localStorage` under the Storage_Key `riad-mode` within 100ms of the click.
6. WHEN the page loads AND a value for Storage_Key `riad-mode` exists in `localStorage` AND that value is exactly one of `light`, `dark`, `classic`, or `modern`, THE App_Shell SHALL set `document.body.dataset.mode` to that stored value before the browser's First Contentful Paint so that no transition from another mode is observable to the Reviewer.
7. WHEN the page loads AND no value exists for Storage_Key `riad-mode` in `localStorage`, THE App_Shell SHALL set `document.body.dataset.mode` to `light` before the browser's First Contentful Paint.
8. IF the value stored under Storage_Key `riad-mode` in `localStorage` is not exactly one of `light`, `dark`, `classic`, or `modern`, THEN THE App_Shell SHALL set `document.body.dataset.mode` to `light` and overwrite the Storage_Key `riad-mode` value with `light` before the browser's First Contentful Paint.
9. IF reading from or writing to `localStorage` throws an exception or returns no value for Storage_Key `riad-mode`, THEN THE App_Shell SHALL set `document.body.dataset.mode` to `light`, continue rendering without error, and retain the Reviewer's in-session mode selection for the remainder of the page session.
10. WHILE `document.body.dataset.mode` is set to a given mode, THE Mode_Switcher SHALL visually indicate that same mode as the currently active option through a persistent visual state distinct from the other three options.

### Requirement 4: Visual distinctiveness from the existing theme

**User Story:** As the reviewer, I want the Riad theme to look and feel clearly different from OUZAFT, so that it is a genuinely new theme rather than a recolor.

#### Acceptance Criteria

1. THE Riad_Theme SHALL use, as its heading typeface, a Google Font family whose name is not `Cormorant Garamond`, and SHALL NOT list `Cormorant Garamond` anywhere in its heading font stack.
2. THE Riad_Theme SHALL use, as its body typeface, a Google Font family whose name is not `Nunito Sans`, and SHALL NOT list `Nunito Sans` anywhere in its body font stack.
3. THE Riad_Theme SHALL prefix every non-utility CSS class name it introduces with `rd-`, and SHALL NOT introduce any class name prefixed with `oz-`, so that no style rule collides with OUZAFT.
4. THE Riad_Theme SHALL either (a) define a card corner-radius scale whose values differ numerically from OUZAFT's `--r-sm 6px`, `--r-md 12px`, `--r-lg 20px`, `--r-xl 32px` in at least two tokens, OR (b) apply a non-rectangular card outline to primary content cards using `clip-path` or an SVG mask (for example an arch-topped mask) that is not used anywhere in OUZAFT.
5. THE Riad_Theme SHALL render the Home_Page hero with a layout that differs from OUZAFT's centered caption + bottom dots slider in at least two of the following three attributes: (a) heading text alignment is not centered, (b) primary navigation controls are not horizontally centered dots along the bottom edge, (c) the hero contains a secondary structural element (for example a numbered preview rail, a corner ornament, an inset arch frame) that OUZAFT does not use.
6. THE Riad_Theme SHALL introduce at least three recurring decorative motifs inspired by riad architecture (for example zellige tile pattern borders, Moorish_Arch card tops, carved-plaster divider SVGs, muqarnas corner ornaments, lantern silhouettes), AND each chosen motif SHALL appear on at least three distinct sections across the site.
7. THE Riad_Theme SHALL implement at least three motion behaviours drawn from the following set: arch-clip reveal on scroll, tile-mosaic stagger entrance, parallax courtyard depth on cursor, text mask-wipe on hero line change, animated tessellation on section dividers — AND none of the three chosen behaviours SHALL be present in the OUZAFT implementation.
8. WHEN the user has `prefers-reduced-motion: reduce` set, THE Riad_Theme SHALL still render every decorative motif from criterion 6 in its final (motionless) visual state, and SHALL reduce the motion behaviours from criterion 7 per Requirement 11.

### Requirement 5: App shell, topbar, header, and footer

**User Story:** As a visitor, I want a consistent site chrome around every page, so that I can orient, navigate, and take action from anywhere on the site.

#### Acceptance Criteria

1. THE App_Shell SHALL render, in the following document order, a TopBar, a Site_Header, a `<main>` element containing `<Routes>`, and a Footer.
2. WHEN the user navigates to a new route via client-side routing, THE App_Shell SHALL scroll the window to vertical position y=0 before the new route becomes interactive.
3. THE TopBar SHALL display a slogan of 10 to 80 characters, a hotline phone link using a `tel:` URI scheme, between 3 and 6 social-media links where each link has an accessible name identifying the platform, and the Mode_Switcher.
4. THE Site_Header SHALL display the brand/logo linking to `/`, a primary navigation containing at minimum the items Home, Riads (linking to `/rooms`), About, Blog, and Contact, and a reservation call-to-action button.
5. WHILE the viewport width is at or below 920px, THE Site_Header SHALL show the mobile-menu toggle button and hide the primary desktop navigation; WHILE the viewport width is greater than 920px + 16px hysteresis, THE Site_Header SHALL hide the mobile-menu toggle button and show the primary desktop navigation.
6. WHEN the user activates the mobile-menu toggle, THE Site_Header SHALL open a mobile menu panel containing every primary navigation item plus the reservation call-to-action; WHEN the user activates the toggle again or selects a navigation item, THE Site_Header SHALL close the mobile menu panel.
7. WHEN the user hovers continuously for at least 100ms over a nav item that has an associated Mega_Menu entry, OR when keyboard focus moves onto that nav item, THE Site_Header SHALL display the Mega_Menu panel beneath that item.
8. WHEN the user moves pointer and keyboard focus outside both the nav item and its Mega_Menu, THE Site_Header SHALL close the Mega_Menu panel within 200ms.
9. WHILE the viewport width is greater than 920px AND no full-screen loading overlay or ErrorBoundary fallback is active, THE Site_Header SHALL remain visible and both pointer- and keyboard-reachable on every route.
10. THE Footer SHALL render a 4-column grid containing, in order: a brand summary, site navigation links, contact information, and a fourth column containing either payment/partner logos or a newsletter signup form.
11. THE Footer SHALL render a bottom bar showing a copyright line whose year equals the current calendar year at the moment of render, plus at least two legal links (for example "Privacy" and "Terms").

### Requirement 6: Home page content and sections

**User Story:** As a visitor, I want the home page to introduce the riad collection, enable a booking search, and show featured riads, experiences, stories, and testimonials, so that I can understand and act on the offering within one page.

#### Acceptance Criteria

1. THE Home_Page SHALL include, in the following top-to-bottom order, the sections: hero, Booking_Engine, featured riads, brand story (mini about), experiences, full-bleed CTA banner, amenities, testimonials, latest blog posts, newsletter signup.
2. THE hero section on the Home_Page SHALL cycle through at least three hero slides, where each slide has a unique image, eyebrow, headline, subhead, and primary CTA label that differ from every other slide in the set.
3. WHILE the Home_Page hero is visible in the viewport AND no hero user interaction (click, tap, keyboard focus, or pointer hover on a hero control) has occurred in the last 7 seconds, THE hero SHALL auto-advance to the next slide, wrapping from the last slide back to the first.
4. WHEN the user activates a hero dot or arrow control via click, tap, or keyboard (Enter or Space), THE hero SHALL transition to the selected slide within 600 milliseconds and SHALL reset the 7-second auto-advance timer.
5. THE Booking_Engine SHALL expose at least two labeled tabs (including a "Stay" tab for riad bookings), a date-range picker using `react-datepicker` requiring both check-in and check-out dates, a guest-count stepper that accepts integer values from 1 to 10 inclusive with a default of 2, and a visible submit button.
6. IF the user submits the Booking_Engine form with a start date on or after the end date, THEN THE Booking_Engine SHALL display an inline validation message identifying the date-range error, SHALL retain all entered field values, and SHALL NOT navigate away from the Home_Page.
7. IF the user submits the Booking_Engine form with a missing check-in date, a missing check-out date, or a check-in date earlier than the current calendar day, THEN THE Booking_Engine SHALL display an inline validation message identifying the invalid field, SHALL retain all other entered field values, and SHALL NOT navigate away from the Home_Page.
8. WHEN the user submits the Booking_Engine form with all fields passing validation, THE Booking_Engine SHALL navigate to the riad listing or results view carrying the submitted dates, guest count, and active tab as search parameters.
9. THE featured riads section SHALL render exactly three riad cards selected as the first three entries whose `featured` flag is true in the main riads Data_Array, falling back to the first three entries of the Data_Array if fewer than three are flagged.
10. THE testimonials section SHALL contain at least four testimonials and SHALL auto-advance to the next testimonial every 7 seconds, wrapping from the last testimonial back to the first.

### Requirement 7: Rooms page (riads listing)

**User Story:** As a visitor, I want a full listings page showing every riad in the collection with pricing, amenities, and key facts, so that I can compare and select a property.

#### Acceptance Criteria

1. THE Rooms_Page SHALL render a Breadcrumb_Hero at the top with the page title, a breadcrumb trail, and a background image.
2. WHERE the viewport width is greater than 920px, THE Rooms_Page SHALL render each item from the main riads Data_Array as a horizontal listing card with the image on one side and the content on the other.
3. EACH riad listing card SHALL display the following fields: image, name, category label, location text, bed details, size in square metres, capacity text, price value with currency, original (struck-through) price, numeric rating, review count, at least three amenity icons with matching visible labels, a badge label, and a cancellation policy line.
4. WHERE the viewport width is at or below 920px, THE Rooms_Page SHALL stack each listing card vertically with the image rendered above the content.
5. WHEN the user clicks a listing card's reserve button, THE Rooms_Page SHALL scroll the window to y=0 and open a details view for that riad (either as an in-page details panel or a client-side route whose path contains the riad slug).
6. THE Rooms_Page SHALL render a sort control offering at least the options "Price: low to high" and "Price: high to low", plus an option representing the Data_Array's original order (for example "Recommended" or "Featured").
7. WHEN the user selects a sort option, THE Rooms_Page SHALL reorder the visible listing cards according to that option within 300 milliseconds and SHALL visually indicate the currently active sort option.
8. IF the main riads Data_Array is empty after any active filter or sort, THEN THE Rooms_Page SHALL display an empty-state message in the listings area indicating that no riads were found, while still rendering the Breadcrumb_Hero and the sort control.

### Requirement 8: About page

**User Story:** As a visitor, I want to understand the story, values, people, and credentials behind the riad collection, so that I can build trust before booking.

#### Acceptance Criteria

1. THE About_Page SHALL render, in the following top-to-bottom order: a Breadcrumb_Hero, an about intro (text block plus image with an experience badge showing a numeric value and a label), a stats bar, a "Why Us" feature grid, an activities or services tabbed section, a team/hosts grid, an article teaser rendering exactly two blog post cards, and a newsletter signup.
2. THE stats bar SHALL render between 4 and 8 stats, where each stat contains an icon, a non-empty numeric value, and a label of 1 to 40 characters.
3. THE "Why Us" grid SHALL render between 4 and 8 feature cells, where each cell contains an icon, a title of 1 to 60 characters, and a description of 1 to 200 characters.
4. THE team grid SHALL render between 4 and 8 members, where each member has an image, a name of 1 to 60 characters, a role of 1 to 60 characters, and a bio of 1 to 300 characters.
5. IF a team member image fails to load, THEN THE About_Page SHALL display a neutral placeholder graphic or the member's initials in the image slot so that the grid layout remains intact.
6. WHEN the activities or services tabbed section first renders, THE About_Page SHALL mark the first tab as the active tab and display that tab's content.
7. WHEN the user activates a tab in the activities section via click or keyboard (Enter or Space), THE About_Page SHALL update both the displayed tab content and the active-tab visual state within 300 milliseconds such that exactly one tab is in the active visual state after the update.
8. IF the content swap or the visual-state update for a newly clicked tab fails, THEN THE About_Page SHALL revert both the content and the visual state to the previously active tab and SHALL display a user-visible error indication on the activities section.

### Requirement 9: Blog page

**User Story:** As a visitor, I want to browse stories and guides with category filtering and a contextual sidebar, so that I can discover content relevant to my interests.

#### Acceptance Criteria

1. THE Blog_Page SHALL render a Breadcrumb_Hero, a main posts listing, and a sidebar.
2. THE posts listing SHALL render every item in the blog posts Data_Array as a card showing image, category, date formatted as "Month DD, YYYY", read-time, title (truncated to a maximum of 120 characters with an ellipsis if longer), excerpt (truncated to a maximum of 200 characters with an ellipsis if longer), and author.
3. THE sidebar SHALL render a search input accepting up to 100 characters, a category list containing every unique category from the blog posts Data_Array plus an "All" entry, a popular-posts list showing at most 5 posts, and a newsletter card.
4. WHEN the user selects a category from the sidebar category list, THE Blog_Page SHALL filter the visible posts to only those whose category value exactly matches the selected category using case-insensitive comparison, and SHALL complete the filtering within 500 milliseconds of the selection.
5. WHEN the user selects the "All" category or clears the active category filter, THE Blog_Page SHALL display every post in the blog posts Data_Array subject to any active search filter from criterion 6.
6. WHEN the user types text in the sidebar search input, THE Blog_Page SHALL filter the visible posts within 500 milliseconds of the last keystroke to only those whose title or excerpt contains the entered text as a substring, using case-insensitive matching.
7. WHILE both a category filter and a search text filter are active, THE Blog_Page SHALL display only posts that satisfy both filters (logical AND), and SHALL hide posts that match the category but not the search text.
8. IF no posts match the currently active filters, THEN THE Blog_Page SHALL display an empty-state message in the posts listing area indicating that no posts were found, and SHALL continue rendering the sidebar with its filter controls enabled so the user can adjust filters.

### Requirement 10: Contact page

**User Story:** As a visitor, I want a way to reach the team, check frequently asked questions, and see the location on a map, so that I can resolve questions before or after booking.

#### Acceptance Criteria

1. THE Contact_Page SHALL render a Breadcrumb_Hero followed by a two-column layout containing contact information on one side and a contact form on the other, then an FAQ accordion, then a map embed.
2. THE contact information panel SHALL display at minimum: a street address, a hotline phone number presented as a clickable telephone link, a support email presented as a clickable email link, and opening hours listed per day of the week with open and close times.
3. THE contact form SHALL include a name field (1 to 100 characters), an email field (1 to 254 characters), a subject field (1 to 200 characters), and a message field (1 to 2000 characters), each marked required.
4. IF the user submits the contact form with any required field empty or exceeding its maximum character length, THEN THE Contact_Page SHALL display an inline validation message next to each invalid required field, preserve all other entered field values, and SHALL NOT submit the form.
5. WHEN the user submits the contact form with all required fields filled within their character limits AND the email passes both general syntax validation and the specific pattern check (`text@text.text`), THE Contact_Page SHALL display a success confirmation message that remains visible for at least 5 seconds, and SHALL clear all form fields.
6. THE FAQ accordion SHALL render at least six question/answer pairs and SHALL initialize with all answer panels collapsed on page load.
7. WHEN the user clicks an FAQ question, THE Contact_Page SHALL expand that question's answer panel and collapse any other currently-open panel.
8. IF the user submits the contact form AND the email does not match the simple email pattern (`text@text.text`), THEN THE Contact_Page SHALL display an inline validation message next to the email field, preserve all other entered field values, and SHALL NOT submit the form, even when every other required field is filled.
9. THE map embed SHALL display a visible location marker at the street address shown in the contact information panel and SHALL allow the user to zoom in and zoom out.

### Requirement 11: Animation system and reveal behaviour

**User Story:** As a visitor, I want refined, performant motion that enhances the sense of place, so that the site feels crafted rather than static.

#### Acceptance Criteria

1. THE Animation_System SHALL provide a CSS-only baseline reveal that transitions each reveal element from opacity 0 with an initial offset of up to 24 pixels to opacity 1 at offset 0, over a duration between 200 and 800 milliseconds, so that animations still occur when GSAP fails to load.
2. WHERE the mode is `modern` AND `window.gsap` is defined, THE Animation_System SHALL layer GSAP-driven effects on top of the CSS baseline including at minimum a staggered entrance on reveal element groups, a cursor-driven parallax on the hero, and a tessellation or arch-clip reveal on section dividers, without removing or disabling the baseline CSS transition.
3. IF `window.gsap` is undefined OR a GSAP call throws an exception at the moment an enhanced animation would run, THEN THE Animation_System SHALL skip the GSAP effect silently and SHALL preserve the CSS baseline animation so that the element reaches its visible end state.
4. WHEN an element carrying a reveal class first enters the viewport with at least 10% of its bounding box intersecting the viewport, THE Animation_System SHALL transition that element from its hidden state (opacity 0, offset up to 24 pixels) to its visible state (opacity 1, offset 0 pixels).
5. WHEN an element carrying a reveal class re-enters the viewport after leaving it, THE Animation_System SHALL re-trigger the transition from hidden state to visible state, applying the same duration and offset bounds as on first entry.
6. WHILE the user has `prefers-reduced-motion: reduce` set, THE Animation_System SHALL limit every reveal to no more than 200 milliseconds in duration and no more than 8 pixels of displacement, and SHALL skip the GSAP-layered effects defined in criterion 2.

### Requirement 12: Responsive behaviour

**User Story:** As a visitor on any device, I want the layout to adapt cleanly to my screen size, so that the site is usable on desktop, tablet, and phone.

#### Acceptance Criteria

1. WHILE the viewport width is in the range 921px to 1240px inclusive, THE Riad_Theme SHALL render card grids with exactly two columns for any grid that renders three or four columns at widths greater than 1240px.
2. WHILE the viewport width is in the range 641px to 920px inclusive, THE Riad_Theme SHALL show the mobile-menu toggle, hide the desktop primary navigation, stack every horizontal listing card vertically with the image above the content, and render the Booking_Engine as a single-column form; AT no single viewport width SHALL the desktop primary navigation and the mobile-menu toggle both be visible.
3. WHILE the viewport width is in the range 320px to 640px inclusive, THE Riad_Theme SHALL render every multi-column content grid as a single column and SHALL use the existing `clamp()` rules to reduce heading font-size and body font-size relative to the desktop values.
4. THE Riad_Theme SHALL produce no horizontal page overflow (no document.documentElement.scrollWidth greater than window.innerWidth) at any viewport width from 320px through 1920px inclusive, measured at the widths 320, 375, 414, 640, 768, 920, 1024, 1240, 1440, 1680, and 1920 pixels.
5. WHILE the viewport width is greater than 1920px, THE Riad_Theme SHALL keep container max-widths capped at or below 1440px, center the container horizontally, and render every page section without broken structure (no overlapping columns, no clipped content, no scroll traps).

### Requirement 13: Accessibility baseline

**User Story:** As a visitor using assistive technology or keyboard navigation, I want the site to be usable, so that I can engage with content and complete bookings.

#### Acceptance Criteria

1. THE Riad_Theme SHALL provide a non-empty `alt` attribute between 4 and 150 characters on every content image (hero images, riad cards, blog covers, team portraits), and the alt value SHALL NOT consist solely of filler words such as "image", "photo", "picture", or the file name.
2. THE Riad_Theme SHALL set `alt=""` on every purely decorative image (background flourishes, divider motifs, muqarnas ornaments) so that screen readers skip them.
3. THE Riad_Theme SHALL make every interactive control (button, link, tab, accordion toggle, mode pill) reachable via keyboard Tab (forward) and Shift+Tab (reverse) navigation in visual order (top-to-bottom, left-to-right), without skipping any control and without trapping focus inside any non-dialog region.
4. THE Riad_Theme SHALL render, on every interactive control while it holds keyboard focus, a visible focus indicator that contrasts at a ratio of at least 3:1 against its adjacent background, has a minimum thickness of 2 CSS pixels, and is visually distinct from the control's unfocused state.
5. THE Riad_Theme SHALL meet WCAG 2.1 AA minimum contrast (4.5:1 for body text; 3:1 for large text defined as at least 18pt or 14pt bold) between body text and accent text against their backgrounds in all four modes: `light`, `dark`, `classic`, and `modern`.
6. THE Mode_Switcher SHALL expose each mode option as a button with an accessible name identifying the mode (for example `aria-label="Light mode"`) and SHALL indicate the currently active mode using `aria-pressed="true"` or an equivalent selected-state attribute, while all other options carry `aria-pressed="false"`.
7. THE mobile menu toggle SHALL expose an `aria-expanded` attribute whose value is exactly `"true"` while the mobile menu panel is open and exactly `"false"` while it is closed, synchronized with the visible panel state.
8. WHEN the mobile menu panel is open AND the user presses the Escape key, THE Riad_Theme SHALL close the panel and return keyboard focus to the mobile-menu toggle button.

### Requirement 14: Content data arrays (Riad theme content)

**User Story:** As a reviewer, I want realistic Riad-themed content populated for every data array, so that every section of every page has representative copy and imagery.

#### Acceptance Criteria

1. THE Riad_Theme SHALL define a hero slides array with between 3 and 6 slides, where each slide contains a title (10 to 80 characters), a subtitle or eyebrow (3 to 40 characters), a description (40 to 240 characters), and an image URL that points to a reachable asset (HTTP 200 response or bundled asset path).
2. THE Riad_Theme SHALL define a riads array with between 6 and 12 entries, where each entry contains a name (5 to 60 characters), a category label, numeric beds/capacity/size values greater than 0, a price value greater than 0 with a currency indicator, a numeric rating between 0.0 and 5.0, an image URL that points to a reachable asset, an address with city, between 3 and 6 amenity icon/label pairs, a badge label (1 to 20 characters), and a cancellation policy string (10 to 120 characters).
3. THE Riad_Theme SHALL define an experiences or tour-packages array with between 4 and 8 entries, where each entry contains a title (10 to 80 characters), a duration value with time unit, a group size range, a price value greater than 0 with a currency indicator, an image URL that points to a reachable asset, a difficulty label drawn from a fixed set (for example easy, moderate, challenging), and between 3 and 6 highlight bullets of 5 to 80 characters each.
4. THE Riad_Theme SHALL define an amenities array with between 6 and 12 entries, where each entry contains an icon identifier, a title (3 to 40 characters), and a description (30 to 160 characters).
5. THE Riad_Theme SHALL define a testimonials array with between 4 and 8 entries, where each entry contains a name (3 to 40 characters), a role (3 to 40 characters), an avatar image URL that points to a reachable asset, a review text (60 to 320 characters), and a numeric rating between 0.0 and 5.0.
6. THE Riad_Theme SHALL define a blog posts array with between 6 and 12 entries, where each entry contains a title (10 to 90 characters), an excerpt (60 to 240 characters), an image URL that points to a reachable asset, a date in a consistent human-readable format, a category label (3 to 30 characters), a read-time value expressed in minutes, and an author name (3 to 40 characters).
7. THE Riad_Theme SHALL define a team array with between 4 and 8 entries, where each entry contains a name (3 to 40 characters), a role (3 to 40 characters), and an image URL that points to a reachable asset.
8. THE Riad_Theme SHALL define a stats array with between 4 and 8 entries, where each entry contains an icon identifier, a value (numeric or short string up to 10 characters), and a label (3 to 30 characters).
9. THE Riad_Theme SHALL define a mega-menus object with at least one expanded menu definition containing a heading (3 to 30 characters), between 2 and 4 columns of links with 3 to 8 links per column (each link label 3 to 30 characters), and a promo panel with an image, a heading, and a call-to-action label.
10. THE Riad_Theme SHALL populate every entry across every Data_Array with Riad-themed copy, where at least one of the following terms appears at least once per array (case-insensitive): riad, courtyard, zellige, Moorish, medina, mint tea, hammam, souk, tadelakt.
11. IF any text field in any Data_Array matches a text field from the OUZAFT reference content verbatim (case-insensitive, after trimming whitespace), THEN THE Riad_Theme SHALL be considered non-compliant with this requirement and the offending field SHALL be replaced with Riad-themed copy.
12. IF any required field in any Data_Array entry is missing, empty, or references an unreachable image asset, THEN THE Riad_Theme SHALL surface a build-time or test-time validation error identifying the array name, entry index, and offending field.

### Requirement 15: Project metadata and entry points

**User Story:** As a reviewer, I want the page title, favicon, fonts, and root entry to reflect the Riad theme, so that the theme is coherent from first byte to first paint.

#### Acceptance Criteria

1. THE Riad_Theme SHALL set the `<title>` in `index.html` to a string between 20 and 70 characters that contains the brand name "Dar Zellige" (for example "Dar Zellige — A Collection of Restored Riads").
2. THE Riad_Theme SHALL set `<html lang="en">` in `index.html` and SHALL set `data-mode="light"` on the `<body>` element as the pre-paint default, with the App_Shell allowed to update the attribute per Requirement 3.
3. THE Riad_Theme SHALL import at least two Riad-specific Google Font families in `src/index.css` — one heading family and one body family — and SHALL NOT import or list `Cormorant Garamond` or `Nunito Sans` in either stack, per Requirement 4.
4. THE Riad_Theme SHALL render through `src/main.jsx` by mounting `<StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>` into the `#root` DOM element, with `StrictMode` as the outer wrapper and `BrowserRouter` as the inner wrapper around `App`.
5. THE Riad_Theme SHALL keep the `dependencies`, `devDependencies`, and `scripts` sections of `package.json` identical to the baseline pinned by Requirement 2.10; only the metadata fields `name`, `description`, and `version` MAY be updated to reflect the theme.
6. THE Riad_Theme SHALL provide a Riad-specific favicon at `public/favicon.svg` (SVG format) and SHALL reference it from `index.html` via `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`.

### Requirement 16: Review gate

**User Story:** As the reviewer, I want the Developer to pause for my inspection before any commit is made, so that I can verify the result before it is recorded in Git history.

#### Acceptance Criteria

1. WHEN the Developer finishes implementing every task in the Riad theme plan, THE Developer SHALL send a completion notification to the Reviewer that contains (a) the list of files created or modified under the `theme/Riad` branch, (b) the routes the Reviewer can visit (`/`, `/rooms`, `/about`, `/blog`, `/contact`), and (c) the dev-server start command (`npm run dev`), and SHALL NOT create a Git commit on the `theme/Riad` branch as part of the notification.
2. WHILE Reviewer_Approval has not been issued, THE Developer SHALL ensure that no Git commit exists on the `theme/Riad` branch beyond those that pre-existed before work began (if any).
3. IF the Reviewer requests modifications after inspecting the result, THEN THE Developer SHALL apply the requested changes on the `theme/Riad` branch, re-send the completion notification per criterion 1, and SHALL NOT create any Git commit on the `theme/Riad` branch while Reviewer_Approval remains unissued.
4. WHEN the Reviewer issues Reviewer_Approval, THE Developer SHALL create one or more Git commits on the `theme/Riad` branch whose messages describe the scope of the work being recorded (for example "feat(theme): scaffold Riad theme", "feat(theme): Riad hero and booking engine").
