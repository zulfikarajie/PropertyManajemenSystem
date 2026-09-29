# Flat Design Rework — Docs Index

> Scope: rework ALL UI to **flat design**, features frozen (no logic/RBAC/validation changes).
> Palette (strict): `#EEEDE9` · `#C7BBAB` · `#6B7881` · `#232D36` · `#97764D`
> Font: **sans-only** (Inter). No serif display, no Poppins/Playfair.
> Style basis: `ui-ux-pro-max` verified result — **Minimalism & Swiss Style** (light, low a11y risk, 1px borders, subtle 200–250ms hover, no shadows).

## Palette roles

| Token | Hex | Usage |
|---|---|---|
| `canvas` | `#EEEDE9` | Page background everywhere (PMS + public + auth) |
| `surface` | `#FFFFFF` | Card / header / modal / input fill |
| `line` | `#C7BBAB` | All borders/dividers: `1px solid #C7BBAB`. Muted surface tint via `#C7BBAB @ 15–25%` |
| `slate` | `#6B7881` | Secondary text, icons, placeholders, table headers |
| `ink` | `#232D36` | Primary text, sidebar fill, primary button fill, headings |
| `bronze` | `#97764D` | Accent only: active nav, links, focus ring, CTA highlight, KPI value |

Contrast notes (must verify in QA):
- `#232D36` on `#EEEDE9` / `#FFFFFF` — PASS (primary text).
- `#6B7881` on `#FFFFFF` — ~4.6:1 PASS for secondary text; on `#EEEDE9` borderline — use for large/secondary only, never small critical text.
- `#FFFFFF` on `#97764D` — ~3.5:1 FAIL for normal text → bronze buttons use `#232D36` text or `#FFFFFF` only ≥18px/bold; primary buttons use `#232D36` fill + white text.
- Focus ring: `2px solid #97764D`, offset 2px, always visible.

## Flat rules (global)

1. No neumorphism: delete all `--shadow-neumo-*`, `--radius-neumo`, `--color-bg-neumorphic`, `--color-surface-neumorphic/raised/recessed`.
2. Shadows: `none` everywhere. Exception: modal/dropdown `0 1px 2px rgba(35,45,54,.12)` + `1px solid #C7BBAB`.
3. Radius: `8px` cards/buttons/inputs/modals, `4px` badges/small chips, `999px` pills only.
4. Borders: every elevated surface gets `1px solid #C7BBAB`.
5. No gradients, no emboss, no `scale()` press. Press = `opacity .85` or darken fill.
6. Transitions: `150ms ease` (hover), `200ms ease` (modal/fade). Respect `prefers-reduced-motion`.
7. Tables: `overflow-x-auto` wrapper (ux-guideline), flat header `#FFFFFF` + bottom `1px solid #C7BBAB`, zebra `#FFFFFF` / `#EEEDE9`, hover `#C7BBAB @ 25%`.
8. Forms: `<label>` always (no placeholder-only), `44px` height, `1px solid #C7BBAB`, error `1px solid #B42318` + message.
9. Icons: `lucide-react` only. No emojis as icons. Decorative icons `aria-hidden`.

## Phases

| Phase | Doc | Pages / scope | Status |
|---|---|---|---|
| 00 | `00-design-tokens.md` | Master tokens, Tailwind + CSS var map, component rules | DONE (this batch) |
| 0+1 | `01-phase-0-1-foundation-auth-layouts.md` | Tokens impl + shared components + layouts + auth (Login/Register/Forgot/Reset/Change/NotFound) | DONE — code implemented, typecheck+build green |
| 1.5 | `01-5-phase-1-5-auth-split.md` | Split-screen auth rework (Login/Register/Forgot/Reset) on existing tokens | DONE — code implemented, typecheck+build green, eslint clean |
| 2 | `02-phase-2-public-site.md` | Home, About, RoomTypes(public), Gallery, Contact | DONE — code implemented, typecheck+build green |
| 3 | `03-phase-3-dashboard-reservations.md` | Dashboard, ReservationList/Form/Detail/Calendar | DONE — typecheck+build green, eslint 0 errors |
| 4 | `04-phase-4-rooms.md` | RoomTypeList/Form, RoomList/Form | DONE — typecheck+build green, eslint 0 errors (+ toggle-only sidebar dropdowns + all-module CRUD modal panels) |
| 5 | `05-phase-5-admin-activity.md` | UserList/Form/Detail/Role, RoleList/Form, PermissionList, ActivityLog | DONE — typecheck+build green, eslint 0 errors |
| 6 | `06-phase-6-finance.md` | Sales, InvoiceList/Form/Detail, Report, Expenses + responsive tiers + sidebar rail | DONE — typecheck+build green, eslint 0 errors |
| 7 | `07-phase-7-polish-qa.md` | Responsive + a11y + contrast audit + cleanup | PLANNED |

Per agreement: phases are detailed + implemented one batch at a time.
Phase 6 (`06-phase-6-finance.md`) is implemented. Remaining: Phase 3 reservations (PARTIAL) and Phase 7 (`07-phase-7-polish-qa.md`, global responsive + a11y + contrast audit).

## How to work a phase

1. Read `00-design-tokens.md` (master) + the phase doc.
2. Keep all logic/hooks/services/routes identical — restyle only.
3. Per file: remove `neumo` vars/shadows → apply flat tokens → verify `npm run typecheck`.
4. Check off boxes in the phase doc.
