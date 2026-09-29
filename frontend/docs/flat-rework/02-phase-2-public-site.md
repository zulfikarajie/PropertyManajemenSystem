# Phase 2 — Public Site (DONE)

Master: `00-design-tokens.md`. Features/copy frozen — restyle only, no route/logic/data changes.
Status: code implemented 2026-09-19, `npm run typecheck` green, `npm run build` green (1680 modules).
Responsive tiers (2026-09-19, verified ux Mobile First; landing-domain queries returned no verified match, so the previously verified hero-testimonials-cta pattern + Mobile First apply): mobile-first base = small (title 24px, section h2 20px, card/section padding compact), `min-width: 480px` title 28px + CTA row, `min-width: 768px` tablet medium (title 32px, h2 22px, 2-col grids), `min-width: 1024px` desktop current (title 40px, h2 24px, 3-4 col grids). CTAs keep 18px/700 white-on-bronze + 44px targets on all tiers (README contrast rule); form text stays 14px (iOS zoom floor). Also fixed: availability submit was bronze/white at 16px → now inherits compliant 18px.
Skill basis: `ui-ux-pro-max` verified landing result — **hero-testimonials-cta**
(Hero > Problem statement > Solution overview > Testimonials carousel > CTA;
sticky hero CTA + post-testimonials CTA; carousel a11y: previous/next + pause
controls, stop rotation on focus/hover/reduced-motion, announce slide position).
Color strategy adapted to flat palette: bronze CTA (`#97764D`), never "vibrant"
gradient fills.

## Current state (read 2026-09-19)

All 5 public pages are thin placeholders (heading + one paragraph, `maxWidth
1200px`, old `brand-700`/`font-family-display` tokens). `PublicLayout` is
already flat (canvas bg, white header + line border, `#232D36` footer).
So Phase 2 is a contained token-swap + CTA pattern, not a rebuild.

## 2A. Page checklist

| Route / File | Preserve (do not change) | Restyle to flat | Done |
|---|---|---|---|
| `/` `HomePage.tsx` (+ `src/styles/home-sogo.css`) | Copy “Selamat Datang / Hotel Property Management System”, layout width | SOGO-based rework in flat tone (2026-09-19): hero (ink, eyebrow, WhatsApp bronze + Lihat Kamar) → overlapping availability card (check-in/out, dewasa/anak → WhatsApp deep link, error summary focus + inline `role=alert` per verified ux result) → Welcome (copy + visual panel + rating badge) → Rooms & Suites (3 active `roomTypeService` cards, IDR, facility chips) → Photos carousel (no autoplay; prev/next + `aria-live` position + keyboard arrows per hero-testimonials-cta carousel a11y) → Reserve banner. Excluded: Events, People Says, Restaurant Menu. No banned tokens in file | [x] |
| `/about` `AboutPage.tsx` | Copy “Tentang Kami …” | Same token swap; section spacing 16/24/32 rhythm | [x] |
| `/rooms` `RoomTypesPage.tsx` | Copy “Tipe Kamar …” | Same token swap; room cards (when built) = white + `1px #C7BBAB` + 8px, price ink, facility chips neutral flat | [x] |
| `/gallery` `GalleryPage.tsx` | Copy “Galeri …” | Same token swap; future carousel follows skill a11y rules (pause control, stop on focus/hover/reduced-motion, position announcement, keyboard prev/next) | [x] |
| `/contact` `ContactPage.tsx` | Copy “Hubungi Kami … WhatsApp …” | Same token swap; WhatsApp CTA = bronze fill, white ≥18px/bold text only (contrast rule, see README); contact rows flat with Lucide icons (`Phone`, `MapPin`, `Clock`), slate icons | [x] |

Token swap per page (mechanical):
- `var(--color-brand-700, #4A2C1A)` → `#232D36`
- `var(--font-family-display)` → `var(--font-family-sans)`
- `var(--color-secondary-text, #756A61)` → `#6B7881`
- Page wrapper keeps `maxWidth 1200px`, padding `24px`, canvas bg from layout.

## 2B. Shared public rules

- CTA buttons: bronze `#97764D` fill; text white only at ≥18px/bold, else `#232D36` on light fills. Hover `#7D6240`. Radius 8px.
- Cards: white + `1px #C7BBAB` + 8px, no shadow (per 00 §5).
- Icons: `lucide-react` (`Phone`, `MapPin`, `Clock`, `MessageCircle` for WhatsApp), `aria-hidden` decorative, 20px standard.
- Footer (already flat): keep `#232D36` + white text; links `#C7BBAB`, hover white.
- Responsive: stack to single column <768px; touch targets ≥44px; gutter 16px mobile / 24px desktop.

## Acceptance Phase 2

- `grep -ri "brand-700\|font-family-display\|4A2C1A\|756A61" src/pages/HomePage.tsx src/pages/AboutPage.tsx src/pages/RoomTypesPage.tsx src/pages/GalleryPage.tsx src/pages/ContactPage.tsx` → 0 hits.
- `npm run typecheck` green; `npm run build` green.
- Manual: 375px + 1280px; all 5 routes render on canvas with ink headings; WhatsApp CTA visible without scroll on Home/Contact; focus ring bronze on tab.
