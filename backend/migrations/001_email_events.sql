-- Email events tracking (opens/clicks/replies) + follow-up flags

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
  follow_up_sent    TINYINT(1) NOT NULL DEFAULT 0,
  follow_up_sent_at DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE email_events ADD COLUMN recipient_name VARCHAR(500) DEFAULT ''       ; -- ignore if exists
ALTER TABLE email_events ADD COLUMN email_type     VARCHAR(100) NOT NULL DEFAULT 'initial'; -- ignore if exists
ALTER TABLE email_events ADD COLUMN opened         TINYINT(1)  NOT NULL DEFAULT 0; -- ignore if exists
ALTER TABLE email_events ADD COLUMN clicked        TINYINT(1)  NOT NULL DEFAULT 0; -- ignore if exists
ALTER TABLE email_events ADD COLUMN replied        TINYINT(1)  NOT NULL DEFAULT 0; -- ignore if exists
ALTER TABLE email_events ADD COLUMN follow_up_sent TINYINT(1)  NOT NULL DEFAULT 0; -- ignore if exists
ALTER TABLE email_events ADD COLUMN follow_up_sent_at DATETIME DEFAULT NULL;       -- ignore if exists

CREATE INDEX idx_email_events_sent_at        ON email_events(sent_at);
CREATE INDEX idx_email_events_status         ON email_events(status);
CREATE INDEX idx_email_events_replied        ON email_events(replied);
CREATE INDEX idx_email_events_follow_up_sent ON email_events(follow_up_sent);

-- Optional: keep email_logs compatible with tracking ids
ALTER TABLE email_logs ADD COLUMN tracking_id VARCHAR(255) DEFAULT '';
