-- Domain warmup tracking

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
