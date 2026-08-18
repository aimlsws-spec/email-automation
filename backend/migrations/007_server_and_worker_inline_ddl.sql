-- ============================================================================
-- DDL EXTRACTED FROM server.js AND queueWorker.js
-- ============================================================================

-- 1. Create users table
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  token      VARCHAR(255) NOT NULL,
  used       TINYINT(1) DEFAULT 0,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Add user_id column to tables (for multi-user auth migration)
ALTER TABLE campaigns ADD COLUMN user_id INT DEFAULT NULL;
ALTER TABLE leads ADD COLUMN user_id INT DEFAULT NULL;
ALTER TABLE email_queue ADD COLUMN user_id INT DEFAULT NULL;
ALTER TABLE email_logs ADD COLUMN user_id INT DEFAULT NULL;
ALTER TABLE email_events ADD COLUMN user_id INT DEFAULT NULL;
ALTER TABLE email_templates ADD COLUMN user_id INT DEFAULT NULL;
ALTER TABLE followup_templates ADD COLUMN user_id INT DEFAULT NULL;
ALTER TABLE followup_logs ADD COLUMN user_id INT DEFAULT NULL;
ALTER TABLE sender_accounts ADD COLUMN user_id INT DEFAULT NULL;
ALTER TABLE domain_warmup ADD COLUMN user_id INT DEFAULT NULL;
ALTER TABLE domain_events ADD COLUMN user_id INT DEFAULT NULL;
ALTER TABLE domain_stats ADD COLUMN user_id INT DEFAULT NULL;
ALTER TABLE link_clicks ADD COLUMN user_id INT DEFAULT NULL;
ALTER TABLE suppression_list ADD COLUMN user_id INT DEFAULT NULL;

-- 4. Ensure email_templates table exists
CREATE TABLE IF NOT EXISTS email_templates (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(500) NOT NULL,
  html_content LONGTEXT NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Ensure campaigns has template_html column
ALTER TABLE campaigns ADD COLUMN template_html TEXT;

-- 6. Add columns to email_queue
ALTER TABLE email_queue ADD COLUMN type VARCHAR(100) DEFAULT 'initial';
ALTER TABLE email_queue ADD COLUMN sending_mode VARCHAR(50) DEFAULT 'domain';

-- 7. Add columns to campaigns
ALTER TABLE campaigns ADD COLUMN sending_type VARCHAR(50) DEFAULT 'domain';
ALTER TABLE campaigns ADD COLUMN gmail_accounts JSON;
ALTER TABLE campaigns ADD COLUMN domain_accounts JSON;
ALTER TABLE campaigns ADD COLUMN from_name VARCHAR(255) DEFAULT NULL;
ALTER TABLE campaigns ADD COLUMN followup_enabled TINYINT(1) DEFAULT 1;

-- 8. Add columns and index to email_logs
ALTER TABLE email_logs ADD COLUMN queue_job_id INT DEFAULT NULL;
CREATE INDEX idx_email_logs_job_id ON email_logs (queue_job_id);
