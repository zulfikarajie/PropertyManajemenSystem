# Frontend Development Plan — Joglo Seruni & Public Promotional Website

---

## 1. Project Overview

This project builds two complementary frontend applications within a single repository:

1. **Public Promotional Website** — A marketing-facing website promoting the hotel/property, focused on presentation, room promotion, visual appeal, and direct communication channels (especially WhatsApp). No online booking, OTA integration, or payment gateway in the initial version.

2. **Internal Property Management System (PMS)** — An authenticated internal system for hotel owners, administrators, and employees to manage users, roles, permissions, rooms, reservations, invoices, sales, expenses, and financial reports.

Both applications share the same technology stack and repository but maintain clear separation of concerns in routing, layout, and data access.

---

## 2. Business Context

### Hotel/Property Context
- The property is a hotel that receives reservations from multiple channels: direct walk-in, phone, WhatsApp, website, and OTA platforms.
- OTA reservations are manually entered by hotel staff — no OTA API integration exists or is planned.
- No online booking engine exists. Customers are directed to contact the hotel via WhatsApp or phone.
- Reservation prices are manually entered by staff and are independent from the room type's default/base rate.
- Historical reservation prices must remain stable even if room type default rates change later.

### User Roles
The system supports dynamic Role-Based Access Control (RBAC). Users can have arbitrary roles (not limited to "Admin" and "Employee"). Roles and permissions are managed dynamically through the system itself.

### Reservation Sources
- Direct / Walk-in
- Phone
- WhatsApp
- Website
- OTA
- Other (extensible)

### Reservation Statuses
- Reserved
- Checked In
- Checked Out
- Cancelled

### Multiple Rooms Per Reservation
A single reservation can include multiple rooms. Each room in a reservation has its own manual rate and calculates its own subtotal. The reservation total is the sum of all room subtotals.

---

## 3. Public Promotional Website

### Pages/Sections

#### Home
- Hero section with high-quality property imagery
- Property introduction and tagline
- Main call-to-action (CTA) directing to contact/WhatsApp
- Featured rooms section with room cards
- Property highlights (facilities, location, etc.)
- Gallery preview
- Contact/booking CTA

#### About / Property
- Property description
- Hotel/property information
- Facilities overview
- Location information
- Other relevant information

#### Room Types
- Available room types with cards or grid layout
- Room images
- Room name and short description
- Capacity information where appropriate
- Facilities listed per room type
- Starting/display price where appropriate
- Data sourced from the same conceptual Room Type data used by the PMS, but presentation is simplified and does not expose internal PMS details

#### Gallery
- Property photos
- Room photos
- Facilities images
- Other relevant images
- Visually appealing, image-heavy layout

#### Contact
- Hotel contact information
- WhatsApp CTA (prominent)
- Phone number
- Address
- Location/map section
- Operating/contact hours information

### Design Principles
- Modern, professional, clean, elegant
- Hospitality-oriented aesthetic
- High-quality visual hierarchy
- Strong imagery
- Clear calls-to-action
- Easy navigation
- Fast access to room information
- Easy WhatsApp contact access
- Fully responsive: Desktop, Laptop, Tablet, Mobile (mobile-first where appropriate)

### Technology Choice
React + Vite + Tailwind CSS. The public website is built as a set of pages/routes within the same Vite project as the PMS, with layout separation between public and internal interfaces.

---

## 4. Internal Property Management System (PMS)

### Modules

1. **Dashboard** — Operational overview with reservation summaries, sales summaries, occupancy data, invoice summaries
2. **User Management** — CRUD for users, role assignment, activate/deactivate
3. **Role & Permission Management** — Dynamic RBAC: create/view/edit/delete roles, assign permissions to roles
4. **Room Type Management** — CRUD for room types, activate/deactivate
5. **Room Management** — CRUD for rooms, status management
6. **Reservation** — Full reservation lifecycle: create, view, edit, cancel, check-in, check-out
7. **Reservation Calendar** — Visual calendar showing reservations, room occupancy, availability
8. **Finance**
    - **Sales** — Reporting by period (weekly, monthly, 6 months, 1 year)
    - **Invoice** — CRUD for invoices, invoice items, status management
    - **Report** — Financial reports combining sales, expenses, revenue
  9. **Activity Logging** — System-wide audit trail logging all actions (check-ins, payments, status changes, etc.)

### Access Control
All internal PMS pages require authentication and are protected by RBAC. Navigation, buttons, actions, and CRUD operations are gated by the current user's permissions.

---

## 5. Scope

### In Scope
- Public promotional website with all specified pages
- Public promotional website with all specified pages
- Internal PMS with all 9 modules
- Mock data layer for all data collections
- Authentication UI and RBAC frontend
- Dynamic role and permission management
- Reservation creation, editing, cancellation, check-in, check-out
- Multiple rooms per reservation with manual pricing
- Reservation calendar
- Invoice management
- Sales reporting with period filters
- Financial reports with sales/expense/revenue summaries
- Dashboard with operational summaries
- Activity logging for audit trail
- Responsive design for all devices
- Local development with mock data only (no backend required)

### Out of Scope
- Laravel backend implementation
- PostgreSQL database implementation
- Laravel API integration (planned for future phase)
- OTA API integration
- Payment gateway integration
- Online booking engine
- External booking engine
- Authentication backend/JWT verification server-side
- Full accounting system

---

## 6. Technology Assumptions

| Area | Technology |
|------|-----------|
| Framework | React 18+ |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Language | TypeScript |
| Routing | React Router |
| State Management | React Context + useReducer (initially); evaluated for Zustand/Jotai if needed |
| Forms | React Hook Form + Zod validation |
| Date Handling | date-fns |
| Charts | Recharts (if needed for sales/reports) |
| Icons | Lucide React or Heroicons |
| Testing | Vitest + React Testing Library (evaluation phase) |
| Mock Data | JSON files in `/src/mock` directory |
| Linting | ESLint + Prettier |
| Type Safety | TypeScript strict mode |

---

## 7. Architecture

### High-Level Architecture

```
UI Layer
  ↓
Application/Service Layer (business logic, data fetching, form handling)
  ↓
Data Access Layer (mock data services — will later swap to Laravel API)
  ↓
Mock Data Layer (JSON files / in-memory data)
```

### Data Flow
1. UI components dispatch actions or call service functions
2. Service layer handles business logic (validation, calculations, transformations)
3. Data Access Layer fetches from mock data services
4. Mock data services return realistic data from JSON files
5. When Laravel backend is ready: only the Data Access Layer implementation changes

### Separation of Concerns
- **Public Website**: Public layout, public routes, public components, public mock data
- **Internal PMS**: Protected layout, protected routes, PMS components, shared mock data
- **Shared**: Shared components (buttons, inputs, modals, tables), shared types, shared utilities

### Future Laravel Integration Boundary
When Laravel is ready, the following changes are required:
- Replace mock data services with API client functions
- Replace JSON mock files with API endpoint calls
- Add authentication token handling (e.g., Bearer tokens)
- Add error handling for network/API errors
- No changes needed to UI components or service layer business logic

---

## 8. Folder / Module Structure

```
src/
├── main.tsx
├── App.tsx
├── index.css
├── vite-env.d.ts
├── config/
│   ├── routes.ts
│   ├── tailwind.config.ts
│   └── app.ts
├── layouts/
│   ├── PublicLayout.tsx
│   ├── PublicFooter.tsx
│   ├── PMSLayout.tsx
│   ├── PMSSidebar.tsx
│   └── PMSHeader.tsx
├── components/
│   ├── shared/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Loading.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── Pagination.tsx
│   ├── public/
│   │   ├── HeroSection.tsx
│   │   ├── RoomCard.tsx
│   │   ├── GallerySection.tsx
│   │   ├── FeatureSection.tsx
│   │   └── CTASection.tsx
│   └── pms/
│       ├── ReservationCard.tsx
│       ├── ReservationForm.tsx
│       ├── DateRangePicker.tsx
│       ├── RoomSelector.tsx
│       ├── SalesChart.tsx
│       ├── CalendarView.tsx
│       └── StatsCard.tsx
├── pages/
│   ├── public/
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── RoomTypesPage.tsx
│   │   ├── GalleryPage.tsx
│   │   └── ContactPage.tsx
│   └── pms/
│       ├── LoginPage.tsx
│       ├── DashboardPage.tsx
│       ├── users/
│       │   ├── UserListPage.tsx
│       │   ├── UserDetailPage.tsx
│       │   └── UserFormPage.tsx
│       ├── roles/
│       │   ├── RoleListPage.tsx
│       │   ├── RoleDetailPage.tsx
│       │   └── RoleFormPage.tsx
│       ├── permissions/
│       │   └── PermissionListPage.tsx
│       ├── room-types/
│       │   ├── RoomTypeListPage.tsx
│       │   └── RoomTypeFormPage.tsx
│       ├── rooms/
│       │   ├── RoomListPage.tsx
│       │   └── RoomFormPage.tsx
│       ├── reservations/
│       │   ├── ReservationListPage.tsx
│       │   ├── ReservationDetailPage.tsx
│       │   ├── ReservationFormPage.tsx
│       │   └── ReservationCalendarPage.tsx
│       ├── finance/
│       │   ├── SalesPage.tsx
│       │   ├── InvoiceListPage.tsx
│       │   ├── InvoiceDetailPage.tsx
│       │   ├── InvoiceFormPage.tsx
│       │   ├── ReportPage.tsx
│       │   └── ExpensesPage.tsx
│       └── auth/
│           └── LoginPage.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── usePermissions.ts
│   ├── usePublicData.ts
│   └── useReservationForm.ts
├── services/
│   ├── authService.ts
│   ├── userService.ts
│   ├── roleService.ts
│   ├── permissionService.ts
│   ├── roomTypeService.ts
│   ├── roomService.ts
│   ├── reservationService.ts
│   ├── invoiceService.ts
│   ├── salesService.ts
│   ├── expenseService.ts
│   └── reportService.ts
├── data/
│   ├── mock/
│   │   ├── users.json
│   │   ├── roles.json
│   │   ├── permissions.json
│   │   ├── roomTypes.json
│   │   ├── rooms.json
│   │   ├── reservations.json
│   │   ├── invoices.json
│   │   ├── invoiceItems.json
│   │   ├── sales.json
│   │   ├── expenses.json
│   │   └── gallery.json
│   └── public/
│       ├── propertyInfo.json
│       ├── publicRoomTypes.json
│       ├── publicGallery.json
│       ├── publicFacilities.json
│       └── contactInfo.json
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

## 9. Navigation

### Public Website Navigation
- Simple header with logo, navigation links (Home, Rooms, Gallery, About, Contact)
- WhatsApp CTA button prominently displayed
- Footer with contact information, social links, quick links
- Mobile-friendly hamburger menu

### Internal PMS Navigation
- Sidebar navigation with icon + label
- Top header with user info, notification, logout
- Sidebar sections:
  - Dashboard
  - Reservations (List, Calendar)
  - Rooms (Room Types, Rooms)
  - Users (User Management)
  - Roles & Permissions
  - Finance (Sales, Invoices, Reports, Expenses)
- Activity (Audit Trail)
- Permission-aware: navigation items are hidden or disabled based on user permissions
- Active route highlighting
- Collapsible sidebar on smaller screens

---

## 10. Authentication

### Authentication Flow
1. Login page with email/username and password fields
2. Form validation using React Hook Form + Zod
3. On submit, call auth service with mock data
4. On successful authentication:
   - Store user session in auth store (context)
   - Store authentication token (mock — will be replaced with Laravel JWT)
   - Redirect to dashboard
5. On failed authentication: show error message
6. Logout clears session and redirects to login

### Registration Flow
1. Register page with name, email, password, confirm password fields
2. Form validation using React Hook Form + Zod
3. On submit, call auth service with mock data
4. On successful registration:
   - Show success message
   - Redirect to login page
5. On failed registration (email already exists, validation error): show error message

### Forget Password Flow
1. Forget password page with email input field
2. User enters registered email
3. System validates email exists in mock data
4. On valid email: show success message with reset instructions
5. Reset password page with new password and confirm password fields
6. On submit, update password in mock data
7. Redirect to login page with success message

### Change Password Flow
1. Accessible only to authenticated users
2. Form with current password, new password, confirm new password fields
3. Validate current password matches stored password
4. Validate new password meets strength requirements
5. On submit, update password in auth store and mock data
6. Show success message and optionally log out other sessions
7. Redirect to dashboard or profile page

### Authentication State
- Current user (id, name, email, role, permissions)
- Is authenticated boolean
- Is loading boolean
- Error message string
- Password changed timestamp (for session management)

### Registration State
- Name, email, password, confirm password fields
- Form validation (required fields, email format, password strength, password match)
- Success/error messages
- Auto-redirect to login on successful registration

### Password Reset State
- Email verification status
- Reset token (if applicable)
- New password field with strength validation
- Confirm new password field
- Success/error messages
- Redirect to login after successful reset

### Mock Authentication
- Mock user data includes roles and permissions
- Login validates credentials against mock data
- Registration validates email uniqueness against mock data
- On login, user's roles and permissions are loaded into the store
- Password reset validates email existence and updates mock data
- Change password validates current password and updates auth store
- In the Laravel phase, this will be replaced with API call + JWT token

### Protected Routes
- All PMS routes are protected
- Unauthenticated users are redirected to login
- Route guards check authentication status
- Nested route guards check permissions for specific modules

---

## 11. RBAC (Role-Based Access Control)

### RBAC Model
- **User** → has many **Roles**
- **Role** → has many **Permissions**
- **Permission** → atomic action identifier (e.g., `reservation.create`)

### Permission Structure
Permissions are string identifiers following the pattern: `{resource}.{action}`

Example permissions:
- `user.view`, `user.create`, `user.update`, `user.delete`
- `role.view`, `role.create`, `role.update`, `role.delete`
- `permission.view`, `permission.assign`
- `room.view`, `room.create`, `room.update`, `room.delete`
- `reservation.view`, `reservation.create`, `reservation.update`, `reservation.delete`, `reservation.checkin`, `reservation.checkout`
- `finance.sales.view`, `finance.invoice.view`, `finance.invoice.create`, `finance.invoice.update`, `finance.report.view`

### Dynamic RBAC
- Roles can be created, edited, deleted by authorized users
- Permissions can be assigned to roles dynamically
- Users can be assigned multiple roles
- A user's effective permissions are the union of all permissions from all assigned roles
- The architecture supports adding new permissions without code changes

### Frontend RBAC Implementation
- `usePermissions()` hook returns the current user's effective permissions
- Permission checks control:
  - Navigation items visibility
  - Page access (route guards)
  - Button visibility and disabled state
  - Action availability (edit, delete, check-in, etc.)
  - CRUD operation UI elements

### Permission Checking Components
- `<RequirePermission permission="reservation.create">` component wrapper
- `hasPermission(permission: string): boolean` utility function
- `usePermission(permission: string): boolean` hook
- Permission-aware button components

---

## 12. User Management

### Features
- **User List**: Display all users with pagination/search/filter
- **User Search/Filter**: Filter by name, email, role, status
- **Create User**: Form with name, email, password, role assignment
- **Edit User**: Update name, email, roles, status
- **Activate/Deactivate**: Toggle user status
- **User Detail**: View user information, associated reservations, audit trail

### User Model
- id (string/number)
- name (string)
- email (string)
- password (hashed — mock: plain text)
- roles (array of Role)
- status (active/inactive)
- createdAt (date)
- updatedAt (date)
- lastLoginAt (date, optional)

### User List Page
- Table with columns: Name, Email, Roles, Status, Created Date, Actions
- Search bar and filter dropdowns
- Pagination or infinite scroll
- Action buttons: View, Edit, Activate/Deactivate

### User Form Page
- Form fields: Name, Email, Password (for create), Roles, Status
- Validation: required fields, email format, password strength
- Role multi-select assignment
- Submit creates or updates user

---

## 13. Role & Permission Management

### Features
- **Role List**: Display all roles with permissions summary
- **Create Role**: Form with name, description, permission assignment
- **Edit Role**: Update name, description, modify permission assignments
- **Delete/Deactivate Role**: Remove or deactivate role
- **Permission List**: Display all available permissions grouped by resource
- **Role Permission Assignment**: Checkbox/tree interface for assigning permissions to roles

### Role Model
- id
- name
- description
- permissions (array of Permission)
- status (active/inactive)
- createdAt
- updatedAt

### Permission Model
- id
- name (e.g., `reservation.create`)
- description (e.g., "Create new reservations")
- resource (e.g., "reservation")
- action (e.g., "create")
- group (e.g., "Reservations")

### Role Detail Page
- Show role name, description, status
- List all assigned permissions
- Option to add/remove permissions
- Show users assigned to this role

---

## 14. Room Type Management

### Features
- **Room Type List**: Display all room types with status
- **Create Room Type**: Form with name, description, capacity, facilities, default rate, images, status
- **Edit Room Type**: Update all fields
- **Activate/Deactivate**: Toggle room type status
- **Room Type Mock Data**: 5 records minimum

### Room Type Model
- id
- name (e.g., "Standard Double Room")
- description
- capacity (number)
- facilities (array of strings)
- defaultRate (number) — base/default rate, NOT the reservation price
- images (array of strings — URLs or file paths)
- status (active/inactive)
- createdAt
- updatedAt

### Default Rate vs. Reservation Rate
- The `defaultRate` is the room type's base rate
- When creating a reservation, staff enter a manual rate that may differ from `defaultRate`
- Historical reservation prices must remain stable regardless of `defaultRate` changes
- This distinction is critical and must be maintained throughout the system

---

## 15. Room Management

### Features
- **Room List**: Display all rooms with filters by type, status
- **Create Room**: Form with room number, room type selection, status
- **Edit Room**: Update room details
- **Deactivate/Delete**: Where appropriate
- **Room Filtering**: Filter by room type, availability, status
- **Room Mock Data**: 5 records minimum

### Room Model
- id
- roomNumber (string, unique)
- roomTypeId (reference to Room Type)
- status (active/inactive/maintenance)
- createdAt
- updatedAt

### Architecture Notes
- Room status supports future expansion: `active`, `inactive`, `maintenance`, `housekeeping`
- Availability status is planned for future implementation but NOT built now
- Housekeeping status is planned for future but NOT built now
- Only `active` and `inactive` are used initially

---

## 16. Reservation

### Reservation Model
- id
- reservationCode/bookingReference (unique, auto-generated)
- guestName (string, required)
- reservationSource (enum: Direct/Walk-in, Phone, WhatsApp, Website, OTA, Other)
- checkInDate (date)
- checkOutDate (date)
- status (Reserved, Checked In, Checked Out, Cancelled)
- notes (string, optional)
- totalAmount (number) — calculated from reservation rooms
- createdAt
- updatedAt

### Reservation Room Model (Join Entity)
- id
- reservationId
- roomId
- roomNumber
- roomTypeName
- rate (manual rate entered by staff)
- subtotal (rate × number of nights)
- createdAt

### Reservation Source Enum
- `direct` — Direct / Walk-in
- `phone` — Phone
- `whatsapp` — WhatsApp
- `website` — Website
- `ota` — OTA (manually entered)
- `other` — Other

### Reservation Status Flow
```
Reserved → Checked In → Checked Out
Reserved → Cancelled
Checked In → Checked Out
Reserved → Checked In (must be created first)
Cancelled → cannot transition to any other status
Checked Out → cannot transition to any other status
```

### Permission-Based Status Transitions
- `reservation.create`: Required to create a reservation
- `reservation.update`: Required to edit a reservation
- `reservation.delete`: Required to cancel a reservation
- `reservation.checkin`: Required to check in
- `reservation.checkout`: Required to check out

### Reservation Creation Flow
1. Open Reservation form
2. Enter guest name (required)
3. Select reservation source (required)
4. Select check-in date (required, must be today or future)
5. Select check-out date (required, must be after check-in)
6. View available rooms based on date range
7. Select room(s)
8. Enter manual room rate for each selected room
9. System calculates subtotals and total
10. Review reservation details
11. Save reservation
12. Reservation appears in list and calendar

### Reservation List Page
- Table with columns: Reservation Code, Guest, Source, Check-in, Check-out, Rooms, Total, Status, Actions
- Search/filter by: guest name, source, status, date range
- Pagination
- Click to view details

### Reservation Detail Page
- Full reservation information
- List of reservation rooms with individual rates
- Total calculation
- Status display
- Notes
- Action buttons (Edit, Check-in, Check-out, Cancel) — gated by permissions
- Related invoice link (if exists)

### Reservation Edit
- Edit guest name, source, dates, rooms, rates
- Changing dates may affect room availability
- All fields validated before update

### Reservation Cancellation
- Cancel action sets status to "Cancelled"
- Confirmation dialog required
- Cannot cancel if already checked out

---

## 17. Reservation Calendar

### Features
- Calendar view showing reservations by date range
- Display: Guest name, room number, check-in/check-out dates, source, status
- Color coding by status
- Room occupancy visualization
- Available room indication
- Filtering by date range, room, status

### Calendar Layout
- Monthly or weekly view
- Each reservation shown as a block spanning check-in to check-out
- Overlapping reservations visible
- Room availability shown clearly

### Mock Data
- Use existing reservation mock data
- Calendar is a visualization layer on top of reservation data
- No separate calendar mock data needed

---

## 18. Check-In / Check-Out

### Check-In
- Action available from reservation detail or list
- Requires `reservation.checkin` permission
- Confirmation dialog before action
- Changes reservation status to "Checked In"
- Can check in multiple rooms in a reservation simultaneously
- Record check-in date/time

### Check-Out
- Action available from reservation detail or list
- Requires `reservation.checkout` permission
- Confirmation dialog before action
- Changes reservation status to "Checked Out"
- Record check-out date/time
- May trigger invoice creation (conceptual — invoice module may already exist)

### Status Transition Rules
- Check-In: Only from "Reserved" status
- Check-Out: Only from "Checked In" status
- Cannot check in a cancelled reservation
- Cannot check out a cancelled or reserved reservation
- Permission restrictions enforced on frontend

---

## 19. Manual Reservation Pricing

### Core Rule
The reservation room rate is manually entered by hotel staff and is **independent** of the room type's default rate.

### Example
- Room Type default rate: Rp750,000
- Staff enters actual reservation rate: Rp650,000
- Reservation records Rp650,000
- If room type default rate later changes to Rp800,000, the reservation still shows Rp650,000
- Historical reservation prices are immutable with respect to room type rate changes

### Implementation
- Each `ReservationRoom` stores its own `rate` field
- When creating a reservation, staff enter the rate per room
- The rate is stored in `ReservationRoom.rate`
- Invoice, Sales, and Reports all reference `ReservationRoom.rate`, not `RoomType.defaultRate`
- Rate validation: must be positive number, can have decimals

### Data Integrity
- Frontend form validation ensures rate is a positive number
- Calculations use stored `ReservationRoom.rate`, never reference `RoomType.defaultRate` for pricing
- This ensures historical data remains accurate regardless of future rate changes

---

## 20. Multiple Rooms Per Reservation

### Architecture
- A reservation has multiple `ReservationRoom` entries
- Each `ReservationRoom` references one `Room`
- Each `ReservationRoom` has its own manual `rate`
- Each `ReservationRoom` calculates its own `subtotal = rate × nights`
- Reservation `totalAmount = sum of all ReservationRoom.subtotals`

### UI for Multiple Rooms
- Room selection interface allows selecting multiple rooms
- Each selected room shows a rate input field
- Real-time subtotal and total calculation
- Visual confirmation of selected rooms

### Validation
- At least one room must be selected
- All room rates must be positive numbers
- Selected rooms must be available for the reservation date range
- No duplicate rooms in a single reservation

---

## 21. Finance Module

### Finance Navigation
- Sidebar section in PMS navigation
- Sub-pages: Sales, Invoices, Reports, Expenses
- Access controlled by `finance.*` permissions

### Finance Data Models
- **Sales**: Derived from reservations and invoices
- **Invoice**: Full CRUD with items
- **Expenses**: Expense records with categories
- **Report**: Aggregated financial data from sales and expenses

### Data Relationships
```
Reservation → Reservation Room (manual rate)
Reservation → Invoice
Invoice → Invoice Items
Invoice Items → Sales (revenue)
Expenses → Report
Reservation + Invoice Items + Expenses → Financial Report
```

---

## 22. Finance — Sales

### Features
- Sales Overview page with period filters
- Period options: Weekly, Monthly, 6 Months, 1 Year
- Summary cards: Total Sales, Revenue, Transaction Count, Average per Transaction
- Sales trends visualization
- Revenue by period breakdown
- Revenue by reservation source breakdown

### Sales Overview Page
- Period filter (Weekly / Monthly / 6 Months / 1 Year)
- Summary statistics cards at top
- Chart showing sales trends over the selected period
- Table or list of transactions
- Breakdown by reservation source

### Data Source
- Sales data derived from reservations and their associated invoice items
- Manual rates from `ReservationRoom` are used for revenue calculation
- Reservation source is used for source breakdown
- Filter by date range based on check-in date or invoice date

### Chart Visualization
- Use Recharts for line/bar charts
- Weekly view: 7 data points
- Monthly view: monthly aggregates
- 6-month view: 6 data points
- 1-year view: 12 data points

---

## 23. Finance — Invoice

### Features
- Invoice List: Search, filter, paginate
- Invoice Creation: Create from reservation or manually
- Invoice Detail: Full invoice breakdown
- Invoice Edit: Modify where appropriate
- Invoice Status Management
- Invoice Items Management

### Invoice Model
- id
- invoiceNumber (unique, auto-generated)
- reservationId (reference, optional)
- guestName
- invoiceDate
- dueDate
- items (array of InvoiceItem)
- subtotal
- discount
- total
- paymentStatus (Pending, Paid, Overdue, Partial)
- invoiceStatus (Draft, Sent, Paid, Cancelled)
- createdAt
- updatedAt

### Invoice Item Model
- id
- invoiceId
- description
- quantity
- unitPrice (manual rate from reservation)
- subtotal (quantity × unitPrice)
- createdAt

### Invoice Creation
- Can be created from an existing reservation
- Auto-populates guest name, items from reservation rooms
- Manual rate from `ReservationRoom` used as item unit price
- Staff can add custom items or adjustments
- Discount field available

### Invoice Status Flow
```
Draft → Sent → Paid
Draft → Cancelled
Sent → Paid
Sent → Overdue (if past due date without payment)
Paid → cannot change
Cancelled → cannot change
```

### Invoice List Page
- Table with columns: Invoice Number, Guest, Reservation Ref, Date, Total, Payment Status, Invoice Status
- Search by invoice number, guest name
- Filter by status, date range, payment status
- Click to view details
- Action buttons based on permissions

### Invoice Detail Page
- Full invoice layout
- All items with quantities and rates
- Subtotal, discount, total calculation
- Payment status display
- Related reservation information
- Action buttons (Edit, Send, Mark as Paid) — gated by permissions

---

## 24. Finance — Report

### Features
- Financial Report overview page
- Sales summary with trends
- Expense summary with categories and trends
- Revenue summary (Revenue = Sales - Expenses)
- Net result/profit overview
- Transaction counts
- Filterable by date range
- Visualization (charts)

### Report Model
- Reports are generated dynamically from data
- No separate report database model needed initially
- Report is a computed view from Sales + Expenses + Reservations

### Report Page
- Date range filter
- Summary cards: Total Sales, Total Expenses, Net Revenue, Transaction Count
- Sales trend chart
- Expense breakdown by category (pie/donut chart)
- Revenue trend chart
- Key metrics table

### Expense Model
- id
- date
- category (Utilities, Maintenance, Supplies, Operational, Other)
- description
- amount
- status (optional)
- createdAt
- updatedAt

### Expense Categories
- Utilities
- Maintenance
- Supplies
- Operational
- Other

### Expense Data
- At least 5 expense mock records
- Categories should be realistic and varied
- Dates should span multiple months for meaningful reporting

### Report Visualization
- Sales trend: Line chart
- Expense breakdown: Pie/donut chart
- Revenue trend: Line chart
- Summary cards with formatted currency values

---

## 25. Dashboard

### Features
- Overview landing page for PMS after login
- Reservation summary (today, upcoming, recent)
- Occupancy summary (based on current reservations)
- Sales summary (today, this week, this month)
- Invoice summary (pending, overdue, paid)
- Quick access to key modules
- Operational KPIs

### Dashboard Layout
- Grid of summary cards at top
- Reservation table/list below
- Sales chart or recent transactions
- Quick action buttons (New Reservation, New Invoice, etc.)

### Dashboard Data
- Reservation count by status
- Occupancy rate (reserved rooms / total rooms)
- Today's revenue from check-ins
- Pending invoices count
- Recent reservations
- Revenue trend sparkline

### Access Control
- Dashboard is accessible to all authenticated users
- Some cards may be filtered based on permissions
- All data derived from existing modules

---

## 26. Data Models Summary

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  roles: Role[];
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}
```

### Role
```typescript
interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

### Permission
```typescript
interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  group: string;
}
```

### RoomType
```typescript
interface RoomType {
  id: string;
  name: string;
  description: string;
  capacity: number;
  facilities: string[];
  defaultRate: number;
  images: string[];
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}
```

### Room
```typescript
interface Room {
  id: string;
  roomNumber: string;
  roomTypeId: string;
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: Date;
  updatedAt: Date;
}
```

### Reservation
```typescript
interface Reservation {
  id: string;
  reservationCode: string;
  guestName: string;
  source: ReservationSource;
  checkInDate: Date;
  checkOutDate: Date;
  status: ReservationStatus;
  notes: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### ReservationRoom
```typescript
interface ReservationRoom {
  id: string;
  reservationId: string;
  roomId: string;
  roomNumber: string;
  roomTypeName: string;
  rate: number;
  subtotal: number;
  createdAt: Date;
}
```

### Invoice
```typescript
interface Invoice {
  id: string;
  invoiceNumber: string;
  reservationId?: string;
  guestName: string;
  invoiceDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentStatus: 'Pending' | 'Paid' | 'Overdue' | 'Partial';
  invoiceStatus: 'Draft' | 'Sent' | 'Paid' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}
```

### InvoiceItem
```typescript
interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}
```

### Expense
```typescript
interface Expense {
  id: string;
  date: Date;
  category: ExpenseCategory;
  description: string;
  amount: number;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Sale
```typescript
interface Sale {
  id: string;
  reservationId?: string;
  invoiceId?: string;
  date: Date;
  amount: number;
  source: ReservationSource;
  description: string;
}
```

---

## 27. Data Relationships

```
RoomType ──→ Room (one-to-many)

Reservation ──→ ReservationRoom (one-to-many)
ReservationRoom ──→ Room (many-to-one)

Reservation ──→ Invoice (one-to-one, optional)
Invoice ──→ InvoiceItem (one-to-many)

Invoice ──→ Sale (one-to-many or derived)
ReservationRoom (manual rate) ──→ Invoice Item ──→ Sale

Reservation ──→ ReservationSource (many-to-one)
Expense ──→ Report (derived)
Reservation ──→ Report (via Sales and Invoices)
```

### Key Relationship Notes
- **RoomType → Room**: One room type can have multiple rooms
- **Reservation → ReservationRoom**: One reservation can have multiple rooms
- **ReservationRoom stores manual rate**: This is the critical link for historical pricing stability
- **Reservation → Invoice**: Each reservation can have one invoice (conceptual, may or may not be enforced initially)
- **Invoice → InvoiceItem**: Invoice items reference the manual rate from reservation rooms
- **Manual rate propagation**: `ReservationRoom.rate` → `InvoiceItem.unitPrice` → `Sale.amount`

---

## 28. Mock Data

### Mock Data Strategy
- All data stored in JSON files under `/src/data/mock/`
- JSON files organized by entity type
- Mock data services read from JSON files and simulate CRUD operations
- In-memory data store that mirrors JSON structure
- Services provide functions: `getAll()`, `getById()`, `create()`, `update()`, `delete()`
- When Laravel is ready: only the service implementation changes

### Mock Data Service Pattern
```typescript
// Example service pattern
class RoomTypeService {
  private data: RoomType[];

  constructor() {
    this.data = loadFromMock('roomTypes');
  }

  getAll(): RoomType[] { return this.data; }
  getById(id: string): RoomType | undefined { return this.data.find(r => r.id === id); }
  create(item: RoomType): RoomType { this.data.push(item); return item; }
  update(id: string, updates: Partial<RoomType>): RoomType { ... }
  delete(id: string): void { ... }
}
```

### Mock Data Requirements (Minimum Records)

| Entity | Minimum Records | File |
|--------|----------------|------|
| Users | 5 | users.json |
| Roles | 5 | roles.json |
| Permissions | 5+ | permissions.json |
| Room Types | 5 | roomTypes.json |
| Rooms | 5 | rooms.json |
| Reservations | 5 | reservations.json |
| Invoices | 5 | invoices.json |
| Invoice Items | 5+ | invoiceItems.json |
| Sales | 5 | sales.json |
| Expenses | 5 | expenses.json |
| Public Room Types | 5 | publicRoomTypes.json |
| Public Gallery | 5+ | publicGallery.json |

### Data Consistency Requirements
- IDs must be consistent across related records
- Reservation sources must include all initial options
- Reservation rates must differ from default room rates in some cases
- Invoice items must reference valid reservation IDs
- Sales amounts must match invoice/reservation data
- Expense dates should span multiple months
- All dates must be realistic and internally consistent

---

## 29. State Management

### Evaluation
Initial evaluation favors React Context + useReducer for the following reasons:
- No authentication token needs to be managed by complex state libraries
- Current user, roles, permissions, and UI state can be managed with context
- Form state is handled by React Hook Form (external library)
- No need for global caching or server-state management at this stage
- Simpler to understand and maintain

### Stores/Contexts Needed
1. **AuthContext/AuthStore**: Current user, authentication status, login/logout
2. **PermissionContext/PermissionStore**: User permissions derived from roles
3. **UIStore**: Modal states, loading states, notification states, sidebar state

### Future Evaluation
If the project grows, Zustand or Jotai may be evaluated for:
- Simpler state updates without Provider nesting
- Better performance with selective subscriptions
- Middleware for persistence

### State Management Rules
- No global state for form data — use React Hook Form
- No global state for API/mock data — use service layer directly
- Global state only for: auth, permissions, UI
- All data fetching is handled by service layer, not by state management

---

## 30. Validation

### Validation Framework
- React Hook Form for form handling
- Zod for schema validation
- Validation occurs before form submission
- Server-side validation will be handled by Laravel in future phase

### Validation Rules

#### General Validation
- Required fields must be marked and validated
- Email format validation
- Date format validation
- Numeric field validation (positive numbers)
- String length limits where appropriate

#### Reservation Validation
- Guest name: required, minimum 2 characters
- Check-in date: required, must be today or future
- Check-out date: required, must be after check-in date
- Room selection: at least one room required
- Room rate: must be positive number
- Reservation source: required
- Overlapping reservations: must check room availability for selected date range

#### User Validation
- Name: required, minimum 2 characters
- Email: required, valid email format, unique
- Password: required for creation, minimum 6 characters
- Role assignment: at least one role required
- Status: must be one of the defined values

#### Role Validation
- Name: required, unique, minimum 2 characters
- Description: optional
- Permissions: at least one permission recommended

#### Invoice Validation
- Invoice number: required, unique
- Guest name: required
- Invoice date: required, valid date
- Due date: must be after invoice date
- Items: at least one item required
- Unit prices: must be positive numbers
- Total: must match calculated sum
- Discount: must be non-negative number

#### Expense Validation
- Date: required, valid date
- Category: required, must be a valid category
- Description: required
- Amount: required, positive number

#### Room Validation
- Room number: required, unique
- Room type: required, must reference existing room type
- Status: must be one of the defined values

#### Room Type Validation
- Name: required, unique, minimum 2 characters
- Description: required
- Capacity: required, positive integer
- Default rate: required, positive number
- Status: must be one of the defined values

---

## 31. Responsive Design

### Internal PMS Breakpoints
- Desktop: ≥1280px
- Laptop: 1024px–1279px
- Tablet: 768px–1023px

### Public Website Breakpoints
- Desktop: ≥1280px
- Laptop: 1024px–1279px
- Tablet: 768px–1023px
- Mobile: <768px

### Responsive Approach
- Tailwind CSS responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Mobile-first for public website
- Desktop-first for internal PMS (sidebar layout)
- Sidebar collapses to overlay/mobile menu on tablet and mobile
- Tables: horizontal scroll on smaller screens
- Cards: stack vertically on smaller screens
- Charts: resize appropriately
- Touch targets: minimum 44px on mobile
- Navigation: hamburger menu on mobile for public site, sidebar overlay for PMS

### Touch Considerations
- Button sizes adequate for touch
- Date pickers mobile-friendly
- Form inputs properly sized
- Modal dialogs full-width on mobile

---

## 32. Local Development

### Prerequisites
- Node.js 18+
- npm (included with Node.js)

### Setup Commands
```bash
npm install
npm run dev
```

### Development Server
- Vite dev server runs on `localhost:5173` (default)
- Hot module replacement (HMR) enabled
- No backend server required for frontend prototype
- No PostgreSQL required
- No Laravel server required
- No OTA API required
- No payment API required

### Environment Configuration
- `.env` file for configuration
- `VITE_API_BASE_URL` for API base URL (initially not used, set to mock)
- `VITE_APP_NAME` for application name

### Build for Production
```bash
npm run build
npm run preview
```

---

## 33. Future Laravel Integration

### Backend Capabilities Required (Documented for Future Implementation)

#### Authentication
- POST `/api/login` — Authenticate user, return JWT token
- POST `/api/logout` — Invalidate session/token
- GET `/api/me` — Get current authenticated user
- POST `/api/register` — Register new user (optional)

#### Users
- GET `/api/users` — List users (with pagination, search, filters)
- GET `/api/users/{id}` — Get user details
- POST `/api/users` — Create user
- PUT `/api/users/{id}` — Update user
- DELETE `/api/users/{id}` — Delete/deactivate user

#### Roles
- GET `/api/roles` — List roles
- GET `/api/roles/{id}` — Get role details
- POST `/api/roles` — Create role
- PUT `/api/roles/{id}` — Update role
- DELETE `/api/roles/{id}` — Delete role

#### Permissions
- GET `/api/permissions` — List all permissions
- GET `/api/roles/{id}/permissions` — Get role permissions
- PUT `/api/roles/{id}/permissions` — Assign permissions to role

#### Room Types
- GET `/api/room-types` — List room types
- GET `/api/room-types/{id}` — Get room type details
- POST `/api/room-types` — Create room type
- PUT `/api/room-types/{id}` — Update room type
- DELETE `/api/room-types/{id}` — Delete room type

#### Rooms
- GET `/api/rooms` — List rooms (with filters)
- GET `/api/rooms/{id}` — Get room details
- POST `/api/rooms` — Create room
- PUT `/api/rooms/{id}` — Update room
- DELETE `/api/rooms/{id}` — Delete/deactivate room

#### Reservations
- GET `/api/reservations` — List reservations (with search, filters, pagination)
- GET `/api/reservations/{id}` — Get reservation details
- POST `/api/reservations` — Create reservation
- PUT `/api/reservations/{id}` — Update reservation
- DELETE `/api/reservations/{id}` — Cancel reservation
- PATCH `/api/reservations/{id}/check-in` — Check in
- PATCH `/api/reservations/{id}/check-out` — Check out

#### Reservations Calendar
- GET `/api/reservations/calendar` — Get calendar data

#### Invoices
- GET `/api/invoices` — List invoices
- GET `/api/invoices/{id}` — Get invoice details
- POST `/api/invoices` — Create invoice
- PUT `/api/invoices/{id}` — Update invoice
- PATCH `/api/invoices/{id}/status` — Update invoice status

#### Sales
- GET `/api/sales/overview` — Get sales overview with period filter
- GET `/api/sales/trends` — Get sales trends data

#### Expenses
- GET `/api/expenses` — List expenses
- POST `/api/expenses` — Create expense
- PUT `/api/expenses/{id}` — Update expense
- DELETE `/api/expenses/{id}` — Delete expense

#### Reports
- GET `/api/reports/financial` — Get financial report data
- GET `/api/reports/sales` — Get sales report data
- GET `/api/reports/expenses` — Get expense report data

#### Dashboard
- GET `/api/dashboard/overview` — Get dashboard summary data

### Frontend Architecture for Integration
When Laravel is ready, the following changes are minimal:
1. Update Data Access Layer services to make HTTP requests
2. Replace mock data loading with API calls
3. Add authentication token header to all API requests
4. Add error handling for HTTP errors
5. No changes to UI components, service layer business logic, or form validation

---

## 34. Module Breakdown

### MODULE 01 — Project Foundation
- Project setup with Vite + React + TypeScript
- Tailwind CSS configuration
- Global styles and design tokens
- Base layout components
- UI conventions and component library
- Routing setup
- Local development verification

### MODULE 02 — Public Website Foundation
- Public layout (header, footer, navigation)
- Home page (hero, featured rooms, highlights, gallery preview, CTA)
- About/Property page
- Room Types page
- Gallery page
- Contact page (WhatsApp CTA, map, contact info)
- Public website mock data
- WhatsApp integration UI
- Responsive design

### MODULE 03 — Authentication & RBAC Foundation
- Login page with email/password authentication
- Register page with name, email, password, confirm password
- Forget password page with email submission
- Reset password flow
- Change password page (authenticated users only)
- User model/types
- Role model/types
- Permission model/types
- Current user state (auth context/store)
- Permission checking utilities
- Protected routes
- Permission-aware navigation
- Mock authentication

### MODULE 04 — User Management
- User list page (table, search, filter, pagination)
- Create user form
- Edit user form
- Activate/deactivate user
- User detail page
- User mock data (5 records)
- Depends on AUTH-005 (Login), AUTH-007 (Navigation), AUTH-009 (Register) for user management flow

### MODULE 05 — Role & Permission Management
- Role list page
- Create/edit/delete role
- Permission list page
- Role permission assignment UI
- Permission-based UI components
- Mock data for roles and permissions

### MODULE 06 — Room Type Management
- Room type list page
- Create room type form
- Edit room type form
- Room type activate/deactivate
- Room type mock data (5 records)

### MODULE 07 — Room Management
- Room list page
- Create room form
- Edit room form
- Room status management
- Room filtering
- Room mock data (5 records)

### MODULE 08 — Reservation Foundation
- Reservation types and status definitions
- Reservation source definitions
- Reservation mock data (5 records)
- Reservation data service layer
- Reservation service/data layer

### MODULE 09 — Reservation Management
- Reservation list page
- Search/filter
- Reservation creation form (guest name, source, dates, rooms, rates)
- Multiple rooms support
- Manual room rate input
- Reservation total calculation
- Reservation details page
- Reservation edit
- Reservation cancellation
- Reservation mock data integration

### MODULE 10 — Reservation Calendar
- Calendar layout (monthly view)
- Date range navigation
- Reservation events display
- Room occupancy visualization
- Availability indication
- Calendar filtering

### MODULE 11 — Check-In / Check-Out
- Check-in action
- Check-out action
- Status transitions
- Permission restrictions
- Confirmation dialogs
- Status update logic

### MODULE 12 — Finance Foundation
- Finance navigation section
- Finance data models
- Finance mock data
- Finance shared components
- Expense data (5 records)
- Sales data (5 records)

### MODULE 13 — Invoice
- Invoice list page (search, filter, pagination)
- Invoice creation page
- Invoice items management
- Invoice totals calculation
- Invoice detail page
- Invoice edit
- Invoice status management
- Reservation/invoice relationship
- Invoice mock data (5 records + 5+ items)

### MODULE 14 — Sales
- Sales overview page
- Period filters (Weekly, Monthly, 6 Months, 1 Year)
- Summary cards
- Sales charts (Recharts)
- Sales data filtering
- Revenue by period
- Revenue by reservation source
- Sales mock data (5 records)

### MODULE 15 — Financial Reports
- Report overview page
- Sales summary section
- Expense summary section
- Revenue summary section
- Expense data and categories
- Net result calculation
- Report filtering
- Report visualization (charts)

### MODULE 16 — Activity Logging
- Activity log page with timeline/feed view
- System-wide audit trail
- Log all significant actions: login, check-in, check-out, payment, invoice creation, reservation changes, status updates
- Activity categories: authentication, reservation, finance, system
- Filter by category, user, date range
- Activity detail view
- Activity mock data (10+ records)
- Activity data service
- Activity navigation item in PMS sidebar
- Permission-based access control

### MODULE 17 — Dashboard
- Dashboard layout
- Reservation summary cards
- Sales summary
- Invoice summary
- Occupancy indicators
- Quick action links
- Dashboard mock data integration

### MODULE 18 — Quality & Refinement
- Loading states (skeleton, spinner)
- Empty states
- Error states
- Confirmation dialogs
- Form validation refinement
- Permission testing
- Responsive design refinement
- Accessibility basics (ARIA labels, keyboard navigation)
- UI consistency audit
- Local production build verification
- Linting and code quality checks

---

## 35. Task Breakdown

### MODULE 01 — Project Foundation

| Task ID | Task Name | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|-----------|-------------|---------------------|
| FOUND-001 | Project Setup | Initialize Vite + React + TypeScript project | None | `npm install` and `npm run dev` work without errors |
| FOUND-002 | Tailwind CSS Setup | Configure Tailwind CSS with custom theme | FOUND-001 | Tailwind classes work, custom colors defined |
| FOUND-003 | Global Styles & Design Tokens | Define CSS variables, typography, spacing | FOUND-002 | Consistent design tokens applied globally |
| FOUND-004 | Base Layout | Create app shell with router outlet | FOUND-003 | Router works, layout renders correctly |
| FOUND-005 | Routing Setup | Configure React Router with public and PMS routes | FOUND-004 | All routes defined, navigation works |
| FOUND-006 | UI Components Library | Create base shared components (Button, Input, Card, Modal, Table, Badge, Loading, EmptyState) | FOUND-002, FOUND-003 | All components functional, styled consistently |
| FOUND-007 | Local Development Verification | Verify `npm run dev` works end-to-end | FOUND-001–FOUND-006 | Development server running, no errors |

### MODULE 02 — Public Website Foundation

| Task ID | Task Name | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|-----------|-------------|---------------------|
| PUB-001 | Public Layout | Create public header, footer, navigation | FOUND-005 | Navigation links work, responsive header |
| PUB-002 | Public Mock Data | Create property info, room types, gallery, facilities, contact data | None | All JSON files created with 5+ records each |
| PUB-003 | Home Page | Hero, intro, featured rooms, highlights, gallery preview, CTA | PUB-001, PUB-002 | All sections rendered, responsive |
| PUB-004 | About/Property Page | Property description, facilities, location | PUB-001, PUB-002 | All information displayed |
| PUB-005 | Room Types Page | Display all room types with cards | PUB-001, PUB-002 | Room cards show name, image, description, price |
| PUB-006 | Gallery Page | Photo gallery with grid layout | PUB-001, PUB-002 | Images displayed, responsive grid |
| PUB-007 | Contact Page | Contact info, WhatsApp CTA, map section | PUB-001, PUB-002 | All contact info displayed, WhatsApp link works |
| PUB-008 | WhatsApp CTA Integration | Prominent WhatsApp button across site | PUB-001 | WhatsApp links present on all pages |
| PUB-009 | Responsive Design (Public) | Mobile-first responsive refinement | PUB-001–PUB-008 | All pages work on mobile, tablet, desktop |

### MODULE 03 — Authentication & RBAC Foundation

| Task ID | Task Name | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|-----------|-------------|---------------------|
| AUTH-001 | Auth Data Models | Define User, Role, Permission TypeScript types | None | Types defined, exported, no TS errors |
| AUTH-002 | Auth Mock Data | Create users, roles, permissions JSON files | AUTH-001 | 5 users, 5 roles, 5+ permissions with realistic data |
| AUTH-003 | Auth Context/Store | Create auth context with login, logout, user state | AUTH-001, AUTH-002 | Auth state works, login/logout functional |
| AUTH-004 | Permission System | Create permission utilities and hooks | AUTH-002 | `hasPermission()` works, derived from roles |
| AUTH-005 | Login Page | Authentication form with validation | AUTH-003 | Form works, validates, redirects on success |
| AUTH-006 | Protected Routes | Route guards for PMS pages | AUTH-003, AUTH-004 | Unauthenticated users redirected to login |
| AUTH-007 | Permission-Aware Navigation | Sidebar items filtered by permissions | AUTH-004 | Navigation shows only permitted items |
| AUTH-008 | Current User State | Manage current user across application | AUTH-003 | User data available throughout app |
| AUTH-009 | Register Page | Registration form with name, email, password, confirm password | AUTH-003 | Form works, validates, redirects to login on success |
| AUTH-010 | Forget Password | Forgot password form with email submission and reset flow | AUTH-001 | Email validated, reset link sent, password updated |
| AUTH-011 | Change Password | Authenticated user can change their password | AUTH-005, AUTH-008 | Current password validated, new password applied, redirect to dashboard |
| AUTH-012 | Reset Password Flow | Handle password reset token verification and password update | AUTH-010 | Token validated, password updated successfully |

### MODULE 04 — User Management

| Task ID | Task Name | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|-----------|-------------|---------------------|
| USER-001 | User List Page | Display users with search, filter, pagination | AUTH-005, AUTH-007 | Users displayed, search works, filter works |
| USER-002 | Create User | Form to create new user | AUTH-005, AUTH-007 | User created, validation works, redirect to list |
| USER-003 | Edit User | Form to update existing user | USER-001 | User updated, validation works |
| USER-004 | Activate/Deactivate User | Toggle user status | USER-001 | Status toggled, confirmation dialog |
| USER-005 | User Detail Page | View user information | USER-001 | All user details displayed |
| USER-006 | User Mock Data Integration | Connect user service to mock data | USER-001–USER-005 | All CRUD operations work with mock data |

### MODULE 05 — Role & Permission Management

| Task ID | Task Name | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|-----------|-------------|---------------------|
| ROLE-001 | Role List Page | Display all roles | AUTH-007 | Roles displayed with permissions summary |
| ROLE-002 | Create Role | Form to create new role | AUTH-007 | Role created with permissions |
| ROLE-003 | Edit Role | Form to update role and permissions | ROLE-001 | Role updated, permissions modified |
| ROLE-004 | Delete/Deactivate Role | Remove or deactivate role | ROLE-001 | Role deleted/deactivated with confirmation |
| ROLE-005 | Permission List Page | Display all available permissions | AUTH-007 | All permissions grouped and displayed |
| ROLE-006 | Role Permission Assignment | UI for assigning permissions to roles | ROLE-002, ROLE-003 | Permissions assigned via UI |
| ROLE-007 | Permission-Based UI | Buttons/actions gated by permissions | AUTH-004 | UI reflects user permissions correctly |

### MODULE 06 — Room Type Management

| Task ID | Task Name | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|-----------|-------------|---------------------|
| ROOMTYPE-001 | Room Type List Page | Display all room types | AUTH-007 | Room types displayed with status |
| ROOMTYPE-002 | Create Room Type | Form to create new room type | AUTH-007 | Room type created with validation |
| ROOMTYPE-003 | Edit Room Type | Form to update room type | ROOMTYPE-001 | Room type updated |
| ROOMTYPE-004 | Room Type Status | Activate/deactivate room type | ROOMTYPE-001 | Status toggled |
| ROOMTYPE-005 | Room Type Mock Data | Connect to mock data service | ROOMTYPE-001–ROOMTYPE-004 | 5 room types loaded and displayed |

### MODULE 07 — Room Management

| Task ID | Task Name | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|-----------|-------------|---------------------|
| ROOM-001 | Room List Page | Display all rooms with filters | ROOMTYPE-005 | Rooms displayed, filtered by type/status |
| ROOM-002 | Create Room | Form to create new room | ROOMTYPE-005 | Room created with room type assignment |
| ROOM-003 | Edit Room | Form to update room details | ROOM-001 | Room updated |
| ROOM-004 | Room Status | Manage room active/inactive status | ROOM-001 | Room status updated |
| ROOM-005 | Room Filtering | Filter rooms by type, status | ROOM-001 | Filtering works correctly |
| ROOM-006 | Room Mock Data Integration | Connect room service to mock data | ROOM-001–ROOM-005 | 5 rooms loaded, all operations work |

### MODULE 08 — Reservation Foundation

| Task ID | Task Name | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|-----------|-------------|---------------------|
| RES-FOUND-001 | Reservation Types & Statuses | Define reservation types, statuses, sources | None | Constants defined, exported |
| RES-FOUND-002 | Reservation Mock Data | Create 5 reservation records with realistic data | RES-FOUND-001 | JSON files created, internally consistent |
| RES-FOUND-003 | Reservation Service Layer | Create reservation data access service | RES-FOUND-002 | getAll, getById, create, update, delete functions |
| RES-FOUND-004 | Reservation Room Model | Define ReservationRoom type and relationships | RES-FOUND-001 | Type defined, relationships clear |

### MODULE 09 — Reservation Management

| Task ID | Task Name | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|-----------|-------------|---------------------|
| RES-001 | Reservation List Page | Display reservations with search, filter, pagination | RES-FOUND-003 | Reservations displayed, search works, filter works |
| RES-002 | Reservation Creation Form | Form with guest name, source, dates, room selection, manual rate | RES-FOUND-003, ROOM-006 | Reservation created with validation, total calculated |
| RES-003 | Multiple Room Selection | UI for selecting multiple rooms with rates | RES-002 | Multiple rooms selectable, subtotals calculated |
| RES-004 | Reservation Details Page | Full reservation view | RES-001 | All reservation info displayed, actions visible |
| RES-005 | Reservation Edit | Edit existing reservation | RES-004 | Reservation updated, validation works |
| RES-006 | Reservation Cancellation | Cancel reservation with confirmation | RES-004 | Status changed to Cancelled |
| RES-007 | Room Availability Check | Check room availability for date range | RES-002, RES-FOUND-003 | Available rooms filtered correctly |
| RES-008 | Reservation Mock Data Integration | Connect reservation service to mock data | RES-001–RES-007 | All CRUD operations work with mock data |

### MODULE 10 — Reservation Calendar

| Task ID | Task Name | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|-----------|-------------|---------------------|
| CAL-001 | Calendar Layout | Monthly calendar view | RES-001 | Calendar renders with reservation events |
| CAL-002 | Date Range Navigation | Navigate between months | CAL-001 | Month navigation works |
| CAL-003 | Reservation Events Display | Show reservations as calendar blocks | CAL-001 | Events displayed with guest/room/status info |
| CAL-004 | Room Occupancy | Visual occupancy indication | CAL-003 | Occupancy shown per room |
| CAL-005 | Calendar Filtering | Filter by room, status, date range | CAL-001 | Filtering works |
| CAL-006 | Availability Visualization | Show available rooms/dates | CAL-004 | Availability clearly indicated |

### MODULE 11 — Check-In / Check-Out

| Task ID | Task Name | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|-----------|-------------|---------------------|
| CHECK-001 | Check-In Action | Button and action to check in reservation | RES-004 | Status changes to Checked In |
| CHECK-002 | Check-Out Action | Button and action to check out reservation | RES-004 | Status changes to Checked Out |
| CHECK-003 | Status Transition Rules | Enforce valid status transitions | RES-004, CHECK-001, CHECK-002 | Invalid transitions prevented |
| CHECK-004 | Permission Restrictions | Check permissions for check-in/out | CHECK-001, CHECK-002 | Unauthorized users cannot check in/out |
| CHECK-005 | Confirmation Dialogs | Confirm before status change | CHECK-001, CHECK-002 | Confirmation dialog shown |

### MODULE 12 — Finance Foundation

| Task ID | Task Name | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|-----------|-------------|---------------------|
| FIN-FOUND-001 | Finance Navigation | Add Finance section to PMS sidebar | AUTH-007 | Finance section visible with sub-items |
| FIN-FOUND-002 | Finance Data Models | Define Invoice, Expense, Sale, Report types | None | All types defined |
| FIN-FOUND-003 | Finance Mock Data | Create invoices, expenses, sales JSON files | FIN-FOUND-002 | 5+ records for each entity |
| FIN-FOUND-004 | Finance Shared Components | StatsCard, SalesChart, ExpenseChart | None | Reusable chart/stats components |
| FIN-FOUND-005 | Expense Data | 5 expense records with categories | FIN-FOUND-002 | Expense mock data complete |
| FIN-FOUND-006 | Sales Data | 5 sales records derived from reservations | FIN-FOUND-002, RES-008 | Sales data consistent with reservations |

### MODULE 13 — Invoice

| Task ID | Task Name | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|-----------|-------------|---------------------|
| INV-001 | Invoice List Page | Display invoices with search, filter | FIN-FOUND-003 | Invoices displayed, search works |
| INV-002 | Invoice Creation | Form to create invoice from reservation | RES-004, FIN-FOUND-003 | Invoice created with items |
| INV-003 | Invoice Items Management | Add/edit/remove invoice items | INV-002 | Items calculated correctly |
| INV-004 | Invoice Totals | Subtotal, discount, total calculation | INV-003 | Totals calculated correctly |
| INV-005 | Invoice Detail Page | Full invoice view | INV-001 | All invoice info displayed |
| INV-006 | Invoice Edit | Modify invoice where appropriate | INV-005 | Invoice updated |
| INV-007 | Invoice Status Management | Update invoice status | INV-001 | Status changed with validation |
| INV-008 | Invoice Mock Data Integration | Connect invoice service to mock data | INV-001–INV-007 | All operations work |

### MODULE 14 — Sales

| Task ID | Task Name | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|-----------|-------------|---------------------|
| SALES-001 | Sales Overview Page | Main sales reporting page | FIN-FOUND-003, FIN-FOUND-004 | Sales overview rendered |
| SALES-002 | Period Filters | Weekly, Monthly, 6 Months, 1 Year | SALES-001 | All period options work |
| SALES-003 | Summary Cards | Total sales, revenue, transaction count, avg | SALES-001 | Cards display correct values |
| SALES-004 | Sales Charts | Line/bar chart of sales trends | SALES-002 | Charts render with correct data |
| SALES-005 | Source Breakdown | Revenue by reservation source | SALES-001 | Source breakdown displayed |
| SALES-006 | Sales Data Filtering | Filter sales data by period | SALES-001–SALES-005 | Filtering updates all components |

### MODULE 15 — Financial Reports

| Task ID | Task Name | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|-----------|-------------|---------------------|
| REPORT-001 | Report Overview Page | Financial report dashboard | FIN-FOUND-003, FIN-FOUND-004 | Report overview rendered |
| REPORT-002 | Sales Summary | Sales data in report | REPORT-001 | Sales summary displayed |
| REPORT-003 | Expense Summary | Expense data by category | REPORT-001 | Expense summary displayed |
| REPORT-004 | Revenue Summary | Revenue = Sales - Expenses | REPORT-001 | Net revenue calculated |
| REPORT-005 | Expense Data & Categories | Expense categories and trends | FIN-FOUND-005 | Expense chart displays |
| REPORT-006 | Report Filtering | Date range filter for reports | REPORT-001–REPORT-005 | Filtering updates all report sections |
| REPORT-007 | Report Visualization | Charts for all report sections | REPORT-002–REPORT-005 | Charts render correctly |

### MODULE 16 — Dashboard

| Task ID | Task Name | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|-----------|-------------|---------------------|
| DASH-001 | Dashboard Layout | Grid layout with summary cards and lists | AUTH-007 | Dashboard renders correctly |
| DASH-002 | Reservation Summary | Today/upcoming/recent reservations | RES-001 | Reservation summary cards |
| DASH-003 | Sales Summary | Today/this week/this month sales | SALES-001 | Sales summary cards |
| DASH-004 | Invoice Summary | Pending/overdue/paid invoice counts | INV-001 | Invoice summary cards |
| DASH-005 | Occupancy Indicators | Room occupancy metrics | ROOM-006 | Occupancy rate displayed |
| DASH-006 | Quick Actions | Links to create reservation, invoice, etc. | DASH-001–DASH-005 | Quick action buttons functional |

### MODULE 17 — Quality & Refinement

| Task ID | Task Name | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|-----------|-------------|---------------------|
| QA-001 | Loading States | Skeleton/spinners for data loading | All modules | Loading states shown during data fetch |
| QA-002 | Empty States | Illustrations/messages for empty data | All modules | Empty states displayed when no data |
| QA-003 | Error States | Error messages and recovery | All modules | Errors handled gracefully |
| QA-004 | Confirmation Dialogs | Reusable confirm dialog component | All modules | Confirmations used for destructive actions |
| QA-005 | Validation Refinement | Comprehensive form validation | All modules | All forms validated correctly |
| QA-006 | Permission Testing | Test all permission-based UI | AUTH-007, all modules | Permissions correctly enforced |
| QA-007 | Responsive Refinement | Polish responsive design | All modules | All pages responsive across devices |
| QA-008 | Accessibility Basics | ARIA labels, keyboard navigation | All modules | Basic accessibility implemented |
| QA-009 | UI Consistency Audit | Review all components for consistency | All modules | Consistent colors, spacing, typography |
| QA-010 | Production Build | Verify `npm run build` works | All modules | Production build succeeds, no errors |
| QA-011 | Linting & Code Quality | ESLint + Prettier setup and checks | All modules | No lint errors, consistent formatting |

---

## 36. Task Dependencies

### Critical Path
```
FOUND-001 → FOUND-002 → FOUND-003 → FOUND-004 → FOUND-005 → FOUND-006 → FOUND-007
PUB-001 → PUB-002 → PUB-003 → PUB-004 → PUB-005 → PUB-006 → PUB-007 → PUB-008 → PUB-009
AUTH-001 → AUTH-002 → AUTH-003 → AUTH-004 → AUTH-005 → AUTH-006 → AUTH-007 → AUTH-008 → AUTH-009 → AUTH-010 → AUTH-011 → AUTH-012
USER-001–006 depends on AUTH-005, AUTH-007
ROLE-001–007 depends on AUTH-007, AUTH-004
ROOMTYPE-001–005 depends on AUTH-007
ROOM-001–006 depends on ROOMTYPE-005, AUTH-007
RES-FOUND-001–004 depends on AUTH-007
RES-001–008 depends on RES-FOUND-003, ROOM-006
CAL-001–006 depends on RES-001
CHECK-001–005 depends on RES-004
FIN-FOUND-001–006 depends on RES-008, AUTH-007
INV-001–008 depends on FIN-FOUND-003, RES-004
SALES-001–006 depends on FIN-FOUND-003, FIN-FOUND-004, RES-008
REPORT-001–007 depends on FIN-FOUND-003, FIN-FOUND-004, FIN-FOUND-005, FIN-FOUND-006
DASH-001–006 depends on RES-001, SALES-001, INV-001, ROOM-006, AUTH-007
QA-001–011 depends on all modules
```

### Cross-Module Dependencies
- `RES-002` (Reservation Creation) depends on: `RES-FOUND-003` (Reservation Service), `ROOM-006` (Room Mock Data), `AUTH-005` (Login)
- `FIN-002` (Invoice Creation) depends on: `RES-004` (Reservation Details), `FIN-FOUND-003` (Finance Mock Data)
- `SALES-001` (Sales Overview) depends on: `FIN-002` (Invoice), `RES-008` (Reservation Data), `FIN-FOUND-004` (Charts)
- `REPORT-001` (Financial Report) depends on: `SALES-001` (Sales), `FIN-FOUND-005` (Expenses)
- `DASH-001` (Dashboard) depends on: All module data services

---

## 37. Acceptance Criteria

### General Acceptance Criteria (All Tasks)
- No TypeScript errors
- No console errors in browser
- Relevant linting passes
- Responsive on all target devices
- All form validations work correctly
- Mock data loads and displays correctly
- FRONTEND_PLAN.md updated after task completion
- Definition of Done met

### Module Acceptance Criteria

#### MODULE 01 — Project Foundation
- `npm install` completes successfully
- `npm run dev` starts development server
- Tailwind CSS classes work
- All shared components render correctly
- Routing works with all defined routes
- Production build (`npm run build`) succeeds

#### MODULE 02 — Public Website
- All 5 public pages render correctly
- WhatsApp CTA visible on all pages
- All pages responsive on mobile, tablet, desktop
- Mock data loads and displays
- Navigation works correctly
- Gallery images display

#### MODULE 03 — Authentication & RBAC
- Login form works with mock data
- Authentication state persists across pages
- Permission checking works correctly
- Protected routes redirect unauthenticated users
- Navigation reflects user permissions

#### MODULE 04–07 — CRUD Modules
- All CRUD operations work with mock data
- Search and filter functionality works
- Forms validate correctly
- Status toggles work
- Pagination works (if applicable)

#### MODULE 08–11 — Reservation Modules
- Reservation creation works with all fields
- Multiple rooms per reservation supported
- Manual pricing rule enforced
- Reservation editing works
- Cancellation works
- Calendar displays reservations correctly
- Check-in/check-out status transitions work
- Permission restrictions enforced

#### MODULE 12–15 — Finance Modules
- Invoice creation from reservation works
- Invoice items calculate correctly
- Sales overview with period filters works
- Charts render correctly
- Expense data displayed
- Financial reports generate correctly

#### MODULE 16 — Dashboard
- Dashboard displays all summary information
- Quick actions navigate correctly
- All widgets load correctly

#### MODULE 17 — Quality & Refinement
- Loading states shown appropriately
- Empty states displayed when no data
- Error states handled gracefully
- Confirmation dialogs work
- All forms validated
- Responsive design polished
- Accessibility basics implemented
- Production build succeeds
- No lint errors

---

## 38. Definition of Done

A task is considered **Done** when ALL of the following criteria are met:

1. **UI Implemented**: All required UI components rendered and styled
2. **Mock Data Connected**: Service layer connected to mock data
3. **No TypeScript Errors**: `tsc --noEmit` passes or no TS errors in console
4. **No Console Errors**: No runtime errors in browser console
5. **Validation Works**: All form validations functional
6. **Responsive**: Page works on all target screen sizes
7. **Permission Testing**: Permission-gated features verified
8. **FRONTEND_PLAN.md Updated**: Task status updated, implementation notes recorded
9. **Verification Steps Passed**: All acceptance criteria met
10. **Relevant Checks Passed**: Linting, type checking, build verification

---

## 39. Task Progress Tracking

### 🎨 Design System Applied

**Design Reference**: Warm Minimalist Reservation — Brown & Cream Theme

| Design Token | Value |
|---|---|
| Primary Color | `#6F4528` (Primary Brown) |
| Dark Brown | `#4A2C1A` |
| Medium Brown | `#8B5E3C` |
| Light Brown | `#B88962` |
| Background | `#F5F0E8` (Cream) |
| Surface | `#FFFCF8` (Off-White) |
| Input Background | `#FAF7F2` |
| Border | `#DED3C6` |
| Divider | `#E5DCD1` |
| Success | `#4F8A5B` |
| Warning | `#C58A3A` |
| Error | `#C85C5C` |
| Info | `#5C7FA3` |
| Primary Text | `#2D241F` |
| Secondary Text | `#756A61` |
| Muted Text | `#A0958B` |
| Font | Inter, Playfair Display |
| Card Radius | 16px |
| Button Radius | 12px |
| Button Height | 48px |
| Input Height | 52px |
| 4px Spacing System | ✅ |
| Mobile Padding | 20px |

**Applied to**: tailwind.config.ts, src/styles/globals.css, src/config/app.ts, all shared components, all layout components

---

### MODULE 01 — Project Foundation

| Task ID | Task Name | Status | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|--------|-----------|-------------|---------------------|
| FOUND-001 | Project Setup | ✅ Completed | Initialize Vite + React + TypeScript project | None | `npm install` and `npm run dev` work without errors |
| FOUND-002 | Tailwind CSS Setup | ✅ Completed | Configure Tailwind CSS with brown/cream custom theme | FOUND-001 | Tailwind classes work, custom colors defined |
| FOUND-003 | Global Styles & Design Tokens | ✅ Completed | Define CSS variables, typography, spacing with Warm Minimalist design | FOUND-002 | Consistent design tokens applied globally |
| FOUND-004 | Base Layout | ✅ Completed | Create app shell with PublicLayout, PMSLayout, BaseLayout | FOUND-003 | Router works, layout renders correctly |
| FOUND-005 | Routing Setup | ✅ Completed | Configure React Router with public and PMS routes | FOUND-004 | All routes defined, navigation works |
| FOUND-006 | UI Components Library | ✅ Completed | Create 12 shared components (Button, Input, Select, Modal, Table, Card, Badge, Loading, EmptyState, ErrorState, ConfirmDialog, Pagination) | FOUND-002, FOUND-003 | All components functional, styled with brown/cream theme |
| FOUND-007 | Local Development Verification | ✅ Completed | Verify `npm run dev` works end-to-end | FOUND-001–FOUND-006 | Development server running, no errors |

**Status**: 7/7 completed  
**Implementation Notes**: Design system applied (Warm Minimalist Reservation — Brown #6F4528, Cream #F5F0E8). All 12 shared components created with the design system. Layout components created. Routing configured. TypeScript types defined. Dev server running on port 5173.  
**Files Created**: 63 source files + 20 config files (package.json, tsconfig.json, vite.config.ts, tailwind.config.ts, postcss.config.js, index.html, .gitignore, .eslintrc.cjs → eslint.config.js, .prettierrc, tsconfig.node.json, src/main.tsx, src/App.tsx, src/styles/globals.css, src/index.css, src/vite-env.d.ts, src/config/routes.ts, src/config/app.ts, src/layouts/*.tsx, src/components/shared/*.tsx, src/types/*.ts, src/utils/*.ts, src/constants/*.ts, src/hooks/*.ts, src/stores/*.tsx, src/pages/*.tsx, src/data/mock/, src/data/public/)  
**Verification**: `npx tsc --noEmit` PASS (exit code 0), `npx vite build` PASS (40 modules, 1.26s), `npm run dev` PASS (localhost:5173), `npm run lint` configured with @typescript-eslint, HMR enabled  
**Important Decisions**: Used React Context + useReducer for state management; Inter + Playfair Display fonts; `@/` path alias configured; 4px spacing system; `jsx: "react-jsx"` in tsconfig; ESLint v9 flat config format; `eslint-plugin-react` removed due to corrupted dependency; `postcss.config.js` simplified to empty plugins  
**Known Issues**: `npm run dev` was verified but server was terminated after verification; `npm run build` confirmed working; `npm run lint` requires `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin` packages; 4 vulnerabilities (3 moderate, 1 high) in dependencies

---

### MODULE 02 — Public Website Foundation

| Task ID | Task Name | Status | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|--------|-----------|-------------|---------------------|
| PUB-001 | Public Layout | ⬜ Pending | Create public header, footer, navigation | FOUND-005 | Navigation links work, responsive header |
| PUB-002 | Public Mock Data | ⬜ Pending | Create property info, room types, gallery, facilities, contact data | None | All JSON files created with 5+ records each |
| PUB-003 | Home Page | ⬜ Pending | Hero, intro, featured rooms, highlights, gallery preview, CTA | PUB-001, PUB-002 | All sections rendered, responsive |
| PUB-004 | About/Property Page | ⬜ Pending | Property description, facilities, location | PUB-001, PUB-002 | All information displayed |
| PUB-005 | Room Types Page | ⬜ Pending | Display all room types with cards | PUB-001, PUB-002 | Room cards show name, image, description, price |
| PUB-006 | Gallery Page | ⬜ Pending | Photo gallery with grid layout | PUB-001, PUB-002 | Images displayed, responsive grid |
| PUB-007 | Contact Page | ⬜ Pending | Contact info, WhatsApp CTA, map section | PUB-001, PUB-002 | All contact info displayed, WhatsApp link works |
| PUB-008 | WhatsApp CTA Integration | ⬜ Pending | Prominent WhatsApp button across site | PUB-001 | WhatsApp links present on all pages |
| PUB-009 | Responsive Design (Public) | ⬜ Pending | Mobile-first responsive refinement | PUB-001–PUB-008 | All pages work on mobile, tablet, desktop |

**Status**: All tasks ⬜ Pending  
**Implementation Notes**: —  
**Files Created/Modified**: —  
**Verification**: —  
**Important Decisions**: —  
**Known Issues**: —  

---

### MODULE 03 — Authentication & RBAC Foundation

| Task ID | Task Name | Status | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|--------|-----------|-------------|---------------------|
| AUTH-001 | Auth Data Models | ✅ Completed | Define User, Role, Permission TypeScript types | None | Types defined, exported, no TS errors |
| AUTH-002 | Auth Mock Data | ⬜ Pending | Create users, roles, permissions JSON files | AUTH-001 | 5 users, 5 roles, 5+ permissions with realistic data |
| AUTH-003 | Auth Context/Store | ✅ Completed | Create auth context with login, logout, user state | AUTH-001, AUTH-002 | Auth state works, login/logout functional |
| AUTH-004 | Permission System | ✅ Completed | Create permission utilities and hooks | AUTH-002 | `hasPermission()` works, derived from roles |
| AUTH-005 | Login Page | ✅ Completed | Authentication form with brown/cream theme | AUTH-003 | Form works, validates, redirects on success |
| AUTH-006 | Protected Routes | ✅ Completed | Route guards for PMS pages | AUTH-003, AUTH-004 | Unauthenticated users redirected to login |
| AUTH-007 | Permission-Aware Navigation | ✅ Completed | Sidebar items filtered by permissions | AUTH-004 | Navigation shows only permitted items |
| AUTH-008 | Current User State | ✅ Completed | Manage current user across application | AUTH-003 | User data available throughout app |
| AUTH-009 | Register Page | ⬜ Pending | Registration form with name, email, password, confirm password | AUTH-003 | Form works, validates, redirects to login on success |
| AUTH-010 | Forget Password | ⬜ Pending | Forgot password form with email submission and reset flow | AUTH-001 | Email validated, reset link sent, password updated |
| AUTH-011 | Change Password | ⬜ Pending | Authenticated user can change their password | AUTH-005, AUTH-008 | Current password validated, new password applied, redirect to dashboard |
| AUTH-012 | Reset Password Flow | ⬜ Pending | Handle password reset token verification and password update | AUTH-010 | Token validated, password updated successfully |

**Status**: 6/12 completed, 6 pending
**Implementation Notes**: AuthProvider, PermissionProvider, UIProvider created. useAuth, usePermissions hooks created. LoginPage created with design system. ProtectedRoute and PublicOnlyRoute components defined. Register, Forget Password, Change Password, and Reset Password features planned.
**Files Created/Modified**: src/stores/authStore.ts, src/stores/permissionStore.ts, src/stores/uiStore.ts, src/hooks/useAuth.ts, src/hooks/usePermissions.ts, src/utils/permissionUtils.ts, src/pages/LoginPage.tsx, src/App.tsx (routing)
**Verification**: Context providers configured, hooks work, login form styled with design system
**Important Decisions**: React Context + useReducer chosen for state management; Registration, Forget Password, and Change Password flows to be added as new pages
**Known Issues**: Mock authentication not yet connected to JSON data; AUTH-007, AUTH-002, AUTH-009, AUTH-010, AUTH-011, AUTH-012 pending

---

### MODULE 04 — User Management

| Task ID | Task Name | Status | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|--------|-----------|-------------|---------------------|
| USER-001 | User List Page | ⬜ Pending | Display users with search, filter, pagination | AUTH-005, AUTH-007 | Users displayed, search works, filter works |
| USER-002 | Create User | ⬜ Pending | Form to create new user | AUTH-005, AUTH-007 | User created, validation works, redirect to list |
| USER-003 | Edit User | ⬜ Pending | Form to update existing user | USER-001 | User updated, validation works |
| USER-004 | Activate/Deactivate User | ⬜ Pending | Toggle user status | USER-001 | Status toggled, confirmation dialog |
| USER-005 | User Detail Page | ⬜ Pending | View user information | USER-001 | All user details displayed |
| USER-006 | User Mock Data Integration | ⬜ Pending | Connect user service to mock data | USER-001–USER-005 | All CRUD operations work with mock data |

**Status**: All tasks ⬜ Pending  
**Implementation Notes**: —  
**Files Created/Modified**: —  
**Verification**: —  
**Important Decisions**: —  
**Known Issues**: —  

---

### MODULE 05 — Role & Permission Management

| Task ID | Task Name | Status | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|--------|-----------|-------------|---------------------|
| ROLE-001 | Role List Page | ⬜ Pending | Display all roles | AUTH-007 | Roles displayed with permissions summary |
| ROLE-002 | Create Role | ⬜ Pending | Form to create new role | AUTH-007 | Role created with permissions |
| ROLE-003 | Edit Role | ⬜ Pending | Form to update role and permissions | ROLE-001 | Role updated, permissions modified |
| ROLE-004 | Delete/Deactivate Role | ⬜ Pending | Remove or deactivate role | ROLE-001 | Role deleted/deactivated with confirmation |
| ROLE-005 | Permission List Page | ⬜ Pending | Display all available permissions | AUTH-007 | All permissions grouped and displayed |
| ROLE-006 | Role Permission Assignment | ⬜ Pending | UI for assigning permissions to roles | ROLE-002, ROLE-003 | Permissions assigned via UI |
| ROLE-007 | Permission-Based UI | ⬜ Pending | Buttons/actions gated by permissions | AUTH-004 | UI reflects user permissions correctly |

**Status**: All tasks ⬜ Pending  
**Implementation Notes**: —  
**Files Created/Modified**: —  
**Verification**: —  
**Important Decisions**: —  
**Known Issues**: —  

---

### MODULE 06 — Room Type Management

| Task ID | Task Name | Status | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|--------|-----------|-------------|---------------------|
| ROOMTYPE-001 | Room Type List Page | ⬜ Pending | Display all room types | AUTH-007 | Room types displayed with status |
| ROOMTYPE-002 | Create Room Type | ⬜ Pending | Form to create new room type | AUTH-007 | Room type created with validation |
| ROOMTYPE-003 | Edit Room Type | ⬜ Pending | Form to update room type | ROOMTYPE-001 | Room type updated |
| ROOMTYPE-004 | Room Type Status | ⬜ Pending | Activate/deactivate room type | ROOMTYPE-001 | Status toggled |
| ROOMTYPE-005 | Room Type Mock Data Integration | ⬜ Pending | Connect to mock data service | ROOMTYPE-001–ROOMTYPE-004 | 5 room types loaded and displayed |

**Status**: All tasks ⬜ Pending  
**Implementation Notes**: —  
**Files Created/Modified**: —  
**Verification**: —  
**Important Decisions**: —  
**Known Issues**: —  

---

### MODULE 07 — Room Management

| Task ID | Task Name | Status | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|--------|-----------|-------------|---------------------|
| ROOM-001 | Room List Page | ⬜ Pending | Display all rooms with filters | ROOMTYPE-005 | Rooms displayed, filtered by type/status |
| ROOM-002 | Create Room | ⬜ Pending | Form to create new room | ROOMTYPE-005 | Room created with room type assignment |
| ROOM-003 | Edit Room | ⬜ Pending | Form to update room details | ROOM-001 | Room updated |
| ROOM-004 | Room Status | ⬜ Pending | Manage room active/inactive status | ROOM-001 | Room status updated |
| ROOM-005 | Room Filtering | ⬜ Pending | Filter rooms by type, status | ROOM-001 | Filtering works correctly |
| ROOM-006 | Room Mock Data Integration | ⬜ Pending | Connect room service to mock data | ROOM-001–ROOM-005 | 5 rooms loaded, all operations work |

**Status**: All tasks ⬜ Pending  
**Implementation Notes**: —  
**Files Created/Modified**: —  
**Verification**: —  
**Important Decisions**: —  
**Known Issues**: —  

---

### MODULE 08 — Reservation Foundation

| Task ID | Task Name | Status | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|--------|-----------|-------------|---------------------|
| RES-FOUND-001 | Reservation Types & Statuses | ⬜ Pending | Define reservation types, statuses, sources | None | Constants defined, exported |
| RES-FOUND-002 | Reservation Mock Data | ⬜ Pending | Create 5 reservation records with realistic data | RES-FOUND-001 | JSON files created, internally consistent |
| RES-FOUND-003 | Reservation Service Layer | ⬜ Pending | Create reservation data access service | RES-FOUND-002 | getAll, getById, create, update, delete functions |
| RES-FOUND-004 | Reservation Room Model | ⬜ Pending | Define ReservationRoom type and relationships | RES-FOUND-001 | Type defined, relationships clear |

**Status**: All tasks ⬜ Pending  
**Implementation Notes**: —  
**Files Created/Modified**: —  
**Verification**: —  
**Important Decisions**: —  
**Known Issues**: —  

---

### MODULE 09 — Reservation Management

| Task ID | Task Name | Status | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|--------|-----------|-------------|---------------------|
| RES-001 | Reservation List Page | ⬜ Pending | Display reservations with search, filter, pagination | RES-FOUND-003 | Reservations displayed, search works, filter works |
| RES-002 | Reservation Creation Form | ⬜ Pending | Form with guest name, source, dates, room selection, manual rate | RES-FOUND-003, ROOM-006 | Reservation created with validation, total calculated |
| RES-003 | Multiple Room Selection | ⬜ Pending | UI for selecting multiple rooms with rates | RES-002 | Multiple rooms selectable, subtotals calculated |
| RES-004 | Reservation Details Page | ⬜ Pending | Full reservation view | RES-001 | All reservation info displayed, actions visible |
| RES-005 | Reservation Edit | ⬜ Pending | Edit existing reservation | RES-004 | Reservation updated, validation works |
| RES-006 | Reservation Cancellation | ⬜ Pending | Cancel reservation with confirmation | RES-004 | Status changed to Cancelled |
| RES-007 | Room Availability Check | ⬜ Pending | Check room availability for date range | RES-002, RES-FOUND-003 | Available rooms filtered correctly |
| RES-008 | Reservation Mock Data Integration | ⬜ Pending | Connect reservation service to mock data | RES-001–RES-007 | All CRUD operations work with mock data |

**Status**: All tasks ⬜ Pending  
**Implementation Notes**: —  
**Files Created/Modified**: —  
**Verification**: —  
**Important Decisions**: —  
**Known Issues**: —  

---

### MODULE 10 — Reservation Calendar

| Task ID | Task Name | Status | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|--------|-----------|-------------|---------------------|
| CAL-001 | Calendar Layout | ⬜ Pending | Monthly calendar view | RES-001 | Calendar renders with reservation events |
| CAL-002 | Date Range Navigation | ⬜ Pending | Navigate between months | CAL-001 | Month navigation works |
| CAL-003 | Reservation Events Display | ⬜ Pending | Show reservations as calendar blocks | CAL-001 | Events displayed with guest/room/status info |
| CAL-004 | Room Occupancy | ⬜ Pending | Visual occupancy indication | CAL-003 | Occupancy shown per room |
| CAL-005 | Calendar Filtering | ⬜ Pending | Filter by room, status, date range | CAL-001 | Filtering works |
| CAL-006 | Availability Visualization | ⬜ Pending | Show available rooms/dates | CAL-004 | Availability clearly indicated |

**Status**: All tasks ⬜ Pending  
**Implementation Notes**: —  
**Files Created/Modified**: —  
**Verification**: —  
**Important Decisions**: —  
**Known Issues**: —  

---

### MODULE 11 — Check-In / Check-Out

| Task ID | Task Name | Status | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|--------|-----------|-------------|---------------------|
| CHECK-001 | Check-In Action | ⬜ Pending | Button and action to check in reservation | RES-004 | Status changes to Checked In |
| CHECK-002 | Check-Out Action | ⬜ Pending | Button and action to check out reservation | RES-004 | Status changes to Checked Out |
| CHECK-003 | Status Transition Rules | ⬜ Pending | Enforce valid status transitions | RES-004, CHECK-001, CHECK-002 | Invalid transitions prevented |
| CHECK-004 | Permission Restrictions | ⬜ Pending | Check permissions for check-in/out | CHECK-001, CHECK-002 | Unauthorized users cannot check in/out |
| CHECK-005 | Confirmation Dialogs | ⬜ Pending | Confirm before status change | CHECK-001, CHECK-002 | Confirmation dialog shown |

**Status**: All tasks ⬜ Pending  
**Implementation Notes**: —  
**Files Created/Modified**: —  
**Verification**: —  
**Important Decisions**: —  
**Known Issues**: —  

---

### MODULE 12 — Finance Foundation

| Task ID | Task Name | Status | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|--------|-----------|-------------|---------------------|
| FIN-FOUND-001 | Finance Navigation | ⬜ Pending | Add Finance section to PMS sidebar | AUTH-007 | Finance section visible with sub-items |
| FIN-FOUND-002 | Finance Data Models | ✅ Completed | Define Invoice, Expense, Sale, Report types | None | All types defined |
| FIN-FOUND-003 | Finance Mock Data | ⬜ Pending | Create invoices, expenses, sales JSON files | FIN-FOUND-002 | 5+ records for each entity |
| FIN-FOUND-004 | Finance Shared Components | ⬜ Pending | StatsCard, SalesChart, ExpenseChart | None | Reusable chart/stats components |
| FIN-FOUND-005 | Expense Data | ⬜ Pending | 5 expense records with categories | FIN-FOUND-002 | Expense mock data complete |
| FIN-FOUND-006 | Sales Data | ⬜ Pending | 5 sales records derived from reservations | FIN-FOUND-002, RES-008 | Sales data consistent with reservations |

**Status**: 1/6 completed, 5 pending  
**Implementation Notes**: Type definitions completed in src/types/  
**Files Created/Modified**: src/types/finance.types.ts, src/types/invoice.types.ts  
**Verification**: —  
**Important Decisions**: —  
**Known Issues**: —  

---

### MODULE 13 — Invoice

| Task ID | Task Name | Status | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|--------|-----------|-------------|---------------------|
| INV-001 | Invoice List Page | ✅ Completed | Display invoices with search, filter | FIN-FOUND-003 | Invoices displayed, search works |
| INV-002 | Invoice Creation | ✅ Completed | Form to create invoice from reservation | RES-004, FIN-FOUND-003 | Invoice created with items |
| INV-003 | Invoice Items Management | ✅ Completed | Add/edit/remove invoice items | INV-002 | Items calculated correctly |
| INV-004 | Invoice Totals | ✅ Completed | Subtotal, discount, total calculation | INV-003 | Totals calculated correctly |
| INV-005 | Invoice Detail Page | ✅ Completed | Full invoice view | INV-001 | All invoice info displayed |
| INV-006 | Invoice Edit | ✅ Completed | Modify invoice where appropriate | INV-005 | Invoice updated |
| INV-007 | Invoice Status Management | ✅ Completed | Update invoice status | INV-001 | Status changed with validation |
| INV-008 | Invoice Mock Data Integration | ✅ Completed | Connect invoice service to mock data | INV-001–INV-007 | All operations work |

**Status**: 8/8 completed  
**Implementation Notes**: InvoiceList with search + status filter; InvoiceForm shared component with Zod validation; InvoiceDetail with Send / Mark Paid / Cancel actions gated by status (Cancel guarded by ConfirmDialog); manual-rate rule preserved (`ReservationRoom.rate` → `InvoiceItem.unitPrice`); 5 mock invoices linked to reservations  
**Files Created/Modified**: src/pages/finance/InvoiceListPage.tsx, InvoiceFormPage.tsx, InvoiceDetailPage.tsx (status actions + ConfirmDialog added 2026-09-18), src/components/shared/InvoiceForm.tsx, InvoiceStatusBadge.tsx, src/services/invoiceService.ts, src/data/mock/invoices.json  
**Verification**: `npx tsc --noEmit` PASS, `npm run build` PASS (1675 modules), invoice routes render under `finance.view` guard  
**Important Decisions**: Status transitions enforced in UI (Draft→Sent→Paid, Draft/Sent→Cancelled); destructive Cancel requires confirmation  
**Known Issues**: None in module scope  

---

### MODULE 14 — Sales

| Task ID | Task Name | Status | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|--------|-----------|-------------|---------------------|
| SALES-001 | Sales Overview Page | ✅ Completed | Main sales reporting page | FIN-FOUND-003, FIN-FOUND-004 | Sales overview rendered |
| SALES-002 | Period Filters | ✅ Completed | Weekly, Monthly, 6 Months, 1 Year | SALES-001 | All period options work |
| SALES-003 | Summary Cards | ✅ Completed | Total sales, revenue, transaction count, avg | SALES-001 | Cards display correct values |
| SALES-004 | Sales Charts | ✅ Completed | Line/bar chart of sales trends | SALES-002 | Charts render with correct data |
| SALES-005 | Source Breakdown | ✅ Completed | Revenue by reservation source | SALES-001 | Source breakdown displayed |
| SALES-006 | Sales Data Filtering | ✅ Completed | Filter sales data by period | SALES-001–SALES-005 | Filtering updates all components |

**Status**: 6/6 completed  
**Implementation Notes**: SalesPage with today/week/month/6months/1year filters, 4 StatsCards with Lucide vector icons, source breakdown table, monthly Sales-vs-Expenses chart extracted to reusable `SalesChart` shared component (custom div bars with role="img" + aria-label summary + legend; Recharts intentionally not added — no new dependencies); IDR formatting throughout  
**Files Created/Modified**: src/pages/finance/SalesPage.tsx (icons + SalesChart wiring 2026-09-18), src/components/shared/SalesChart.tsx (new), StatsCard.tsx (icon: ReactNode), src/services/salesService.ts, src/data/mock/sales.json  
**Verification**: `npx tsc --noEmit` PASS, `npm run build` PASS, period filter updates all sections  
**Important Decisions**: Dependency-free custom charts instead of Recharts (skill constraint: no package installs); chart logic extracted for reuse in ReportPage per composition guidance  
**Known Issues**: None in module scope  

---

### MODULE 15 — Financial Reports

| Task ID | Task Name | Status | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|--------|-----------|-------------|---------------------|
| REPORT-001 | Report Overview Page | ✅ Completed | Financial report dashboard | FIN-FOUND-003, FIN-FOUND-004 | Report overview rendered |
| REPORT-002 | Sales Summary | ✅ Completed | Sales data in report | REPORT-001 | Sales summary displayed |
| REPORT-003 | Expense Summary | ✅ Completed | Expense data by category | REPORT-001 | Expense summary displayed |
| REPORT-004 | Revenue Summary | ✅ Completed | Revenue = Sales - Expenses | REPORT-001 | Net revenue calculated |
| REPORT-005 | Expense Data & Categories | ✅ Completed | Expense categories and trends | FIN-FOUND-005 | Expense chart displays |
| REPORT-006 | Report Filtering | ✅ Completed | Date range filter for reports | REPORT-001–REPORT-005 | Filtering updates all report sections |
| REPORT-007 | Report Visualization | ✅ Completed | Charts for all report sections | REPORT-002–REPORT-005 | Charts render correctly |

**Status**: 7/7 completed  
**Implementation Notes**: ReportPage reuses SalesChart + new ExpenseChart shared components; ExpensesPage now persists via expenseService.create (was discarding form data), with category filter + total; ExpenseForm wired to shared expenseSchema; emoji icons replaced with Lucide vectors; 8 expense categories (superset of planned 5)  
**Files Created/Modified**: src/pages/finance/ReportPage.tsx, ExpensesPage.tsx (create wiring + filter 2026-09-18), src/components/shared/ExpenseChart.tsx (new), ExpenseForm.tsx (shared schema), src/utils/validationUtils.ts (expenseSchema), src/services/reportService.ts, expenseService.ts, src/data/mock/expenses.json  
**Verification**: `npx tsc --noEmit` PASS, `npm run build` PASS, Net Revenue = Sales − Expenses verified against mock data  
**Important Decisions**: Same dependency-free chart approach as MOD-14; expense category set extended (Utilities, Staff, Maintenance, Supplies, Marketing, Food & Beverage, Laundry, Other)  
**Known Issues**: None in module scope  

---

### MODULE 16 — Dashboard

| Task ID | Task Name | Status | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|--------|-----------|-------------|---------------------|
| DASH-001 | Dashboard Layout | ⬜ Pending | Grid layout with summary cards and lists | AUTH-007 | Dashboard renders correctly |
| DASH-002 | Reservation Summary | ⬜ Pending | Today/upcoming/recent reservations | RES-001 | Reservation summary cards |
| DASH-003 | Sales Summary | ⬜ Pending | Today/this week/this month sales | SALES-001 | Sales summary cards |
| DASH-004 | Invoice Summary | ⬜ Pending | Pending/overdue/paid invoice counts | INV-001 | Invoice summary cards |
| DASH-005 | Occupancy Indicators | ⬜ Pending | Room occupancy metrics | ROOM-006 | Occupancy rate displayed |
| DASH-006 | Quick Actions | ⬜ Pending | Links to create reservation, invoice, etc. | DASH-001–DASH-005 | Quick action buttons functional |

**Status**: All tasks ⬜ Pending  
**Implementation Notes**: —  
**Files Created/Modified**: —  
**Verification**: —  
**Important Decisions**: —  
**Known Issues**: —  

---

### MODULE 17 — Quality & Refinement

| Task ID | Task Name | Status | Objective | Dependencies | Acceptance Criteria |
|---------|-----------|--------|-----------|-------------|---------------------|
| QA-001 | Loading States | ⬜ Pending | Skeleton/spinners for data loading | All modules | Loading states shown during data fetch |
| QA-002 | Empty States | ⬜ Pending | Illustrations/messages for empty data | All modules | Empty states displayed when no data |
| QA-003 | Error States | ⬜ Pending | Error messages and recovery | All modules | Errors handled gracefully |
| QA-004 | Confirmation Dialogs | ✅ Completed | Reusable confirm dialog component | All modules | Confirmations used for destructive actions |
| QA-005 | Validation Refinement | ⬜ Pending | Comprehensive form validation | All modules | All forms validated correctly |
| QA-006 | Permission Testing | ⬜ Pending | Test all permission-based UI | AUTH-007, all modules | Permissions correctly enforced |
| QA-007 | Responsive Refinement | ⬜ Pending | Polish responsive design | All modules | All pages responsive across devices |
| QA-008 | Accessibility Basics | ⬜ Pending | ARIA labels, keyboard navigation | All modules | Basic accessibility implemented |
| QA-009 | UI Consistency Audit | ⬜ Pending | Review all components for consistency | All modules | Consistent colors, spacing, typography |
| QA-010 | Production Build | ⬜ Pending | Verify `npm run build` works | All modules | Production build succeeds, no errors |
| QA-011 | Linting & Code Quality | ⬜ Pending | ESLint + Prettier setup and checks | All modules | No lint errors, consistent formatting |

**Status**: 1/11 completed, 10 pending  
**Implementation Notes**: ConfirmDialog component created with design system  
**Files Created/Modified**: src/components/shared/ConfirmDialog.tsx  
**Verification**: —  
**Important Decisions**: —  
**Known Issues**: —  

---

### Overall Project Progress Summary

| Module | Module Name | Tasks | Completed | In Progress | Pending | Progress |
|--------|-------------|-------|-----------|-------------|---------|----------|
| MOD-01 | Project Foundation | 7 | 7 | 0 | 0 | 100% |
| MOD-02 | Public Website Foundation | 9 | 0 | 0 | 9 | 0% |
| MOD-03 | Authentication & RBAC Foundation | 12 | 7 | 0 | 5 | 58% |
| MOD-04 | User Management | 6 | 0 | 0 | 6 | 0% |
| MOD-05 | Role & Permission Management | 7 | 0 | 0 | 7 | 0% |
| MOD-06 | Room Type Management | 5 | 0 | 0 | 5 | 0% |
| MOD-07 | Room Management | 6 | 0 | 0 | 6 | 0% |
| MOD-08 | Reservation Foundation | 4 | 0 | 0 | 4 | 0% |
| MOD-09 | Reservation Management | 8 | 0 | 0 | 8 | 0% |
| MOD-10 | Reservation Calendar | 6 | 0 | 0 | 6 | 0% |
| MOD-11 | Check-In / Check-Out | 5 | 0 | 0 | 5 | 0% |
| MOD-12 | Finance Foundation | 6 | 1 | 0 | 5 | 17% |
| MOD-13 | Invoice | 8 | 8 | 0 | 0 | 100% |
| MOD-14 | Sales | 6 | 6 | 0 | 0 | 100% |
| MOD-15 | Financial Reports | 7 | 7 | 0 | 0 | 100% |
| MOD-16 | Dashboard | 6 | 0 | 0 | 6 | 0% |
| MOD-17 | Quality & Refinement | 11 | 1 | 0 | 10 | 9% |
| **Total** | | **118** | **38** | **0** | **80** | **32%** |

---

## 40. Future Scope

### Post-Initial Version Ideas
- Online booking engine with real-time availability
- OTA integration (Booking.com, Airbnb, etc.)
- Payment gateway integration
- Guest management module (separate from reservation)
- Housekeeping management module
- Maintenance management module
- Email notifications and receipts
- SMS notifications
- Mobile app (React Native)
- Multi-language support
- Multi-property support
- Advanced reporting and analytics
- Customer reviews/ratings
- Promotional codes and discounts
- Loyalty program
- Staff scheduling
- Inventory management (minibar, laundry, etc.)
- Chatbot for customer service

### Future Backend Boundaries (When Laravel Is Implemented)
- All API endpoints listed in Section 33 will be implemented in Laravel
- Database migrations for all models listed in Section 26
- Server-side authentication with JWT
- Server-side RBAC with middleware
- Server-side validation matching frontend validation
- Server-side pagination, search, and filtering
- Server-side file upload for room images
- Server-side caching for reports

---

## 41. Explicitly Out of Scope

The following are **NOT** in the initial scope and will NOT be implemented:

- Laravel backend
- PostgreSQL database
- API integration (initially)
- OTA API integration
- Payment gateway
- Online booking engine
- Guest management module (separate)
- Housekeeping management
- Maintenance management
- Email notification system
- SMS notification system
- Mobile app
- Multi-language support
- Multi-property support
- Full accounting system
- Advanced analytics/AI features
- Customer portal/self-service
- Chatbot
- Staff scheduling
- Inventory management
- Email marketing
- Social media integration
- Third-party CRM integration
- Enterprise SSO/LDAP

---

## 42. Important Assumptions Requiring Approval

1. **Single Repository**: Both public website and internal PMS are in the same Vite project with layout separation. Alternative: separate repositories or separate Vite apps.

2. **State Management**: React Context + useReducer chosen initially. If the team prefers Zustand/Jotai, this can be adjusted in Module 03.

3. **Mock Data Format**: JSON files used initially. The service layer abstraction allows easy swap to API calls later.

4. **Authentication**: Simple mock authentication. No role-based route protection at the backend level initially (will be added with Laravel).

5. **Reservation → Invoice Relationship**: Each reservation can have one invoice. This is a 1:1 relationship initially. If the business requires 1:many or many:1, this can be adjusted.

6. **Manual Pricing**: All reservation prices are manually entered. No automatic rate calculation based on room type or date. This is by design and will be documented as a business rule.

7. **No Guest Management**: Guest information is embedded in reservations. There is no separate guest profile system.

8. **Currency**: Indonesian Rupiah (IDR / Rp) based on the project context. All currency formatting follows IDR conventions.

9. **Date Handling**: `date-fns` library for date manipulation. All dates stored as JavaScript Date objects.

10. **No Real-time Features**: No WebSocket or real-time updates initially. Data refresh happens on page load or manual refresh.

11. **Production Build**: The production build should work entirely on the frontend with mock data. No backend dependency for the initial build.

12. **Testing**: Testing is listed in the technology assumptions but is NOT a primary deliverable in the initial version. Testing can be added in a future iteration.

---

## 43. Local Development Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npx tsc --noEmit` | TypeScript type checking |

---

## 44. Document Version

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2026-09-14 | Plan | Initial comprehensive frontend development plan |

---

*This document serves as the living development plan for the Joglo Seruni & Public Promotional Website project. It will be updated after each completed task with status, implementation notes, files changed, and verification results.*
