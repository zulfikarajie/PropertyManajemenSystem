# Phase 1.5 — Split-Screen Auth Rework (DONE)

Master: `00-design-tokens.md`. Reference image used for **layout/composition
only**; all colors/typography/tokens are the existing flat foundation.
Status: code implemented 2026-09-19, `typecheck` + `build` green, eslint clean
on changed files.
Skill basis: `ui-ux-pro-max` verified ux result — **Accessible Authentication
(Minimum)** (allow password managers + paste; no `onpaste` blocking) and
**ARIA Labels** (accessible names on interactive elements).

## Changed

| File | Change |
|---|---|
| `src/components/AuthSplitLayout.tsx` (new) | Shared split layout: brand top-left, heading, description, form slot, full-height visual panel. Renders `<img cover>` when `AUTH_HERO_IMAGE` is set, else CSS placeholder. |
| `src/config/authVisual.ts` (new) | Single `AUTH_HERO_IMAGE` constant (`''` = placeholder) + alt text. Future replacement point. |
| `src/styles/auth-split.css` (new) | Isolated auth styles, `auth-*` classes only. Existing tokens exclusively. Breakpoints 1024 / 768 / 480; `prefers-reduced-motion` disables entrance. |
| `src/main.tsx` | Import `auth-split.css`. |
| `src/pages/LoginPage.tsx` | Split layout; brand + “Welcome back” + description; Email/Password with labels + `autocomplete`; Remember-me + Forgot row; Login (primary) + Sign Up (outline) side-by-side. |
| `src/pages/RegisterPage.tsx` | Split layout; same heading/description pattern; 4 fields unchanged; Sign Up primary + Sign-in foot link. |
| `src/pages/ForgotPasswordPage.tsx` | Split layout; both steps (email → reset) unchanged; status box + Back to Login. |
| `src/pages/ResetPasswordPage.tsx` | Split layout; token flow unchanged; success/error status colors kept. |
| 4 auth pages | `React.FormEvent` → `FormEvent` type import (lint fix, no logic change). |

Responsive: desktop 50/50 full-height visual; ≤1024px tighter padding;
≤768px stacked (form first, visual 240px hero below); ≤480px single-column
actions, 24px heading. No fixed widths that overflow (panels flex, inner
`max-width 440/480px`).

## Preserved

- Theme foundation: palette `#EEEDE9/#C7BBAB/#6B7881/#232D36/#97764D`,
  Inter sans-only, 8px radius, existing `Button`/`Input` components, CSS vars,
  `tailwind.config.ts` — **untouched**.
- Auth logic: `login`/`register`/`resetPassword`/`validateResetToken` flows,
  validation rules, error messages, redirects, route paths — **identical**.
- Other pages/layouts: PMS + public + ChangePassword + NotFound — **untouched**.

## Authentication Pages

- Login: implemented (`/login`)
- Signup: implemented (`/register`)
- Forgot Password: implemented (`/forgot-password`, both steps)
- Reset Password: implemented (`/reset-password`, token flow)

ChangePassword left as centered card (authenticated-area page, out of §13 scope).

## Image Placeholder

Defined in `src/config/authVisual.ts` → `AUTH_HERO_IMAGE = ''`.
Empty renders the flat CSS placeholder (ink panel, bronze/line ring motif,
brand caption — theme-consistent, no asset). To use real photography, set the
constant to a URL/path; `AuthSplitLayout` renders it with `object-fit: cover`
at full panel height. No layout changes needed.

## Debug fix — blank `/login` (2026-09-19)

Root cause: `authService.login()` persists `pms_token`/`pms_user` in
localStorage and `AuthProvider` restores them on boot, but
`PublicOnlyRoute` rendered `return null` for authenticated users and the
store's `logout()` never cleared storage. After any login, `/login`
(and `/register`, `/forgot-password`, `/reset-password`) rendered blank
forever.
Fix (design untouched): `PublicOnlyRoute` now `<Navigate to="/dashboard"
replace />` for authenticated users; new `authService.logout()` clears the
stored session and the store calls it. `typecheck` + `build` green.

## Validation

- `npm run typecheck` green; `npm run build` green (3.87s); eslint 0 errors on
  all changed files.
- Skill a11y rules applied: `autocomplete="username/current-password/
  new-password/email"` on all auth inputs; paste allowed (no blockers);
  real `<label>`s; `role="alert/status"`; visible bronze focus ring;
  44px touch targets (inputs, buttons, remember row, links).
- Breakpoints to verify manually: 1440 / 1280 / 1024 / 768 / 480 / 375,
  plus login → dashboard, register → login, forgot 2-step, reset with token.
