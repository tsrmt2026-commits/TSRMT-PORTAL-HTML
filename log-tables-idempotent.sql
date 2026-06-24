-- ====================================================================
-- TSRMT PORTAL — LOG TABLES (IDEMPOTENT / SAFE TO RE-RUN)
-- ====================================================================
-- Run this WHOLE script in Supabase → SQL Editor.
-- It will NOT error if the tables already exist.
-- "relation already exists" is harmless — this script skips that.
-- ====================================================================

-- ---------- 1) log_edit_ahli ----------
CREATE TABLE IF NOT EXISTS log_edit_ahli (
  bil        BIGSERIAL PRIMARY KEY,
  ic         TEXT,
  field      TEXT,
  old_value  TEXT,
  new_value  TEXT,
  reason     TEXT,
  editor     TEXT,
  edited_at  TIMESTAMPTZ DEFAULT now()
);

-- Add any missing columns (skips columns that already exist)
ALTER TABLE log_edit_ahli ADD COLUMN IF NOT EXISTS ic         TEXT;
ALTER TABLE log_edit_ahli ADD COLUMN IF NOT EXISTS field      TEXT;
ALTER TABLE log_edit_ahli ADD COLUMN IF NOT EXISTS old_value  TEXT;
ALTER TABLE log_edit_ahli ADD COLUMN IF NOT EXISTS new_value  TEXT;
ALTER TABLE log_edit_ahli ADD COLUMN IF NOT EXISTS reason     TEXT;
ALTER TABLE log_edit_ahli ADD COLUMN IF NOT EXISTS editor     TEXT;
ALTER TABLE log_edit_ahli ADD COLUMN IF NOT EXISTS edited_at  TIMESTAMPTZ DEFAULT now();

CREATE INDEX IF NOT EXISTS log_edit_ahli_ic_idx ON log_edit_ahli(ic);

-- ---------- 2) log_waris ----------
CREATE TABLE IF NOT EXISTS log_waris (
  bil        BIGSERIAL PRIMARY KEY,
  ic         TEXT,
  field      TEXT,
  old_value  TEXT,
  new_value  TEXT,
  reason     TEXT,
  editor     TEXT,
  edited_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE log_waris ADD COLUMN IF NOT EXISTS ic         TEXT;
ALTER TABLE log_waris ADD COLUMN IF NOT EXISTS field      TEXT;
ALTER TABLE log_waris ADD COLUMN IF NOT EXISTS old_value  TEXT;
ALTER TABLE log_waris ADD COLUMN IF NOT EXISTS new_value  TEXT;
ALTER TABLE log_waris ADD COLUMN IF NOT EXISTS reason     TEXT;
ALTER TABLE log_waris ADD COLUMN IF NOT EXISTS editor     TEXT;
ALTER TABLE log_waris ADD COLUMN IF NOT EXISTS edited_at  TIMESTAMPTZ DEFAULT now();

CREATE INDEX IF NOT EXISTS log_waris_ic_idx ON log_waris(ic);

-- ====================================================================
-- RLS POLICIES — allow the portal (anon key) to INSERT log rows.
-- (Reading logs is optional — usually admin-only. Here we allow it
--  so the portal can confirm inserts, but you can drop SELECT policy
--  later if you want logs to be write-only from the portal.)
-- ====================================================================

-- log_edit_ahli policies
ALTER TABLE log_edit_ahli ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "log_ahli_insert_all" ON log_edit_ahli;
CREATE POLICY "log_ahli_insert_all"
  ON log_edit_ahli FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "log_ahli_select_all" ON log_edit_ahli;
CREATE POLICY "log_ahli_select_all"
  ON log_edit_ahli FOR SELECT
  TO anon, authenticated
  USING (true);

-- log_waris policies
ALTER TABLE log_waris ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "log_waris_insert_all" ON log_waris;
CREATE POLICY "log_waris_insert_all"
  ON log_waris FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "log_waris_select_all" ON log_waris;
CREATE POLICY "log_waris_select_all"
  ON log_waris FOR SELECT
  TO anon, authenticated
  USING (true);

-- ====================================================================
-- VERIFY (run separately to check what exists):
--   SELECT column_name, data_type FROM information_schema.columns
--   WHERE table_name IN ('log_edit_ahli','log_waris')
--   ORDER BY table_name, ordinal_position;
-- ====================================================================
