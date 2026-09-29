# Phase 3 — Dashboard + Reservations (DONE)

Master: `00-design-tokens.md`. Features/copy/logic/RBAC/validation frozen — restyle only, no route/service/data changes.
Status: DONE — `npm run typecheck` green, `npm run build` green (1694 modules), eslint 0 errors.
Comprehensive rework (2026-09-19, verified chart Compare Categories): List + Calendar rebuilt around `reservation-boards.css` chart/filter boards; Form/Detail/ReservationCard/ReservationForm/RoomSelector/CalendarView token-swapped per §3B (CalendarView: bronze today ring, flat event fills with code labels, 8px cells + 2px gaps). Acceptance re-run: token grep 0 hits, emoji grep 0 hits, typecheck + build green.

Skill basis: `ui-ux-pro-max` verified results —
**Hotel/Hospitality product** (Revenue Management Dashboard; Warm neutrals + Gold adapted to flat palette, never gold-gradient fills),
**Trend Over Time chart** (Line Chart, low a11y risk; data table + trend summary fallback; never hue alone),
**Table Handling ux-guideline** (`overflow-x-auto` wrapper, already in flat `Table`; filter chips `flex-wrap`, never clipped),
**Minimalism & Swiss Style** (light, low a11y risk, 1px borders, 150–200ms hover, no shadows).
Color strategy adapted to flat palette: ink `#232D36` headings, slate `#6B7881` meta, bronze `#97764D` accent/links/focus only; status via flat `Badge` fills (00 §1), never white-text-on-fill.

## Current state (read 2026-09-19)

All 5 pages render but carry pre-flat tokens. `Card`/`StatsCard`/`Table`/`Button`/`Badge` shells are already flat
(`Card raised` prop is accepted-but-ignored, renders flat). The old tokens live in page files + 4 shared
components they compose. So Phase 3 is a token-swap + emoji→Lucide pass over pages + their direct shared deps.

| File | Old tokens found |
|---|---|
| `src/pages/DashboardPage.tsx` | `font-family-display`, `color-primary-text/secondary-text/primary/success/warning/error`, `surface-secondary`, `taupe-dark`, `green/yellow/red-light`, `radius-neumo`, `shadow-neumo-btn/light/dark`; emoji `🏨📋💰⏳📊📈📄🕐💡` |
| `src/pages/reservations/ReservationListPage.tsx` | `#4A2C1A`, `font-family-display`, `#756A61`, `#A0958B`, `#6F4528`, `#9A6A32`, `#4F8A5B`, `#C85C5C`; emoji stats `📋🔵🟢⚫🔴💰` |
| `src/pages/reservations/ReservationFormPage.tsx` | `#4A2C1A`, `font-family-display` (shell only; form body is shared `ReservationForm`) |
| `src/pages/reservations/ReservationDetailPage.tsx` | `#4A2C1A`, `font-family-display`, `#756A61`, `#A0958B`, `#2D241F`, `#FFFCF8`, `#E5DCD1` |
| `src/pages/reservations/ReservationCalendarPage.tsx` | `#4A2C1A`, `font-family-display`, `#756A61`; emoji stats `📋🏨🟢🔴`, `#6F4528`, `#4F8A5B`, `#C85C5C` |
| `src/components/shared/ReservationCard.tsx` (used by List) | `#2D241F`, `#756A61`, `#4A2C1A` |
| `src/components/shared/ReservationForm.tsx` (used by Form page) | `#6F4528`, `#E5DCD1`, `#FFF8F0`, `#FFFCF8`, `#2D241F`, `#756A61` |
| `src/components/shared/RoomSelector.tsx` (used by Form) | `#4A2C1A`, `#6F4528`, `#E5DCD1`, `#FFF8F0`, `#FFFCF8`, `#F5F0E8`, `#2D241F`, `#756A61` |
| `src/components/shared/CalendarView.tsx` (used by Calendar) | `#9A6A32`, `#4F8A5B`, `#756A61`, `#C85C5C`, `#4A2C1A`, `font-family-display`, `#E5DCD1`, `#FFFCF8`, `#F5F0E8`, `#2D241F`, `#A0958B` |

Out of scope (later phases): `SalesChart`, `ExpenseChart`, `InvoiceForm`, `ActivityFeed`.

## 3A. Page checklist

| Route / File | Preserve (do not change) | Restyle to flat | Done |
|---|---|---|---|
| Dashboard `DashboardPage.tsx` (+ `src/styles/dashboard-modern.css`) | All data logic (`reservationService`/`salesService`/`invoiceService`/`roomService`/`expenseService`, `useMemo` filters, `today` const, occupancy math, table `columns`, quick-action routes) | TailwindAdmin Modern rework in flat tone (2026-09-19, trimmed + rearranged same day per request): equal-width quick-action button list horizontal at top → TopCards auto-marquee strip (6 stat links, pause on hover/focus, reduced-motion static) → RevenueUpdate grouped bars (Mingguan/Harian select, bronze/slate, legend + text summary, `role=img`) + right column beside charts (composition donut at half chart height, small occupancy card, small invoice card with row tiles) → bottom: recent-reservations table full width only (sales card removed per request; tight 12px card padding + compact table cells). Chart bars + labels share one horizontal scroller; PMS shell responsive (`src/styles/pms-layout.css`: sidebar → top horizontal nav ≤768px). Removed: welcome banner, turnover KPI (Omzet Bulan Ini), recent-activity timeline, revenue-by-source. Animations: marquee, fade-up stagger, count-up (rAF, reduced-motion aware), bar/donut grow-draw. No banned tokens or emojis in file; Lucide only | [x] |
| List `reservations/ReservationListPage.tsx` | Filter/search state, `service.getAll()` + `getRoomsByReservationId`, grid layout, empty state, create `Modal` | Reworked 2026-09-19: 6-stat grid (incl. Total Revenue — deleted) replaced by left `Distribusi Reservasi` horizontal bar card (Total/Reserved/Checked In/Checked Out/Cancelled, flat fills, direct labels + values, `role="img"` summary, mount grow, `reservation-boards.css`); right `Cari & Filter` card (labeled Search/Source/Status + count, stacked); equal heights via grid stretch, 3fr/2fr ≥1024px, stacked below; title ink sans, subtitle slate; create `Modal` unchanged | [x] |
| Form `reservations/ReservationFormPage.tsx` | `isEdit` flow, `service.create/update`, `reservationCode` gen, `navigate` targets, `ReservationForm` props | Thin route wrapper around shared `ReservationFormPanel` (modal pattern); shell token swap (title ink sans, `ArrowLeft` Back) | [x] |
| Detail `reservations/ReservationDetailPage.tsx` | `getById`/`getReservationRooms`, check-in/out/cancel service calls + `ConfirmDialog` flows, status `Badge` map, nights math, edit `Modal` | Token swap (captions slate, values ink, rows white + `1px #C7BBAB` + 8px, rate ink, `ArrowLeft` Back); action bar + flows unchanged | [x] |
| Calendar `reservations/ReservationCalendarPage.tsx` | `filterRoom`/`filterStatus` state, room/status selects, `CalendarView` props | Same boards layout as List (status chart + stacked Room/Status filter + active-rooms count); emoji stats grid removed; title ink sans; `CalendarView` flat per §3B | [x] |

Token swap (mechanical, pages + §3B shared):
- `#4A2C1A` / `var(--color-brand-700…)` / `var(--color-primary)` (text) → `#232D36`
- `var(--font-family-display)` → `var(--font-family-sans)`
- `#756A61` / `#A0958B` / `var(--color-secondary-text/muted-text…)` → `#6B7881`
- `#2D241F` → `#232D36`
- `#FFFCF8` → `#FFFFFF`; `#F5F0E8` → `#EEEDE9` (canvas) or `#F2F0EB` (zebra/muted)
- `#E5DCD1` → `#C7BBAB`
- `#6F4528` / `#9A6A32` / `#4F8A5B` / `#C85C5C` as text/icon colors → ink/slate/bronze (status meaning moves to flat `Badge`)
- `var(--radius-neumo…)` → `8px`; `var(--shadow-neumo-*)` → `none` (keep `pop` on modal/dropdown only)
- `var(--color-surface-secondary/neumorphic…)` / `var(--color-green/yellow/red-light)` → `#FFFFFF` / `#EEEDE9` / `#F2F0EB` + `1px #C7BBAB`

## 3B. Shared deps (in scope — pages compose them)

- `ReservationCard.tsx`: title ink, guest/meta slate, footer total ink; keep `Card hover` (border-bronze, no lift); status stays flat `Badge`.
- `ReservationForm.tsx` + `RoomSelector.tsx`: selected border `#97764D` (not `#6F4528`); unselected `#C7BBAB`; option bg `#FFFFFF`, unavailable `#EEEDE9`; room number ink, type slate; no `FFF8F0/FFFCF8/F5F0E8` fills.
- `CalendarView.tsx`: header ink sans; weekday slate + bottom `1px #C7BBAB`; day cells white / `#EEEDE9` out-of-month, `1px #C7BBAB`, radius 8px; today = bronze border + ink text (not filled); event dots use flat status fills + text labels (chart rule: never hue alone); keep logic (month nav, filters, `onDateClick`) identical.
- `StatsCard` icon rule: pages pass Lucide `ReactNode` (20px, slate or bronze), never emoji strings. `StatsCard` shell itself needs no change.
- React stack rules (verified `layout card list`): composition via `children` (keep `Card>{content}</Card>`), generic list typing kept, stable `key={item.id}` (never index) for stats/breakdown/room rows.

## 3C. Shared PMS rules (from 00)

- Cards: white + `1px #C7BBAB` + 8px, no shadow; `hover` → border bronze only.
- Tables: flat `Table` as-is (`overflow-x-auto` wrapper per ux-guideline); no page-level table CSS.
- Filters: `Input`/`Select` flat 44px + labels; filter rows `flex-wrap`; touch targets ≥44px.
- Status: flat `Badge` fills only; calendar dots pair color + text label.
- Icons: `lucide-react` only, no emojis; decorative `aria-hidden`.
- Motion: `150ms ease` hover / `200ms ease` modal; `prefers-reduced-motion` respected (global).
- Responsive: grids `auto-fit/auto-fill minmax(...)` kept; single column <768px; content max 1200–1400px as today; gutters 16px mobile / 24px desktop.
- Charts (dashboard revenue-per-source bars): keep div-bar composition (no new deps); add `role="img"` + `aria-label` summary + legend where missing, mirroring `SalesChart` pattern; trend reading order text-first, never color-only.

## Acceptance Phase 3

- `grep -ri "font-family-display|radius-neumo|shadow-neumo|surface-secondary|surface-neumorphic|green-light|yellow-light|red-light|taupe-dark|4A2C1A|2D241F|FFFCF8|6F4528" src/pages/DashboardPage.tsx src/pages/reservations/ src/components/shared/ReservationCard.tsx src/components/shared/ReservationForm.tsx src/components/shared/RoomSelector.tsx src/components/shared/CalendarView.tsx` → 0 hits.
- No emoji in scope: `grep -r "🏨|📋|💰|⏳|📊|📈|📄|🕐|💡|🔵|🟢|⚫|🔴|🏨" src/pages/DashboardPage.tsx src/pages/reservations/` → 0 hits.
- `npm run typecheck` green; `npm run build` green.
- Manual: 375px + 1280px; dashboard grids stack without horizontal scroll (tables scroll inside wrapper only); filters wrap; focus ring bronze on tab; reduced-motion → no width-transition excess; check-in/out/cancel flows click-through unchanged.
