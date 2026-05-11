-- MySQL 8.0 Schema for automate_mail
-- Run: mysql -u root -p automate_mail < mysql_schema.sql

SET FOREIGN_KEY_CHECKS = 0;
SET sql_mode = 'NO_ENGINE_SUBSTITUTION';

-- ─── campaigns ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS campaigns (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(500) NOT NULL,
  sender_email     VARCHAR(255),
  status           VARCHAR(100) DEFAULT 'Running',
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  subject          TEXT,
  total_leads      INT DEFAULT 0,
  sent_count       INT DEFAULT 0,
  pending_count    INT DEFAULT 0,
  failed_count     INT DEFAULT 0,
  active_sender    VARCHAR(255),
  sending_mode     VARCHAR(100) DEFAULT 'automation',
  sending_type     VARCHAR(100) DEFAULT 'domain',
  gmail_accounts   JSON,
  template_html    LONGTEXT,
  domain_accounts  JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── leads ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  email                VARCHAR(255) NOT NULL PRIMARY KEY,
  name                 VARCHAR(500) DEFAULT '',
  company              VARCHAR(500) DEFAULT '',
  status               VARCHAR(100) DEFAULT 'Pending',
  last_sent_date       VARCHAR(100) DEFAULT '',
  follow_up_count      INT DEFAULT 0,
  message_id           TEXT,
  initial_message_id   TEXT,
  last_subject         TEXT,
  inquiry_id           TEXT,
  reply_detected_at    VARCHAR(100) DEFAULT '',
  next_follow_up_at    DATETIME,
  email_provider       VARCHAR(100) DEFAULT 'gmail',
  sender_email         VARCHAR(255),
  campaign_id          INT,
  last_activity_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at           DATETIME DEFAULT CURRENT_TIMESTAMP,
  follow_up_step       INT NOT NULL DEFAULT 0,
  last_sent_at         DATETIME,
  has_replied          TINYINT(1) NOT NULL DEFAULT 0,
  is_bounced           TINYINT(1) NOT NULL DEFAULT 0,
  thread_id            TEXT,
  replied              TINYINT(1) DEFAULT 0,
  replied_at           DATETIME,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_leads_campaign_id      ON leads(campaign_id);
CREATE INDEX idx_leads_status           ON leads(status);
CREATE INDEX idx_leads_next_follow_up   ON leads(next_follow_up_at);
CREATE INDEX idx_leads_has_replied      ON leads(has_replied);

-- ─── email_queue ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_queue (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  lead_email       VARCHAR(255),
  campaign_id      INT,
  subject          TEXT,
  html_body        LONGTEXT,
  status           VARCHAR(50) DEFAULT 'pending',
  attempts         INT DEFAULT 0,
  last_error       TEXT,
  scheduled_at     DATETIME,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  sending_mode     VARCHAR(50) DEFAULT 'domain',
  sender_email     VARCHAR(255),
  gmail_accounts_json JSON,
  type             VARCHAR(100) DEFAULT 'initial'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_queue_status       ON email_queue(status);
CREATE INDEX idx_queue_campaign_id  ON email_queue(campaign_id);
CREATE INDEX idx_queue_scheduled_at ON email_queue(scheduled_at);

-- ─── email_logs ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_logs (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  lead_email   VARCHAR(255),
  to_email     VARCHAR(255),
  email        VARCHAR(255),
  type         VARCHAR(100) DEFAULT 'initial',
  subject      TEXT,
  provider     VARCHAR(100) DEFAULT 'gmail',
  sender_email VARCHAR(255) DEFAULT '',
  message_id   TEXT,
  tracking_id  VARCHAR(255) DEFAULT '',
  status       VARCHAR(50) DEFAULT 'sent',
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  sent_at      DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_email_logs_sent_at      ON email_logs(sent_at);
CREATE INDEX idx_email_logs_sender_email ON email_logs(sender_email);
CREATE INDEX idx_email_logs_status       ON email_logs(status);

-- ─── email_events ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_events (
  tracking_id       VARCHAR(255) PRIMARY KEY,
  recipient_email   VARCHAR(255) NOT NULL,
  recipient_name    VARCHAR(500) DEFAULT '',
  email_type        VARCHAR(100) NOT NULL DEFAULT 'initial',
  sent_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status            VARCHAR(50) NOT NULL DEFAULT 'sent',
  opened            TINYINT(1) NOT NULL DEFAULT 0,
  clicked           TINYINT(1) NOT NULL DEFAULT 0,
  replied           TINYINT(1) NOT NULL DEFAULT 0,
  sender_email      VARCHAR(255) DEFAULT '',
  follow_up_sent    TINYINT(1) NOT NULL DEFAULT 0,
  follow_up_sent_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_email_events_sent_at        ON email_events(sent_at);
CREATE INDEX idx_email_events_status         ON email_events(status);
CREATE INDEX idx_email_events_replied        ON email_events(replied);
CREATE INDEX idx_email_events_follow_up_sent ON email_events(follow_up_sent);

-- ─── email_templates ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_templates (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(500) NOT NULL,
  html_content LONGTEXT NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── sender_accounts ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sender_accounts (
  email             VARCHAR(255) NOT NULL PRIMARY KEY,
  refresh_token     TEXT,
  is_connected      TINYINT(1) DEFAULT 0,
  updated_at        DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  type              VARCHAR(50) DEFAULT 'gmail',
  smtp_host         VARCHAR(255),
  smtp_port         INT DEFAULT 465,
  smtp_user         VARCHAR(255),
  smtp_pass         TEXT,
  status            VARCHAR(50) DEFAULT 'active',
  daily_sent_count  INT DEFAULT 0,
  daily_limit       INT DEFAULT 300,
  last_reset_date   DATE,
  last_sent_at      DATETIME,
  warmup_stage      INT DEFAULT 1,
  reply_count       INT DEFAULT 0,
  bounce_count      INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── domain_warmup ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS domain_warmup (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  domain       VARCHAR(255) NOT NULL UNIQUE,
  start_date   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  current_day  INT NOT NULL DEFAULT 1,
  daily_min    INT NOT NULL DEFAULT 20,
  daily_max    INT NOT NULL DEFAULT 30,
  daily_limit  INT NOT NULL DEFAULT 20,
  current_sent INT NOT NULL DEFAULT 0,
  status       VARCHAR(50) NOT NULL DEFAULT 'active',
  last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_domain_warmup_domain ON domain_warmup(domain);

-- ─── domain_events ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS domain_events (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  lead_email  VARCHAR(255),
  campaign_id INT,
  domain      VARCHAR(255) NOT NULL,
  event_type  VARCHAR(100) NOT NULL,
  metadata    JSON,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_domain_events_domain     ON domain_events(domain);
CREATE INDEX idx_domain_events_event_type ON domain_events(event_type);
CREATE INDEX idx_domain_events_created_at ON domain_events(created_at);

-- ─── domain_stats ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS domain_stats (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  domain           VARCHAR(255) NOT NULL UNIQUE,
  total_sent       INT NOT NULL DEFAULT 0,
  total_bounced    INT NOT NULL DEFAULT 0,
  total_replied    INT NOT NULL DEFAULT 0,
  total_opened     INT NOT NULL DEFAULT 0,
  spam_reports     INT NOT NULL DEFAULT 0,
  daily_sent       INT NOT NULL DEFAULT 0,
  last_sent_at     DATETIME,
  reputation_score FLOAT NOT NULL DEFAULT 100,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── link_clicks ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS link_clicks (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  lead_email   VARCHAR(255),
  campaign_id  INT,
  sender_email VARCHAR(255) DEFAULT '',
  url          TEXT,
  type         VARCHAR(100) DEFAULT 'click',
  ip_address   VARCHAR(100),
  user_agent   TEXT,
  clicked_at   DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── system_limits ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS system_limits (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  daily_global_limit  INT DEFAULT 1000,
  daily_total_sent    INT DEFAULT 0,
  last_reset_date     DATE,
  updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO system_limits (daily_global_limit, daily_total_sent)
VALUES (1000, 0);

SET FOREIGN_KEY_CHECKS = 1;
