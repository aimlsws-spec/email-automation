import { useEffect, useState, useCallback, useRef } from 'react';
import {
  ArrowPathIcon,
  QueueListIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Card } from 'components/ui';
import { Page } from 'components/shared/Page';
import { fetchQueueStats, fetchQueueSenders, fetchQueueList, deleteQueueItems } from 'services/api';

// ─── helpers ──────────────────────────────────────────────────────────────────

function fmt(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString();
}

function fmtTime(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function statusBadge(status) {
  const map = {
    pending:    'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300',
    processing: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-300',
    sent:       'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
    failed:     'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

function typeBadge(type) {
  if (!type) return '—';
  if (type === 'initial') return (
    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Initial</span>
  );
  return (
    <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
      {type.replace(/_/g, ' ')}
    </span>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, Icon, colorClass, highlight }) {
  return (
    <Card className={`p-5 flex items-start justify-between border ${highlight ? 'border-error-200 dark:border-error-800/40' : 'border-gray-100 dark:border-dark-700'}`}>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
        <p className={`mt-1 text-2xl font-black ${colorClass}`}>{value ?? '—'}</p>
        <p className="mt-2 text-[10px] text-gray-400 dark:text-dark-400">{sub}</p>
      </div>
      <div className={`flex size-12 items-center justify-center rounded-xl ${highlight ? 'bg-error-100 dark:bg-error-900/30' : 'bg-gray-100 dark:bg-dark-700'}`}>
        <Icon className={`size-6 ${colorClass}`} />
      </div>
    </Card>
  );
}

// ─── Sender card ──────────────────────────────────────────────────────────────

function SenderCard({ sender }) {
  return (
    <Card className="p-4 border border-gray-100 dark:border-dark-700">
      <p className="truncate text-sm font-semibold text-gray-700 dark:text-dark-200" title={sender.senderEmail}>
        {sender.senderEmail}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">Pending</span>
          <span className="font-bold text-warning dark:text-warning-lighter">{sender.pending}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Processing</span>
          <span className="font-bold text-info dark:text-info-lighter">{sender.processing}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Sent Today</span>
          <span className="font-bold text-success dark:text-success-lighter">{sender.sentToday}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Failed</span>
          <span className={`font-bold ${sender.failed > 0 ? 'text-error dark:text-error-lighter' : 'text-gray-400'}`}>{sender.failed}</span>
        </div>
      </div>
      {sender.nextScheduled && (
        <p className="mt-2 text-[10px] text-gray-400 dark:text-dark-400">
          Next send: {fmtTime(sender.nextScheduled)}
        </p>
      )}
    </Card>
  );
}

// ─── Confirm modal ────────────────────────────────────────────────────────────

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-80 max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-dark-600 dark:bg-dark-800">
        <h3 className="text-sm font-bold text-gray-800 dark:text-dark-100">Confirm Delete</h3>
        <p className="mt-2 text-xs text-gray-600 dark:text-dark-300">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-dark-600 dark:text-dark-300 dark:hover:bg-dark-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-error px-3 py-1.5 text-xs font-semibold text-white hover:bg-error/90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const LIMIT = 50;
const DELETABLE = new Set(['pending', 'failed']);

export default function QueueMonitor() {
  const [stats,   setStats]   = useState(null);
  const [senders, setSenders] = useState([]);
  const [items,   setItems]   = useState([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [deleting, setDeleting] = useState(false);
  const [confirm,  setConfirm]  = useState(null);

  // filters
  const [filterStatus,   setFilterStatus]   = useState('');
  const [filterSender,   setFilterSender]   = useState('');
  const [filterType,     setFilterType]     = useState('');
  const [filterCampaign, setFilterCampaign] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo,   setFilterDateTo]   = useState('');
  const [search,         setSearch]         = useState('');
  const [searchInput,    setSearchInput]    = useState('');

  const timerRef = useRef(null);

  const loadAll = useCallback(async (pg = page) => {
    setLoading(true);
    try {
      const [s, snd, list] = await Promise.all([
        fetchQueueStats(),
        fetchQueueSenders(),
        fetchQueueList({
          page:     pg,
          limit:    LIMIT,
          status:   filterStatus,
          sender:   filterSender,
          type:     filterType,
          campaign: filterCampaign,
          dateFrom: filterDateFrom,
          dateTo:   filterDateTo,
          search,
        }),
      ]);
      setStats(s);
      setSenders(snd || []);
      setItems(list.data || []);
      setTotal(list.total || 0);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, filterSender, filterType, filterCampaign, filterDateFrom, filterDateTo, search]);

  useEffect(() => {
    loadAll(page);
    timerRef.current = setInterval(() => loadAll(page), 30000);
    return () => clearInterval(timerRef.current);
  }, [loadAll, page]);

  // clear selection when page/filters change
  useEffect(() => { setSelected(new Set()); }, [page, filterStatus, filterSender, filterType, filterCampaign, filterDateFrom, filterDateTo, search]);

  function handleSearch(e) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function handleFilterChange(setter) {
    return (e) => { setter(e.target.value); setPage(1); };
  }

  const deletableItems = items.filter(r => DELETABLE.has(r.status));
  const allPageSelected = deletableItems.length > 0 && deletableItems.every(r => selected.has(r.id));

  function toggleSelectAll() {
    if (allPageSelected) {
      setSelected(prev => {
        const next = new Set(prev);
        deletableItems.forEach(r => next.delete(r.id));
        return next;
      });
    } else {
      setSelected(prev => {
        const next = new Set(prev);
        deletableItems.forEach(r => next.add(r.id));
        return next;
      });
    }
  }

  function toggleRow(id) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleDelete() {
    setDeleting(true);
    setConfirm(null);
    try {
      await deleteQueueItems([...selected]);
      setSelected(new Set());
      await loadAll(page);
    } finally {
      setDeleting(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const s = stats || {};

  return (
    <Page title="Queue Monitor">
      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
      <div className="transition-content overflow-hidden px-(--margin-x) pb-8">

        {/* Header */}
        <div className="mt-4 flex items-center justify-between sm:mt-5 lg:mt-6">
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-dark-100">Queue Monitor</h1>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-400">
              auto-refreshes every 30s
              {lastUpdated && ` · Updated ${lastUpdated.toLocaleTimeString()}`}
            </p>
          </div>
          <button
            onClick={() => loadAll(page)}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:opacity-50 dark:border-dark-600 dark:bg-dark-800 dark:text-dark-300"
          >
            <ArrowPathIcon className={`size-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Now
          </button>
        </div>

        {/* Stats cards */}
        <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          <StatCard
            label="Pending"
            value={s.pendingEmails}
            sub={`${s.pendingSenders ?? 0} sender(s) · Oldest: ${s.oldestQueued ? fmtTime(s.oldestQueued) : '—'}`}
            Icon={QueueListIcon}
            colorClass="text-warning dark:text-warning-lighter"
          />
          <StatCard
            label="Processing"
            value={s.processingEmails}
            sub={`${s.activeCampaigns ?? 0} active campaign(s)`}
            Icon={ArrowPathIcon}
            colorClass="text-info dark:text-info-lighter"
          />
          <StatCard
            label="Follow-up Queue"
            value={s.pendingFollowups}
            sub={`Today: ${s.dueTodayFollowups ?? 0} · Overdue: ${s.overdueFollowups ?? 0}`}
            Icon={ClockIcon}
            colorClass="text-success dark:text-success-lighter"
          />
          <StatCard
            label="Failed"
            value={(s.failedEmails ?? 0) + (s.failedFollowups ?? 0)}
            sub={`Emails: ${s.failedEmails ?? 0} · Follow-ups: ${s.failedFollowups ?? 0} · Retry: ${s.retryPending ?? 0}`}
            Icon={ExclamationTriangleIcon}
            colorClass="text-error dark:text-error-lighter"
            highlight={(s.failedEmails ?? 0) > 0}
          />
        </div>

        {/* Sender analytics */}
        {senders.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-dark-200">Sender Load</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {senders.map(s => <SenderCard key={s.senderEmail} sender={s} />)}
            </div>
          </div>
        )}

        {/* Filters */}
        <Card className="mt-6 border border-gray-100 p-4 dark:border-dark-700">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 dark:text-dark-400">
              <FunnelIcon className="size-4" />
              Filters
            </div>

            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search email / campaign…"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="rounded-lg border border-gray-200 py-1.5 pl-7 pr-3 text-xs focus:border-primary focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-200"
                />
              </div>
              <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90">
                Search
              </button>
            </form>

            <select
              value={filterStatus}
              onChange={handleFilterChange(setFilterStatus)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-primary focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-200"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
              <option value="sent">Sent</option>
            </select>

            <select
              value={filterType}
              onChange={handleFilterChange(setFilterType)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-primary focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-200"
            >
              <option value="">All Types</option>
              <option value="initial">Initial</option>
              <option value="follow_up_1">Follow-up 1</option>
              <option value="follow_up_2">Follow-up 2</option>
              <option value="follow_up_3">Follow-up 3</option>
              <option value="follow_up_4">Follow-up 4</option>
              <option value="follow_up_5">Follow-up 5</option>
              <option value="follow_up_6">Follow-up 6</option>
              <option value="follow_up_7">Follow-up 7</option>
              <option value="manual_followup">Manual Follow-up</option>
            </select>

            <input
              type="text"
              placeholder="Sender email"
              value={filterSender}
              onChange={handleFilterChange(setFilterSender)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-primary focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-200"
            />

            <input
              type="date"
              value={filterDateFrom}
              onChange={handleFilterChange(setFilterDateFrom)}
              title="Date from"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-primary focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-200"
            />
            <input
              type="date"
              value={filterDateTo}
              onChange={handleFilterChange(setFilterDateTo)}
              title="Date to"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-primary focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-200"
            />

            {(filterStatus || filterSender || filterType || filterCampaign || filterDateFrom || filterDateTo || search) && (
              <button
                onClick={() => {
                  setFilterStatus(''); setFilterSender(''); setFilterType('');
                  setFilterCampaign(''); setFilterDateFrom(''); setFilterDateTo('');
                  setSearch(''); setSearchInput(''); setPage(1);
                }}
                className="text-xs font-semibold text-error hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </Card>

        {/* Table */}
        <Card className="mt-4 overflow-hidden border border-gray-100 dark:border-dark-700">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 dark:border-dark-700">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-600 dark:text-dark-300">
                {total.toLocaleString()} job(s)
              </span>
              <button
                onClick={() => setConfirm({
                  message: `Permanently delete ${selected.size} selected item(s) from the queue? Only pending and failed jobs will be removed.`,
                  onConfirm: handleDelete,
                })}
                disabled={selected.size === 0 || deleting}
                className="flex items-center gap-1.5 rounded-lg border border-error/30 bg-error/10 px-3 py-1 text-xs font-semibold text-error transition hover:bg-error hover:text-white disabled:cursor-not-allowed disabled:opacity-30 dark:border-error/20 dark:bg-error/10"
              >
                <TrashIcon className="size-3.5" />
                {selected.size > 0 ? `Delete Selected (${selected.size})` : 'Delete Selected'}
              </button>
            </div>
            <span className="text-xs text-gray-400">
              Page {page} of {totalPages}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-dark-800">
                  <th className="w-10 px-4 py-2.5 text-left font-semibold uppercase tracking-wider text-gray-400 dark:text-dark-400">
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      onChange={toggleSelectAll}
                      disabled={deletableItems.length === 0}
                      title="Select all pending/failed on this page"
                      className="cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-40"
                    />
                  </th>
                  {['ID', 'Campaign', 'Sender', 'Recipient', 'Type', 'Status', 'Queued At', 'Scheduled At', 'Attempts', 'Last Attempt', 'Error'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-semibold uppercase tracking-wider text-gray-400 dark:text-dark-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-dark-700/50">
                {loading && items.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center text-gray-400">
                      <ArrowPathIcon className="mx-auto mb-2 size-5 animate-spin" />
                      Loading…
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center text-gray-400">
                      No queue jobs match the current filters.
                    </td>
                  </tr>
                ) : items.map(row => {
                  const canDelete = DELETABLE.has(row.status);
                  const isSelected = selected.has(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-gray-50/50 dark:hover:bg-dark-800/30 ${isSelected ? 'bg-error-50/40 dark:bg-error-900/10' : ''}`}
                    >
                      <td className="px-4 py-2.5">
                        {canDelete ? (
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRow(row.id)}
                            className="cursor-pointer accent-primary"
                          />
                        ) : (
                          <span className="block size-4" />
                        )}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-gray-500 dark:text-dark-400">{row.id}</td>
                      <td className="max-w-[120px] truncate px-4 py-2.5 text-gray-700 dark:text-dark-200" title={row.campaign_name}>{row.campaign_name || '—'}</td>
                      <td className="max-w-[140px] truncate px-4 py-2.5 text-gray-600 dark:text-dark-300" title={row.sender_email}>{row.sender_email || '—'}</td>
                      <td className="max-w-[160px] truncate px-4 py-2.5 text-gray-600 dark:text-dark-300" title={row.recipient_email}>{row.recipient_email || '—'}</td>
                      <td className="px-4 py-2.5">{typeBadge(row.queue_type)}</td>
                      <td className="px-4 py-2.5">{statusBadge(row.status)}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-gray-500 dark:text-dark-400">{fmt(row.queued_at)}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-gray-500 dark:text-dark-400">{fmt(row.scheduled_at)}</td>
                      <td className="px-4 py-2.5 text-center text-gray-600 dark:text-dark-300">{row.attempts ?? 0}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-gray-500 dark:text-dark-400">{fmt(row.last_attempt)}</td>
                      <td className="max-w-[200px] truncate px-4 py-2.5 text-error dark:text-error-lighter" title={row.last_error}>{row.last_error || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 dark:border-dark-700">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:border-dark-600 dark:text-dark-300"
              >
                <ChevronLeftIcon className="size-3.5" /> Prev
              </button>
              <span className="text-xs text-gray-400">
                {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, total)} of {total.toLocaleString()}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:border-dark-600 dark:text-dark-300"
              >
                Next <ChevronRightIcon className="size-3.5" />
              </button>
            </div>
          )}
        </Card>

      </div>
    </Page>
  );
}
