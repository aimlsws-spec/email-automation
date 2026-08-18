-- ============================================================================
-- MIGRATION 009: Campaign Senders (auto-pilot bulk campaign sender assignment)
-- Table: campaign_senders
-- Safe to run multiple times (idempotent)
-- Does NOT modify any existing tables
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- campaign_senders
--   One row per (campaign_master, sender) pairing used by the bulk-campaign
--   scheduler. Each row tracks that sender's own "every other day" clock for
--   this campaign, and points at a shadow single-sender row in the legacy
--   `campaigns` table so the existing send worker / follow-up / reply
--   pipeline can process it unmodified.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campaign_senders (
  id                  INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  campaign_id         INT UNSIGNED    NOT NULL,                 -- FK -> campaign_master.id
  sender_email        VARCHAR(255)    NOT NULL,                 -- soft ref -> sender_accounts.email
  legacy_campaign_id  INT             DEFAULT NULL,             -- soft ref -> campaigns.id (shadow single-sender campaign)

  batch_size          INT UNSIGNED    NOT NULL DEFAULT 200,     -- leads released per eligible send day
  last_batch_no       INT UNSIGNED    NOT NULL DEFAULT 0,       -- highest batch_no released so far for this sender
  next_eligible_date  DATE            DEFAULT NULL,             -- NULL = eligible immediately on first scheduler run

  created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE INDEX uidx_cs_campaign_sender (campaign_id, sender_email),
  INDEX idx_cs_next_eligible           (next_eligible_date),
  INDEX idx_cs_legacy_campaign_id      (legacy_campaign_id),

  CONSTRAINT fk_cs_campaign_id
    FOREIGN KEY (campaign_id)
    REFERENCES campaign_master (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Per-sender scheduling state for a bulk campaign_master campaign';

SET FOREIGN_KEY_CHECKS = 1;
