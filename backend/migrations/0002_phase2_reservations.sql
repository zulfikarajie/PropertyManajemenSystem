-- Phase 2 migration: reservations, reservation rooms, nightly rates (D1 / SQLite).
-- Applies with: wrangler d1 migrations apply pms-internal-db --local|--remote
-- SQLite-only syntax. No PostgreSQL types, enums, or extensions.
--
-- Notes:
-- - Derived totals (nights, room_total, dp_amount, remaining_balance) are
--   NEVER stored: the server recomputes them from reservation_nightly_rates
--   with the formulas in src/lib/pricing.ts (mirrors frontend pricingUtils).
-- - reservation_rooms.room_id is plain TEXT (no FK): the rooms inventory
--   table lands in Phase 3, which will add the FK + existence validation.
--   Room number/type-name snapshots preserve history regardless.
-- - Single `source` column serves as both guest source and rate source,
--   matching the frontend wizard draft.

CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  reservation_code TEXT NOT NULL UNIQUE,
  guest_name TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('direct', 'phone', 'whatsapp', 'website', 'ota', 'other')),
  check_in_date TEXT NOT NULL,
  check_out_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'reserved' CHECK (status IN ('reserved', 'checked-in', 'checked-out', 'cancelled')),
  notes TEXT NOT NULL DEFAULT '',
  total_amount INTEGER NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  pricing_mode TEXT NOT NULL DEFAULT 'same' CHECK (pricing_mode IN ('same', 'different')),
  payment_type TEXT NOT NULL DEFAULT 'no_dp' CHECK (payment_type IN ('no_dp', 'dp')),
  dp_type TEXT NOT NULL DEFAULT 'percentage' CHECK (dp_type IN ('percentage', 'fixed')),
  dp_percentage REAL,
  dp_fixed_amount INTEGER CHECK (dp_fixed_amount IS NULL OR dp_fixed_amount >= 0),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK (check_out_date > check_in_date)
);

CREATE TABLE IF NOT EXISTS reservation_rooms (
  id TEXT PRIMARY KEY,
  reservation_id TEXT NOT NULL REFERENCES reservations (id) ON DELETE CASCADE,
  room_id TEXT NOT NULL,
  room_number TEXT NOT NULL,
  room_type_name TEXT NOT NULL DEFAULT '',
  rate INTEGER NOT NULL DEFAULT 0 CHECK (rate >= 0),
  subtotal INTEGER NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  created_at TEXT NOT NULL,
  UNIQUE (reservation_id, room_id)
);

CREATE TABLE IF NOT EXISTS reservation_nightly_rates (
  reservation_id TEXT NOT NULL REFERENCES reservations (id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  rate INTEGER NOT NULL DEFAULT 0 CHECK (rate >= 0),
  PRIMARY KEY (reservation_id, date)
);

CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations (status);
CREATE INDEX IF NOT EXISTS idx_reservations_source ON reservations (source);
CREATE INDEX IF NOT EXISTS idx_reservations_dates ON reservations (check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_reservations_code ON reservations (reservation_code);
CREATE INDEX IF NOT EXISTS idx_reservation_rooms_reservation ON reservation_rooms (reservation_id);
CREATE INDEX IF NOT EXISTS idx_reservation_rooms_room ON reservation_rooms (room_id);
CREATE INDEX IF NOT EXISTS idx_nightly_rates_reservation ON reservation_nightly_rates (reservation_id);
