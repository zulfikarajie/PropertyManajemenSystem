# MODULE 01 — Project Foundation

## Overview

This module establishes the entire project scaffolding: build tooling, styling framework, global design system, base layout, routing architecture, shared UI component library, and verified local development environment. All subsequent modules depend on the foundation laid here.

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | React 18+ | Component-based UI |
| Build Tool | Vite | Fast bundling and HMR |
| Language | TypeScript | Static type checking |
| Styling | Tailwind CSS | Utility-first CSS |
| Routing | React Router | Client-side routing |
| Forms | React Hook Form + Zod | Form handling and validation |
| Date | date-fns | Date manipulation |
| Icons | Lucide React | Icon library |
| Linting | ESLint + Prettier | Code quality and formatting |

---

## Project Structure (Foundation Files Only)

```
frontend/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── App.css
    ├── index.css
    ├── vite-env.d.ts
    ├── config/
    │   ├── routes.ts
    │   ├── tailwind.config.ts
    │   └── app.ts
    ├── layouts/
    │   ├── PublicLayout.tsx
    │   ├── PMSLayout.tsx
    │   └── BaseLayout.tsx
    ├── components/
    │   └── shared/
    │       ├── Button.tsx
    │       ├── Input.tsx
    │       ├── Select.tsx
    │       ├── Modal.tsx
    │       ├── Table.tsx
    │       ├── Card.tsx
    │       ├── Badge.tsx
    │       ├── Loading.tsx
    │       ├── EmptyState.tsx
    │       ├── ErrorState.tsx
    │       ├── ConfirmDialog.tsx
    │       └── Pagination.tsx
    ├── hooks/
    │   ├── useAuth.ts
    │   └── usePermissions.ts
    ├── stores/
    │   ├── authStore.ts
    │   ├── permissionStore.ts
    │   └── uiStore.ts
    ├── types/
    │   ├── auth.types.ts
    │   ├── user.types.ts
    │   ├── role.types.ts
    │   ├── permission.types.ts
    │   ├── room.types.ts
    │   ├── reservation.types.ts
    │   ├── invoice.types.ts
    │   ├── finance.types.ts
    │   └── public.types.ts
    ├── utils/
    │   ├── dateUtils.ts
    │   ├── currencyUtils.ts
    │   ├── formatUtils.ts
    │   ├── permissionUtils.ts
    │   └── validationUtils.ts
    ├── constants/
    │   ├── reservationStatuses.ts
    │   ├── reservationSources.ts
    │   ├── expenseCategories.ts
    │   └── routes.ts
    └── styles/
        └── globals.css
```

---

## Task Breakdown

### FOUND-001 — Project Setup

| Field | Detail |
|-------|--------|
| **Task ID** | FOUND-001 |
| **Task Name** | Project Setup |
| **Module** | MODULE 01 — Project Foundation |
| **Objective** | Initialize Vite + React + TypeScript project with all configuration files |
| **Dependencies** | None |
| **Status** | ⬜ Pending |
| **Priority** | High |
| **Estimated Effort** | 2-3 hours |

#### Objective
Initialize the Vite project with React, TypeScript, ESLint, Prettier, and all base configuration files. This is the absolute starting point for the entire project.

#### Implementation Steps
1. Run `npm create vite@latest` with React + TypeScript template
2. Install dependencies (`npm install`)
3. Configure `package.json` scripts: `dev`, `build`, `preview`, `lint`, `format`
4. Set up `tsconfig.json` with strict mode enabled
5. Configure `vite.config.ts` with plugins and aliases
6. Set up `.gitignore` with appropriate exclusions
7. Set up `.eslintrc.cjs` for ESLint
8. Set up `.prettierrc` for Prettier formatting
9. Create `postcss.config.js` for Tailwind CSS processing
10. Verify project structure is created correctly

#### Files to Create
| File | Description |
|------|-------------|
| `package.json` | Project manifest with scripts and dependencies |
| `tsconfig.json` | TypeScript configuration with strict mode |
| `tsconfig.app.json` | Application-specific TypeScript config |
| `tsconfig.node.json` | Build tool TypeScript config |
| `vite.config.ts` | Vite configuration with plugins and path aliases |
| `postcss.config.js` | PostCSS configuration for Tailwind |
| `.eslintrc.cjs` | ESLint configuration |
| `.prettierrc` | Prettier formatting rules |
| `.gitignore` | Git ignore rules |
| `index.html` | HTML entry point |
| `src/main.tsx` | Application entry point |
| `src/App.tsx` | Root App component |
| `src/vite-env.d.ts` | Vite type declarations |

#### Acceptance Criteria
- `npm install` completes without errors
- `npm run dev` starts the Vite development server
- No TypeScript compilation errors in console
- Project structure matches the folder structure above
- All configuration files are properly formatted

#### Definition of Done
- All configuration files created and validated
- `npm install` and `npm run dev` work without errors
- Development server starts on port 5173
- No console errors on initial load
- Blank page renders successfully

---

### FOUND-002 — Tailwind CSS Setup

| Field | Detail |
|-------|--------|
| **Task ID** | FOUND-002 |
| **Task Name** | Tailwind CSS Setup |
| **Module** | MODULE 01 — Project Foundation |
| **Objective** | Configure Tailwind CSS with custom theme colors, fonts, and spacing |
| **Dependencies** | FOUND-001 |
| **Status** | ⬜ Pending |
| **Priority** | High |
| **Estimated Effort** | 2-3 hours |

#### Objective
Configure Tailwind CSS with the project's custom design system including colors, fonts, spacing scale, border radii, shadows, and responsive breakpoints that match the hospitality/property theme.

#### Implementation Steps
1. Install `tailwindcss`, `@tailwindcss/vite`, `postcss`, `autoprefixer`
2. Configure `tailwind.config.ts` with content paths
3. Define custom color palette in `tailwind.config.ts`
4. Define custom font family in `tailwind.config.ts`
5. Configure custom spacing scale
6. Add custom border radius values
7. Add custom shadow values
8. Configure responsive breakpoints if needed
9. Add dark mode configuration (if applicable)
10. Import Tailwind directives in `src/index.css`
11. Create `src/config/tailwind.config.ts` for centralized configuration
12. Verify Tailwind classes work in a test component

#### Custom Theme Design Tokens

**Colors** (Hospitality/Property Theme):
```typescript
colors: {
  brand: {
    50: '#FFF8F0',
    100: '#FFEED0',
    200: '#FFDDB3',
    300: '#FFC480',
    400: '#FFA04D',
    500: '#FF8020',
    600: '#E06B1A',
    700: '#B35015',
    800: '#803A10',
    900: '#4D250A',
  },
  surface: {
    50: '#F8F9FA',
    100: '#F1F3F5',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#868E96',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
  },
  accent: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3',
    600: '#1E88E5',
    700: '#1565C0',
    800: '#0D47A1',
    900: '#0D47A1',
  }
}
```

**Font Family**:
```typescript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  display: ['Playfair Display', 'serif'],
  mono: ['JetBrains Mono', 'monospace'],
}
```

**Border Radius**:
```typescript
borderRadius: {
  'xs': '2px',
  'sm': '4px',
  'DEFAULT': '8px',
  'md': '12px',
  'lg': '16px',
  'xl': '24px',
  '2xl': '32px',
  'full': '9999px',
}
```

**Shadows**:
```typescript
boxShadow: {
  'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
  'card': '0 4px 12px rgba(0, 0, 0, 0.08)',
}
```

**Spacing Scale** (custom extensions):
```typescript
spacing: {
  '18': '4.5rem',
  '88': '22rem',
  '128': '32rem',
}
```

**Breakpoints**:
```typescript
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}
```

#### Files to Create/Modify
| File | Description |
|------|-------------|
| `tailwind.config.ts` | Main Tailwind configuration |
| `src/config/tailwind.config.ts` | Centralized Tailwind configuration |
| `src/index.css` | Tailwind directives and global styles |
| `postcss.config.js` | PostCSS configuration |
| `package.json` | Added Tailwind dependencies |

#### Acceptance Criteria
- Tailwind CSS classes work in components
- Custom colors render correctly
- Custom fonts are applied
- Responsive classes work at all breakpoints
- `npm run dev` shows no CSS errors

#### Definition of Done
- Tailwind CSS properly configured with custom theme
- All custom design tokens defined in configuration
- Tailwind directives import in `index.css`
- Verified by applying Tailwind classes to a test component
- No TypeScript or console errors

---

### FOUND-003 — Global Styles & Design Tokens

| Field | Detail |
|-------|--------|
| **Task ID** | FOUND-003 |
| **Task Name** | Global Styles & Design Tokens |
| **Module** | MODULE 01 — Project Foundation |
| **Objective** | Define CSS variables, typography scale, spacing system, and global base styles |
| **Dependencies** | FOUND-002 |
| **Status** | ⬜ Pending |
| **Priority** | High |
| **Estimated Effort** | 2-3 hours |

#### Objective
Create the global CSS foundation including CSS custom properties (design tokens), CSS reset/base styles, typography system, spacing utilities, and global animation definitions.

#### Implementation Steps
1. Create `src/styles/globals.css`
2. Define CSS custom properties in `:root` selector
3. Define dark mode CSS variables (if applicable)
4. Create CSS reset/normalize styles
5. Define global typography styles (h1-h6, p, span, etc.)
6. Create spacing utility classes
7. Define global animation keyframes
8. Set up global focus styles for accessibility
9. Configure selection styling
10. Set up scroll behavior
11. Define z-index scale
12. Create reusable utility classes beyond Tailwind

#### Design Tokens (CSS Custom Properties)
```css
:root {
  /* Colors */
  --color-primary: #FF8020;
  --color-primary-light: #FFA04D;
  --color-primary-dark: #E06B1A;
  --color-primary-subtle: #FFF8F0;
  --color-accent: #2196F3;
  --color-accent-light: #64B5F6;
  --color-accent-dark: #1565C0;
  --color-accent-subtle: #E3F2FD;
  --color-surface-50: #F8F9FA;
  --color-surface-100: #F1F3F5;
  --color-surface-200: #E9ECEF;
  --color-surface-300: #DEE2E6;
  --color-surface-400: #CED4DA;
  --color-surface-500: #ADB5BD;
  --color-surface-600: #868E96;
  --color-surface-700: #495057;
  --color-surface-800: #343A40;
  --color-surface-900: #212529;
  --color-white: #FFFFFF;
  --color-black: #000000;

  /* Typography */
  --font-family-sans: 'Inter', system-ui, sans-serif;
  --font-family-display: 'Playfair Display', serif;
  --font-family-mono: 'JetBrains Mono', monospace;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* Border Radius */
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --shadow-soft: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-card: 0 4px 12px rgba(0, 0, 0, 0.08);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;
  --transition-spring: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Z-Index Scale */
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal-backdrop: 400;
  --z-modal: 500;
  --z-toast: 600;
  --z-tooltip: 700;
}
```

#### Global Base Styles
```css
/* CSS Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-family-sans);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-surface-900);
  background-color: var(--color-surface-50);
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-display);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  color: var(--color-surface-800);
}

h1 { font-size: var(--font-size-5xl); }
h2 { font-size: var(--font-size-4xl); }
h3 { font-size: var(--font-size-3xl); }
h4 { font-size: var(--font-size-2xl); }
h5 { font-size: var(--font-size-xl); }
h6 { font-size: var(--font-size-lg); }

p {
  margin-bottom: var(--space-4);
}

a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--color-primary-dark);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Focus Styles */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: var(--radius-xs);
}

/* Selection */
::selection {
  background-color: var(--color-primary-subtle);
  color: var(--color-primary-dark);
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-surface-100);
}

::-webkit-scrollbar-thumb {
  background: var(--color-surface-400);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-surface-500);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-fade-in { animation: fadeIn var(--transition-normal) ease; }
.animate-slide-up { animation: slideUp var(--transition-normal) ease; }
.animate-slide-down { animation: slideDown var(--transition-normal) ease; }
.animate-scale-in { animation: scaleIn var(--transition-spring) ease; }
```

#### Files to Create/Modify
| File | Description |
|------|-------------|
| `src/styles/globals.css` | Global CSS with custom properties, reset, typography, animations |
| `src/index.css` | Import globals.css and Tailwind directives |
| `src/config/app.ts` | Centralized app configuration exporting design tokens |
| `package.json` | Add font packages (Inter, Playfair Display, JetBrains Mono) |

#### Acceptance Criteria
- CSS custom properties defined and accessible
- Global reset applied
- Typography scale consistent
- Global animations work
- Focus styles accessible
- No visual regressions from CSS
- All components inherit design tokens

#### Definition of Done
- `globals.css` created with all design tokens
- CSS reset applied globally
- Typography hierarchy defined
- Animations defined and working
- Focus styles accessible
- Verified by rendering a page with mixed typography

---

### FOUND-004 — Base Layout

| Field | Detail |
|-------|--------|
| **Task ID** | FOUND-004 |
| **Task Name** | Base Layout |
| **Module** | MODULE 01 — Project Foundation |
| **Objective** | Create the app shell with router outlet and base layout structure |
| **Dependencies** | FOUND-003 |
| **Status** | ⬜ Pending |
| **Priority** | High |
| **Estimated Effort** | 2-3 hours |

#### Objective
Create the foundational layout components that wrap all pages. This includes the main App component with router configuration, the public layout shell, and the internal PMS layout shell.

#### Implementation Steps
1. Set up `src/App.tsx` with `<BrowserRouter>` and `<Routes>`/`<Route>` configuration
2. Create `src/layouts/BaseLayout.tsx` — the core layout wrapper
3. Create `src/layouts/PublicLayout.tsx` — layout for public website pages
4. Create `src/layouts/PMSLayout.tsx` — layout for internal PMS pages
5. Define the route structure skeleton in `src/config/routes.ts`
6. Create placeholder page components (Home, Login, Dashboard)
7. Set up the layout structure with header/footer slots
8. Create sidebar slot for PMS layout
9. Add layout-level error boundary
10. Create a loading component for route transitions

#### BaseLayout Component Structure
```tsx
// BaseLayout.tsx
import { Outlet } from 'react-router-dom';

interface BaseLayoutProps {
  className?: string;
}

export function BaseLayout({ className }: BaseLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <header className="flex-shrink-0">
        {/* Header slot */}
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="flex-shrink-0">
        {/* Footer slot */}
      </footer>
    </div>
  );
}
```

#### PublicLayout Component Structure
```tsx
// PublicLayout.tsx
import { BaseLayout } from './BaseLayout';

export function PublicLayout() {
  return (
    <BaseLayout>
      <PublicHeader slot="header" />
      <div slot="main">
        <Outlet />
      </div>
      <PublicFooter slot="footer" />
    </BaseLayout>
  );
}
```

#### PMSLayout Component Structure
```tsx
// PMSLayout.tsx
import { BaseLayout } from './BaseLayout';

export function PMSLayout() {
  return (
    <BaseLayout>
      <PMSHeader slot="header" />
      <div className="flex flex-1">
        <PMSSidebar slot="sidebar" />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
      <PMSSFooter slot="footer" />
    </BaseLayout>
  );
}
```

#### Routes Configuration
```typescript
// src/config/routes.ts
export const routes = {
  public: {
    home: '/',
    about: '/about',
    rooms: '/rooms',
    gallery: '/gallery',
    contact: '/contact',
  },
  pms: {
    login: '/login',
    dashboard: '/dashboard',
    reservations: '/reservations',
    calendar: '/reservations/calendar',
    rooms: '/rooms',
    roomTypes: '/room-types',
    users: '/users',
    roles: '/roles',
    permissions: '/permissions',
    finance: '/finance',
    sales: '/finance/sales',
    invoices: '/finance/invoices',
    reports: '/finance/reports',
    expenses: '/finance/expenses',
  },
} as const;
```

#### Files to Create/Modify
| File | Description |
|------|-------------|
| `src/App.tsx` | Root component with RouterProvider and route configuration |
| `src/layouts/BaseLayout.tsx` | Core layout wrapper with header/main/footer slots |
| `src/layouts/PublicLayout.tsx` | Public website layout |
| `src/layouts/PMSLayout.tsx` | Internal PMS layout with sidebar |
| `src/config/routes.ts` | Centralized route definitions |
| `src/pages/HomePage.tsx` | Placeholder home page |
| `src/pages/LoginPage.tsx` | Placeholder login page |
| `src/pages/DashboardPage.tsx` | Placeholder dashboard page |
| `src/components/Loading.tsx` | Loading spinner component |

#### Acceptance Criteria
- Router renders correctly with all defined routes
- PublicLayout wraps public pages with header and footer
- PMSLayout wraps PMS pages with header, sidebar, and content area
- `<Outlet />` renders child routes correctly
- Layout structure is consistent across all pages
- No layout-related console errors

#### Definition of Done
- All layout components created and rendering
- Router configured with base routes (even if pages are placeholders)
- Layout nesting works correctly
- Outlet renders child routes
- `npm run dev` shows correct layout structure
- No TypeScript errors

---

### FOUND-005 — Routing Setup

| Field | Detail |
|-------|--------|
| **Task ID** | FOUND-005 |
| **Task Name** | Routing Setup |
| **Module** | MODULE 01 — Project Foundation |
| **Objective** | Configure React Router with all public and PMS routes including nested routes and protected routes |
| **Dependencies** | FOUND-004 |
| **Status** | ⬜ Pending |
| **Priority** | High |
| **Estimated Effort** | 2-3 hours |

#### Objective
Set up the complete routing architecture with React Router v6, including nested routes, route grouping, protected route guards, lazy loading configuration, and 404 handling.

#### Implementation Steps
1. Install `react-router-dom`
2. Configure router in `src/App.tsx` with `createBrowserRouter`
3. Define all public routes with PublicLayout wrapper
4. Define all PMS routes with PMSLayout wrapper
5. Implement ProtectedRoute component
6. Implement PublicOnlyRoute component (for login page)
7. Set up lazy loading for route components
8. Define nested routes for each module
9. Add 404 catch-all route
10. Set up route transitions/loaders
11. Configure route navigation and links
12. Add breadcrumb navigation structure (planned)

#### Route Structure
```typescript
// Complete route tree
const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'rooms', element: <RoomTypesPage /> },
      { path: 'gallery', element: <GalleryPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
  {
    path: '/login',
    element: <PublicOnlyRoute><LoginPage /></PublicOnlyRoute>,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><PMSLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: 'reservations',
        children: [
          { index: true, element: <ReservationListPage /> },
          { path: ':id', element: <ReservationDetailPage /> },
          { path: 'calendar', element: <ReservationCalendarPage /> },
          { path: 'new', element: <ReservationFormPage /> },
        ],
      },
      {
        path: 'rooms',
        children: [
          { index: true, element: <RoomListPage /> },
          { path: 'types', element: <RoomTypeListPage /> },
          { path: 'types/new', element: <RoomTypeFormPage /> },
          { path: 'types/:id/edit', element: <RoomTypeFormPage /> },
          { path: 'new', element: <RoomFormPage /> },
          { path: ':id/edit', element: <RoomFormPage /> },
        ],
      },
      {
        path: 'users',
        children: [
          { index: true, element: <UserListPage /> },
          { path: ':id', element: <UserDetailPage /> },
          { path: 'new', element: <UserFormPage /> },
          { path: ':id/edit', element: <UserFormPage /> },
        ],
      },
      {
        path: 'roles',
        children: [
          { index: true, element: <RoleListPage /> },
          { path: 'new', element: <RoleFormPage /> },
          { path: ':id/edit', element: <RoleFormPage /> },
        ],
      },
      {
        path: 'permissions',
        element: <PermissionListPage />,
      },
      {
        path: 'finance',
        children: [
          { index: true, element: <SalesPage /> },
          { path: 'sales', element: <SalesPage /> },
          { path: 'invoices', element: <InvoiceListPage /> },
          { path: 'invoices/new', element: <InvoiceFormPage /> },
          { path: 'invoices/:id', element: <InvoiceDetailPage /> },
          { path: 'reports', element: <ReportPage /> },
          { path: 'expenses', element: <ExpensesPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
```

#### ProtectedRoute Component
```tsx
// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
```

#### PublicOnlyRoute Component
```tsx
// src/components/PublicOnlyRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
```

#### Files to Create/Modify
| File | Description |
|------|-------------|
| `src/App.tsx` | Updated with `createBrowserRouter` and all routes |
| `src/config/routes.ts` | Complete route configuration |
| `src/components/ProtectedRoute.tsx` | Authentication guard component |
| `src/components/PublicOnlyRoute.tsx` | Redirect authenticated users away from login |
| `src/pages/NotFoundPage.tsx` | 404 page |
| `src/pages/HomePage.tsx` | Updated with router links |
| All page files | Updated placeholder files |

#### Acceptance Criteria
- All public routes render correctly
- `/login` is accessible to unauthenticated users only
- All PMS routes redirect to `/login` when unauthenticated
- Nested routes render correctly within layouts
- 404 page displays for unknown routes
- Navigation between routes works without page reload
- `npm run dev` shows correct page rendering

#### Definition of Done
- All routes defined and functional
- Protected routes work correctly
- PublicOnlyRoute prevents authenticated users from accessing login
- Nested routes render within correct layout
- 404 page handles unknown routes
- No TypeScript errors
- No console errors during navigation

---

### FOUND-006 — UI Components Library

| Field | Detail |
|-------|--------|
| **Task ID** | FOUND-006 |
| **Task Name** | UI Components Library |
| **Module** | MODULE 01 — Project Foundation |
| **Objective** | Create the base shared component library that all modules will reuse |
| **Dependencies** | FOUND-002, FOUND-003 |
| **Status** | ⬜ Pending |
| **Priority** | High |
| **Estimated Effort** | 4-5 hours |

#### Objective
Build the foundational shared component library following the project's design system. Each component must be reusable, accessible, properly typed with TypeScript, and styled with Tailwind CSS.

#### Components to Create

**1. Button (`src/components/shared/Button.tsx`)**
- Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`
- Sizes: `sm`, `md`, `lg`
- States: default, hover, disabled, loading
- Props: `children`, `variant`, `size`, `disabled`, `loading`, `onClick`, `type`, `className`

**2. Input (`src/components/shared/Input.tsx`)**
- Variants: `default`, `error`
- Sizes: `sm`, `md`, `lg`
- States: default, focused, disabled, error
- Props: `label`, `type`, `placeholder`, `value`, `onChange`, `error`, `disabled`, `required`, `className`

**3. Select (`src/components/shared/Select.tsx`)**
- Options array type-safe
- Searchable option list (future feature)
- Props: `label`, `options`, `value`, `onChange`, `placeholder`, `error`, `disabled`, `required`, `className`

**4. Modal (`src/components/shared/Modal.tsx`)**
- Overlay with backdrop
- Header with title and close button
- Body with optional scrolling
- Footer with action buttons
- Size variants: `sm`, `md`, `lg`, `xl`, `full`
- Props: `open`, `onClose`, `title`, `children`, `footer`, `size`, `className`

**5. Table (`src/components/shared/Table.tsx`)**
- Generic column definitions with TypeScript generics
- Sortable columns (future feature)
- Pagination integration
- Row actions
- Props: `columns`, `data`, `loading`, `onRowClick`, `pagination`, `className`

**6. Card (`src/components/shared/Card.tsx`)**
- Flexible layout with header, body, footer slots
- Hover effects
- Props: `title`, `children`, `footer`, `className`, `hover`, `padding`

**7. Badge (`src/components/shared/Badge.tsx`)**
- Color variants: `default`, `success`, `warning`, `danger`, `info`
- Sizes: `sm`, `md`, `lg`
- Props: `children`, `variant`, `size`, `className`

**8. Loading (`src/components/shared/Loading.tsx`)**
- Spinner variant
- Skeleton variant
- Full-page variant
- Props: `variant`, `size`, `className`

**9. EmptyState (`src/components/shared/EmptyState.tsx`)**
- Icon
- Title
- Description
- Optional action button
- Props: `icon`, `title`, `description`, `action`, `className`

**10. ErrorState (`src/components/shared/ErrorState.tsx`)**
- Icon
- Title
- Description
- Retry action
- Props: `title`, `description`, `error`, `onRetry`, `className`

**11. ConfirmDialog (`src/components/shared/ConfirmDialog.tsx`)**
- Modal wrapper with confirmation message
- Cancel and confirm buttons
- Destructive mode styling
- Props: `open`, `onClose`, `onConfirm`, `title`, `message`, `confirmText`, `cancelText`, `destructive`

**12. Pagination (`src/components/shared/Pagination.tsx`)**
- Page navigation
- Page size selector
- Props: `currentPage`, `totalPages`, `totalItems`, `onPageChange`, `pageSize`, `onPageSizeChange`

#### Component Design Principles
- All components use TypeScript with exported prop types
- All components use `className` for extensibility
- All components follow the same naming convention: `ComponentName.tsx`
- All components are in `/src/components/shared/`
- Components are exported from a barrel file: `src/components/shared/index.ts`
- Components support both light and dark mode CSS variables
- Components are keyboard accessible
- Components have ARIA attributes where appropriate

#### Barrel Export
```typescript
// src/components/shared/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Select } from './Select';
export { Modal } from './Modal';
export { Table } from './Table';
export { Card } from './Card';
export { Badge } from './Badge';
export { Loading } from './Loading';
export { EmptyState } from './EmptyState';
export { ErrorState } from './ErrorState';
export { ConfirmDialog } from './ConfirmDialog';
export { Pagination } from './Pagination';
```

#### Files to Create/Modify
| File | Description |
|------|-------------|
| `src/components/shared/Button.tsx` | Primary button component |
| `src/components/shared/Input.tsx` | Text input component |
| `src/components/shared/Select.tsx` | Select dropdown component |
| `src/components/shared/Modal.tsx` | Modal dialog component |
| `src/components/shared/Table.tsx` | Data table component |
| `src/components/shared/Card.tsx` | Card container component |
| `src/components/shared/Badge.tsx` | Badge/status indicator component |
| `src/components/shared/Loading.tsx` | Loading/spinner component |
| `src/components/shared/EmptyState.tsx` | Empty data state component |
| `src/components/shared/ErrorState.tsx` | Error state component |
| `src/components/shared/ConfirmDialog.tsx` | Confirmation dialog component |
| `src/components/shared/Pagination.tsx` | Pagination component |
| `src/components/shared/index.ts` | Barrel exports |

#### Acceptance Criteria
- All 12 components render correctly
- All component variants work (primary/secondary/outline/ghost/danger for Button)
- All components are TypeScript typed with no errors
- Components are styled with Tailwind CSS consistently
- Components are accessible (keyboard navigable, ARIA labels)
- `src/components/shared/index.ts` exports all components
- Components are importable from `@/components/shared`
- No console errors when rendering any component

#### Definition of Done
- All 12 shared components created and functional
- All variants render correctly
- TypeScript strict mode compliant
- Components follow design system (colors, spacing, typography)
- Barrel export works correctly
- Components tested by importing into placeholder pages
- No TypeScript errors

---

### FOUND-007 — Local Development Verification

| Field | Detail |
|-------|--------|
| **Task ID** | FOUND-007 |
| **Task Name** | Local Development Verification |
| **Module** | MODULE 01 — Project Foundation |
| **Objective** | Verify the entire project foundation works end-to-end |
| **Dependencies** | FOUND-001 through FOUND-006 |
| **Status** | ⬜ Pending |
| **Priority** | High |
| **Estimated Effort** | 1-2 hours |

#### Objective
Run comprehensive verification of the entire project foundation: installation, development server, routing, components, and production build. This is the gatekeeper before any other module can begin.

#### Verification Steps

**Step 1: Installation Verification**
- [ ] Run `npm install` — completes without errors
- [ ] Check `node_modules` exists with all dependencies
- [ ] Verify `package.json` scripts are correct

**Step 2: Development Server Verification**
- [ ] Run `npm run dev` — starts without errors
- [ ] Verify server starts on port 5173
- [ ] Open browser and confirm blank page loads
- [ ] Verify HMR works (edit a file, see changes)
- [ ] Check browser console for errors (should be clean)

**Step 3: TypeScript Verification**
- [ ] Run `npx tsc --noEmit` — no type errors
- [ ] Verify all TypeScript files have correct types
- [ ] Check for any implicit `any` types

**Step 4: Tailwind CSS Verification**
- [ ] Create a test component using custom colors
- [ ] Verify custom colors render correctly
- [ ] Verify responsive classes work
- [ ] Verify fonts are loaded
- [ ] Verify custom spacing works

**Step 5: Routing Verification**
- [ ] Navigate to `/` — renders PublicLayout with HomePage
- [ ] Navigate to `/about` — renders correctly
- [ ] Navigate to `/rooms` — renders correctly
- [ ] Navigate to `/gallery` — renders correctly
- [ ] Navigate to `/contact` — renders correctly
- [ ] Navigate to `/login` — renders LoginPage
- [ ] Navigate to unknown route — renders NotFoundPage
- [ ] Verify navigation works without page reload

**Step 6: Component Verification**
- [ ] Import and render each of the 12 shared components in a test page
- [ ] Verify Button all variants render
- [ ] Verify Input with label, error state, disabled state
- [ ] Verify Select with options
- [ ] Verify Modal opens and closes
- [ ] Verify Table renders with data
- [ ] Verify Card renders with slots
- [ ] Verify Badge all variants render
- [ ] Verify Loading spinner and skeleton
- [ ] Verify EmptyState renders
- [ ] Verify ErrorState renders
- [ ] Verify ConfirmDialog opens and works
- [ ] Verify Pagination renders

**Step 7: Production Build Verification**
- [ ] Run `npm run build` — completes without errors
- [ ] Run `npm run preview` — preview production build
- [ ] Verify all pages render in production
- [ ] Check build output size is reasonable

**Step 8: Linting Verification**
- [ ] Run `npm run lint` — no errors
- [ ] Run `npm run format` — formats correctly
- [ ] Check ESLint rules are enforced

#### Files to Modify
- Only verification artifacts — no new feature files needed
- May create test pages temporarily for verification (can be deleted)

#### Acceptance Criteria
- `npm install` completes successfully
- `npm run dev` starts and serves the app
- `npx tsc --noEmit` passes with zero errors
- `npm run build` completes successfully
- `npm run preview` shows the production build
- `npm run lint` passes with zero errors
- All 12 shared components render correctly
- All routes render correctly (public and PMS)
- No console errors in browser
- No TypeScript errors in console
- HMR works correctly

#### Definition of Done
- All 8 verification steps passed
- `npm run dev` works end-to-end
- `npm run build` succeeds
- `npm run lint` passes
- All routes functional
- All shared components working
- Zero TypeScript errors
- Zero console errors
- Zero lint errors
- Module 01 is marked as COMPLETED in FRONTEND_PLAN.md

---

## Module 01 Acceptance Criteria Summary

| Criterion | Status |
|-----------|--------|
| `npm install` completes successfully | ⬜ |
| `npm run dev` starts development server | ⬜ |
| Tailwind CSS classes work with custom theme | ⬜ |
| All 12 shared components render correctly | ⬜ |
| Routing works with all public and PMS routes | ⬜ |
| Protected and PublicOnly routes work | ⬜ |
| Production build (`npm run build`) succeeds | ⬜ |
| ESLint + Prettier pass | ⬜ |
| No TypeScript errors (`tsc --noEmit`) | ⬜ |
| No console errors in browser | ⬜ |
| HMR works correctly | ⬜ |
| Global styles and design tokens applied | ⬜ |

---

## Dependencies

| Dependency | Package Name | Purpose |
|-----------|-------------|---------|
| React | `react`, `react-dom` | UI framework |
| Vite | `vite`, `@vitejs/plugin-react` | Build tool |
| TypeScript | `typescript` | Static typing |
| Tailwind CSS | `tailwindcss`, `@tailwindcss/vite`, `postcss`, `autoprefixer` | Styling |
| React Router | `react-router-dom` | Client-side routing |
| React Hook Form | `react-hook-form`, `@hookform/resolvers` | Form handling |
| Zod | `zod` | Schema validation |
| date-fns | `date-fns` | Date manipulation |
| Lucide React | `lucide-react` | Icons |
| ESLint | `eslint`, `@eslint/js`, `globals` | Linting |
| Prettier | `prettier` | Code formatting |

---

## Files Changed (Upon Completion)

### New Files Created (Foundation)
```
index.html
package.json
tsconfig.json
tsconfig.app.json
tsconfig.node.json
vite.config.ts
postcss.config.js
tailwind.config.ts
.eslintrc.cjs
.prettierrc
.gitignore
src/main.tsx
src/App.tsx
src/App.css
src/index.css
src/vite-env.d.ts
src/config/routes.ts
src/config/app.ts
src/config/tailwind.config.ts
src/layouts/BaseLayout.tsx
src/layouts/PublicLayout.tsx
src/layouts/PMSLayout.tsx
src/components/shared/Button.tsx
src/components/shared/Input.tsx
src/components/shared/Select.tsx
src/components/shared/Modal.tsx
src/components/shared/Table.tsx
src/components/shared/Card.tsx
src/components/shared/Badge.tsx
src/components/shared/Loading.tsx
src/components/shared/EmptyState.tsx
src/components/shared/ErrorState.tsx
src/components/shared/ConfirmDialog.tsx
src/components/shared/Pagination.tsx
src/components/shared/index.ts
src/hooks/useAuth.ts
src/hooks/usePermissions.ts
src/stores/authStore.ts
src/stores/permissionStore.ts
src/stores/uiStore.ts
src/types/auth.types.ts
src/types/user.types.ts
src/types/role.types.ts
src/types/permission.types.ts
src/types/room.types.ts
src/types/reservation.types.ts
src/types/invoice.types.ts
src/types/finance.types.ts
src/types/public.types.ts
src/utils/dateUtils.ts
src/utils/currencyUtils.ts
src/utils/formatUtils.ts
src/utils/permissionUtils.ts
src/utils/validationUtils.ts
src/constants/reservationStatuses.ts
src/constants/reservationSources.ts
src/constants/expenseCategories.ts
src/constants/routes.ts
src/styles/globals.css
src/pages/HomePage.tsx
src/pages/AboutPage.tsx
src/pages/RoomTypesPage.tsx
src/pages/GalleryPage.tsx
src/pages/ContactPage.tsx
src/pages/LoginPage.tsx
src/pages/DashboardPage.tsx
src/pages/NotFoundPage.tsx
```

### Modified Files
- None (all new project)

---

## Important Decisions

1. **Vite + React + TypeScript**: Chosen over Create React App for faster build times and better TypeScript support.
2. **Tailwind CSS**: Chosen over CSS Modules or Styled Components for utility-first rapid development and consistency.
3. **React Router v6**: Chosen for nested route support and cleaner API.
4. **React Hook Form + Zod**: Chosen for performant form handling with schema validation.
5. **React Context + useReducer** for state management: Chosen for simplicity; no additional state library needed initially.
6. **Component barrel exports**: All shared components exported from a single index for clean imports.
7. **`@/` path alias**: Configured in `tsconfig.json` and `vite.config.ts` for clean imports.
8. **Strict TypeScript mode**: All `tsconfig.json` settings set to strict to catch type errors early.
9. **ESLint + Prettier**: Linting and formatting enforced from the start.
10. **CSS Custom Properties + Tailwind**: Both used together for maximum flexibility — Tailwind for utility classes, CSS variables for design tokens that need JavaScript access.

---

## Known Issues / Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Tailwind version compatibility | Build errors | Pin exact versions in `package.json` |
| TypeScript strict mode causing many errors | Slows down development | Use `@ts-ignore` sparingly, fix types properly |
| ESLint configuration complexity | Setup time | Use standard ESLint configs for Vite + React |
| Path alias configuration issues | Import errors | Verify `@/` alias works in both Vite and TypeScript |
| Package version conflicts | Install failures | Use exact versions, clean `node_modules` if needed |

---

## Verification Checklist

- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts the Vite dev server on port 5173
- [ ] Blank page renders without console errors
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] Tailwind CSS custom colors render correctly
- [ ] Global CSS variables and typography are applied
- [ ] All 12 shared components render correctly
- [ ] All public routes (`/`, `/about`, `/rooms`, `/gallery`, `/contact`) work
- [ ] `/login` route works
- [ ] Protected routes redirect unauthenticated users to `/login`
- [ ] 404 page displays for unknown routes
- [ ] `npm run build` completes successfully
- [ ] `npm run preview` shows the production build
- [ ] `npm run lint` passes with zero errors
- [ ] `npm run format` formats code correctly
- [ ] HMR works (editing a file updates the browser)
- [ ] All components are accessible via keyboard
- [ ] Responsive design works on all breakpoints
- [ ] No TypeScript errors in any file
- [ ] No console errors in browser developer tools
- [ ] FRONTEND_PLAN.md updated with FOUND-001 through FOUND-007 as COMPLETED
- [ ] All implementation notes, files changed, and verification results recorded in FRONTEND_PLAN.md

---

## Next Module

After MODULE 01 is completed and verified, proceed to **MODULE 02 — Public Website Foundation** (PUB-001 through PUB-009).

---

*Document version: 1.0 | Date: 2026-09-14*
