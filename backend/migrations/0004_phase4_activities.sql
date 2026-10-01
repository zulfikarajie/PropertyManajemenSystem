-- Phase 4 migration: activities / audit log (D1 / SQLite).
-- Applies with: wrangler d1 migrations apply pms-internal-db --local|--remote
-- SQLite-only syntax. No PostgreSQL types, enums, or extensions.
--
-- Notes:
-- - Append-only audit history: NO update or delete API exists. Rows are
--   written once by server-side audit hooks (trusted backend mutations) and
--   by the idempotent seed import. There is deliberately NO foreign key on
--   user_id: deleting or renaming a user must never rewrite or remove audit
--   history (user_name is a point-in-time snapshot, like reservation room
--   snapshots in Phase 2).
-- - entity_type / entity_id are plain TEXT (no FK): reservations, rooms,
--   sessions, and (future) finance entities are referenced by id only so the
--   log survives deletion of the referenced row.
-- - metadata is a JSON TEXT object with STRING values only, matching the
--   frontend `Activity.metadata?: Record<string, string>` contract. Never
--   stores passwords, hashes, or tokens.
-- - category is CHECK-constrained to the frontend taxonomy in
--   `frontend/src/constants/activityTypes.ts`
--   (authentication | reservation | finance | system). Room/room-type
--   mutations log under `system` (the generic bucket) so no frontend
--   vocabulary change is needed. Finance rows exist in seed only; finance
--   mutations stay deferred with the Finance backend.

CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('authentication', 'reservation', 'finance', 'system')),
  action TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL DEFAULT '',
  entity_type TEXT,
  entity_id TEXT,
  metadata TEXT NOT NULL DEFAULT '{}',
  ip_address TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_activities_created ON activities (created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities (category);
CREATE INDEX IF NOT EXISTS idx_activities_user ON activities (user_id);
CREATE INDEX IF NOT EXISTS idx_activities_entity ON activities (entity_type, entity_id);
