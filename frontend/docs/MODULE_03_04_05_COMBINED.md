# MODULES 03–05 — Auth & RBAC, User Management & Role & Permission Management

## Overview

This combined scope covers **Module 03 (Authentication & RBAC Foundation)**, **Module 04 (User Management)**, and **Module 05 (Role & Permission Management)**. All three modules form the authorization and user management backbone of the internal PMS system.

**New Features Added:** Registration, Forget Password, Change Password, and Reset Password flows.

**Dependency Chain:**
```
MODULE 03 (AUTH-001 → AUTH-012)
  ↓
MODULE 04 (USER-001 → USER-006) depends on AUTH-005, AUTH-007
  ↓
MODULE 05 (ROLE-001 → ROLE-007) depends on AUTH-007, AUTH-004
```

---

## Task List — All 25 Tasks

### MODULE 03 — Authentication & RBAC Foundation (12 tasks)

| Task ID | Task Name | Plan Status | Actual Status | Evidence |
|---------|-----------|------------|---------------|----------|
| AUTH-001 | Auth Data Models | ✅ Completed | ✅ **VERIFIED** | `src/types/auth.types.ts` defines `AppUser`, `AppRole`, `AppPermission` interfaces; re-exported via `user.types.ts`, `role.types.ts`, `permission.types.ts` |
| AUTH-002 | Auth Mock Data | ✅ Completed | ❌ **NOT IMPLEMENTED** | `src/data/mock/` directory is **EMPTY** — no `users.json`, `roles.json`, `permissions.json` files exist |
| AUTH-003 | Auth Context/Store | ✅ Completed | ✅ **VERIFIED** | `src/stores/authStore.tsx` (`AuthProvider` + `useReducer`), `src/stores/permissionStore.tsx` (`PermissionProvider`), `src/stores/uiStore.tsx` (`UIProvider`) all exist |
| AUTH-004 | Permission System | ✅ Completed | ✅ **VERIFIED** | `src/hooks/usePermissions.ts` (`usePermissions()` hook with `hasPermission()`), `src/utils/permissionUtils.ts` (`hasPermission()`, `getUserPermissions()`) both exist and functional |
| AUTH-005 | Login Page | ✅ Completed | ✅ **VERIFIED** | `src/pages/LoginPage.tsx` exists with email/password form styled with brown/cream design system |
| AUTH-006 | Protected Routes | ✅ Completed | ❌ **NOT IMPLEMENTED** | `src/App.tsx` uses basic `<Routes>`/`<Route>` — **NO** `ProtectedRoute` or `PublicOnlyRoute` component exists. All PMS routes currently accessible to unauthenticated users |
| AUTH-007 | Permission-Aware Navigation | ⬜ Pending | ❌ **NOT IMPLEMENTED** | No sidebar navigation component exists. `src/layouts/PMSLayout.tsx` has empty `<aside>` sidebar placeholder with no navigation items |
| AUTH-008 | Current User State | ✅ Completed | ✅ **VERIFIED** | `src/hooks/useAuth.ts` provides `user`, `isAuthenticated`, `isLoading`, `login()`, `logout()`; `authStore.tsx` manages state via `useReducer` |
| AUTH-009 | Register Page | ⬜ Pending | ❌ **NOT STARTED** | No `RegisterPage.tsx` exists. Need registration form with name, email, password, confirm password fields |
| AUTH-010 | Forget Password | ⬜ Pending | ❌ **NOT STARTED** | No forget password page exists. Need email submission form and reset flow |
| AUTH-011 | Change Password | ⬜ Pending | ❌ **NOT STARTED** | No change password page exists. Needs current password, new password, confirm new password fields for authenticated users |
| AUTH-012 | Reset Password Flow | ⬜ Pending | ❌ **NOT STARTED** | No reset password flow exists. Needs token verification and password update |

**MODULE 03 Progress: 5/12 tasks verified actual (42%)**

---

### MODULE 04 — User Management (6 tasks)

| Task ID | Task Name | Plan Status | Actual Status | Evidence |
|---------|-----------|------------|---------------|----------|
| USER-001 | User List Page | ⬜ Pending | ❌ **NOT STARTED** | No `UserListPage.tsx` in `src/pages/`. No user table component exists |
| USER-002 | Create User | ⬜ Pending | ❌ **NOT STARTED** | No user creation form exists. `userSchema` defined in `validationUtils.ts` but no UI |
| USER-003 | Edit User | ⬜ Pending | ❌ **NOT STARTED** | No user edit form exists |
| USER-004 | Activate/Deactivate User | ⬜ Pending | ❌ **NOT STARTED** | No toggle functionality exists |
| USER-005 | User Detail Page | ⬜ Pending | ❌ **NOT STARTED** | No user detail page exists |
| USER-006 | User Mock Data Integration | ⬜ Pending | ❌ **NOT STARTED** | No `users.json` in `src/data/mock/`, no `userService.ts` in `src/services/` |

**MODULE 04 Progress: 0/6 (0%)**

**Pre-existing Infrastructure for USER-001–006:**
- `src/types/user.types.ts` — exports `AppUser` type
- `src/utils/validationUtils.ts` — `userSchema` zod schema (name, email, password validation)
- `src/hooks/useAuth.ts` — provides `login()` mock function
- `src/stores/authStore.tsx` — provides `user` state and `login`/`logout` actions

---

### MODULE 05 — Role & Permission Management (7 tasks)

| Task ID | Task Name | Plan Status | Actual Status | Evidence |
|---------|-----------|------------|---------------|----------|
| ROLE-001 | Role List Page | ⬜ Pending | ❌ **NOT STARTED** | No `RoleListPage.tsx` in `src/pages/`. No role table component exists |
| ROLE-002 | Create Role | ⬜ Pending | ❌ **NOT STARTED** | No role creation form exists |
| ROLE-003 | Edit Role | ⬜ Pending | ❌ **NOT STARTED** | No role edit form exists |
| ROLE-004 | Delete/Deactivate Role | ⬜ Pending | ❌ **NOT STARTED** | No role deletion/deactivation exists |
| ROLE-005 | Permission List Page | ⬜ Pending | ❌ **NOT STARTED** | No `PermissionListPage.tsx` exists |
| ROLE-006 | Role Permission Assignment | ⬜ Pending | ❌ **NOT STARTED** | No UI for assigning permissions to roles exists |
| ROLE-007 | Permission-Based UI | ⬜ Pending | ❌ **NOT STARTED** | No `<RequirePermission>` component exists. `hasPermission()` utility exists but is not wired into any UI component |

**MODULE 05 Progress: 0/7 (0%)**

**Pre-existing Infrastructure for ROLE-001–007:**
- `src/types/role.types.ts` — exports `AppRole`, `AppPermission` types
- `src/types/permission.types.ts` — exports `AppPermission` type
- `src/types/auth.types.ts` — defines `AppRole` interface with `permissions: AppPermission[]`
- `src/hooks/usePermissions.ts` — `hasPermission()` function available for RBAC gating
- `src/utils/permissionUtils.ts` — `hasPermission()`, `getUserPermissions()` utilities

---

## Combined Task Summary — 25 Total Tasks

| Module | Tasks | Verified Complete | Not Implemented | Pending |
|--------|-------|-------------------|-----------------|---------|
| MODULE 03 | 12 | **5** (AUTH-001, AUTH-003, AUTH-004, AUTH-005, AUTH-008) | **2** (AUTH-002, AUTH-006) | **5** (AUTH-007, AUTH-009, AUTH-010, AUTH-011, AUTH-012) |
| MODULE 04 | 6 | **0** | **6** | **0** |
| MODULE 05 | 7 | **0** | **7** | **0** |
| **TOTAL** | **25** | **5** | **15** | **5** |

**Actual Progress: 5/25 tasks (20%)**

---

## New Features: Registration & Password Management

### AUTH-009 — Register Page
- **Objective**: Registration form with name, email, password, confirm password fields
- **Dependencies**: AUTH-003 (Auth Context/Store)
- **Acceptance Criteria**: Form works, validates all fields, redirects to login on success
- **Required Files**: `src/pages/RegisterPage.tsx`, validation schema, registration service integration
- **Validation**: Name min 2 chars, email format, password min 6 chars, password match confirmation
- **Status**: ❌ **NOT STARTED**

### AUTH-010 — Forget Password
- **Objective**: Forgot password form with email submission and reset flow
- **Dependencies**: AUTH-001 (Auth Data Models)
- **Acceptance Criteria**: Email validated against mock data, reset instructions sent, password can be updated
- **Required Files**: `src/pages/ForgotPasswordPage.tsx`, reset flow logic
- **Flow**: User enters email → system validates → shows success message → user receives reset instructions → reset password page → password updated
- **Status**: ❌ **NOT STARTED**

### AUTH-011 — Change Password
- **Objective**: Authenticated users can change their password
- **Dependencies**: AUTH-005 (Login Page), AUTH-008 (Current User State)
- **Acceptance Criteria**: Current password validated, new password meets strength requirements, password updated in auth store and mock data
- **Required Files**: `src/pages/ChangePasswordPage.tsx`, password change form with validation
- **Validation**: Current password match, new password strength, confirm new password match
- **Status**: ❌ **NOT STARTED**

### AUTH-012 — Reset Password Flow
- **Objective**: Handle password reset token verification and password update
- **Dependencies**: AUTH-010 (Forget Password)
- **Acceptance Criteria**: Token validated, password updated successfully, redirect to login
- **Required Files**: `src/pages/ResetPasswordPage.tsx`, token verification logic
- **Flow**: Token from email → verify token → update password → success redirect
- **Status**: ❌ **NOT STARTED**

---

## Existing Infrastructure (Supports All 3 Modules)

### State Management
| File | Purpose | Status |
|------|---------|--------|
| `src/stores/authStore.tsx` | `AuthProvider` — manages user, `isAuthenticated`, `isLoading`; `login()`, `logout()` actions | ✅ Exists |
| `src/stores/permissionStore.tsx` | `PermissionProvider` — manages `permissions: string[]`; `hasPermission()` | ✅ Exists |
| `src/stores/uiStore.tsx` | `UIProvider` — sidebar state, loading, notifications, modals | ✅ Exists |

### Hooks
| File | Purpose | Status |
|------|---------|--------|
| `src/hooks/useAuth.ts` | Returns `user`, `isAuthenticated`, `isLoading`, `login()`, `logout()` | ✅ Exists |
| `src/hooks/usePermissions.ts` | Returns `permissions: string[]`, `hasPermission(permission: string): boolean` | ✅ Exists |

### Utilities
| File | Purpose | Status |
|------|---------|--------|
| `src/utils/permissionUtils.ts` | `hasPermission(permissions, requiredPermission)`, `getUserPermissions(roles)` | ✅ Exists |
| `src/utils/validationUtils.ts` | Zod schemas: `userSchema`, `roomTypeSchema`, `roomSchema`, `invoiceSchema`, `reservationSchema` | ✅ Exists |
| `src/utils/dateUtils.ts` | Date manipulation helpers | ✅ Exists |
| `src/utils/currencyUtils.ts` | Currency formatting helpers | ✅ Exists |
| `src/utils/formatUtils.ts` | String formatting helpers | ✅ Exists |
| `src/utils/statusUtils.ts` | Status formatting helpers (extra, not in original plan) | ✅ Exists |

### Types
| File | Purpose | Status |
|------|---------|--------|
| `src/types/auth.types.ts` | `AppUser`, `AppRole`, `AppPermission`, `RoomType`, `Room`, `Reservation`, `ReservationRoom`, `Invoice`, `InvoiceItem`, `Expense`, `Sale` | ✅ Exists |
| `src/types/user.types.ts` | Re-exports `AppUser`, `AppRole`, `AppPermission`, `RoomType`, `Room`, `Reservation`, `ReservationRoom`, `Invoice`, `InvoiceItem`, `Expense`, `Sale` | ✅ Exists |
| `src/types/role.types.ts` | Re-exports `AppRole`, `AppPermission` | ✅ Exists |
| `src/types/permission.types.ts` | Re-exports `AppPermission` | ✅ Exists |
| `src/types/reservation.types.ts` | Re-exports `Reservation`, `ReservationRoom` | ✅ Exists |
| `src/types/invoice.types.ts` | Invoice-related types | ✅ Exists |
| `src/types/finance.types.ts` | Finance-related types | ✅ Exists |
| `src/types/public.types.ts` | Public-facing types | ✅ Exists |

### Constants
| File | Purpose | Status |
|------|---------|--------|
| `src/constants/reservationStatuses.ts` | `reservationStatuses`, `reservationSources`, `expenseCategories` | ✅ Exists |

### Config
| File | Purpose | Status |
|------|---------|--------|
| `src/config/routes.ts` | Route definitions for public and PMS | ✅ Exists |
| `src/config/app.ts` | Centralized app configuration with design tokens | ✅ Exists |

### Shared Components (Available for Modules 03–05)
| Component | Status |
|-----------|--------|
| `Button.tsx` | ✅ Exists |
| `Input.tsx` | ✅ Exists |
| `Select.tsx` | ✅ Exists |
| `Modal.tsx` | ✅ Exists |
| `Card.tsx` | ✅ Exists |
| `Badge.tsx` | ✅ Exists |
| `Loading.tsx` | ✅ Exists |
| `EmptyState.tsx` | ✅ Exists |
| `ErrorState.tsx` | ✅ Exists |
| `ConfirmDialog.tsx` | ✅ Exists |
| `Pagination.tsx` | ✅ Exists |
| **`Table.tsx`** | ❌ **MISSING** |
| `src/components/shared/index.ts` | Exports 11 components (missing Table) |

### Layouts (Available)
| Layout | Status |
|--------|--------|
| `src/layouts/BaseLayout.tsx` | ✅ Exists (header/main/footer with `<Outlet />`) |
| `src/layouts/PublicLayout.tsx` | ✅ Exists (header/main/footer) |
| `src/layouts/PMSLayout.tsx` | ✅ Exists (header/sidebar/main/footer) — sidebar is **empty placeholder** |

---

## Missing Items Required for Modules 03–05

### Critical Missing Items (New Features)
| Missing Item | Feature | Description |
|-------------|---------|-------------|
| **`RegisterPage.tsx`** | AUTH-009 | Registration form with name, email, password, confirm password |
| **`ForgotPasswordPage.tsx`** | AUTH-010 | Email submission form and reset instructions |
| **`ChangePasswordPage.tsx`** | AUTH-011 | Change password form for authenticated users |
| **`ResetPasswordPage.tsx`** | AUTH-012 | Token verification and password update page |
| **Registration validation schema** | AUTH-009 | Zod schema for registration (name, email, password, confirm password) |
| **Password reset flow logic** | AUTH-010, AUTH-012 | Token generation, verification, and password update logic |

### Existing Critical Missing Items
| Missing Item | Module | Description |
|-------------|--------|-------------|
| **Mock data JSON files** | AUTH-002 | `src/data/mock/users.json` (5 users), `src/data/mock/roles.json` (5 roles), `src/data/mock/permissions.json` (5+ permissions) |
| **`ProtectedRoute.tsx`** | AUTH-006 | Component that redirects unauthenticated users to `/login` |
| **`PublicOnlyRoute.tsx`** | AUTH-006 | Component that redirects authenticated users away from `/login` |
| **Sidebar navigation** | AUTH-007 | Permission-aware sidebar with navigation items in `PMSLayout.tsx` |
| **User List Page** | USER-001 | `src/pages/users/UserListPage.tsx` with table, search, filter, pagination |
| **Create User Form** | USER-002 | User creation form with validation |
| **Edit User Form** | USER-003 | User edit form |
| **Activate/Deactivate** | USER-004 | Toggle user status with confirmation |
| **User Detail Page** | USER-005 | `src/pages/users/UserDetailPage.tsx` |
| **User Service** | USER-006 | `src/services/userService.ts` with CRUD functions |
| **User Mock Data** | USER-006 | `src/data/mock/users.json` |
| **Role List Page** | ROLE-001 | `src/pages/roles/RoleListPage.tsx` |
| **Create/Edit Role Forms** | ROLE-002, ROLE-003 | Role creation and edit forms |
| **Delete/Deactivate Role** | ROLE-004 | Role deletion/deactivation |
| **Permission List Page** | ROLE-005 | `src/pages/permissions/PermissionListPage.tsx` |
| **Role Permission Assignment UI** | ROLE-006 | Checkbox/tree interface for assigning permissions |
| **`<RequirePermission>` Component** | ROLE-007 | Permission-gated component wrapper |
| **`Table.tsx`** | SHARED | Missing shared component needed for all list pages |

### Additional Missing Infrastructure
| Missing Item | Description |
|-------------|-------------|
| **`src/services/` directory** | No service layer files (`authService.ts`, `userService.ts`, `roleService.ts`, `permissionService.ts`) |
| **`src/hooks/useAuth.ts` — mock data connection** | Current `login()` is hardcoded mock, not connected to JSON data |
| **Password reset token service** | Needed for AUTH-010/AUTH-012 token generation and verification |
| **Permission-aware navigation** | `PMSLayout.tsx` sidebar is empty — needs navigation items filtered by permissions |

---

## Implementation Plan — Recommended Order

### Phase 0: New Auth Features (AUTH-009 to AUTH-012)
1. **AUTH-009**: Create `src/pages/RegisterPage.tsx` with registration form, validation schema, and mock data integration
2. **AUTH-010**: Create `src/pages/ForgotPasswordPage.tsx` with email submission and reset instructions flow
3. **AUTH-012**: Create `src/pages/ResetPasswordPage.tsx` with token verification and password update logic
4. **AUTH-011**: Create `src/pages/ChangePasswordPage.tsx` for authenticated users, integrate with `useAuth()` and `authStore.tsx`
5. Add registration, forget password, and reset password routes to `src/config/routes.ts` and `src/App.tsx`
6. Update `src/App.tsx` to include new routes

### Phase 1: Complete MODULE 03 Gaps
7. **AUTH-002**: Create `src/data/mock/users.json` (5 users with roles), `src/data/mock/roles.json` (5 roles with permissions), `src/data/mock/permissions.json` (5+ permissions)
8. **AUTH-006**: Create `src/components/ProtectedRoute.tsx` and `src/components/PublicOnlyRoute.tsx`, integrate into `src/App.tsx`
9. **AUTH-007**: Create sidebar navigation in `PMSLayout.tsx` with permission-filtered items using `usePermissions()`
10. Connect `useAuth.ts` `login()` to mock data instead of hardcoded values
11. Connect registration, login, and password features to mock data

### Phase 2: Complete MODULE 04 (User Management)
12. Create `src/services/userService.ts` with CRUD functions reading from mock data
13. Create `src/pages/users/UserListPage.tsx` (table with search, filter, pagination)
14. Create `src/pages/users/UserFormPage.tsx` (create/edit form)
15. Create `src/pages/users/UserDetailPage.tsx`
16. Implement activate/deactivate toggle with `ConfirmDialog`
17. Integrate with `userSchema` from `validationUtils.ts`

### Phase 3: Complete MODULE 05 (Role & Permission Management)
18. Create `src/services/roleService.ts` and `src/services/permissionService.ts`
19. Create `src/pages/roles/RoleListPage.tsx`, `RoleFormPage.tsx`
20. Create `src/pages/permissions/PermissionListPage.tsx`
21. Create role-permission assignment UI
22. Create `<RequirePermission>` wrapper component

### Phase 4: Shared Component Completion
23. Create missing `src/components/shared/Table.tsx`
24. Update `src/components/shared/index.ts` to export all 12 components
25. Create `src/components/ProtectedRoute.tsx` and `PublicOnlyRoute.tsx`

---

## Task Status Tracker (Update as Work Progresses)

### MODULE 03 — Authentication & RBAC Foundation

| Task ID | Task Name | Status | Notes |
|---------|-----------|--------|-------|
| AUTH-001 | Auth Data Models | ✅ Completed | Types defined in `src/types/auth.types.ts` |
| AUTH-002 | Auth Mock Data | ❌ **NOT IMPLEMENTED** | `src/data/mock/` is empty — needs `users.json`, `roles.json`, `permissions.json` |
| AUTH-003 | Auth Context/Store | ✅ Completed | `authStore.tsx`, `permissionStore.tsx`, `uiStore.tsx` exist |
| AUTH-004 | Permission System | ✅ Completed | `usePermissions.ts`, `permissionUtils.ts` exist |
| AUTH-005 | Login Page | ✅ Completed | `LoginPage.tsx` exists with design system styling |
| AUTH-006 | Protected Routes | ❌ **NOT IMPLEMENTED** | No `ProtectedRoute`/`PublicOnlyRoute` components; `App.tsx` has basic routes only |
| AUTH-007 | Permission-Aware Navigation | ❌ **NOT STARTED** | Sidebar in `PMSLayout.tsx` is empty placeholder |
| AUTH-008 | Current User State | ✅ Completed | `useAuth()` hook and `authStore.tsx` manage user state |
| AUTH-009 | Register Page | ❌ **NOT STARTED** | New feature — registration form with validation |
| AUTH-010 | Forget Password | ❌ **NOT STARTED** | New feature — email submission and reset flow |
| AUTH-011 | Change Password | ❌ **NOT STARTED** | New feature — authenticated user password change |
| AUTH-012 | Reset Password Flow | ❌ **NOT STARTED** | New feature — token verification and password update |

**MODULE 03: 5/12 complete (42%)**

### MODULE 04 — User Management

| Task ID | Task Name | Status | Notes |
|---------|-----------|--------|-------|
| USER-001 | User List Page | ❌ **NOT STARTED** | No page exists |
| USER-002 | Create User | ❌ **NOT STARTED** | `userSchema` exists in `validationUtils.ts` |
| USER-003 | Edit User | ❌ **NOT STARTED** | — |
| USER-004 | Activate/Deactivate User | ❌ **NOT STARTED** | — |
| USER-005 | User Detail Page | ❌ **NOT STARTED** | — |
| USER-006 | User Mock Data Integration | ❌ **NOT STARTED** | No `users.json`, no `userService.ts` |

**MODULE 04: 0/6 complete (0%)**

### MODULE 05 — Role & Permission Management

| Task ID | Task Name | Status | Notes |
|---------|-----------|--------|-------|
| ROLE-001 | Role List Page | ❌ **NOT STARTED** | No page exists |
| ROLE-002 | Create Role | ❌ **NOT STARTED** | — |
| ROLE-003 | Edit Role | ❌ **NOT STARTED** | — |
| ROLE-004 | Delete/Deactivate Role | ❌ **NOT STARTED** | — |
| ROLE-005 | Permission List Page | ❌ **NOT STARTED** | — |
| ROLE-006 | Role Permission Assignment | ❌ **NOT STARTED** | — |
| ROLE-007 | Permission-Based UI | ❌ **NOT STARTED** | `hasPermission()` utility exists but no UI component |

**MODULE 05: 0/7 complete (0%)**

---

## Combined Acceptance Criteria

### For MODULE 03
- [ ] `npm install` completes successfully
- [ ] `npm run dev` starts development server
- [ ] Login form works with mock data
- [ ] Registration form works with validation (name, email, password, confirm password)
- [ ] Forget password flow works (email submission → reset → password update)
- [ ] Change password works for authenticated users
- [ ] Reset password flow handles token verification
- [ ] Authentication state persists across pages
- [ ] Permission checking works correctly (`hasPermission()`)
- [ ] Protected routes redirect unauthenticated users to `/login`
- [ ] Navigation reflects user permissions
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] No console errors in browser

### For MODULE 04
- [ ] All CRUD operations work with mock data
- [ ] Search and filter functionality works
- [ ] Forms validate correctly using `userSchema`
- [ ] Status toggles work with confirmation dialogs
- [ ] Pagination works (if applicable)
- [ ] User list displays with all columns (Name, Email, Roles, Status, Actions)
- [ ] Create/Edit user forms functional
- [ ] User detail page displays all information

### For MODULE 05
- [ ] All CRUD operations work with mock data for roles
- [ ] Search and filter functionality works for roles
- [ ] Forms validate correctly
- [ ] Status toggles work
- [ ] Permission assignment UI functional (checkbox/tree interface)
- [ ] Permission-based UI components work (buttons/actions gated by permissions)
- [ ] All pages responsive across devices

---

## Cross-Module Dependencies

```
AUTH-001 (Types) → AUTH-002 (Mock Data) → AUTH-003 (Stores) → AUTH-004 (Permissions) → AUTH-005 (Login)
                                                                        ↓
AUTH-009 (Register) ← AUTH-003                                  AUTH-008 (User State)
AUTH-010 (Forget Password) ← AUTH-001                            ↓
AUTH-012 (Reset Password) ← AUTH-010                           AUTH-006 (Protected Routes)
AUTH-011 (Change Password) ← AUTH-005, AUTH-008                     ↓
                                                                        ↓
USER-001–006 (User Management) ← AUTH-005, AUTH-007                   ROLE-001–007 (Role Management) ← AUTH-004, AUTH-007
```

**Critical Path:**
1. AUTH-002 (Mock Data) — must be done first to populate all modules
2. AUTH-006 (Protected Routes) — must be done before any PMS feature is accessible
3. AUTH-007 (Permission-Aware Navigation) — must be done before any module-specific UI
4. AUTH-009 to AUTH-012 (New Auth Features) — can be developed in parallel with Phase 1
5. USER-001 + ROLE-001 can be done in parallel after Phase 0–1

---

## Files Already Created (Do Not Recreate)

### Source Files Available
- `src/types/auth.types.ts` — All core types (AppUser, AppRole, AppPermission, RoomType, Room, Reservation, Invoice, Expense, Sale)
- `src/types/user.types.ts`, `role.types.ts`, `permission.types.ts`, `reservation.types.ts`, `invoice.types.ts`, `finance.types.ts`, `public.types.ts` — Re-export types
- `src/stores/authStore.tsx` — Auth context with `useReducer`
- `src/stores/permissionStore.tsx` — Permission context
- `src/stores/uiStore.tsx` — UI state context
- `src/hooks/useAuth.ts` — Auth hook
- `src/hooks/usePermissions.ts` — Permission hook
- `src/utils/permissionUtils.ts` — Permission utilities
- `src/utils/validationUtils.ts` — Zod validation schemas
- `src/utils/dateUtils.ts`, `currencyUtils.ts`, `formatUtils.ts`, `statusUtils.ts` — Utility functions
- `src/config/routes.ts` — Route definitions
- `src/config/app.ts` — App configuration with design tokens
- `src/styles/globals.css` — CSS custom properties, reset, animations
- `src/index.css` — Base styles
- `src/layouts/BaseLayout.tsx`, `PublicLayout.tsx`, `PMSLayout.tsx` — Layout components
- `src/pages/LoginPage.tsx` — Login page
- `src/components/shared/` — 11 shared components (Button, Input, Select, Modal, Card, Badge, Loading, EmptyState, ErrorState, ConfirmDialog, Pagination) + `index.ts`
- `src/constants/reservationStatuses.ts` — Reservation constants

### Config Files Available
- `package.json` — All dependencies configured
- `tsconfig.json` — TypeScript strict mode with `@/` path alias
- `vite.config.ts` — Vite with React + Tailwind plugins
- `tailwind.config.ts` — Custom theme (brown/cream)
- `postcss.config.js` — PostCSS configuration
- `index.html` — HTML entry point

---

## Verification Checklist

- [ ] `npm run dev` starts without errors
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npm run build` completes successfully
- [ ] Login form submits and sets auth state
- [ ] Registration form submits and redirects to login
- [ ] Forget password email submission works
- [ ] Reset password flow completes successfully
- [ ] Change password updates auth store correctly
- [ ] Protected routes redirect unauthenticated users
- [ ] `hasPermission()` returns correct permissions from user roles
- [ ] Mock data JSON files load correctly
- [ ] User list page displays mock users
- [ ] Role list page displays mock roles
- [ ] Permission checks gate UI elements correctly
- [ ] `npm run lint` passes with zero errors
- [ ] No TypeScript errors in any file
- [ ] No console errors in browser

---

*Document created from FRONTEND_PLAN.md Sections 10, 34, 35, 36, 39 and actual project file analysis.
Features added: Registration, Forget Password, Change Password, Reset Password flows (AUTH-009 to AUTH-012).
Updated: 2026-09-15*
