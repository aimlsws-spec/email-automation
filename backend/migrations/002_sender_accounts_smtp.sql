-- Allow SMTP accounts that have no refresh_token
ALTER TABLE sender_accounts MODIFY COLUMN refresh_token TEXT NULL;

-- Add type + SMTP credential columns (idempotent)
ALTER TABLE sender_accounts ADD COLUMN type      VARCHAR(50) DEFAULT 'gmail';
ALTER TABLE sender_accounts ADD COLUMN smtp_host VARCHAR(255);
ALTER TABLE sender_accounts ADD COLUMN smtp_port INT;
ALTER TABLE sender_accounts ADD COLUMN smtp_user VARCHAR(255);
ALTER TABLE sender_accounts ADD COLUMN smtp_pass TEXT;

-- Backfill: existing rows (Gmail OAuth) get type = 'gmail'
UPDATE sender_accounts SET type = 'gmail' WHERE type IS NULL;
