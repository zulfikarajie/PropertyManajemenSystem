-- Phase 6 migration: finance (invoices, invoice items, expenses). D1 / SQLite.
-- Applies with: wrangler d1 migrations apply pms-internal-db --local|--remote
-- SQLite-only syntax. No PostgreSQL types, enums, or extensions.
--
-- Notes:
-- - Frontend source of truth: `frontend/src/types/auth.types.ts`
--   (`Invoice` / `InvoiceItem` / `Expense`), `InvoiceForm.tsx` (percent
--   discount 0-100, Completed => Paid), `invoiceService.ts` status
--   transitions (send / markPaid / cancel), `InvoicePrintDocument.tsx`
--   (invoice + linked-reservation fields only, no tax/service charges).
-- - Status columns accept the WIDE frontend literal set actually rendered
--   and assigned by the UI (`invoiceService`, list/detail badges, report
--   counts), not the narrower TS/zod unions in the frontend types:
--     invoice_status: Draft | Sent | Completed | Cancelled
--     payment_status: Pending | Paid | Overdue | Partial
--   `Overdue` / `Partial` are stored display literals only; the backend
--   never auto-assigns them (no `due_date` column exists in the frontend
--   model, so date-driven overdue is impossible).
-- - `discount` is a PERCENT 0-100 (matches `InvoiceForm` zod `max(100)`,
--   the list `%` rendering, and seed rows such as 2400000 - 10% = 2160000).
--   `total` is always recomputed server-side; client totals are ignored.
-- - Money is INTEGER IDR (no decimals), matching frontend integer math.
-- - `reservation_id` is deliberately FK-LESS plain TEXT: Finance reads
--   reservations (detail/print via `GET /api/reservations/:id`) but never
--   mutates them, and an invoice must survive the reservation lifecycle.
-- - NO sales table (derived from invoices), NO payments table (the
--   frontend has no payment history/method UI; markPaid is an atomic
--   status flip), NO due_date / tax / service-charge columns.
-- - Backend-required permissions below are inserted here (not in the
--   frontend mocks) so the frontend permission catalog/UI stays untouched.

CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  reservation_id TEXT,
  guest_name TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT '',
  invoice_date TEXT NOT NULL,
  subtotal INTEGER NOT NULL DEFAULT 0,
  discount REAL NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Overdue', 'Partial')),
  invoice_status TEXT NOT NULL DEFAULT 'Draft' CHECK (invoice_status IN ('Draft', 'Sent', 'Completed', 'Cancelled')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK (discount >= 0 AND discount <= 100),
  CHECK (subtotal >= 0),
  CHECK (total >= 0)
);

CREATE TABLE IF NOT EXISTS invoice_items (
  id TEXT PRIMARY KEY,
  invoice_id TEXT NOT NULL REFERENCES invoices (id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 1),
  unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
  subtotal INTEGER NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Utilities', 'Staff', 'Maintenance', 'Supplies', 'Marketing', 'Food & Beverage', 'Laundry', 'Other')),
  description TEXT NOT NULL DEFAULT '',
  amount INTEGER NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Paid', 'Pending')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices (invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices (invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices (invoice_status);
CREATE INDEX IF NOT EXISTS idx_invoices_payment ON invoices (payment_status);
CREATE INDEX IF NOT EXISTS idx_invoices_reservation ON invoices (reservation_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items (invoice_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses (date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses (category);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses (status);

-- Backend-required Finance permissions (mirrors existing Finance group;
-- granted to Super Admin + Manager below, mirroring their existing grants).
INSERT INTO permissions (id, name, description, resource, action, "group") VALUES
  ('perm-027', 'finance.invoice.delete', 'Delete invoice', 'finance', 'invoice.delete', 'Finance'),
  ('perm-028', 'finance.expense.view', 'View expenses', 'finance', 'expense.view', 'Finance'),
  ('perm-029', 'finance.expense.create', 'Create expense', 'finance', 'expense.create', 'Finance'),
  ('perm-030', 'finance.expense.update', 'Update expense', 'finance', 'expense.update', 'Finance'),
  ('perm-031', 'finance.expense.delete', 'Delete expense', 'finance', 'expense.delete', 'Finance')
ON CONFLICT(id) DO NOTHING;

-- Role grants for the new permissions live in the SEED (not here): roles
-- do not exist at migration time, so granting here would violate the
-- role_permissions foreign keys. See scripts/generate-seed-sql.mjs
-- (role-001 + role-002, mirroring their existing finance grants).
