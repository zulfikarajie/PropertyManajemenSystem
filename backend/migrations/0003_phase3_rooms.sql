-- Phase 3 migration: room inventory (room_types + rooms) (D1 / SQLite).
-- Applies with: wrangler d1 migrations apply pms-internal-db --local|--remote
-- SQLite-only syntax. No PostgreSQL types, enums, or extensions.
--
-- Notes:
-- - room_types.facilities and room_types.images are stored as JSON TEXT arrays
--   (e.g. '["WiFi","TV"]'); the API parses/serializes them to string[].
--   defaultRate is reference-only for pricing and is never a persisted price.
-- - rooms.room_number is UNIQUE (trimmed on write). rooms.room_type_id
--   REFERENCES room_types(id) ON DELETE RESTRICT; service-layer checks are the
--   primary enforcement (delete of a type with rooms → 409, delete of a room
--   referenced by reservation_rooms → 409).
-- - reservation_rooms.room_id stays plain TEXT (no FK rebuild): historical
--   room number/type-name snapshots are preserved verbatim when room/type
--   data changes. Phase 3 adds only service-layer existence validation for
--   NEW reservation writes (see src/services/reservationService.ts).

CREATE TABLE IF NOT EXISTS room_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  capacity INTEGER NOT NULL CHECK (capacity >= 1),
  facilities TEXT NOT NULL DEFAULT '[]',
  default_rate INTEGER NOT NULL CHECK (default_rate > 0),
  images TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  room_number TEXT NOT NULL UNIQUE,
  room_type_id TEXT NOT NULL REFERENCES room_types (id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_room_types_status ON room_types (status);
CREATE INDEX IF NOT EXISTS idx_room_types_name ON room_types (name);
CREATE INDEX IF NOT EXISTS idx_rooms_type ON rooms (room_type_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms (status);
CREATE INDEX IF NOT EXISTS idx_rooms_number ON rooms (room_number);
