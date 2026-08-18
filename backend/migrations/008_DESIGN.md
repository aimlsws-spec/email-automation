# Bulk Campaign Automation — Database Design Document

---

## 1. Files Delivered

| File | Purpose |
|------|---------|
| `008_bulk_campaign_automation.sql` | Forward migration (idempotent, CREATE IF NOT EXISTS) |
| `008_bulk_campaign_automation_rollback.sql` | Rollback (drops the 3 new tables only) |
| `008_DESIGN.md` | This document |

---

## 2. ER Diagram (text format)

```
┌─────────────────────────────────────────────────────────────┐
│                       users                                 │
│  id (PK)  name  email  password  created_at  updated_at     │
└──────────────────────────┬──────────────────────────────────┘
                           │  uploaded_by (soft reference)
                           │  (no FK enforced — users can be
                           │   deleted without cascade risk)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    campaign_master                           │
│                                                             │
│  uuid                    CHAR(36)         NOT NULL  UNIQUE               │
│  campaign_name           VARCHAR(500)     NOT NULL                        │
│  description             TEXT                                             │
│  original_filename       VARCHAR(500)                                     │
│  csv_hash                CHAR(64)         UNIQUE  (SHA-256 of CSV file)   │
│  uploaded_by             INT  (soft ref → users.id)                       │
│                                                                           │
│  total_leads             INT UNSIGNED  DEFAULT 0                          │
│  valid_leads             INT UNSIGNED  DEFAULT 0                          │
│  invalid_leads           INT UNSIGNED  DEFAULT 0                          │
│  duplicate_leads         INT UNSIGNED  DEFAULT 0                          │
│  imported_leads          INT UNSIGNED  DEFAULT 0                          │
│                                                                           │
│  status                  ENUM(Draft|Importing|Ready|Running|              │
│                               Paused|Completed|Cancelled)                 │
│                                                                           │
│  schedule_type           ENUM(daily|alternate_day|weekly)  NULL           │
│  last_processed_lead_id  BIGINT UNSIGNED  DEFAULT 0  ← scheduler cursor   │
│  batch_no                INT UNSIGNED     DEFAULT 0  ← increments per run │
│  next_schedule_at        DATETIME  NULL                                   │
│  completed_at            DATETIME  NULL                                   │
│                                                                           │
│  import_started_at       DATETIME                                         │
│  import_completed_at     DATETIME                                         │
│  created_at              DATETIME  DEFAULT CURRENT_TIMESTAMP              │
│  updated_at              DATETIME  ON UPDATE CURRENT_TIMESTAMP            │
│  deleted_at              DATETIME  NULL  ← soft delete                    │
└──────────────────────────┬──────────────────────────────────┘
                           │ 1
                           │
                           │ FK: campaign_leads.campaign_id
                           │     ON DELETE CASCADE
                           │ ∞
          ┌────────────────┴──────────────────────────────────┐
          │                  campaign_leads                    │
          │                                                    │
          │  id (PK, BIGINT UNSIGNED)                          │
          │  campaign_id   INT UNSIGNED  FK → campaign_master  │
          │                                                    │
          │  -- Contact --                                     │
          │  name          VARCHAR(500)                        │
          │  email         VARCHAR(255)  NOT NULL              │
          │  company       VARCHAR(500)                        │
          │  phone         VARCHAR(50)                         │
          │  designation   VARCHAR(255)                        │
          │  city          VARCHAR(255)                        │
          │  state         VARCHAR(255)                        │
          │  country       VARCHAR(255)                        │
          │                                                    │
          │  -- Import (set once during CSV parsing) --              │
          │  import_status     ENUM(Valid|Invalid|Duplicate)               │
          │                                                                    │
          │  -- Processing (updated by scheduler/worker) --                    │
          │  processing_status ENUM(Pending|Scheduled|Queued|                  │
          │                        Sent|Replied|FollowUpRunning|               │
          │                        Completed|Failed|Suppressed)                │
          │                                                                    │
          │  batch_no          INT UNSIGNED  DEFAULT 0  ← matches master        │
          │                                                    │
          │  -- Scheduling --                                  │
          │  assigned_sender_id    INT                         │
          │  assigned_template_id  INT                         │
          │  scheduled_date        DATETIME                    │
          │  queued_at             DATETIME                    │
          │  sent_at               DATETIME                    │
          │                                                    │
          │  -- Reply --                                       │
          │  replied               TINYINT(1)  DEFAULT 0       │
          │  reply_received_at     DATETIME                    │
          │                                                    │
          │  -- Follow-up --                                   │
          │  followup_enabled      TINYINT(1)  DEFAULT 1       │
          │  followup_completed    TINYINT(1)  DEFAULT 0       │
          │                                                    │
          │  -- Audit --                                       │
          │  import_row_number     INT UNSIGNED                │
          │  validation_errors     TEXT                        │
          │  created_at            DATETIME                    │
          │  updated_at            DATETIME                    │
          └────────────────────────────────────────────────────┘

                           │ 1
                           │
                           │ FK: campaign_import_logs.campaign_id
                           │     ON DELETE CASCADE
                           │ ∞
          ┌────────────────┴──────────────────────────────────┐
          │              campaign_import_logs                  │
          │                                                    │
          │  id (PK, BIGINT UNSIGNED)                          │
          │  campaign_id   INT UNSIGNED  FK → campaign_master  │
          │  event         VARCHAR(100)  NOT NULL              │
          │  message       TEXT                                │
          │  level         ENUM(info|warning|error|debug)      │
          │  created_at    DATETIME  DEFAULT CURRENT_TIMESTAMP │
          └────────────────────────────────────────────────────┘
```

---

## 3. Index Explanation

### campaign_master

| Index | Columns | Reason |
|-------|---------|--------|
| PRIMARY KEY | `id` | Unique row lookup |
| `uidx_cm_uuid` | `uuid` | Public API identifier; unique enforced |
| `uidx_cm_csv_hash` | `csv_hash` | Duplicate import prevention; unique enforced |
| `idx_cm_status` | `status` | Filter campaigns by lifecycle state |
| `idx_cm_uploaded_by` | `uploaded_by` | List campaigns per user |
| `idx_cm_created_at` | `created_at` | Sort/paginate by creation date |
| `idx_cm_deleted_at` | `deleted_at` | Soft-delete filter (`WHERE deleted_at IS NULL`) |
| `idx_cm_next_schedule_at` | `next_schedule_at` | Scheduler polls for due campaigns |

### campaign_leads

| Index | Columns | Reason |
|-------|---------|--------|
| PRIMARY KEY | `id` | Unique row lookup (BIGINT for 100k+ rows) |
| `idx_cl_campaign_id` | `campaign_id` | All leads for a campaign |
| `idx_cl_email` | `email` | Suppression check, duplicate detection |
| `idx_cl_import_status` | `import_status` | Filter Valid/Invalid/Duplicate leads |
| `idx_cl_processing_status` | `processing_status` | Filter leads by processing state across all campaigns |
| `idx_cl_scheduled_date` | `scheduled_date` | Scheduler picks leads due for sending |
| `idx_cl_assigned_sender_id` | `assigned_sender_id` | Load per sender, sender rotation |
| `idx_cl_campaign_proc_status` | `(campaign_id, processing_status)` | **Primary scheduler composite**: `WHERE campaign_id=? AND processing_status='Pending' AND id > last_processed_lead_id` |
| `idx_cl_campaign_import_status` | `(campaign_id, import_status)` | Import summary per campaign without full scan |
| `idx_cl_email_replied` | `(email, replied)` | Reply detection joins |

### campaign_import_logs

| Index | Columns | Reason |
|-------|---------|--------|
| PRIMARY KEY | `id` | Unique row lookup |
| `idx_cil_campaign_id` | `campaign_id` | Fetch all logs for a campaign |
| `idx_cil_level` | `level` | Filter errors/warnings only |
| `idx_cil_created_at` | `created_at` | Chronological log display |

---

## 4. Relationship Explanation

### campaign_master → campaign_leads  (1 : ∞)
- One campaign upload produces many lead rows.
- `campaign_leads.campaign_id` is a hard FK with `ON DELETE CASCADE` — deleting a campaign removes all its leads automatically.
- `ON UPDATE CASCADE` keeps the FK consistent if the PK ever changes (rare but safe).

### campaign_master → campaign_import_logs  (1 : ∞)
- One campaign produces many log events during import.
- Same `ON DELETE CASCADE` / `ON UPDATE CASCADE` policy.
- Logs are append-only; no UPDATE is expected on this table.

### campaign_master → users  (soft reference)
- `uploaded_by` stores the user ID but has **no hard FK**.
- Reason: users can be deactivated or deleted without breaking historical campaign records.
- The application layer enforces the relationship.

### campaign_leads → sender_accounts / email_templates  (soft references)
- `assigned_sender_id` and `assigned_template_id` are intentionally **not hard FKs**.
- The scheduler module (future) will populate these. Keeping them soft avoids circular dependency with existing tables and allows NULL until assignment.

---

## 5. Status Flow Diagrams

### campaign_master.status
```
Draft → Importing → Ready → Running → Completed
                                   ↘ Paused → Running
                                   ↘ Cancelled
```

### campaign_leads.import_status  (set once at import time, never changes)
```
Parsing CSV row → Valid
               → Invalid   (missing email, malformed data)
               → Duplicate (email already exists in this campaign)
```

### campaign_leads.processing_status  (updated by scheduler/worker)
```
Pending → Scheduled → Queued → Sent → Replied
                                    → FollowUpRunning → Completed
                             → Failed
                    → Suppressed  (suppression check before queue)
```

---

## 6. Future Scalability Notes (100k+ leads)

### Immediate (current design handles this)
- `campaign_leads.id` is `BIGINT UNSIGNED` — supports 18 quintillion rows.
- The composite index `(campaign_id, status)` means the scheduler never does a full table scan.
- `campaign_import_logs` is append-only with no UPDATE — safe for high write throughput.

### When you reach 500k+ leads per campaign

**Option A — Batch processing with cursor pagination**
```sql
-- Scheduler fetches in pages of 500 using the PK cursor
SELECT * FROM campaign_leads
WHERE campaign_id = ?
  AND status = 'Pending'
  AND id > :last_seen_id
ORDER BY id ASC
LIMIT 500;
```
This avoids OFFSET-based pagination which degrades at large offsets.

**Option B — Partition campaign_leads by campaign_id**
```sql
ALTER TABLE campaign_leads
  PARTITION BY HASH(campaign_id)
  PARTITIONS 16;
```
Each partition holds ~1/16 of rows. Queries filtered by `campaign_id` only scan one partition.

**Option C — Archive completed campaigns**
Move leads with `status IN ('Completed','Sent','Replied')` older than N days to an archive table:
```sql
CREATE TABLE campaign_leads_archive LIKE campaign_leads;
-- Nightly job moves old rows
INSERT INTO campaign_leads_archive SELECT * FROM campaign_leads
  WHERE status IN ('Completed','Sent','Replied')
    AND updated_at < NOW() - INTERVAL 90 DAY;
DELETE FROM campaign_leads WHERE id IN (...);
```

**Option D — Dedicated import worker with bulk INSERT**
Use `INSERT INTO campaign_leads (...) VALUES (...),(...),...` in batches of 1000 rows per statement instead of row-by-row inserts. This is 10–50× faster for large CSVs.

**Option E — Read replica for analytics**
Route dashboard/stats queries (`COUNT`, `GROUP BY status`) to a MySQL read replica so they don't compete with the scheduler's write traffic on the primary.

### Index maintenance at scale
- Run `ANALYZE TABLE campaign_leads` after large imports to refresh optimizer statistics.
- Consider `pt-online-schema-change` (Percona Toolkit) for any future ALTER TABLE on this table once it has millions of rows.

---

## 7. Design Decisions

| Decision | Reason |
|----------|--------|
| `uuid CHAR(36)` on `campaign_master` | Integer PKs are never exposed to the frontend or API. UUID is the public identifier; integer PK is used only for internal joins. |
| `csv_hash CHAR(64)` UNIQUE | SHA-256 of the uploaded file stored before import begins. A duplicate hash aborts the import immediately without touching `campaign_leads`. |
| `last_processed_lead_id` cursor | Replaces `OFFSET`-based pagination. The scheduler runs `WHERE id > last_processed_lead_id` which is a constant-time PK seek regardless of table size. |
| `batch_no` on both tables | `campaign_master.batch_no` increments each scheduling run. `campaign_leads.batch_no` is stamped at scheduling time. Enables `WHERE batch_no = 3` reporting without any `GROUP BY` calculation. |
| `schedule_type` + `next_schedule_at` | Reserved for the future scheduler module. Storing them now avoids a future `ALTER TABLE` on a potentially large table. |
| `deleted_at` soft delete | Campaigns are never hard-deleted. Analytics, audit logs, and import history remain intact. Active campaigns are always queried with `WHERE deleted_at IS NULL`. |
| Split `import_status` / `processing_status` | A single overloaded ENUM caused ambiguity (e.g. `Invalid` and `Sent` in the same column). Import state is set once and never changes. Processing state is updated repeatedly by the worker. Separating them makes both queries and application logic unambiguous. |

---

## 8. Idempotency Guarantee

All `CREATE TABLE` statements use `IF NOT EXISTS`.  
Running the migration twice is safe — the second run is a no-op.  
The rollback uses `DROP TABLE IF EXISTS` — safe to run even if tables don't exist.
