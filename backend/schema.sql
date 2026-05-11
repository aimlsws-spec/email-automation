-- MySQL schema for automate_mail
-- Run: mysql -u root -p automate_mail < schema.sql

CREATE TABLE IF NOT EXISTS leads (
  email                VARCHAR(255) NOT NULL PRIMARY KEY,
  name                 VARCHAR(500) DEFAULT '',
  company              VARCHAR(500) DEFAULT '',
  status               VARCHAR(100) DEFAULT 'Pending',
  email_provider       VARCHAR(100) DEFAULT 'gmail',
  last_sent_date       VARCHAR(100) DEFAULT '',
  follow_up_count      INT DEFAULT 0,
  message_id           TEXT,
  initial_message_id   TEXT,
  last_subject         TEXT,
  inquiry_id           TEXT,
  reply_detected_at    VARCHAR(100) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS email_logs (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  to_email VARCHAR(255) NOT NULL,
  type     VARCHAR(100) NOT NULL,
  status   VARCHAR(100) NOT NULL,
  sent_at  DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_leads_status           ON leads(status);
CREATE INDEX idx_leads_reply            ON leads(reply_detected_at);
CREATE INDEX idx_leads_company_status   ON leads(company, status);
CREATE INDEX idx_email_logs_type_status ON email_logs(type, status);
CREATE INDEX idx_email_logs_sent_at     ON email_logs(sent_at);
CREATE INDEX idx_email_logs_status_sent ON email_logs(status, sent_at);
CREATE INDEX idx_leads_reply_at         ON leads(reply_detected_at);
