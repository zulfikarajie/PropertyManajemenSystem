# Phase 4 — Rooms (DONE)

Master: `00-design-tokens.md`. Features/copy/logic/RBAC/validation frozen — restyle only, no route/service/data changes.
Status: DONE — code implemented, `npm run typecheck` green, `npm run build` green (1690 modules), eslint 0 errors (pre-existing `any` warnings only).
Skill basis (applied): **Search / No Results**, **Chip Collection Reflow**, **Table Handling**, **Minimalism & Swiss Style** (see header).

Skill basis: `ui-ux-pro-max` verified results —
**Search / No Results** (dead ends frustrate users; show 'No results' with suggestions — flat `Table` `emptyMessage` + slate result counts already comply, keep them),
**Chip Collection Reflow** (filter rows must `flex-wrap`, never clip — both list pages already wrap, keep it),
**Table Handling** (`overflow-x-auto` wrapper, already in flat `Table`),
**Minimalism & Swiss Style** (light, low a11y risk, 1px borders, 150–200ms hover, no shadows).
Color strategy adapted to flat palette: ink `#232D36` headings/links-as-bronze `#97764D` for row links; status via flat `Badge` fills (00 §1).

## Current state (read 2026-09-19)

All 4 pages render with working logic (search/filter state, `useMemo` filtering, zod + `react-hook-form` forms, `ConfirmDialog` deletes) but carry pre-flat tokens. Shared shells (`Table`, `Button`, `Badge`, `Card`, `Input`, `Select`, `ConfirmDialog`) are already flat — no shared changes needed.

| File | Old tokens found |
|---|---|
| `src/pages/room-types/RoomTypeListPage.tsx` | `#4A2C1A`, `font-family-display`, `#756A61`, `#6F4528` (row link) |
| `src/pages/room-types/RoomTypeFormPage.tsx` | `#4A2C1A`, `font-family-display`, `#6F4528` (back link) |
| `src/pages/rooms/RoomListPage.tsx` | `#4A2C1A`, `font-family-display`, `#756A61`, `#6F4528` (row link) |
| `src/pages/rooms/RoomFormPage.tsx` | `#4A2C1A`, `font-family-display`, `#6F4528` (back link) |

No emojis in scope. No charts. No new deps.

## 4A. Page checklist

| Route / File | Preserve (do not change) | Restyle to flat | Done |
|---|---|---|---|
| List `room-types/RoomTypeListPage.tsx` | Search/status-filter state, `useMemo` filtering, table `columns` (name/desc/capacity/rate/facilities/status/actions), Edit/Delete + `ConfirmDialog` flow, `navigate` targets, result count, `Table` empty state | Title ink `#232D36` sans 700; subtitle + count slate `#6B7881`; row link `#6F4528`→bronze `#97764D`; description cell slate; facility `Badge`s as-is (flat); filter bar keeps `flex-wrap`; `+ New Room Type` keeps flat primary `Button` | [x] |
| Form `room-types/RoomTypeFormPage.tsx` | `isEdit` flow, zod schema + `react-hook-form`, `service.create/update/delete`, `ConfirmDialog`, `navigate` targets, grid layout | Title ink sans; back link `#6F4528`→bronze + `ArrowLeft` 14px `aria-hidden`; form grid + `Input`/`Select`/`Button` shells as-is (flat); action bar keeps danger/outline/primary flat | [x] |
| List `rooms/RoomListPage.tsx` | Search/type/status-filter state, `useMemo` filtering, `getTypeLabel`, table `columns`, Edit/Delete + `ConfirmDialog` flow, `navigate` targets, rooms count | Same token swap as type list; status `Badge` map as-is (success/warning/danger flat); `+ New Room` keeps flat primary `Button` | [x] |
| Form `rooms/RoomFormPage.tsx` | `isEdit` flow, zod schema + `react-hook-form`, `service.create/update/delete`, `ConfirmDialog`, `navigate` targets | Same token swap as type form; back link bronze + `ArrowLeft` 14px `aria-hidden` | [x] |

Token swap (mechanical, all 4 files):
- `#4A2C1A` → `#232D36`
- `var(--font-family-display)` → `var(--font-family-sans)`
- `#756A61` → `#6B7881` (already the flat value — normalize to `#6B7881` literal or keep; grep must show 0 `756A61`)
- `#6F4528` (links) → `#97764D`, hover `#7D6240` (global `a:hover` already does this; row links keep inline bronze)

## 4B. Shared rules (from 00 — no shared edits expected)

- Cards: white + `1px #C7BBAB` + 8px, no shadow (page `Card` wrappers as-is).
- Tables: flat `Table` as-is; empty state + result count satisfy No-Results guideline — keep both.
- Filters: `Input`/`Select` flat 44px; rows `flex-wrap`; touch targets ≥44px.
- Status: flat `Badge` fills only (active/success, inactive/warning, maintenance/warning, danger for inactive rooms — keep existing maps, they are flat).
- Forms: labels always (already via `Input`/`Select` `label` props + zod inline errors) — no change.
- Destructive: `Button` danger + `ConfirmDialog` destructive as-is.
- Icons: `lucide-react` only if icons are added (`Plus` for New buttons, `ArrowLeft` for back links — optional, keep text-only if preferred); decorative icons `aria-hidden`.
- Motion: `150ms ease` hover only; `prefers-reduced-motion` respected (global).
- Responsive: `auto-fit minmax(250px, 1fr)` form grids kept; tables scroll inside wrapper only; single column <768px.

## Acceptance Phase 4

- `grep -ri "font-family-display|4A2C1A|756A61|6F4528" src/pages/room-types/ src/pages/rooms/` → 0 hits (verified 2026-09-19).
- `npm run typecheck` green; `npm run build` green (1684 modules); eslint 0 errors (2 pre-existing `any` warnings in form `service.create` calls, untouched).
- Sidebar (`src/layouts/PMSLayout.tsx` + `src/styles/pms-layout.css`): exclusive accordion — Kamar, Reservasi, Manajemen, Keuangan, Aktivitas open on main-button click (navigates to first permitted child) and close the previous; highlight is route-driven and exclusive (exact Dashboard match; longest-prefix child match, so Kalender no longer double-lights Daftar Reservasi); `aria-expanded`/`aria-controls` + `ChevronDown` rotate 200ms + mount fade (reduced-motion off); hover wash on links; order Dashboard, Reservasi, Keuangan, Kamar, then divider + bottom-pinned Manajemen, Aktivitas; mobile groups stack vertically in horizontal scroll nav.
- CRUD modal panels (all modules, form routes kept as fallback): shared `RoomTypeForm`, `RoomForm`, `UserForm`, `UserRoleForm`, `RoleForm`, `ReservationFormPanel` (`id?/onSuccess/onCancel`); thin route wrappers preserved; list/detail Add/Edit open flat `Modal` (Esc/overlay-close, `key` remount per target, close re-renders fresh from service); invoice create now persists via `invoiceService.create` inside modal; expense create wrapped in modal (dropped `navigate(0)` reload); deletes were already `ConfirmDialog` modals.
- Manual: 375px + 1280px; search/filter/delete/create/update flows click-through unchanged; tables scroll inside wrapper only; focus ring bronze on tab.
