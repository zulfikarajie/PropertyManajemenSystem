# Phase 5 — Admin & Activity (DONE)

Master: `00-design-tokens.md`. Features/copy/logic/RBAC/validation frozen — restyle only, no route/service/data changes.
Status: DONE — code implemented, `npm run typecheck` green, `npm run build` green (1692 modules), eslint 0 errors (pre-existing `any` warnings only).
Comprehensive re-run (2026-09-19): spec re-read + fresh skill searches (ux Empty States/No Results, style Minimalism & Swiss Style — both verified, domain/category/top-result fit) + file-by-file review of all 9 scope files against §5A/§5B: logic preserved everywhere (filters, validation, assign flow, not-found branches, modal create/edit with `key` remount, close→re-render refresh); no emojis; Lucide only with `aria-hidden`; inline errors retained next to fields; filter rows wrap; tables scroll inside wrapper only; `activityTypes.ts` untouched (flat tints component-side). Acceptance re-run: scope grep 0 hits, activity emoji grep 0 hits, typecheck + build green.
Manual checklist status: 375px/landscape click-through, bronze focus-ring tab order, and reduced-motion pass remain user-side verification (no render harness in repo).
Responsive rework (2026-09-19, verified ux Mobile First): `src/styles/admin-responsive.css` — mobile-first three tiers (mobile <768 small: h1 20px, sub/count 13px, page padding 16px, header buttons share row width; tablet ≥768 medium: h1 22px, padding 20px; desktop ≥1024 current 24px h1). Touch targets stay ≥44px and form text stays 14px on all tiers (checklist + iOS zoom floor). Applied to UserList/Form/Detail/Role, RoleList/Form, PermissionList, ActivityLog, ManagementPage.
Note (2026-09-19): `src/pages/management/ManagementPage.tsx` (+ `/dashboard/management` route, sidebar single-button entry) already exists — Pengguna/Jabatan/Akses tabs embed `UserListPage`/`RoleListPage`/`PermissionListPage` with permission-filtered tabs, `role=tablist` keyboard arrows, bronze active underline. Old users/roles/permissions routes stay as fallback. Phase 5 implementation covers the token/emoji/shared-component work below; the tab shell itself needs no change.

Skill basis: `ui-ux-pro-max` verified results —
**Search / No Results** (show 'No results' with suggestions — keep `Table` `emptyMessage` + result counts),
**Chip Collection Reflow** (filter rows `flex-wrap`, never clip),
**Table Handling** (`overflow-x-auto` wrapper, already in flat `Table`),
**Minimalism & Swiss Style** (light, low a11y risk, 1px borders, 150–200ms hover, no shadows).
Color strategy adapted to flat palette: ink `#232D36` headings, slate `#6B7881` meta, bronze `#97764D` row/back links; status via flat `Badge` fills (00 §1).

## Current state (read 2026-09-19)

All pages render with working logic (search/filter state, `useMemo` filtering, `react-hook-form`/zod or controlled forms, `ConfirmDialog` deletes, role assignment) but carry pre-flat tokens. Two pages (`UserFormPage`, `RoleFormPage`, plus filter selects in list pages) use **raw `<select>`/`<textarea>`** with legacy tokens instead of the shared flat shells.

| File | Old tokens found |
|---|---|
| `src/pages/users/UserListPage.tsx` | Custom status pill (`#FFF8F0/#FAF7F2`, `#4A2C1A/#A0958B`, `9999px`); View/Assign links `#6F4528`; h1 `font-family-display`/`#4A2C1A`; muted subtitle `#A0958B`; raw status `<select>` (`inputHeight`, `surface-input`, `taupe-light`, `radius-md`) |
| `src/pages/users/UserFormPage.tsx` | h1 display/`#4A2C1A`; labels `#756A61`; raw role/status `<select>`s (legacy input tokens) |
| `src/pages/users/UserDetailPage.tsx` | `h2`/`h1` `#4A2C1A` display; Back links `#6F4528`; item labels `#756A61` |
| `src/pages/users/UserRolePage.tsx` | `h2` `#4A2C1A`; Back link `#6F4528`; h1 display; info card `#FFFCF8`/`#E5DCD1`/`16px`; captions `#A0958B`; values `#2D241F`; Role label `#756A61` |
| `src/pages/roles/RoleListPage.tsx` | Custom status pill (same as users); Edit link `#6F4528`; h1 display; muted subtitle; raw status `<select>` (legacy input tokens) |
| `src/pages/roles/RoleFormPage.tsx` | h1 display; labels `#756A61`; raw `<textarea>` (legacy input tokens) |
| `src/pages/permissions/PermissionListPage.tsx` | h1 display/`#4A2C1A`; subtitle `#756A61` |
| `src/pages/activity/ActivityLogPage.tsx` | Emoji stats (`📋`, `💰`) + legacy `color-primary/success` vars; h1 `font-family-display`/`color-primary-text` |
| `src/components/shared/ActivityFeed.tsx` (used by ActivityLog) | Rows `#FFFCF8`/`#E5DCD1`; category dot uses `activityCategoryColors` (`#5C7FA3/#6F4528/#4F8A5B/#A0958B`); title `#2D241F`; time/empty `#A0958B`; desc `#756A61`; View link `#6F4528` |

`src/constants/activityTypes.ts` (category color map) stays untouched — map to flat tints component-side (see 5B).

## 5A. Page checklist

| Route / File | Preserve (do not change) | Restyle to flat | Done |
|---|---|---|---|
| List `users/UserListPage.tsx` | Search/status-filter state, `useMemo` filtering, `columns`, View/navigate targets, result count, empty state | Custom status pill → flat `Badge` (active/success, inactive/default); View/Assign links → bronze; title ink sans; subtitle/count slate; raw status `<select>` → shared flat `Select` (same options/state) | [x] |
| Form `users/UserFormPage.tsx` | Controlled `formData`, role/status options, submit flow, validation messages | Title ink sans; labels slate (keep `<label>`s); raw `<select>`s → shared flat `Select` (same value/onChange) | [x] |
| Detail `users/UserDetailPage.tsx` | `getById` lookup, not-found branch, info rows, Back targets | h1/h2 ink sans; Back links bronze + `ArrowLeft` 14px `aria-hidden`; labels slate, values ink | [x] |
| Role `users/UserRolePage.tsx` | `getById`, role select state, assign flow, not-found branch | Info card white + `1px #C7BBAB` + 8px; captions slate; values ink; Back link bronze + `ArrowLeft`; Role label slate (or shared `Select` if drop-in safe, else retoken raw select to flat values) | [x] |
| List `roles/RoleListPage.tsx` | Search/status-filter state, `columns`, Edit/delete flows, count, empty state | Same as user list: pill → `Badge`; Edit link bronze; title ink sans; raw status `<select>` → shared flat `Select` | [x] |
| Form `roles/RoleFormPage.tsx` | Controlled form, permission checkbox list, submit flow | Title ink sans; labels slate; raw `<textarea>` → flat values (`#FFFFFF`, `1px #C7BBAB`, 8px, 44px+ min-height) or shared shell if available; permission checkboxes keep logic, labels ink | [x] |
| List `permissions/PermissionListPage.tsx` | Grouped display logic | Title ink sans; subtitle slate | [x] |
| Log `activity/ActivityLogPage.tsx` | Category/date filters, `ActivityFeed` props, stats math | Title ink sans; stats emoji → Lucide (`ClipboardList`, `Wallet`, …) 20px slate/bronze via `StatsCard` icon slot; filter row `flex-wrap`; feed itself is shared `ActivityFeed` (see 5B) | [x] |

Token swap (mechanical):
- `#4A2C1A` / `var(--color-primary-text)` (headings) → `#232D36`
- `var(--font-family-display)` → `var(--font-family-sans)`
- `#756A61` / `#A0958B` (meta) → `#6B7881`
- `#2D241F` → `#232D36`
- `#6F4528` (links) → `#97764D`
- `#FFFCF8` → `#FFFFFF`; `#FFF8F0`/`#FAF7F2`/`#F5F0E8` → `#FFFFFF`/`#EEEDE9`/`#F2F0EB` per surface role
- `#E5DCD1` / `taupe-light #DED3C6` → `#C7BBAB`
- `radius-md 12px` / `16px` card radius → `8px`
- `inputHeight 52px` / `inputPadding 16px` → flat `44px` / `12px 14px`
- `surface-input #FAF7F2` → `#FFFFFF`
- `activityCategoryColors` display values → flat cycle `['#97764D', '#232D36', '#6B7881', '#C7BBAB']` by category index (labels always adjacent — never hue alone)

## 5B. Shared rules (from 00)

- `ActivityFeed.tsx`: rows white + `1px #C7BBAB` + 8px; avatar dot flat cycle + white initial (keep initial-letter concept); title ink; time slate; desc slate; View link bronze; empty state slate. No logic change.
- `StatsCard` icon rule: pages pass Lucide `ReactNode` (20px, slate or bronze), never emoji strings. Shell unchanged.
- Raw `<select>`/`<textarea>` → shared flat `Select` where props align (`options/value/onChange/label`); otherwise retoken inline to flat values. No validation/logic change.
- Status pills: delete custom pill spans, use flat `Badge` (table covers the rule — keep `Badge` usage as-is elsewhere).
- Icons: `lucide-react` only (`Plus` for New buttons, `ArrowLeft` 14px for back links, stat icons); decorative `aria-hidden`.
- Motion: `150ms ease` hover only; `prefers-reduced-motion` respected (global).
- Responsive: filter rows `flex-wrap`; tables scroll inside wrapper only; single column <768px.

## Acceptance Phase 5

- `grep -ri "font-family-display|4A2C1A|756A61|6F4528|FFFCF8|E5DCD1|2D241F|A0958B|FFF8F0|FAF7F2|inputHeight|surface-input|taupe-light|radius-md" src/pages/users/ src/pages/roles/ src/pages/permissions/ src/pages/activity/ src/components/shared/ActivityFeed.tsx` → 0 hits.
- No emoji in scope: `grep -r "📋|💰|🔵|🟢|🔴|⚫" src/pages/activity/` → 0 hits.
- `npm run typecheck` green; `npm run build` green; eslint clean on changed files.
- Manual: 375px + 1280px; search/filter/assign/create/update/delete flows click-through unchanged; tables scroll inside wrapper only; focus ring bronze on tab.
