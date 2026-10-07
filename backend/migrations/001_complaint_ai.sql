BEGIN;

ALTER TABLE complaints
  ADD COLUMN IF NOT EXISTS priority VARCHAR(16),
  ADD COLUMN IF NOT EXISTS category_confidence NUMERIC(5, 4),
  ADD COLUMN IF NOT EXISTS priority_confidence NUMERIC(5, 4),
  ADD COLUMN IF NOT EXISTS duplicate_group_id INTEGER,
  ADD COLUMN IF NOT EXISTS duplicate_group_label TEXT;

UPDATE complaints
SET department = CASE category
  WHEN 'Garbage & Waste Management' THEN 'Sanitation Department'
  WHEN 'Road Damage / Potholes' THEN 'Road Department'
  WHEN 'Street Light' THEN 'Electrical Department'
  WHEN 'Drainage & Sewerage' THEN 'Drainage Department'
  WHEN 'Water Supply' THEN 'Water Department'
  ELSE 'General Civic Department'
END
WHERE department IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'complaints_priority_check'
      AND conrelid = 'complaints'::regclass
  ) THEN
    ALTER TABLE complaints
      ADD CONSTRAINT complaints_priority_check
      CHECK (priority IS NULL OR priority IN ('Critical', 'High', 'Medium', 'Low'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'complaints_duplicate_group_fk'
      AND conrelid = 'complaints'::regclass
  ) THEN
    ALTER TABLE complaints
      ADD CONSTRAINT complaints_duplicate_group_fk
      FOREIGN KEY (duplicate_group_id)
      REFERENCES complaints(id)
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS complaints_department_priority_queue_idx
  ON complaints (department, priority, created_at);

CREATE INDEX IF NOT EXISTS complaints_duplicate_group_idx
  ON complaints (duplicate_group_id)
  WHERE duplicate_group_id IS NOT NULL;

COMMIT;
