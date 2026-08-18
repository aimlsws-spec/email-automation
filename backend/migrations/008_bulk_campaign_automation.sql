-- ============================================================================
-- MIGRATION 008: Bulk Campaign Automation
-- Tables: campaign_master, campaign_leads, campaign_import_logs
-- Safe to run multiple times (idempotent)
-- Does NOT modify any existing tables
-- ============================================================================

USE automate_mail;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- 1. campaign_master
--    One row per uploaded CSV campaign
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campaign_master (
  id                      INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  uuid                    CHAR(36)         NOT NULL,                        -- Public-safe identifier for APIs/frontend
  campaign_name           VARCHAR(500)     NOT NULL,
  description             TEXT             DEFAULT NULL,
  original_filename       VARCHAR(500)     DEFAULT NULL,
  csv_hash                CHAR(64)         DEFAULT NULL,                    -- SHA-256 of uploaded file; prevents duplicate imports
  uploaded_by             INT              DEFAULT NULL,                    -- FK to users.id (soft ref)

  -- Lead counters (updated during import)
  total_leads             INT UNSIGNED     NOT NULL DEFAULT 0,
  valid_leads             INT UNSIGNED     NOT NULL DEFAULT 0,
  invalid_leads           INT UNSIGNED     NOT NULL DEFAULT 0,
  duplicate_leads         INT UNSIGNED     NOT NULL DEFAULT 0,
  imported_leads          INT UNSIGNED     NOT NULL DEFAULT 0,

  -- Lifecycle status
  status                  ENUM(
                            'Draft',
                            'Importing',
                            'Ready',
                            'Running',
                            'Paused',
                            'Completed',
                            'Cancelled'
                          ) NOT NULL DEFAULT 'Draft',

  -- Scheduler state
  schedule_type           ENUM('daily','alternate_day','weekly') DEFAULT NULL,
  last_processed_lead_id  BIGINT UNSIGNED  NOT NULL DEFAULT 0,              -- Cursor: scheduler resumes from WHERE id > this value
  batch_no                INT UNSIGNED     NOT NULL DEFAULT 0,              -- Incremented each scheduling run; enables per-batch reporting
  next_schedule_at        DATETIME         DEFAULT NULL,
  completed_at            DATETIME         DEFAULT NULL,

  -- Timestamps
  import_started_at       DATETIME         DEFAULT NULL,
  import_completed_at     DATETIME         DEFAULT NULL,
  created_at              DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at              DATETIME         DEFAULT NULL,                    -- Soft delete; NULL = active

  PRIMARY KEY (id),
  UNIQUE INDEX uidx_cm_uuid       (uuid),
  UNIQUE INDEX uidx_cm_csv_hash   (csv_hash),
  INDEX idx_cm_status             (status),
  INDEX idx_cm_uploaded_by        (uploaded_by),
  INDEX idx_cm_created_at         (created_at),
  INDEX idx_cm_deleted_at         (deleted_at),
  INDEX idx_cm_next_schedule_at   (next_schedule_at)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='One record per bulk CSV campaign upload';


-- ----------------------------------------------------------------------------
-- 2. campaign_leads
--    Every lead row from the uploaded CSV
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campaign_leads (
  id                    BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  campaign_id           INT UNSIGNED     NOT NULL,

  -- Lead contact data
  name                  VARCHAR(500)     DEFAULT NULL,
  email                 VARCHAR(255)     NOT NULL,
  company               VARCHAR(500)     DEFAULT NULL,
  phone                 VARCHAR(50)      DEFAULT NULL,
  designation           VARCHAR(255)     DEFAULT NULL,
  city                  VARCHAR(255)     DEFAULT NULL,
  state                 VARCHAR(255)     DEFAULT NULL,
  country               VARCHAR(255)     DEFAULT NULL,

  -- Import validation status (set once during CSV parsing)
  import_status         ENUM(
                          'Valid',
                          'Invalid',
                          'Duplicate'
                        ) NOT NULL DEFAULT 'Valid',

  -- Processing lifecycle status (updated by scheduler/worker)
  processing_status     ENUM(
                          'Pending',
                          'Scheduled',
                          'Queued',
                          'Sent',
                          'Replied',
                          'FollowUpRunning',
                          'Completed',
                          'Failed',
                          'Suppressed'
                        ) NOT NULL DEFAULT 'Pending',

  -- Batch tracking
  batch_no              INT UNSIGNED     NOT NULL DEFAULT 0,               -- Matches campaign_master.batch_no at time of scheduling

  -- Scheduling fields (populated by the scheduler module later)
  assigned_sender_id    INT              DEFAULT NULL,
  assigned_template_id  INT              DEFAULT NULL,
  scheduled_date        DATETIME         DEFAULT NULL,
  queued_at             DATETIME         DEFAULT NULL,
  sent_at               DATETIME         DEFAULT NULL,

  -- Reply tracking
  replied               TINYINT(1)       NOT NULL DEFAULT 0,
  reply_received_at     DATETIME         DEFAULT NULL,

  -- Follow-up flags
  followup_enabled      TINYINT(1)       NOT NULL DEFAULT 1,
  followup_completed    TINYINT(1)       NOT NULL DEFAULT 0,

  -- Audit / import metadata
  import_row_number     INT UNSIGNED     DEFAULT NULL,
  validation_errors     TEXT             DEFAULT NULL,
  created_at            DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),

  -- Core lookup indexes
  INDEX idx_cl_campaign_id              (campaign_id),
  INDEX idx_cl_email                    (email),
  INDEX idx_cl_import_status            (import_status),
  INDEX idx_cl_processing_status        (processing_status),
  INDEX idx_cl_scheduled_date           (scheduled_date),
  INDEX idx_cl_assigned_sender_id       (assigned_sender_id),

  -- Composite: scheduler cursor query — WHERE campaign_id=? AND processing_status='Pending' AND id > ?
  INDEX idx_cl_campaign_proc_status     (campaign_id, processing_status),

  -- Composite: import validation summary per campaign
  INDEX idx_cl_campaign_import_status   (campaign_id, import_status),

  -- Composite: reply detection
  INDEX idx_cl_email_replied            (email, replied),

  CONSTRAINT fk_cl_campaign_id
    FOREIGN KEY (campaign_id)
    REFERENCES campaign_master (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Individual leads imported from a bulk CSV campaign';


-- ----------------------------------------------------------------------------
-- 3. campaign_import_logs
--    Append-only event log for every import operation
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campaign_import_logs (
  id            BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  campaign_id   INT UNSIGNED     NOT NULL,
  event         VARCHAR(100)     NOT NULL,
  message       TEXT             DEFAULT NULL,
  level         ENUM('info','warning','error','debug') NOT NULL DEFAULT 'info',
  created_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_cil_campaign_id  (campaign_id),
  INDEX idx_cil_level        (level),
  INDEX idx_cil_created_at   (created_at),

  CONSTRAINT fk_cil_campaign_id
    FOREIGN KEY (campaign_id)
    REFERENCES campaign_master (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Append-only import event log per campaign';


SET FOREIGN_KEY_CHECKS = 1;
