-- Get all column definitions for all tables
SELECT
  table_name,
  column_name,
  data_type,
  character_maximum_length,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'campaigns','domain_events','domain_stats','domain_warmup',
    'email_events','email_logs','email_queue','email_templates',
    'leads','link_clicks','sender_accounts','system_limits'
  )
ORDER BY table_name, ordinal_position;
