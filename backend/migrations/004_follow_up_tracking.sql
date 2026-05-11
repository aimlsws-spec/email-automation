-- Follow-up tracking columns for leads table

ALTER TABLE leads ADD COLUMN follow_up_step    INT        NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN last_sent_at      DATETIME;
ALTER TABLE leads ADD COLUMN next_follow_up_at DATETIME;
ALTER TABLE leads ADD COLUMN has_replied       TINYINT(1) NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN is_bounced        TINYINT(1) NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN thread_id         TEXT;
ALTER TABLE leads ADD COLUMN message_id        TEXT;

-- Backfill: leads already marked Replied
UPDATE leads SET has_replied = 1
WHERE reply_detected_at IS NOT NULL AND reply_detected_at != '';

CREATE INDEX idx_leads_next_follow_up ON leads(next_follow_up_at);
