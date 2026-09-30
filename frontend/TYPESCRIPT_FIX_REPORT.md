# TypeScript Fix Report — Frontend (Phase 1 follow-up)

- Date: 2026-09-30
- Scope: repair pre-existing `tsc --noEmit` errors only. No redesign, no backend changes (backend/ holds only `.gitkeep`), no new features, no API-contract changes except where a TS error proved the frontend type wrong. No `any` introduced, no `ts-ignore`/`ts-expect-error` used.
- Note: `PROJECT_STATUS_AND_KNOWN_ISSUES.md` and Phase-0 audit docs were not found in the repo; the documented baseline of “39 errors” was re-measured at **40 errors** before any change.

## Before

- `npx tsc --noEmit`: **40 errors, exit ≠ 0**
- By code: TS7053 ×15, TS2367 ×13, TS6133 ×9, TS2322 ×3
- Files affected (16): `DayReservationsPopup.tsx`, `InvoiceDetailPopup.tsx`, `ActivityLogPage.tsx`, `DashboardPage.tsx`, `ExpensesPage.tsx`, `InvoiceDetailPage.tsx`, `InvoiceFormPage.tsx`, `InvoiceListPage.tsx`, `ReportPage.tsx`, `PermissionListPage.tsx`, `RoleListPage.tsx`, `RoomTypeListPage.tsx`, `RoomListPage.tsx`, `UserListPage.tsx`, `invoiceService.ts`, `reportService.ts`
- Phase-1 areas (`authService`, `userService`, `roleService`, `permissionService`, `AuthContext`, `PermissionContext`, auth flows) had **zero errors** — verified, untouched.

## Fixed (40/40)

### Group A — incorrect type definitions: status unions too narrow (16 errors)
Root cause: `Invoice.paymentStatus` (`'Pending'|'Paid'`) and `invoiceStatus` (`'Draft'|'Completed'`) excluded statuses the app's own code uses — `invoiceService.cancel()/send()` assign `'Cancelled'`/`'Sent'`, and badges/filters compare against `'Overdue'`/`'Partial'`/`'Sent'`/`'Cancelled'` (consistent with `FRONTEND_PLAN.md` §Invoice Model). The errors proved the frontend types incorrect.
- `src/types/auth.types.ts:90-91` (fixes `invoiceService.ts:72,80` TS2322; `DayReservationsPopup:111`, `InvoiceDetailPopup:28×2,91×2`, `DashboardPage:115`, `InvoiceListPage:208×2,209×2`, `InvoiceDetailPage:32`, `ReportPage:111`, `reportService:46` TS2367): `paymentStatus` → `'Pending' | 'Paid' | 'Overdue' | 'Partial'`; `invoiceStatus` → `'Draft' | 'Completed' | 'Sent' | 'Cancelled'`. `'Completed'` kept (mock data + `markPaid` use it).
- `src/components/shared/InvoiceForm.tsx:23-24` (fixes `InvoiceFormPage:146` TS2322): same widening on the zod enums; inferred `initialData` type widens accordingly. Existing `Completed ⇒ Paid` validation untouched.
- `constants/invoiceStatuses.ts` option arrays deliberately left narrow → zero UI change.

### Group B — filter-draft state typing (15× TS7053)
Root cause: `draft` state typed as a narrow object literal but indexed by `cat.key`/`activeCategory` of type `string`. Fix: `useState<Record<string, string>>` — identical runtime shape.
- `ExpensesPage:42` (3: lines 160, 173, 214), `RoleListPage:34` (3: 147, 160, 201), `RoomTypeListPage:37` (3: 212, 225, 266), `RoomListPage:32` (3: 204, 217, 258), `UserListPage:36` (3: 160, 173, 214).

### Group C — dead code under `noUnusedLocals`/`noUnusedParameters` (9× TS6133)
Each verified single-occurrence; import/function removal only, no logic touched.
- `ActivityLogPage:74-77`: deleted unused `getCategoryLabel` (its only consumer never existed; `activityCategoryLabels` import still used at lines 130/166).
- `RoomListPage:19-22`: deleted unused `getStatusLabel`.
- `PermissionListPage:1`: `import { useState, useMemo }` → `import { useState }`.
- `ExpensesPage:8`, `InvoiceListPage:8`: removed unused `Select` import.
- `RoomTypeListPage:7,9`, `RoomListPage:8,10`: removed unused `Card` + `Select` imports.

## After

- `npx tsc --noEmit`: **0 errors, exit 0**
- `npm run build` (`tsc -b && vite build`): **success** (`✓ built in ~20s`; only the pre-existing >500 kB chunk-size warning for `ReportPage`).
- `npx eslint` on all 10 changed files: **0 errors**, 23 warnings — all pre-existing `no-explicit-any` on untouched lines (left alone; removing them would be out-of-scope refactoring).
- Headed regression `npx playwright test --headed --project=chromium-headed`: **45/45 passed** (covers rooms, room-type create, invoice flows, filters, auth — the touched areas).

## Remaining

- None. All 40 baseline errors repaired; no suppressions added.
- Pre-existing, intentionally untouched: `any` usages flagged by eslint (23 warnings), `ReportPage` bundle-size warning, in-memory mock-store volatility, no room-number uniqueness check. Recommend addressing `any`s during a dedicated cleanup pass, not this repair task.
