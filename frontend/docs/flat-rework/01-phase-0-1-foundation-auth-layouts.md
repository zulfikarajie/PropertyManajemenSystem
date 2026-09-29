# Phase 0+1 — Foundation + Layouts + Auth (DONE)

Master: `00-design-tokens.md`. Features frozen — restyle only, no route/logic/RBAC/validation changes.
Status: code implemented, `npm run typecheck` green. Doc boxes checked 2026-09-19.

## Phase 0 — Foundation (tokens + shared components)

### 0A. Tokens & globals

- [x] `index.html` — replace Poppins/Open Sans with Inter (sans-only)
- [x] `tailwind.config.ts` — replace brand/brown/cream/taupe/blue/neumo with flat `canvas/surface/line/ink/slate/bronze` map (see 00 §4)
- [x] `src/index.css` — rewrite vars to flat canonical set; delete `--shadow-neumo-*`, `--radius-neumo`, neumo keyframes
- [x] `src/styles/globals.css` — same flat set; sans-only; focus `2px solid #97764D`; scrollbar flat
- [x] `src/App.tsx` — `LoadingFallback` color `#232D36` on `#EEEDE9` (remove `#6F4528`)

### 0B. Shared components (`src/components/shared/`)

| File | Preserve | Restyle to flat | Done |
|---|---|---|---|
| `Button.tsx` | variants/sizes/loading/disabled API | Remove `width:100%` default + neumo shadows + scale press; primary `#232D36`, secondary white+line, outline/bronze, danger `#962222`, radius 8px, `opacity .85` press | [x] |
| `Card.tsx` | title/children/footer/padding API | White + `1px #C7BBAB` + 8px, no shadow; `hover` → border bronze; title ink sans | [x] |
| `Badge.tsx` | variant/size API | Flat status fills + `1px` border + 4px radius; default `#EEEDE9`/`#232D36` | [x] |
| `Table.tsx` | columns/data/loading/rowClick API | `overflow-x-auto` wrapper + line border + 8px; header white/slate; zebra white/`#F2F0EB`; hover tint; row dividers | [x] |
| `Input.tsx` | label/error API | White, 44px, `1px #C7BBAB`, 8px, error `#962222`; label ink | [x] |
| `Select.tsx` | label/error/options API | Same as Input; chevron `#6B7881` | [x] |
| `Modal.tsx` | open/title/footer/size API | White + line border + 8px + `pop` shadow max; scrim `rgba(35,45,54,.45)`; Lucide `X` close; title ink sans | [x] |
| `ConfirmDialog.tsx` | props unchanged | Inherits Modal/Button flat (no direct change except verify) | [x] |
| `Pagination.tsx` | paging API | Flat squares 40px, active ink, inactive white+line, 8px | [x] |
| `Loading.tsx` | variant/size API | Track `#C7BBAB`, top `#97764D`; skeleton `#EEEDE9`; page bg `#EEEDE9`; no neumo shadow | [x] |
| `EmptyState.tsx` | icon/title/desc/action API | White + line border + 8px; icon slate; title ink sans | [x] |
| `ErrorState.tsx` | title/desc/retry API | White + line/error border + 8px; replace ⚠️ emoji with Lucide `AlertTriangle`; retry = flat Button | [x] |
| `StatsCard.tsx` | label/value/icon API | White + line border; value ink (bronze optional hero); label slate | [x] |

Acceptance Phase 0: `grep -ri "neumo" src/ tailwind.config.ts` → 0 hits (except docs); `npm run typecheck` green.

## Phase 1 — Layouts + Auth

### 1A. Layouts

| File | Preserve | Restyle to flat | Done |
|---|---|---|---|
| `src/layouts/PMSLayout.tsx` | nav tree, RBAC gating (`canSee`), active logic, Outlet | Sidebar `#232D36` flat, text `#FFFFFF`/`#C7BBAB`, active white-12% + bronze bar; topbar white + bottom line; content `#EEEDE9`; replace custom SVG `Icon()` with `lucide-react` (LayoutDashboard, BedDouble, CalendarDays, Users, Settings, ShieldCheck, CreditCard, Activity); logout = flat danger-outline; footer slate small | [x] |
| `src/layouts/PublicLayout.tsx` | Outlet slots | Canvas bg, white header + bottom line, footer `#232D36` + white text | [x] |
| `src/layouts/BaseLayout.tsx` | Outlet slots | Canvas bg, sans | [x] |

### 1B. Auth pages (logic identical — only card/inputs/buttons/links)

| Route / File | Preserve (do not change) | Restyle | Done |
|---|---|---|---|
| `/login` `LoginPage.tsx` | `login()`, loading/error, nav to register/forgot | Canvas page; card white+line+8px; title ink sans; links bronze; error `#962222` | [x] |
| `/register` `RegisterPage.tsx` | validation (name≥2, email, pw≥6, match), `register()` | Same card pattern; labels slate/ink; errors `#962222` | [x] |
| `/forgot-password` `ForgotPasswordPage.tsx` | 2-step email→reset flow, messages | Info box flat `#EEEDE9`+line (not brand-50); inputs flat | [x] |
| `/reset-password` `ResetPasswordPage.tsx` | token validate + `resetPassword()` | Same as forgot; success `#2F5D37` on `#E3EDE4` | [x] |
| `/change-password` `ChangePasswordPage.tsx` | `changePassword()`, guards, redirect | Card flat; “login first” state flat | [x] |
| `*` `NotFoundPage.tsx` | copy “Halaman tidak ditemukan” | Canvas + ink title + slate text + bronze “back” link | [x] |

Acceptance Phase 1: all auth flows click-through unchanged; sidebar/topbar flat; no neumo vars; keyboard focus visible; 375px + 1280px OK.

## Verification (this batch)

```bash
npm run typecheck
npm run build
# grep check
rg -i "neumo|6F4528|4A2C1A|FFFCF8|E8E8E8" src tailwind.config.ts --glob '!docs/**' | head
```

Manual: login → dashboard (dashboard itself still old style — expected until Phase 3); resize 375px; tab through inputs (bronze focus ring); `prefers-reduced-motion` → no scale/spin excess.
