# Playwright E2E Test Scenarios — PMS Internal Frontend

> Stack: React 18 + Vite + React Router + mock services (localStorage, no backend)
> Base URL: `http://localhost:5173`
> Execution: Playwright with **headed Chromium** (`headless: false`)
> Credentials (from `src/data/mock/users.json`):
> - Admin (full access): `admin@hotel.com / admin123`
> - Manager: `manager@hotel.com / manager123`
> - Staff (limited): `staff@hotel.com / staff123`
> - Inactive (must fail login): `inactive@hotel.com / inactive123`

No `data-testid` exists in codebase — tests use role / placeholder / text selectors.

---

## SCN-01 — Public Website (no auth)

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| SCN-01-01 | Home page loads | Go `/` | h1 `Selamat Datang` visible, CTAs `Hubungi via WhatsApp`, `Lihat Kamar`, carousel `Foto sebelumnya/berikutnya` |
| SCN-01-02 | Public navigation | Click `Lihat Kamar`, `Learn More`, `Hubungi Kami`, header links | `/rooms`, `/about`, `/contact`, `/gallery` all 200, no console error |
| SCN-01-03 | Availability checker validation | On `/`, submit empty check-in/out | `role=alert` `Ada yang perlu diperbaiki` appears |
| SCN-01-04 | Room Types public list | Go `/rooms` | Room cards visible, images load (no 404 net error) |
| SCN-01-05 | Gallery page | Go `/gallery` | Images/grid visible |
| SCN-01-06 | About page | Go `/about` | Property info visible |
| SCN-01-07 | Contact page WhatsApp CTA | Go `/contact` | `Hubungi via WhatsApp` link has `href` containing `wa.me` or `whatsapp` |
| SCN-01-08 | 404 page | Go `/route-tidak-ada-xyz` | NotFound page rendered |
| SCN-01-09 | Responsive mobile (375px) | Viewport 375x800, go `/` | No horizontal overflow (`scrollWidth <= clientWidth+1`), hamburger/menu usable |

## SCN-02 — Authentication

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| SCN-02-01 | Login page renders | Go `/login` | `Welcome back`, email ph `john@hotel.com`, password ph `Enter your password`, `Login` btn |
| SCN-02-02 | Login invalid credentials | Fill wrong email/pass, submit | `role=alert.auth-error` visible, stays on `/login` |
| SCN-02-03 | Login inactive user fails | `inactive@hotel.com / inactive123` | Login fails, no `pms_token` in localStorage |
| SCN-02-04 | Login admin success | `admin@hotel.com / admin123` | Redirect `/dashboard`, `pms_token` + `pms_user` set, sidebar `Joglo Seruni` |
| SCN-02-05 | PublicOnly guard | While logged in, go `/login` | Redirect to `/dashboard` |
| SCN-02-06 | Protected guard (unauth) | Clear storage, go `/dashboard` | Redirect to `/login` |
| SCN-02-07 | Register new user | Go `/register`, fill unique name/email/pass, submit | Success → redirect `/login`; duplicate email shows error |
| SCN-02-08 | Forgot password flow | Go `/forgot-password`, submit `admin@hotel.com` | `role=status.auth-status` success message appears |
| SCN-02-09 | Forgot password unknown email | Submit `unknown@x.com` | Error message, no success status |
| SCN-02-10 | Reset password no token | Go `/reset-password` | `No reset token provided` message |
| SCN-02-11 | Change password (auth) | Login, go `/change-password` | Form `Current Password`/`New Password` visible; wrong current → error; correct → success |
| SCN-02-12 | Logout | Click `Logout` in sidebar | localStorage cleared, redirect `/login` |

## SCN-03 — Dashboard (`/dashboard`, admin)

| ID | Scenario | Expected |
|----|----------|----------|
| SCN-03-01 | Dashboard renders | h1 `Dashboard`, stats `Check-in Hari Ini`, `Reservasi Aktif`, `Omzet Hari Ini`, `Invoice Tertunda`, `Okupansi`, `Total Reservasi` |
| SCN-03-02 | Quick actions navigate | `Reservasi Baru`→`/dashboard/reservations/new`, `Invoice`→`/dashboard/finance/invoices/new`, `Tambah Kamar`→`/dashboard/rooms/new`, `Laporan Keuangan`→`/dashboard/finance/reports` |
| SCN-03-03 | Revenue period filter | Click `Mingguan/Bulanan/Tahunan`, `Pilih Rentang` + month inputs + `Terapkan` | Chart/data updates, no crash |
| SCN-03-04 | Recent reservations table | Headers `Kode,Tamu,Sumber,Check-in,Status,Total`; row link navigates to `/dashboard/reservations/:id` | Works |

## SCN-04 — Reservations

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| SCN-04-01 | List renders | Go `/dashboard/reservations` | h1 `Reservations`, search ph `Search reservations...`, `Filter`, pills `All/Today/Weekly/Monthly`, meta `Showing X–Y of Z` |
| SCN-04-02 | Search filter | Type guest name | List filters (count decreases or empty `No reservations found`) |
| SCN-04-03 | Filter dialog | Open `Filter`, select Status/Source, `Apply`, then `Reset` | Filtering works, reset restores |
| SCN-04-04 | Wizard step 1 validation | Open `+ New Reservation`, click `Save & Continue` empty | `role=alert` `There is a problem` |
| SCN-04-05 | Create reservation (multi-room, manual rate) | Fill guest name, dates (tomorrow/+3d), select ≥1 room, set manual rate, complete 3 steps, `Save Reservation` | New code appears in list; total = sum(subtotals) |
| SCN-04-06 | Detail page | Click reservation code | Shows `Guest`, `Status`, `Rooms (Rp rate)`, actions `Check In/Check Out/Cancel/Edit reservation` |
| SCN-04-07 | Check-in transition | On `Reserved` reservation, `Check In` → confirm | Status → `Checked In` |
| SCN-04-08 | Check-out transition | On `Checked In` reservation, `Check Out` → confirm | Status → `Checked Out` |
| SCN-04-09 | Cancel reservation | On `Reserved`, `Cancel` → confirm | Status → `Cancelled` |
| SCN-04-10 | Edit reservation | Click Edit, change notes/guest, `Save Changes` | Detail reflects change |
| SCN-04-11 | Calendar renders | Go `/dashboard/reservations/calendar` | h1 `Reservation Calendar`, `N kamar aktif`, events clickable → popup → `ViewAll` navigates with `?date=` |
| SCN-04-12 | RBAC staff cannot delete/cancel w/o perm | Login staff, verify Cancel hidden/disabled where not permitted | `Akses Ditolak` not shown for view, but unauthorized action gated |

## SCN-05 — Rooms & Room Types (`room.view`)

| ID | Scenario | Expected |
|----|----------|----------|
| SCN-05-01 | Room list renders | h1 `Rooms`, search `Search room number...`, table `Room Number/Type/Status/Actions` |
| SCN-05-02 | Room search + filter | Search `101`, filter by type/status | Filters correctly |
| SCN-05-03 | Create room | `+ New Room`, fill `Room Number` unique, select type, `Create` | New row appears |
| SCN-05-04 | Create room duplicate number | Same number again | Validation error, no duplicate |
| SCN-05-05 | Edit room | `Edit room {num}`, change status, `Update` | Row updated |
| SCN-05-06 | Delete room | `Delete room {num}` → confirm `Delete` | Row removed |
| SCN-05-07 | Room Type list renders | h1 `Room Types`, table `Name/Description/Capacity/Default Rate/Facilities/Status` |
| SCN-05-08 | Create room type | `+ New Room Type`, fill name/desc/capacity/rate/facilities, `Create` | New row |
| SCN-05-09 | Edit room type rate (historical stability note) | Change `Default Rate`, verify old reservation rate unchanged | Manual visual check |
| SCN-05-10 | Delete room type | `Delete room type {name}` → confirm | Row removed |

## SCN-06 — User / Role / Permission Management

| ID | Scenario | Expected |
|----|----------|----------|
| SCN-06-01 | Users list (`user.view`) | h1 `Pengguna`, search `Search by name or email...`, table `Name/Email/Role/Status` |
| SCN-06-02 | Create user | `Add User` or `/dashboard/users/new`, fill name/email/pass/role, `Create User` | New row |
| SCN-06-03 | Create user duplicate email | Same email | Validation error |
| SCN-06-04 | User detail | Click `View` → `/dashboard/users/:id` | `User Information` block, `Edit user` btn |
| SCN-06-05 | Assign role | `Assign Role`, change role, `Save Role` | Detail shows new role |
| SCN-06-06 | Roles list | h1 `Jabatan`, table `Role Name/Description/Permissions/Status` | Renders |
| SCN-06-07 | Create role | `Create Role`, fill name/desc, check ≥1 permission, `Create Role` | New row |
| SCN-06-08 | Edit role permissions | `Edit`, toggle permission, `Update Role` | Count updated |
| SCN-06-09 | Permissions list | h1/table of 26 perms grouped | Renders |
| SCN-06-10 | RBAC: staff denied finance/activity | Login staff, go `/dashboard/finance/sales`, `/dashboard/activity` | `Akses Ditolak` (`Anda tidak memiliki izin`) |
| SCN-06-11 | Management hub | Go `/dashboard/management` | Hub links render for admin |

## SCN-07 — Finance (Sales / Invoices / Reports / Expenses)

| ID | Scenario | Expected |
|----|----------|----------|
| SCN-07-01 | Sales overview | h1 `Sales & Revenue`, filter `Hari Ini/Minggu Ini/Bulan Ini/6 Bulan/1 Tahun`, stats `Total Sales/Total Expenses/Net Revenue/Avg`, tables `Revenue by Source`, `Riwayat Transaksi` |
| SCN-07-02 | Invoices list | h1 `Invoices`, search `Search invoice or guest...`, table `Invoice Number/Reservation/Guest/Date/Discount/Total/Payment/Status` |
| SCN-07-03 | Create invoice | `+ New Invoice`, fill number/guest/dates/add item, `Create Invoice` | New row, totals = subtotal−discount |
| SCN-07-04 | Invoice detail | Click row | Shows items, `Subtotal/Discount/Total`, `Mark as Sent/Paid`, `Print Invoice` |
| SCN-07-05 | Mark invoice Paid / Cancel | Click actions + confirm | Status updates |
| SCN-07-06 | Edit invoice | `Edit {num}`, change discount, `Update Invoice` | Total recalculated |
| SCN-07-07 | Delete invoice | `Delete {num}` → `Yes, Delete` | Row removed |
| SCN-07-08 | Reports page | h1 `Laporan Keuangan`, filters `Hari Ini…1 Tahun`, date inputs, category checkboxes + `Select all/Clear all`, buttons `Print PDF/Export Excel/Export PDF` | Stats + `Tren Penjualan vs Pengeluaran` render |
| SCN-07-09 | Expenses page | h1 `Expenses`, `+ New Expense`, filter Category/Status, `Total: Rp …`, table `Date/Category/Description/Amount/Status` | Renders |
| SCN-07-10 | Create expense | Fill category/date/status/desc/amount, `Create Expense` | New row + total updates |

## SCN-08 — Activity Log

| ID | Scenario | Expected |
|----|----------|----------|
| SCN-08-01 | Activity renders | h1 `Activity Log`, stats `Total Activities/Authentication/Reservations/Finance/System`, search `Search activities...` |
| SCN-08-02 | Filter + search + pagination | Filter category, search text, next page | `N result(s)` updates, feed changes |

## SCN-09 — Cross-cutting

| ID | Scenario | Expected |
|----|----------|----------|
| SCN-09-01 | Sidebar navigation (admin) | All links: Dashboard, Daftar Reservasi, Kalender, Penjualan, Invoices, Laporan, Pengeluaran, Tipe Kamar, Daftar Kamar, Manajemen, Aktivitas | Each navigates 200, no blank page |
| SCN-09-02 | Console errors | Collect `pageerror` + `console(error)` across full run | Zero errors expected; all logged in results file |
| SCN-09-03 | Session persistence | Reload `/dashboard` after login | Still authenticated (localStorage session restored) |

---

## Execution notes (filled after run)

- Date: 2026-09-30
- Base URL: `http://localhost:5173` (Vite dev server)
- Browser (headed): Chromium headed (`headless: false`, `slowMo: 150`)
- Command: `npx playwright test --headed --project=chromium-headed`
- Result: **45 / 45 passed**
- Results file: `PLAYWRIGHT_TEST_RESULTS.md` (4 bugs/limitations documented: BUG-001 critical RHF forwardRef, BUG-002 register nav, BUG-003 password reset mock-only, BUG-004 silent duplicate user)
- Screenshots/video dir: `playwright-report/` / `test-results/`
