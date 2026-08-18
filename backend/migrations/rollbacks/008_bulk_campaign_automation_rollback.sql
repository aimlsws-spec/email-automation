-- ============================================================================
-- ROLLBACK 008: Bulk Campaign Automation
-- Drops the three new tables in dependency order.
-- Does NOT touch any pre-existing tables.
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS campaign_import_logs;
DROP TABLE IF EXISTS campaign_leads;
DROP TABLE IF EXISTS campaign_master;

SET FOREIGN_KEY_CHECKS = 1;
