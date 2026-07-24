# Smart Diagnostic TKA — Design System

Single source of truth for every token and reusable component across the platform. Extracted from the approved `login.html`/`login.css` implementation and extended to cover the dashboard application shell. Any new page must consume these tokens — no page-local color/spacing/radius values.

Keywords the system must always read as: **Elegant · Academic · Calm · Modern · Premium · Natural · Cultural · Interactive.** Never "admin dashboard template."

---

## 0. Project Identity & Philosophy

Smart Diagnostic TKA is a premium web-based training platform for junior high school science teachers, focused on developing HOTS (Higher Order Thinking Skills) questions integrated with Acehnese cultural context.

Target users: science teachers, school administrators, training facilitators.

Design inspiration: Apple, Linear, Notion, Framer, Stripe — the interface must read as a modern educational product, not an administrative system.

**Avoid:** visual clutter, overly colorful interfaces, heavy gradients, template-like layouts.

**Always:** elegant, spacious, calm, premium, minimal, soft, academic, interactive.

### 0.1 Product Scope & Implementation Principles (locked, per pivot — see `PIVOT_PLAN.md`)

The product pivoted from a standalone question-authoring system to a Wordwall-based assessment tool. These principles are permanent and apply to every future page:

- **No AI.** No auto-recommendation, no smart analysis, no chatbot, no soal generator, no "AI" feature of any kind.
- **No soal editor.** The website never stores or renders individual questions, options, or answers. Soal HOTS are digitized directly in Wordwall by the guru — the website only stores paket-level metadata (title, subject, grade, HOTS level, stimulus, Wordwall link, status).
- **Wordwall is the assessment medium.** Smart Diagnostic's only job is to embed the Wordwall activity for a Published paket via iframe — it does not grade, score, or store question content itself.
- **Bank Soal manages *paket soal*, not questions.** "Bank Soal Berbasis Budaya Aceh" is a page for CRUD over question-package records (add/edit/delete/view), each representing one Wordwall activity plus its Acehnese cultural stimulus and materi metadata — not a form for composing quiz questions.
- **Bank Stimulus was refactored into Bank Soal, not deleted.** The standalone stimulus library page/menu no longer exists as a separate product surface; its cultural content and UI patterns (card, search, filter, Preview Panel) live on inside Bank Soal Berbasis Budaya Aceh. The old `bank-stimulus.*` files remain on disk (not deleted, not linked from navigation) since their content was migrated, not discarded.

This is not a Learning Management System. Do not add features beyond what the current proposal and dosen guidance call for — see `PIVOT_PLAN.md` for the full requirement analysis, data model, and phase plan behind this pivot.

---

## 1. Color

### 1.1 Raw palette (brand constants — FINAL, LOCKED)

This is the complete palette for the entire product, login through dashboard. **No gold/yellow anywhere, on any page.** Do not add, swap, or reintroduce colors outside this list without explicit sign-off.

| Token | Hex | Role |
|---|---|---|
| `--color-primary-dark` | `#0A3323` | Dark Green — primary brand color |
| `--color-primary-mid` | `#105666` | Midnight Green — gradients, depth |
| `--color-primary-deep` | `#062418` | Deep Green — darkest backdrop shade |
| `--color-moss` | `#839958` | Moss Green — secondary accent, borders |
| `--color-moss-light` | `#A9C17D` | Lightened Moss — legible eyebrow/label text on dark surfaces |
| `--color-beige` | `#F7F4D5` | Beige — light background, light text-on-dark |
| `--color-rosy` | `#D3968C` | Rosy Brown — **primary accent/highlight/CTA color** (replaces gold everywhere) |
| `--color-rosy-deep` | `#B97C6E` | Rosy Brown, deeper — gradient partner, hover states |
| `--color-white` | `#FFFFFF` | Used sparingly, never pure background |
| `--color-danger` | `#FF5252` | Form errors only |

Distribution rule: ~45% Dark Green, 25% Beige, 15% Moss Green, 10% Midnight Green, 5% Rosy Brown (accent/CTA). Never pure black or pure white surfaces.

### 1.2 Semantic tokens (new — needed for dashboard/light surfaces)

The login page is an **immersive dark surface** (dark green backdrop + glass card). The dashboard is a **light working surface** (beige background + dark green sidebar). Both must share the same brand tokens above; these semantic aliases let components stay mode-agnostic:

| Token | Value | Usage |
|---|---|---|
| `--surface-app` | `var(--color-beige)` | Dashboard page background |
| `--surface-sidebar` | `var(--color-primary-dark)` | Sidebar / dark chrome |
| `--surface-card` | `#FFFFFF` | Light elevated cards on beige |
| `--surface-card-tint` | `#FCFBF0` | Alternate light card (warmer than pure white) |
| `--surface-glass-dark` | `rgba(8, 42, 30, 0.72)` | Glass panels on dark/immersive contexts (login card) |
| `--text-on-dark` | `var(--color-beige)` | Body text on dark surfaces |
| `--text-on-light` | `var(--color-primary-dark)` | Body text on light surfaces |
| `--text-muted-on-light` | `#5C6B5F` | Secondary text on light surfaces |
| `--text-muted-on-dark` | `rgba(247,244,213,0.65)` | Secondary text on dark surfaces |
| `--border-on-light` | `rgba(10,51,35,0.10)` | Hairline borders on white/beige cards |
| `--border-on-dark` | `rgba(255,255,255,0.12)` | Hairline borders on dark/glass surfaces |

### 1.3 Gradients

```css
--gradient-warm-bg: linear-gradient(160deg, #0A3323 0%, #0E4632 35%, #105666 65%, #062418 100%);
--gradient-rosy: linear-gradient(135deg, #D3968C 0%, #B97C6E 100%);
--gradient-hero-overlay: linear-gradient(180deg, rgba(247,244,213,0.15) 0%, rgba(10,51,35,0.45) 50%, rgba(10,51,35,0.8) 100%);
--gradient-sidebar: linear-gradient(180deg, #0A3323 0%, #062418 100%);
--gradient-midnight: linear-gradient(135deg, #0A3323 0%, #105666 100%);
```

---

## 2. Typography

```css
--font-headings: 'DM Serif Display', Georgia, serif;
--font-body: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

Rule: serif is **only** for headings/quotes/display numbers. Everything else — labels, nav, body, buttons, table text — is Plus Jakarta Sans.

| Token | Size | Weight | Font | Use |
|---|---|---|---|---|
| `--text-display` | 2.6rem | 400 | serif | Hero-scale headline (login hero) |
| `--text-h1` | 2.0rem | 400 | serif | Page title (e.g. "Dashboard Hasil") |
| `--text-h2` | 1.5rem | 400 | serif | Section heading, card title (large) |
| `--text-h3` | 1.15rem | 500 | body | Card title (standard), widget title |
| `--text-body-lg` | 1rem | 400 | body | Lead paragraph |
| `--text-body` | 0.9rem | 400/500 | body | Default UI text |
| `--text-small` | 0.8rem | 500 | body | Labels, meta, captions |
| `--text-micro` | 0.7rem | 600 | body | Eyebrow tags, badges, timestamps |

Eyebrow/tag convention: uppercase, `letter-spacing: 2px`, Rosy Brown or moss-light color (matches `.sub-brand` in login and `.sidebar__brand-eyebrow` in the shell).

---

## 3. Spacing (8px grid)

```css
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
--space-5: 24px;  --space-6: 32px;  --space-7: 40px;  --space-8: 48px;
--space-9: 64px;  --space-10: 80px;
```

Always compose from this scale. Card internal padding defaults to `--space-6` (32px) on desktop, `--space-5` (24px) on mobile — matches login card's existing responsive padding steps.

---

## 4. Radius

```css
--radius-sm: 8px;    /* small chips, ornament corners */
--radius-md: 12px;   /* inputs */
--radius-lg: 16px;   /* small cards, dropdowns */
--radius-xl: 24px;   /* standard content cards */
--radius-2xl: 32px;  /* hero/login cards, modals */
--radius-pill: 999px; /* buttons, badges, tags */
```

---

## 5. Shadow

```css
--shadow-sm: 0 2px 8px rgba(10,51,35,0.06);
--shadow-md: 0 8px 24px rgba(10,51,35,0.10);
--shadow-lg: 0 20px 48px rgba(10,51,35,0.14);
--shadow-premium: 0 35px 80px rgba(5,20,15,0.45);   /* dark/immersive surfaces only */
--shadow-glow: 0 0 25px rgba(211,150,140,0.35);       /* rosy focus/hover glow */
--shadow-button: 0 12px 24px rgba(211,150,140,0.3);
```

Light-surface cards (dashboard) use `--shadow-sm/md/lg`. Dark/glass surfaces (login, any full-bleed hero) use `--shadow-premium`.

---

## 6. Motion

```css
--transition-fast: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
--transition-smooth: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
--duration-instant: 150ms;
--duration-fast: 250ms;
--duration-base: 400ms;
--duration-slow: 600ms;
--ease-premium: cubic-bezier(0.16, 1, 0.3, 1);
```

Standard entrance pattern (already used on login): elements start `opacity:0; transform: translateY(20-30px)`, resolve on `body.loaded` with staggered `transition-delay` (0.2s, 0.4s, 0.5s steps). Reuse this exact pattern for dashboard page loads and card grids (stagger per card index, capped ~5 steps then repeat delay).

Hover conventions:
- Cards: `translateY(-4px)` + shadow step up one level.
- Buttons (primary rosy): `translateY(-3px)` + `--shadow-glow`-family shadow.
- Icons/nav items: color shift to Rosy Brown, no movement.

### 6.1 Allowed vs. not allowed

| Allowed | Not allowed |
|---|---|
| Fade in | Bounce |
| Slide up | Flip |
| Hover lift | Rotate 360° |
| Glow | Heavy blur (as a UI/content effect) |
| Parallax | Excessive/attention-seeking motion |
| Background drift | |
| Floating particles | |
| Ken Burns effect | |

Note: large-radius `filter: blur()` on decorative background glow blobs (as in login's `.glow-blob`, 120px blur) is an atmospheric background technique, not a "heavy blur on content," and stays allowed for hero/immersive backgrounds — it must never be applied to text, cards, or interactive controls. Motion exists to enhance usability, never to distract.

---

## 7. Components

### 7.1 Buttons

| Variant | Background | Text | Border | Use |
|---|---|---|---|---|
| `.btn-primary` | `--gradient-rosy` | `--color-beige` | none | Main CTA (Masuk, Simpan, Kerjakan Sekarang) |
| `.btn-secondary` | transparent | `--color-primary-dark` (light) / beige (dark) | 1.5px solid `--color-moss` | Secondary actions |
| `.btn-ghost` | transparent | inherits | none, Rosy Brown underline/color on hover | Tertiary / "Lihat semua" links |
| `.btn-icon` | `--surface-card` / transparent | icon color inherits | `--border-on-light`, Rosy Brown on hover | Icon-only controls (notif, collapse) |

All buttons: `border-radius: var(--radius-pill)`, height 44px (compact) / 52-60px (hero, matches login `.btn-submit`), `--transition-fast`.

**Palette is unified project-wide.** Login and the dashboard shell both use the same locked 5-color palette (§1.1) — Rosy Brown is the single accent/CTA/highlight color everywhere. There is no longer a gold vs. non-gold split between pages; an earlier version of this document had login as a documented exception, but the dashboard shell (`style.css`) has since been updated to match, so gold is removed everywhere.

### 7.2 Cards

| Variant | Surface | Border | Shadow | Use |
|---|---|---|---|---|
| `.card-light` | `--surface-card` | `--border-on-light` | `--shadow-sm`, `--shadow-md` on hover | Standard dashboard/content cards |
| `.card-glass-dark` | `--surface-glass-dark` + `backdrop-filter: blur(24px)` | `--border-on-dark` + soft beige/moss gradient border accent | `--shadow-premium` | Login card, any immersive overlay panel |
| `.card-stat` | `--surface-card-tint` | `--border-on-light` | `--shadow-sm` | KPI/stat tiles on dashboard home |

Radius: `--radius-xl` default, `--radius-2xl` for hero-scale cards.

### 7.3 Inputs

Reuse login exactly: beige background, dark green text, `--radius-md`, Rosy Brown focus glow (`box-shadow: 0 0 20px rgba(211,150,140,0.3)`), left icon at 14px, 50px height desktop / 46px mobile.

### 7.4 Application Shell (new, Phase 2.0)

- **Sidebar**: fixed, width `280px` expanded / `88px` collapsed, `--gradient-sidebar` background, `--text-on-dark` labels, active item = Rosy Brown left-border + tinted background (`rgba(211,150,140,0.14)`), icons via Lucide at 20px.
- **Topbar**: sticky, height `72px`, `--gradient-sidebar` background (same dark chrome as the sidebar — never white/light), `--text-on-dark` labels, `--border-on-dark` bottom hairline, houses breadcrumb (left), search (center/optional per page), notification + profile dropdown (right). Its icon buttons and profile text use dark-surface tokens; the notif/profile dropdown *panels* stay light cards (`--surface-card`) since they're detached overlay popovers, not the bar itself.
- **Content area**: `--surface-app` background, max content width `1440px`, outer padding `--space-6` desktop / `--space-4` mobile.
- **Breadcrumb**: `--text-small`, separator `/` in `--color-moss`, current page in `--color-primary-dark` semi-bold.
- **Empty state**: centered icon (48-64px, moss/rosy tint) + `--text-h3` heading + `--text-body` muted description + optional `.btn-secondary`.
- **Loading skeleton**: `--surface-card-tint` base with shimmer gradient sweep (Rosy Brown at ~16% opacity), same radius as the component it replaces.

### 7.5 Icon sizes

`16px` inline-with-text, `20px` nav/buttons default, `24px` section headers, `32-48px` empty states/feature highlights. Source: Lucide Icons only, `stroke-width: 1.5-2`.

### 7.6 Badges / Level tags

Pill-shaped (`--radius-pill`), `--text-micro`, uppercase. HOTS level colors: C4 → moss, C5 → midnight green, C6 → rosy brown (all on beige-tinted pill background at 12% opacity of the accent).

Status variants (added Phase 2.1, for announcements/notices — same tokens, clearer names, no new colors): `.badge--new` (rosy, same as C6), `.badge--important` (`--color-danger`), `.badge--info` (midnight green, same as C5).

### 7.7 Progress Bar (added Phase 2.1)

`.progress-bar` (track: `--border-on-light`, `--radius-pill`, 8px tall — `--sm` modifier for 6px) + `.progress-bar__fill` (`--gradient-rosy` fill, animates `width` on scroll-into-view via `IntersectionObserver`, reads target % from `data-progress` on the fill element). Always pair with `role="progressbar"` + `aria-valuenow/min/max` + `aria-label` on the track. Used for KPI completion (`.card-stat--progress`) and stacked learning-progress rows.

### 7.8 Section Heading (added Phase 2.1)

`.section-heading` + `.section-heading__title` — generic sub-section title (serif, `--text-h2`) used to introduce a block of content within a page (e.g. "Akses Cepat", "Aktivitas Terbaru"). Reuse this instead of ad-hoc headings on any future page. `.section-heading__desc` (added Phase 4) is the optional muted one-liner underneath (`--text-small`, `--text-muted-on-light`). **Note:** the Recommendation sections that originally used this pattern (Materi, Bank Soal) were removed per the product pivot (§0.1) — no auto-recommendation features anywhere. `.section-heading__desc` itself stays as a generic component for any future non-recommendation subtitle use.

### 7.9 Card-stat icon slot (added Phase 2.1)

`.card-stat__header` (icon + label row) + `.card-stat__icon` (20px, `--color-rosy`) + `.card-stat__unit` (muted suffix after the big value, e.g. "/24 Modul", "%"). Extends the existing `.card-stat` — no new base component.

### 7.10 Learning-status badges (added Phase 3)

`.badge--selesai` (moss, same values as C4), `.badge--sedang` (rosy, same as C6/new), `.badge--belum` (neutral — `rgba(10,51,35,0.06)` bg + `--text-muted-on-light`, both already-existing tokens). Used wherever a module/soal/session has a belum-sedang-selesai lifecycle, not just Materi.

### 7.11 Catalog Controls — search, filter chips, sort (in `style.css` since Phase 4)

Shared by every browse/manage page (Materi, Bank Stimulus, Bank Soal) — this is the expected reuse path anticipated back in Phase 3.

- `.catalog-controls` — the flex-wrap bar holding search + filters + sort (`card-light`-wrapped section).
- `.catalog-search` / `.catalog-search__icon` / `.catalog-search__input` — icon-left search box, `--surface-card-tint` bg, `--color-rosy` focus ring.
- `.filter-group` — a row of `.filter-chip` toggle buttons; `.filter-group__label` is the small caption before a row (e.g. "Kategori", "Status"). `.filter-chip.is-active` = `rgba(211,150,140,0.14)` bg + `--color-rosy` border/text; inactive = transparent + `--border-on-light`.
- `.filter-groups-stack` (added Phase 5) — vertical stack wrapper when a page has *multiple* filter groups (Bank Stimulus has 4, Bank Soal has 3); each group inside is a `.filter-group-row` (label + `.filter-group` chip row).
- `.catalog-sort` / `.catalog-sort__label` / `.catalog-sort__select` — the sort `<select>`, same visual weight as a filter chip.
- `.recommended-grid` — generic 2-column grid for any "recommended items" section.
- `.catalog-layout` (added Phase 5) — the 2-column grid shell (list/grid + preview panel) used by Bank Stimulus and Bank Soal; collapses to 1 column at the Tablet breakpoint (see §7.12's breakpoint note).

Use these on every future catalog/library page instead of rebuilding search/filter/sort/layout markup.

### 7.12 Preview Panel (added Phase 4, promoted to `style.css` in Phase 5)

A detail panel that updates in place when a card/row is selected, instead of navigating to a separate page. Now a real shared component (`.preview-panel` / `.preview-panel__close` / `.preview-panel-backdrop` in `style.css`) — pages add their own content classes (e.g. `.stimulus-preview__title`, `.soal-preview__title`) on the same element.

- Structure: `<aside class="[page]-preview preview-panel card-light">` sibling to the main list/grid, inside `.catalog-layout`.
- **Desktop/Laptop** (≥1024px): `position: sticky` sidebar next to the list — **important:** this range includes exactly 1024px; the collapse below must trigger at `max-width: 1023px`, not `1024px`, or Laptop wrongly collapses one tier early (a real bug caught in Phase 5 — Bank Soal's spec explicitly requires Laptop to stay two-column).
- **Tablet** (768–1023px): `@media (max-width: 1023px)` — `.catalog-layout` drops to one column and `.preview-panel` becomes `position: static` (a normal block below the list).
- **Mobile** (<768px): `@media (max-width: 768px)` — fixed bottom-sheet, `transform: translateY(100%)` by default, `.is-open` slides it to `translateY(0)`. Pairs with `.preview-panel-backdrop` (dark rgba overlay, same tone as `.sidebar-overlay`) and `.preview-panel__close` (visible only at this breakpoint). Wire Escape-key, backdrop-click, and the close button to close.
- The panel's `.is-open` class toggle is harmless to call at every breakpoint — it only has a visual effect inside the mobile media query, so one `selectItem(id)` handler works everywhere without branching on screen size.
- Any page-specific grid-column-count breakpoints (e.g. Bank Stimulus's 4→3→2→1 card grid) must align to the same `1023px`/`768px` boundaries, or the grid and the preview panel visually disagree about which "tier" the page is in.

### 7.13 Dropdown Menu (added Phase 5)

`.dropdown-menu` + `.dropdown-menu__item` (+ `--danger` modifier) — a per-item action menu (e.g. Bank Soal's Preview/Edit/Duplikasi/Hapus on each question card). Same tokens as the topbar's profile/notification dropdowns (`--surface-card`, `--border-on-light`, `--shadow-lg`, `--radius-lg`), but a standalone class since it's used in page content, not shell chrome — the topbar itself was left untouched. Trigger button reuses `.btn-icon`; toggle `hidden` + `aria-expanded` on click, close on outside-click and Escape.

---

## 8. Layout & Breakpoints

Container widths: sidebar 280px/88px, content max-width 1440px (centers on ultra-wide), card grid gap `--space-5` (24px).

Breakpoint tiers:

| Tier | Range |
|---|---|
| Desktop | 1440px+ |
| Laptop | 1024px–1439px |
| Tablet | 768px–1023px |
| Mobile | 360px–767px |

```css
@media (max-width: 1024px) { /* laptop/small desktop: sidebar auto-collapses to icon rail */ }
@media (max-width: 768px)  { /* tablet: sidebar becomes off-canvas drawer */ }
@media (max-width: 480px)  { /* mobile: single column, bottom nav optional */ }
```

Requirements:
- Fully responsive, no horizontal scrolling at any tier.
- Sidebar becomes a drawer (off-canvas, toggled) on tablet/mobile — not just narrower.
- Card grids reflow automatically (auto-fit/auto-fill, never a fixed column count that overflows).
- Tables become horizontally scrollable inside their own container, or convert to a stacked card layout on mobile — the page itself never scrolls sideways.
- Images are responsive (`max-width: 100%`, intrinsic aspect ratio preserved).
- All interactive targets (buttons, icon buttons, checkboxes) are minimum 44×44px on touch tiers.
- Forms stack to a single column below tablet.
- Charts (Chart.js) resize via their container and redraw on breakpoint change.
- Desktop and mobile deliver the same experience and feature set — never a stripped-down "mobile version."

---

## 9. Accessibility

- Meet WCAG AA contrast for text against its background (verify beige-on-dark-green and dark-green-on-beige pairs, which this palette already satisfies; double-check Rosy-Brown-on-beige for small text — prefer larger/bold text or the moss-light variant when contrast is marginal).
- Full keyboard navigation: every interactive element reachable via Tab, logical tab order, no keyboard traps.
- Visible focus states on all interactive elements (the Rosy Brown focus glow already used on login inputs is the model — extend it to buttons, nav links, and custom checkboxes).
- Semantic HTML first: `<nav>`, `<main>`, `<header>`, `<button>`, `<label for>` — ARIA only fills gaps native semantics can't cover.
- Every form input has a real, associated `<label>`.
- Minimum touch target 44×44px.
- ARIA attributes (`aria-label`, `aria-expanded`, `aria-current`, `role`) where semantic HTML alone is insufficient (e.g. sidebar collapse toggle, drawer state).
- All meaningful images have descriptive `alt` text; purely decorative images/icons use `alt=""` or `aria-hidden="true"` (already the pattern used for the login page's decorative SVG icons).

---

## 10. Component Reuse Policy

Before creating any new component: check whether an equivalent already exists in this document and reuse it — buttons, cards, typography scale, spacing scale, shadows, radii. Never duplicate a component with slightly different ad-hoc styling; extend an existing variant or add a documented modifier instead.

**Claude must never:** invent new colors, invent new spacing values, invent new shadow values, invent new typography sizes/families, invent new button styles, invent new card styles — outside of what's defined in this document.

**Claude must always:** reuse existing components and tokens, follow this design system, ask before making major UI/architecture changes, keep code modular, prioritize maintainability.

If a page genuinely needs something this document doesn't cover, propose the addition to this document first (as a new token/variant), get confirmation, then use it — don't invent it inline in page CSS.

---

## 11. Standard Page Structure

Every dashboard-shell page follows this vertical hierarchy:

```
Topbar
  ↓
Breadcrumb
  ↓
Page Header (title + short description)
  ↓
Action Buttons (page-level primary/secondary actions)
  ↓
Main Content
  ↓
Footer (optional)
```

---

## 12. Performance

- Prefer `transform`/`opacity` animation over animating `top`/`left`/`width`/`height`.
- Lazy-load below-the-fold images (`loading="lazy"`).
- Avoid unnecessary DOM depth / wrapper divs.
- Keep JavaScript modular per page, with shared behavior only in `main.js`.
- Always reuse CSS variables from this document; never hardcode a duplicate value.

---

## 13. Pages Using This Design System

Login · Dashboard · Materi & Modul · Bank Soal Berbasis Budaya Aceh · Detail Soal (paket soal) · Smart Diagnostic · Dashboard Hasil · Profil — every page uses this system without exception.

**Bank Stimulus is no longer a separate page** — refactored into Bank Soal Berbasis Budaya Aceh per the product pivot (§0.1, `PIVOT_PLAN.md`). Its files remain on disk but are not part of the active navigation.

---

## 14. File & naming conventions

- One CSS var block (`:root`) shared across all pages — will live in `assets/css/style.css` (loaded on every page before the page-specific stylesheet).
- Page-specific CSS (`dashboard.css`, `materi.css`, …) only contains layout/composition for that page's unique sections — never redefines a color, radius, or shadow value.
- Class naming: kebab-case, component-first (`.card-stat__value`, not utility-soup). BEM-lite: block, `__element`, `--modifier`.
- JS stays modular per page (`dashboard.js`, `materi.js`, …) plus one shared `main.js` for shell behavior (sidebar toggle, topbar dropdown, shared modal/skeleton helpers).

### 14.1 Data/logic separation (added Phase 3, mandatory from here on)

Every page with dummy content follows this split — no exceptions, no arrays inline in HTML or in the page's own JS file:

- **`assets/data/<page>.js`** — pure data only. Exports plain arrays/objects (`export const materiData = [...]`) plus one `fetch<Page>()` function that returns a `Promise` resolving to that data (currently via a `setTimeout`-wrapped `Promise`, simulating network latency and demonstrating the loading-skeleton state). When the backend exists, only the body of `fetch<Page>()` changes to a real `fetch('/api/...')` call — every caller already awaits it, so no other file changes.
- **`assets/js/<page>.js`** — logic only: `import`s the data module, then handles rendering, search, filter, sort, pagination, and event listeners. Never hardcodes a data array. Split rendering into small named functions per section (`renderStats()`, `renderQuickAccess()`, `renderRecentActivity()`, `renderEmptyState()`, `renderSkeleton()`, …) — never one large render blob.
- Both files are loaded as **ES modules** (`<script type="module" src="assets/js/<page>.js">`), so `assets/js/<page>.js` can `import { fetch<Page>, ... } from '../data/<page>.js'`. `main.js` stays a classic script (shell behavior only, no data, no module needed).
- Flow: `fetch<Page>()` → resolved data → `render*()` functions. Established in `materi.js`/`dashboard.js`; follow the same shape for `stimulus.js`, `soal.js`, `profile.js`, and any page after.
