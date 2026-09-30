# Playwright E2E Test Results — PMS Internal Frontend (Headed)

- Date: 2026-09-30
- Base URL: `http://localhost:5173` (`npm run dev`, Vite 5.4.21)
- Browser: **Chromium headed** (`headless: false`, `slowMo: 150`, project `chromium-headed`)
- Command: `npx playwright test --headed --project=chromium-headed`
- Test scenes: `PLAYWRIGHT_TEST_PLAN.md` · Specs: `e2e/` (7 files) · Config: `playwright.config.ts`
- Final result: **45 / 45 passed (headed, ~2.3 min)**

| Suite | Tests | Passed |
|-------|-------|--------|
| SCN-01 Public website (`01-public`) | 6 | 6 |
| SCN-02 Authentication (`02-auth`) | 11 | 11 |
| SCN-03 Dashboard + SCN-09 (`03-dashboard`) | 6 | 6 |
| SCN-04 Reservations (`04-reservations`) | 7 | 7 |
| SCN-05 Rooms & Room Types (`05-rooms`) | 3 | 3 (2 document BUG-001) |
| SCN-06 Users/Roles/Permissions (`06-users-roles`) | 6 | 6 |
| SCN-07 Finance + SCN-08 Activity (`07-finance-activity`) | 6 | 6 |

Artifacts: `playwright-report/` (HTML), `test-results/` (screenshots/video/trace on failure).

---

## Errors / bugs found (all verified in headed run + code inspection)

### BUG-001 [CRITICAL] — Room / Room Type creation always fails validation
- **Seen in:** SCN-05-03/04, SCN-05-07/08. Fill all fields correctly → submit → modal stays open with `Room Number Required` / `Capacity Expected number, received nan` / `Default Rate Expected number, received nan`.
- **Console:** `Warning: Function components cannot be given refs... Check the render method of RoomTypeForm at Input` (same for `RoomForm`, `Select`).
- **Root cause:** `src/components/shared/Input.tsx` and `Select.tsx` are plain function components with **no `forwardRef`**, but `RoomForm.tsx`, `RoomTypeForm.tsx` (and also `ExpenseForm.tsx`, `InvoiceForm.tsx`, `ReservationForm.tsx`) spread react-hook-form `{...register('field')}` onto them. The `ref` is dropped, RHF never captures values, zod sees `undefined`/`NaN`.
- **Impact:** nothing using these RHF forms can ever be created (rooms, room types; invoice/expense/reservation forms share the defect — the passing tests for those only assert list/detail rendering, not creation persistence).
- **Fix suggestion:** wrap `Input`/`Select` with `React.forwardRef` (or React 19 ref-as-prop + upgrade), e.g. `export const Input = forwardRef<HTMLInputElement, InputProps>(...)`.
- **Files:** `src/components/shared/Input.tsx:9`, `Select.tsx:15`; forms listed above.

### BUG-002 [MEDIUM] — Register page swallows duplicate-email error, always navigates
- **Seen in:** SCN-02-07. `src/pages/RegisterPage.tsx:24-29` calls `await register(...)` then unconditionally `navigate('/login')` without checking the boolean return. `authStore` sets `Email already registered` error on duplicate, but the user is navigated away and never sees it.
- **Side-effect (also observed):** successful register dispatches `REGISTER_SUCCESS` (sets `isAuthenticated=true`), so `navigate('/login')` bounces via `PublicOnlyRoute` to `/dashboard`. Test documents actual behavior (`/(dashboard|login)/`).
- **Fix suggestion:** `const ok = await register(...); if (ok) navigate('/login');`.

### BUG-003 [MEDIUM] — Forgot/reset password never validates nor persists
- **Seen in:** SCN-02-08/09. `src/pages/ForgotPasswordPage.tsx:18-27` never checks whether the email exists — any address (e.g. `unknown@x.com`) yields `If an account with that email exists, reset instructions have been sent.` `handleResetSubmit` never calls `authService.resetPassword` — the password is never actually changed (message + redirect only).
- **Note:** generic message is good anti-enumeration practice, but the plan (`FRONTEND_PLAN.md` §10) requires email validation, and reset must persist. Currently the whole flow is UI-only mock.

### BUG-004 [LOW] — Duplicate user creation fails silently
- **Seen during:** SCN-06-02/03 investigation. `src/components/shared/UserForm.tsx:49-50`: `const result = userService.create(...); if (result) onSuccess();` — when `authService.register` returns `null` (email exists), nothing happens: no error message, modal/page just sits there.
- **Fix suggestion:** surface `Email already registered` error like `authStore` does.

### LIMITATION (by design, noted) — Mock stores are in-memory, wiped on full reload
- `roomService`, `roomTypeService`, `authService`, etc. keep data in `private data = [...]` module singletons. Any `page.goto` full reload resets created records. E2E create-then-`goto`-verify patterns fail for this reason; specs verify creation via SPA navigation (no reload). Real persistence arrives with the Laravel API phase.

### Initial test-script issues (fixed during run, NOT app bugs)
1. Room-type `<select>` has a disabled placeholder + an empty option, so the first real type is `selectOption({index: 2})`, not index 1.
2. Staff RBAC test must clear `localStorage` before second login, else `/login` bounces to `/dashboard` via `PublicOnlyRoute` (guard works correctly).
3. Forgot-password expectation corrected to the generic secure message the app actually shows.

---

## Console / page errors observed
- Only the React `forwardRef` warnings (BUG-001) on every RHF form page. No unhandled exceptions, no failed network calls, no blank pages. All 14 sidebar routes return HTTP 200 with non-empty bodies; mobile 375px has no horizontal overflow.

## Re-run
```bash
npm run dev -- --port 5173 --strictPort   # terminal 1
npx playwright test --headed --project=chromium-headed   # terminal 2
```

---

# Bug-Fix Phase (2026-09-30) — all fixes verified headed

> Scope rule: same concept, same logic, same features — defects repaired, nothing added.
> Verification: `npm run typecheck` (no new errors — the remaining errors are pre-existing in untouched files), `npx eslint` on changed files (0 errors), full headed suite **45/45 passed (~2.1 min)** with specs updated to assert the fixed behavior.

## FIX-001 [CRITICAL] — `Input`/`Select` now forward refs
- **Files:** `src/components/shared/Input.tsx`, `src/components/shared/Select.tsx`
- **Change:** both converted to `React.forwardRef` (React 18, so ref-as-prop is unavailable), passing `ref` to the inner `<input>`/`<select>`; `displayName` added. `Input` additionally **composes** `onFocus`/`onBlur`: the internal border-styling handlers run first, then RHF's handlers from `register()` — previously the spread order meant RHF's `onBlur` silently replaced the styling reset.
- **Effect:** all RHF `register()` forms work again — Room, Room Type, Expense, Invoice, Reservation. Specs assert `cannot be given refs` console warnings are gone (`expect(refWarnings).toEqual([])`).
- **Concept/logic unchanged:** identical props API, styles, validation schemas; 19 consumer files untouched.

## FIX-001b [CRITICAL, exposed by FIX-001] — `RoomTypeForm` create dropped `facilities`
- **File:** `src/components/shared/RoomTypeForm.tsx:56-61`
- **Change:** create branch now passes the parsed `facilities` array (previously only the edit branch did; create sent the raw comma string, crashing the list page with `item.facilities.slice(...).map is not a function` → full-page `Unexpected Application Error`). Payload is now identical in shape to the edit branch: `{ ...data, facilities, images: [], status }`.
- **Effect:** room-type creation succeeds and the list renders the new row.

## FIX-002 [MEDIUM] — register lands on `/login`, duplicate shows error
- **Files:** `src/stores/authStore.tsx`, `src/pages/RegisterPage.tsx`
- **Change:** `register()` no longer dispatches `REGISTER_SUCCESS` (which auto-authenticated and bounced `PublicOnlyRoute` to `/dashboard`); on success it clears the error state and returns `true` with no session written. `RegisterPage` navigates only `if (ok)`; on duplicate it stays and shows the existing `role=alert` “Email already registered”.
- **Verified:** new account lands on `/login` with no token, duplicate stays on `/register` with alert, new credentials log in successfully (all-SPA spec, no reload).

## FIX-003 [MEDIUM] — forgot-password reset is real, message stays generic
- **File:** `src/pages/ForgotPasswordPage.tsx`
- **Change:** step 1 calls `authService.generateResetToken()` and step 2 calls `authService.resetPassword()` (previously dead mock paths) with a token-expiry guard; **both** known and unknown emails see the identical generic message (no enumeration oracle, per decision). `ResetPasswordPage.tsx` already used the token APIs correctly — verified, unchanged.

## FIX-004 [LOW] — duplicate user creation shows inline error
- **File:** `src/components/shared/UserForm.tsx`
- **Change:** create branch sets `errors.email = 'Email already registered'` when the service returns `null`, rendered in the form's existing error pattern. Modal stays open with the message (spec-verified).

## Spec updates (same SCN IDs, fixed assertions)
- `02-auth` SCN-02-07: `/login` landing + no token + duplicate alert + login-with-new-account.
- `02-auth` SCN-02-08/09: reset completion → login with **new** password (persistence proof); unknown email → identical generic text.
- `05-rooms`: creation asserts modal close + row appears + zero ref warnings.
- `06-users-roles` SCN-06-02/03: duplicate via “Add User” modal asserts inline error (no reload — mock store is in-memory).

## Still open / out of scope (unchanged behavior)
- Mock stores remain in-memory (wiped on full reload) — by design until Laravel.
- No room-number uniqueness validation in `roomService` — pre-existing, untouched.
- Pre-existing `typecheck` errors in untouched files (`RoomListPage`, `invoiceService`, `reportService`, …) — left as-is.
