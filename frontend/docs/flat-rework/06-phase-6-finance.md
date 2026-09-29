# Phase 6 — Finance Responsive + Collapsible Sidebar (DONE)

Master: `00-design-tokens.md`. Features/copy/logic/RBAC/validation frozen — restyle only, no route/service/data changes.
Status: DONE — code implemented, `npm run typecheck` green, `npm run build` green (1693 modules), eslint 0 errors (pre-existing `any` warnings only).
Scope change (2026-09-19, user request): Phase 6 now covers (A) responsive tiers for all finance pages/layouts/buttons (mobile fit + smaller, tablet same treatment) and (B) a collapsible sidebar with slim icon rail on mobile, tablet, AND web view. The mechanical token swap below still applies unchanged.

Skill basis: `ui-ux-pro-max` verified results —
**Mobile First** (base = mobile styles, enhance via `min-width` breakpoints; touch targets ≥44px; form text stays 14px),
**Table Handling** (`overflow-x-auto` wrapper, already in flat `Table`),
**Search / No Results** (keep `Table` `emptyMessage` + result counts),
**Trend Over Time chart** (direct series labels + text summary, never hue alone; table fallback kept),
**Sticky Navigation** (fixed/overlay nav must not obscure content — rail/drawer never cover page content),
**Keyboard Navigation** (tab order follows visual order, every control keyboard-reachable with visible focus, no traps),
**Minimalism & Swiss Style** (light, low a11y risk, 1px borders, 150–200ms hover, no shadows).
(No verified drawer/collapse match after retry — drawer behavior below follows general WAI-ARIA disclosure/dialog guidance: single toggle, `aria-expanded`, Esc closes, focus returns to the toggle.)
Color strategy adapted to flat palette: ink `#232D36` headings/values, slate `#6B7881` meta, bronze `#97764D` links/accents; chart series in flat tints with adjacent text labels; status via flat `Badge`/status fills (00 §1).

## Current state (read 2026-09-19)

Pages render with working logic (period filters, `useMemo` aggregations, invoice status flows, inline create forms already wrapped in `Modal`) but carry pre-flat tokens. Shared shells (`Table`, `Button`, `Badge`, `Card`, `Input`, `Select`, `InvoiceStatusBadge`) are already flat.

| File | Old tokens found |
|---|---|
| `src/pages/finance/SalesPage.tsx` | h1 `font-family-display`/`primary-text`; period pills (`radius 12px`, `primary`/`taupe-dark`/`surface-default`/`surface-raised`); stats icon colors `success/error/primary/info` vars; h3 `primary-text`; source dots from `reservationSourceColors` legacy hex |
| `src/pages/finance/ReportPage.tsx` | Same period pills; same stats colors; summary rows (`taupe-dark` dividers, `secondary-text`, `success/warning/error`, `primary-text`); invoice tiles (`green/yellow/red-light`, `radius 12px`); h1/h3 display |
| `src/pages/finance/InvoiceListPage.tsx` | h1 display; invoiceNumber `primary`; raw status `<select>` (`radius-neumo`, `taupe-dark`, `surface-default`, `shadow-neumo-input`); count `secondary-text` |
| `src/pages/finance/InvoiceDetailPage.tsx` | h2/h1 `primary-text`/display; captions `muted-text`; item dividers `taupe-dark`; desc `primary`; qty/totals `secondary-text`/`primary-text` |
| `src/pages/finance/InvoiceFormPage.tsx` | Back link `primary`; h1 display; reservation link (`cream-50`, `primary`, `radius 12px`); info card `#E8F5E9` green fill |
| `src/pages/finance/ExpensesPage.tsx` | h1 display/`primary-text`; category `<select>` (`taupe-dark`, `surface-default`); count `secondary-text`; total `primary-text` |
| `src/components/shared/SalesChart.tsx` | Empty `muted-text`; month label `secondary-text`; sales bar `blue-400 #60A5FA` + `shadow-neumo-light`; expense bar `warning #C58A3A`; value `muted-text`; legend `success/warning` + shadows |
| `src/components/shared/ExpenseChart.tsx` | Empty `muted-text` + `surface-neumorphic` + `radius-neumo` + `shadow-neumo-dark`; dots/fills from `expenseCategoryColors` legacy hex; label/track/divider (`primary-text`, `surface-secondary`, `taupe-dark`) + bar shadows |
| `src/components/shared/InvoiceForm.tsx` | Subtotal/discount `#756A61`; total `#4A2C1A` |

`src/components/shared/ExpenseForm.tsx` and `src/components/shared/InvoiceStatusBadge.tsx` are already flat (shells only) — no change expected; covered by acceptance grep.
`src/constants/reservationSourceColors` / `expenseCategoryColors` stay untouched — map to flat tints component-side (labels always adjacent, never hue alone).

## 6A. Page checklist

| Route / File | Preserve (do not change) | Restyle to flat | Done |
|---|---|---|---|
| Sales `finance/SalesPage.tsx` | Period state + `getDateRange`, `useMemo` filters/aggregations, `monthlyData`, `sourceColumns`/`salesColumns`, `StatsCard` subtitles, empty states | Title ink sans; period pills → flat segmented (active ink fill + white text, inactive white + `1px #C7BBAB`, 8px, ≥44px); stats icons → Lucide as-is, colors ink/slate/bronze cycle; h3 ink; source dots → flat cycle by index (keep labels + % table) | [x] |
| Report `finance/ReportPage.tsx` | Same filter/aggregation logic, `expenseByCategory` sort, invoice counts, `monthlyData` net, tables | Same pills/stats treatment; summary rows: dividers `1px #C7BBAB`, labels slate, values ink (keep success/error only on paid/overdue/net-negative numerals — flat text colors); invoice tiles → flat status fills (success/warning/danger) + 8px, 24px numerals; h1/h3 ink sans | [x] |
| List `finance/InvoiceListPage.tsx` | Search/status state, `useMemo` filter, row-click → detail, create `Modal` + persist handler | Title ink sans; invoiceNumber → bronze link-text; raw status `<select>` → shared flat `Select` (same options/state); count slate; create/edit/delete `Modal`/`ConfirmDialog` flows unchanged | [x] |
| Detail `finance/InvoiceDetailPage.tsx` | Status-gated actions + `ConfirmDialog` flows, totals math, not-found branch | h1/h2 ink sans; captions slate, values ink; item dividers `1px #C7BBAB`; desc ink, qty slate; totals ink; Back buttons as-is (flat outline) | [x] |
| Form `finance/InvoiceFormPage.tsx` | `isEdit`/from-reservation flows, `defaultValues`, reservation info card data, `InvoiceForm` props | Title ink sans; Back link bronze; reservation link → flat secondary button style; info card `#F2F0EB` + `1px #C7BBAB` + 8px, text ink/slate | [x] |
| Expenses `finance/ExpensesPage.tsx` | Category filter, totals, table, create `Modal` + persist handler | Title ink sans; category `<select>` → shared flat `Select`; count slate; total ink; create/edit/delete `Modal`/`ConfirmDialog` flows unchanged | [x] |

Token swap (mechanical):
- `font-family-display` → `var(--font-family-sans)`; headings ink `#232D36`
- `primary-text` → `#232D36`; `secondary-text`/`muted-text` → `#6B7881`; `primary` (text/links) → `#97764D`
- `taupe-dark` (borders) → `#C7BBAB`; `surface-default` → `#FFFFFF`; `surface-secondary`/`surface-neumorphic` → `#EEEDE9`/`#F2F0EB`; `cream-50` → `#FFFFFF`; `#E8E8E8` → `#EEEDE9`; `#E8F5E9` → `#F2F0EB`
- `green/yellow/red-light` fills → flat status fills (`#E3EDE4`/`#F0E7D3`/`#F3DEDE`); `radius 12px/14px` (+`radius-neumo`) → `8px`; `shadow-neumo-*` → `none`
- `blue-400 #60A5FA` (sales bars) → bronze `#97764D`; `warning #C58A3A` (expense bars) → slate `#6B7881`
- Stats icon color vars (`success/error/primary/info`) → ink/slate/bronze cycle
- `reservationSourceColors` / `expenseCategoryColors` display values → flat cycle `['#97764D', '#232D36', '#6B7881', '#7D6240', '#161D24', '#C7BBAB']` by index (constants files untouched)
- `#756A61` → `#6B7881`; `#4A2C1A` → `#232D36`

## 6B. Shared rules (from 00)

- `SalesChart.tsx` / `ExpenseChart.tsx`: bars/tracks flat fills above; labels slate/ink; legend dots + text kept; `role="img"` summaries kept; empty states white + `1px #C7BBAB` + 8px slate text. No logic change.
- `InvoiceForm.tsx`: totals block slate + ink. No logic change.
- Period pills: native `<button>`s restyled flat (not shared `Button` — segmented control pattern); `aria-pressed` recommended on active pill (a11y, no visual change beyond flat).
- Tables/filters/modals: flat shells as-is; create/edit/delete `Modal`/`ConfirmDialog` flows unchanged.
- Icons: `lucide-react` only; decorative `aria-hidden` (Sales/Report stats already pass Lucide nodes — keep).
- Motion: `150ms ease` hover only; `prefers-reduced-motion` respected (global).
- Responsive: mobile-first tiers in new `src/styles/finance-responsive.css` (see §6C); `1fr 1fr` pairs stack <1024px; tables scroll inside wrapper only.

## 6C. Responsive tiers (finance pages, layouts, buttons)

New `src/styles/finance-responsive.css`, mobile-first, flat tokens only (same tier system as `admin-responsive.css`):
- **Mobile base (<768px)** — everything fits 360–375px, smaller: h1 20px, h3 16px, meta/count 13px, page padding 16px, card/grid gaps 12px; period pills + stat cards stack full-width; `SalesChart`/`ExpenseChart` bars get a shared horizontal-scroll wrapper (labels scroll together with bars, never desync); invoice item rows (`2fr 1fr 1fr 40px`) wrap on narrow widths; tables keep `overflow-x-auto` inside the wrapper only.
- **Tablet (≥768px)** — medium step: h1 22px, 2-col grids where space allows, current card padding restored.
- **Desktop (≥1024px)** — today's sizes byte-identical (h1 24px, current grids/padding).
- Buttons keep ≥44px targets and form text stays 14px on all tiers (touch floor + iOS zoom floor); proportion is expressed through type scale, spacing, and shared button widths (header CTA goes full-width on mobile).
- Applied to Sales, Report, InvoiceList/Detail/Form, Expenses pages (headers, filters, pills, stats, charts, tables, action bars).

## 6D. Collapsible sidebar with slim rail (mobile + tablet + web)

Supersedes the earlier "always-fixed sidebar" decision. `PMSLayout` + `pms-layout.css` only — no route/RBAC/nav-content changes:
- Single `sidebarOpen` state (default open ≥1024px, closed below on first load). One toggle control switches open ↔ closed on all views.
- **Open:** full 240px drawer exactly as today (accordion, exclusive highlight, divider/bottom section, user + logout).
- **Closed:** 56–64px slim rail, same ink background — icons only (20px; active = white + bronze bar, inactive = line color). Every rail icon is a real link/button with `aria-label` + `title`, keyboard-focusable in visual order; `aria-expanded` stays in sync.
- Open↔closed animates width 200ms ease (off under `prefers-reduced-motion`); `.pms-main`/`.pms-footer` offset follows state (240px open / rail width closed) via a shell modifier class, transitioned together. Drawer/rail never cover page content.
- Selecting any page keeps today's behavior (highlight follows route, dropdown opens for its group). No scrim needed (nothing overlays).

## Acceptance Phase 6

- `grep -ri "font-family-display|radius-neumo|shadow-neumo|surface-secondary|surface-neumorphic|surface-raised|surface-default|green-light|yellow-light|red-light|taupe-dark|cream-50|blue-400|60A5FA|E8F5E9|E8E8E8|4A2C1A|756A61|FFFCF8|6F4528" src/pages/finance/ src/components/shared/SalesChart.tsx src/components/shared/ExpenseChart.tsx src/components/shared/InvoiceForm.tsx src/components/shared/ExpenseForm.tsx` → 0 hits.
- `npm run typecheck` green; `npm run build` green; eslint clean on changed files (pre-existing `any` warnings untouched).
- Manual: 375px + 768px + 1280px; period filters update all sections; invoice status flows + create modal click-through unchanged; expense create modal unchanged; finance pages show small/medium/current tiers with no horizontal page scroll; sidebar toggles rail↔drawer on all three widths, navigation works in both states, keyboard-only traversal with visible focus, `aria-expanded` in sync; focus ring bronze on tab.
- Implemented 2026-09-19: `finance-responsive.css` tiers applied to all 6 finance pages; slim 60px rail (`renderRailItem`, `PanelLeftClose/Open`, `aria-expanded` on both toggles, width/margin transitions with reduced-motion off); dead `pages/finance/ExpenseForm.tsx` retokened (unrouted, kept for grep-clean sweep).
