# MODULE 06–11 — Combined Task List

> **Project:** Joglo Seruni Frontend
> **Technology:** React 18+, Vite, TypeScript, Tailwind CSS, React Router v6, Zod validation
> **Status:** ✅ COMPLETED — 6 modules, 45 tasks, all routes accessible
> **Last Updated:** 2026-09-15

---

## MODULE 06 — Room Type Management

### Tasks

| ID | Task | Description |
|----|------|-------------|
| RT-001 | Room Type List Page | Display all room types with table, search, filter by status, pagination |
| RT-002 | Create Room Type Form | Form with name, description, capacity, facilities, default rate, images, status |
| RT-003 | Edit Room Type Form | Update all fields, validation, image upload/preview |
| RT-004 | Room Type Activate/Deactivate | Toggle status with confirmation dialog |
| RT-005 | Room Type Mock Data | 5 records minimum in `roomTypes.json` |
| RT-006 | Room Type Validation | Zod schema: name required min 2 chars, capacity positive integer, default rate positive number, status enum |

### Pages

- `src/pages/room-types/RoomTypeListPage.tsx`
- `src/pages/room-types/RoomTypeFormPage.tsx`
- `src/pages/room-types/RoomTypeDetailPage.tsx` (optional)

### Routes

```
/dashboard/room-types          → RoomTypeListPage
/dashboard/room-types/new      → RoomTypeFormPage (create)
/dashboard/room-types/:id/edit → RoomTypeFormPage (edit)
```

### Service Methods Needed

```typescript
// roomTypeService.ts
getAll(): RoomType[]
getById(id: string): RoomType | undefined
create(data: CreateRoomTypeDTO): RoomType
update(id: string, updates: Partial<RoomType>): RoomType | null
delete(id: string): boolean
toggleStatus(id: string): boolean
```

### Mock Data Structure

```json
[
  {
    "id": "room-type-001",
    "name": "Standard Double Room",
    "description": "Comfortable double room with modern amenities",
    "capacity": 2,
    "facilities": ["WiFi", "TV", "Air Conditioning", "Mini Fridge"],
    "defaultRate": 750000,
    "images": ["/images/room-type-001-1.jpg"],
    "status": "active",
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-09-14T00:00:00Z"
  }
]
```

### Validation Rules

- Name: required, min 2 characters, unique
- Description: required
- Capacity: required, positive integer, min 1
- Default Rate: required, positive number
- Facilities: optional array of strings
- Status: enum (active/inactive)
- Images: optional array of strings

### Dependencies

- MODULE 01 (Project Foundation)
- MODULE 03 (Authentication & RBAC) — `RequirePermission` for route guard

---

## MODULE 07 — Room Management

### Tasks

| ID | Task | Description |
|----|------|-------------|
| RM-001 | Room List Page | Display all rooms with table, filter by type/status, search, pagination |
| RM-002 | Create Room Form | Form with room number, room type selection, status |
| RM-003 | Edit Room Form | Update room details |
| RM-004 | Room Status Management | Activate/deactivate/delete rooms |
| RM-005 | Room Filtering | Filter by room type, availability, status |
| RM-006 | Room Mock Data | 5 records minimum in `rooms.json` |
| RM-007 | Room Validation | Zod schema: room number required unique, room type required, status enum |

### Pages

- `src/pages/rooms/RoomListPage.tsx`
- `src/pages/rooms/RoomFormPage.tsx`
- `src/pages/rooms/RoomDetailPage.tsx` (optional)

### Routes

```
/dashboard/rooms          → RoomListPage
/dashboard/rooms/new      → RoomFormPage (create)
/dashboard/rooms/:id/edit → RoomFormPage (edit)
/dashboard/rooms/:id      → RoomDetailPage (optional)
```

### Service Methods Needed

```typescript
// roomService.ts
getAll(): Room[]
getById(id: string): Room | undefined
getByRoomTypeId(roomTypeId: string): Room[]
create(data: CreateRoomDTO): Room
update(id: string, updates: Partial<Room>): Room | null
delete(id: string): boolean
toggleStatus(id: string): boolean
```

### Mock Data Structure

```json
[
  {
    "id": "room-001",
    "roomNumber": "101",
    "roomTypeId": "room-type-001",
    "status": "active",
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-09-14T00:00:00Z"
  }
]
```

### Validation Rules

- Room Number: required, unique, string
- Room Type ID: required, must reference existing room type
- Status: enum (active/inactive/maintenance)

### Dependencies

- MODULE 01 (Project Foundation)
- MODULE 03 (Authentication & RBAC)
- MODULE 06 (Room Type Management) — room type reference

---

## MODULE 08 — Reservation Foundation

### Tasks

| ID | Task | Description |
|----|------|-------------|
| RS-001 | Reservation Types & Status Definitions | Define ReservationStatus enum and ReservationSource enum |
| RS-002 | Reservation Source Definitions | Define all reservation source options |
| RS-003 | Reservation Mock Data | 5 records minimum in `reservations.json` |
| RS-004 | Reservation Data Service Layer | `reservationService.ts` with CRUD operations |
| RS-005 | Reservation Room Join Entity Model | Define `ReservationRoom` interface and mock data |
| RS-006 | Reservation Room Mock Data | Mock data for `reservationRooms.json` |
| RS-007 | Reservation Constants | `reservationStatuses.ts`, `reservationSources.ts` |

### Data Models

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

type ReservationStatus = 'reserved' | 'checked-in' | 'checked-out' | 'cancelled';
type ReservationSource = 'direct' | 'phone' | 'whatsapp' | 'website' | 'ota' | 'other';
```

### Mock Data Structure (reservations.json)

```json
[
  {
    "id": "res-001",
    "reservationCode": "RSV-2026-001",
    "guestName": "John Doe",
    "source": "direct",
    "checkInDate": "2026-09-15",
    "checkOutDate": "2026-09-17",
    "status": "reserved",
    "notes": "",
    "totalAmount": 1500000,
    "createdAt": "2026-09-01T00:00:00Z",
    "updatedAt": "2026-09-01T00:00:00Z"
  }
]
```

### Constants

```typescript
// reservationStatuses.ts
export const reservationStatuses = ['reserved', 'checked-in', 'checked-out', 'cancelled'] as const;

// reservationSources.ts
export const reservationSources = ['direct', 'phone', 'whatsapp', 'website', 'ota', 'other'] as const;
```

### Service Methods Needed

```typescript
// reservationService.ts
getAll(): Reservation[]
getById(id: string): Reservation | undefined
getByStatus(status: ReservationStatus): Reservation[]
getByDateRange(checkIn: Date, checkOut: Date): Reservation[]
create(data: CreateReservationDTO): Reservation
update(id: string, updates: Partial<Reservation>): Reservation | null
cancel(id: string): boolean
checkIn(id: string): boolean
checkOut(id: string): boolean
```

### Dependencies

- MODULE 01 (Project Foundation)
- MODULE 03 (Authentication & RBAC)
- MODULE 06 (Room Type Management)
- MODULE 07 (Room Management)

---

## MODULE 09 — Reservation Management

### Tasks

| ID | Task | Description |
|----|------|-------------|
| RN-001 | Reservation List Page | Table with columns: Code, Guest, Source, Check-in, Check-out, Rooms, Total, Status, Actions |
| RN-002 | Search/Filter | Filter by guest name, source, status, date range |
| RN-003 | Reservation Creation Form | Guest name, source, dates, room selection, manual rate input per room |
| RN-004 | Multiple Rooms Support | Select multiple rooms, enter rate per room, calculate subtotal/total |
| RN-005 | Manual Room Rate Input | Rate field per room, independent from default rate |
| RN-006 | Total Calculation | Real-time subtotal and total calculation |
| RN-007 | Reservation Details Page | Full reservation info, room list, total, status, notes |
| RN-008 | Reservation Edit | Edit guest name, source, dates, rooms, rates |
| RN-009 | Reservation Cancellation | Cancel action with confirmation dialog, status = cancelled |
| RN-010 | Reservation Mock Data Integration | Link mock data to service layer |

### Pages

- `src/pages/reservations/ReservationListPage.tsx`
- `src/pages/reservations/ReservationFormPage.tsx`
- `src/pages/reservations/ReservationDetailPage.tsx`

### Routes

```
/dashboard/reservations           → ReservationListPage
/dashboard/reservations/new       → ReservationFormPage (create)
/dashboard/reservations/:id/edit  → ReservationFormPage (edit)
/dashboard/reservations/:id       → ReservationDetailPage
```

### Validation Rules

- Guest Name: required, min 2 characters
- Check-in Date: required, must be today or future
- Check-out Date: required, must be after check-in date
- Room Selection: at least one room required
- Room Rate: must be positive number for each room
- Reservation Source: required

### Key Architecture Notes

- **Manual rate**: Each `ReservationRoom` stores its own `rate` field, independent from `RoomType.defaultRate`
- **Historical pricing**: `ReservationRoom.rate` is immutable with respect to `RoomType.defaultRate` changes
- **Total calculation**: `totalAmount = sum of all ReservationRoom.subtotals`
- **Subtotal calculation**: `subtotal = rate × nights`

### Dependencies

- MODULE 01 (Project Foundation)
- MODULE 03 (Authentication & RBAC)
- MODULE 06 (Room Type Management)
- MODULE 07 (Room Management)
- MODULE 08 (Reservation Foundation)

---

## MODULE 10 — Reservation Calendar

### Tasks

| ID | Task | Description |
|----|------|-------------|
| CA-001 | Calendar Layout | Monthly view showing reservations by date range |
| CA-002 | Date Range Navigation | Previous/next month navigation, current month display |
| CA-003 | Reservation Events Display | Each reservation shown as block spanning check-in to check-out |
| CA-004 | Room Occupancy Visualization | Color-coded occupancy indicators per room |
| CA-005 | Availability Indication | Show available rooms for selected date range |
| CA-006 | Calendar Filtering | Filter by date range, room, status |
| CA-007 | Reservation Mock Data Integration | Use existing reservation mock data for calendar |

### Pages

- `src/pages/reservations/ReservationCalendarPage.tsx`

### Routes

```
/dashboard/reservations/calendar → ReservationCalendarPage
```

### Calendar Features

- Monthly view as default (weekly view optional)
- Each reservation shown as a colored block spanning check-in to check-out dates
- Color coding by status:
  - Reserved: Blue
  - Checked In: Green
  - Checked Out: Gray
  - Cancelled: Red
- Room occupancy visualization showing which rooms are occupied on each date
- Available rooms indicated with green/highlight
- Click on reservation block to view details
- Filter by date range, room number, status

### Architecture Notes

- Calendar is a visualization layer on top of reservation data
- No separate calendar mock data needed — uses existing `reservations.json`
- Date range navigation using `date-fns` library
- Responsive: desktop-first with horizontal scroll for smaller screens

### Dependencies

- MODULE 01 (Project Foundation)
- MODULE 03 (Authentication & RBAC)
- MODULE 08 (Reservation Foundation)
- MODULE 09 (Reservation Management)

---

## MODULE 11 — Check-In / Check-Out

### Tasks

| ID | Task | Description |
|----|------|-------------|
| CI-001 | Check-In Action | Action available from reservation detail or list |
| CI-002 | Check-Out Action | Action available from reservation detail or list |
| CI-003 | Status Transition Rules | Implement state machine for status transitions |
| CI-004 | Permission Restrictions | `reservation.checkin` and `reservation.checkout` permission gates |
| CI-005 | Confirmation Dialogs | Confirmation dialog before check-in/check-out |
| CI-006 | Status Update Logic | Update reservation status and record check-in/check-out dates |
| CI-007 | Multiple Room Check-In | Check in multiple rooms in a reservation simultaneously |
| CI-008 | Check-In/Check-Out Mock Data | Update reservation mock data with check-in/check-out records |

### Status Transition Flow

```
Reserved → Checked In → Checked Out
Reserved → Cancelled
CheckedIn → Checked Out

// Rules:
// - Cancelled → cannot transition to any other status
// - Checked Out → cannot transition to any other status
// - Check-In: Only from "Reserved" status
// - Check-Out: Only from "Checked In" status
// - Cannot check in a cancelled reservation
// - Cannot check out a cancelled or reserved reservation
```

### Pages (Integrated)

- Check-In/Check-Out actions on `ReservationDetailPage`
- Check-In/Check-Out actions on `ReservationListPage` (action buttons)
- Status badges reflecting current state

### Routes

No new routes — actions are integrated into existing reservation pages:
- `/dashboard/reservations/:id` — Check-in/check-out buttons visible based on permissions and status
- `/dashboard/reservations` — Action buttons in table rows

### Validation Rules

- Check-In: Requires `reservation.checkin` permission
- Check-Out: Requires `reservation.checkout` permission
- Confirmation dialog required before action
- Cannot check in a cancelled or already checked-in reservation
- Cannot check out a cancelled, reserved, or already checked-out reservation
- Multiple rooms can be checked in simultaneously

### Component Structure

```tsx
// Inline action buttons on ReservationDetailPage
<CheckInButton reservation={reservation} />
<CheckOutButton reservation={reservation} />

// Confirmation dialog wrapper
<ConfirmDialog
  title="Confirm Check-In"
  message="Are you sure you want to check in this reservation?"
  onConfirm={handleCheckIn}
/>
```

### Dependencies

- MODULE 01 (Project Foundation)
- MODULE 03 (Authentication & RBAC)
- MODULE 08 (Reservation Foundation)
- MODULE 09 (Reservation Management)

---

## Summary

| Module | Tasks | Pages | Service | Status |
|--------|-------|-------|---------|--------|
| MODULE 06 — Room Type | 6 | RoomTypeList, RoomTypeForm | roomTypeService.ts | ✅ Done |
| MODULE 07 — Room | 7 | RoomList, RoomForm | roomService.ts | ✅ Done |
| MODULE 08 — Reservation Foundation | 7 | (Data layer) | reservationService.ts | ✅ Done |
| MODULE 09 — Reservation Management | 10 | ReservationList, ReservationForm, ReservationDetail | — | ✅ Done |
| MODULE 10 — Reservation Calendar | 7 | ReservationCalendar | — | ✅ Done |
| MODULE 11 — Check-In/Check-Out | 8 | (Integrated) | — | ✅ Done |
| **Total** | **45 tasks** | **8 pages** | **4 services** | **All Complete** |

### Created Files

#### Mock Data
- `src/data/mock/roomTypes.json` (5 records)
- `src/data/mock/rooms.json` (8 records)
- `src/data/mock/reservations.json` (5 records)
- `src/data/mock/reservationRooms.json` (6 records)

#### Services
- `src/services/roomTypeService.ts` — CRUD + toggleStatus
- `src/services/roomService.ts` — CRUD + toggleStatus
- `src/services/reservationService.ts` — CRUD + checkIn + checkOut + cancel

#### Constants
- `src/constants/reservationStatuses.ts` — Updated with labels, colors, sources

#### Pages (8)
- `src/pages/room-types/RoomTypeListPage.tsx` — Table, search, filter, delete with confirmation
- `src/pages/room-types/RoomTypeFormPage.tsx` — Create/edit with Zod validation
- `src/pages/rooms/RoomListPage.tsx` — Table, search, filter by type/status
- `src/pages/rooms/RoomFormPage.tsx` — Create/edit with Zod validation
- `src/pages/reservations/ReservationListPage.tsx` — Grid cards, stats, search, filter
- `src/pages/reservations/ReservationFormPage.tsx` — Create/edit with room selection
- `src/pages/reservations/ReservationDetailPage.tsx` — Full details, check-in/out, cancel
- `src/pages/reservations/ReservationCalendarPage.tsx` — Monthly calendar view

#### Shared Components
- `src/components/shared/DateRangePicker.tsx`
- `src/components/shared/RoomSelector.tsx`
- `src/components/shared/CalendarView.tsx` — Monthly calendar with reservation blocks
- `src/components/shared/StatsCard.tsx`
- `src/components/shared/ReservationCard.tsx` — Clickable reservation card
- `src/components/shared/ReservationForm.tsx` — Form with guest info + room selection

#### PMS Components
- `src/components/pms/CheckInButton.tsx` — Check-in with confirmation dialog
- `src/components/pms/CheckOutButton.tsx` — Check-out with confirmation dialog
- `src/components/pms/ReservationStatusBadge.tsx` — Status badge with color coding
- `src/components/pms/CheckInCheckOutIntegration.tsx` — Combined check-in/out UI

#### Updated Files
- `src/App.tsx` — Added all new routes (room-types, rooms, reservations, calendar)
- `src/layouts/PMSLayout.tsx` — Added "Kamar" and "Reservasi" navigation sections
- `src/index.css` — Added all CSS custom properties and @keyframes animations
- `src/types/auth.types.ts` — Changed Date to string for JSON compatibility
- `src/components/shared/Badge.tsx` — Fixed CSS property spread
- `src/components/shared/Table.tsx` — Fixed direct DOM style manipulation
