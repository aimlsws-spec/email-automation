-- ============================================================================
-- AUTOMATED FOLLOW-UP SYSTEM MIGRATION
-- ============================================================================
-- Implements complete 30-day follow-up automation with template support

-- ─── 1. Follow-up Templates Table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS followup_templates (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(500) NOT NULL UNIQUE,
  subject_template TEXT,
  html_content     LONGTEXT NOT NULL,
  sequence_day     INT NOT NULL,
  is_active        TINYINT(1) DEFAULT 1,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sequence_day (sequence_day),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 2. Follow-up Schedule Configuration ───────────────────────────────────
CREATE TABLE IF NOT EXISTS followup_schedules (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id       INT,
  enabled           TINYINT(1) DEFAULT 1,
  max_followups     INT DEFAULT 7,
  stop_on_reply     TINYINT(1) DEFAULT 1,
  stop_on_unsubscribe TINYINT(1) DEFAULT 1,
  stop_on_bounce    TINYINT(1) DEFAULT 1,
  created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  INDEX idx_campaign (campaign_id),
  INDEX idx_enabled (enabled)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 3. Follow-up Activity Log ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS followup_logs (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  lead_email       VARCHAR(255) NOT NULL,
  campaign_id      INT,
  followup_stage   INT NOT NULL,
  template_used    VARCHAR(500),
  status           VARCHAR(50) DEFAULT 'sent',
  message_id       TEXT,
  thread_id        TEXT,
  sent_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
  stopped_reason   VARCHAR(255),
  INDEX idx_lead (lead_email),
  INDEX idx_campaign (campaign_id),
  INDEX idx_stage (followup_stage),
  INDEX idx_sent_at (sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 4. Unsubscribe Suppression List ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS suppression_list (
  email            VARCHAR(255) NOT NULL PRIMARY KEY,
  reason           VARCHAR(100) DEFAULT 'unsubscribe',
  campaign_id      INT,
  added_at         DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address       VARCHAR(100),
  user_agent       TEXT,
  INDEX idx_reason (reason),
  INDEX idx_added_at (added_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 5. Enhance leads table for follow-up automation ───────────────────────
ALTER TABLE leads ADD COLUMN IF NOT EXISTS followup_enabled TINYINT(1) DEFAULT 1;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS followup_stopped_reason VARCHAR(255);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS unsubscribed TINYINT(1) DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS unsubscribed_at DATETIME;

-- ─── 6. Enhance campaigns table for follow-up settings ─────────────────────
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS followup_enabled TINYINT(1) DEFAULT 1;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS initial_template_id INT;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS followup_template_1_id INT;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS followup_template_2_id INT;

-- ─── 7. Insert default follow-up templates ─────────────────────────────────
-- These will be populated by the backend service on first run

-- ─── 8. Create indexes for performance ─────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_leads_followup_enabled ON leads(followup_enabled);
CREATE INDEX IF NOT EXISTS idx_leads_unsubscribed ON leads(unsubscribed);
CREATE INDEX IF NOT EXISTS idx_campaigns_followup_enabled ON campaigns(followup_enabled);

-- ─── 9. Backfill existing data ─────────────────────────────────────────────
-- Mark leads with replies as followup_stopped
UPDATE leads 
SET followup_enabled = 0,
    followup_stopped_reason = 'replied'
WHERE has_replied = 1 AND followup_enabled = 1;

-- Mark bounced leads
UPDATE leads 
SET followup_enabled = 0,
    followup_stopped_reason = 'bounced'
WHERE is_bounced = 1 AND followup_enabled = 1;

-- ─── 10. Create view for follow-up analytics ───────────────────────────────
CREATE OR REPLACE VIEW followup_analytics AS
SELECT 
  l.campaign_id,
  c.name AS campaign_name,
  COUNT(DISTINCT l.email) AS total_leads,
  SUM(CASE WHEN l.follow_up_step > 0 THEN 1 ELSE 0 END) AS leads_in_followup,
  SUM(CASE WHEN l.has_replied = 1 THEN 1 ELSE 0 END) AS replied_count,
  SUM(CASE WHEN l.unsubscribed = 1 THEN 1 ELSE 0 END) AS unsubscribed_count,
  SUM(CASE WHEN l.is_bounced = 1 THEN 1 ELSE 0 END) AS bounced_count,
  SUM(CASE WHEN l.followup_enabled = 1 AND l.next_follow_up_at IS NOT NULL THEN 1 ELSE 0 END) AS pending_followups,
  ROUND(SUM(CASE WHEN l.has_replied = 1 THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(DISTINCT l.email), 0), 2) AS reply_rate,
  MAX(l.last_sent_at) AS last_activity
FROM leads l
LEFT JOIN campaigns c ON l.campaign_id = c.id
GROUP BY l.campaign_id, c.name;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
