import { useEffect, useState, useCallback, useRef } from 'react';
import {
  ArrowPathIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Card } from 'components/ui';
import { Page } from 'components/shared/Page';
import { fetchQueueStats, fetchFollowupQueueList, deleteFollowupQueueItems } from 'services/api';

// ─── helpers ──────────────────────────────────────────────────────────────────

function fmt(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString();
}

function statusBadge(status) {
  const map = {
    'Overdue':  'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300',
    'Due Today':'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300',
    'Pending':  'bg-gray-100 text-gray-600 dark:bg-dark-700 dark:text-dark-300',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

function stageLabel(step) {
  if (step == null || step === 0) return 'Initial → Stage 1';
  return `Stage ${step} → ${step + 1}`;
}

// ─── Summary card ─────────────────────────────────────────────────────────────

function SummaryCard({ label, value, Icon, colorClass }) {
  return (
    <Card className="flex items-start justify-between border border-gray-100 p-5 dark:border-dark-700">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
        <p className={`mt-1 text-2xl font-black ${colorClass}`}>{value ?? '—'}</p>
      </div>
      <div className="flex size-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-dark-700">
        <Icon className={`size-6 ${colorClass}`} />
      </div>
    </Card>
  );
}

// ─── Confirm modal ────────────────────────────────────────────────────────────

function ConfirmModal({ message, onConfirm, onCancel }) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
      onCancel(); // Close modal after success
    } catch (err) {
      console.error('Confirm action failed:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-80 max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-dark-600 dark:bg-dark-800">
        <h3 className="text-sm font-bold text-gray-800 dark:text-dark-100">Confirm Delete</h3>
        <p className="mt-2 text-xs text-gray-600 dark:text-dark-300">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-dark-600 dark:text-dark-300 dark:hover:bg-dark-700"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="rounded-lg bg-error px-3 py-1.5 text-xs font-semibold text-white hover:bg-error/90 disabled:opacity-50"
          >
            {isProcessing ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const LIMIT = 50;

// Unique key per follow-up row (lead_email + campaign_id)
function rowKey(row) {
  return `${row.lead_email}::${row.campaign_id}`;
}

export default function FollowupQueue() {
  const [stats,   setStats]   = useState(null);
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
  const [filterCampaign, setFilterCampaign] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo,   setFilterDateTo]   = useState('');
  const [search,         setSearch]         = useState('');
  const [searchInput,    setSearchInput]    = useState('');

  const timerRef = useRef(null);

  const loadAll = useCallback(async (pg = page) => {
    setLoading(true);
    try {
      const [s, list] = await Promise.all([
        fetchQueueStats(),
        fetchFollowupQueueList({
          page:     pg,
          limit:    LIMIT,
          status:   filterStatus,
          sender:   filterSender,
          campaign: filterCampaign,
          dateFrom: filterDateFrom,
          dateTo:   filterDateTo,
          search,
        }),
      ]);
      setStats(s);
      setItems(list.data || []);
      setTotal(list.total || 0);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, filterSender, filterCampaign, filterDateFrom, filterDateTo, search]);

  useEffect(() => {
    loadAll(page);
    timerRef.current = setInterval(() => loadAll(page), 30000);
    return () => clearInterval(timerRef.current);
  }, [loadAll, page]);

  // clear selection when page/filters change
  useEffect(() => { setSelected(new Set()); }, [page, filterStatus, filterSender, filterCampaign, filterDateFrom, filterDateTo, search]);

  function handleSearch(e) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function handleFilterChange(setter) {
    return (e) => { setter(e.target.value); setPage(1); };
  }

  const allPageSelected = items.length > 0 && items.every(r => selected.has(rowKey(r)));

  function toggleSelectAll() {
    if (allPageSelected) {
      setSelected(prev => {
        const next = new Set(prev);
        items.forEach(r => next.delete(rowKey(r)));
        return next;
      });
    } else {
      setSelected(prev => {
        const next = new Set(prev);
        items.forEach(r => next.add(rowKey(r)));
        return next;
      });
    }
  }

  function toggleRow(key) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      // Build payload from selected keys
      const payload = items
        .filter(r => selected.has(rowKey(r)))
        .map(r => ({ lead_email: r.lead_email, campaign_id: r.campaign_id }));
      
      console.log('Deleting follow-up items:', payload);
      const result = await deleteFollowupQueueItems(payload);
      console.log('Delete result:', result);
      
      if (result?.success) {
        setSelected(new Set());
        await loadAll(page);
      } else {
        console.error('Delete failed:', result);
        alert(`Failed to delete follow-ups: ${result?.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(`Failed to delete follow-ups: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const s = stats || {};

  return (
    <Page title="Follow-up Queue">
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
            <h1 className="text-lg font-bold text-gray-800 dark:text-dark-100">Follow-up Queue</h1>
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

        {/* Summary cards */}
        <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          <SummaryCard
            label="Total Pending"
            value={s.pendingFollowups}
            Icon={ClockIcon}
            colorClass="text-info dark:text-info-lighter"
          />
          <SummaryCard
            label="Due Today"
            value={s.dueTodayFollowups}
            Icon={CheckCircleIcon}
            colorClass="text-warning dark:text-warning-lighter"
          />
          <SummaryCard
            label="Overdue"
            value={s.overdueFollowups}
            Icon={ExclamationTriangleIcon}
            colorClass="text-error dark:text-error-lighter"
          />
          <SummaryCard
            label="Failed (7 days)"
            value={s.failedFollowups}
            Icon={ExclamationTriangleIcon}
            colorClass="text-error dark:text-error-lighter"
          />
        </div>

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
                  placeholder="Search lead / campaign…"
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
              <option value="overdue">Overdue</option>
              <option value="due_today">Due Today</option>
              <option value="pending">Pending (future)</option>
            </select>

            <input
              type="text"
              placeholder="Sender email"
              value={filterSender}
              onChange={handleFilterChange(setFilterSender)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-primary focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-200"
            />

            <input
              type="text"
              placeholder="Campaign name"
              value={filterCampaign}
              onChange={handleFilterChange(setFilterCampaign)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-primary focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-200"
            />

            <input
              type="date"
              value={filterDateFrom}
              onChange={handleFilterChange(setFilterDateFrom)}
              title="Scheduled from"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-primary focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-200"
            />
            <input
              type="date"
              value={filterDateTo}
              onChange={handleFilterChange(setFilterDateTo)}
              title="Scheduled to"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-primary focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-200"
            />

            {(filterStatus || filterSender || filterCampaign || filterDateFrom || filterDateTo || search) && (
              <button
                onClick={() => {
                  setFilterStatus(''); setFilterSender(''); setFilterCampaign('');
                  setFilterDateFrom(''); setFilterDateTo('');
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
                {total.toLocaleString()} pending follow-up(s)
              </span>
              <button
                onClick={() => setConfirm({
                  message: `Cancel follow-ups for ${selected.size} selected lead(s)? They will no longer receive automated follow-up emails and will be removed from the queue.`,
                  onConfirm: handleDelete,
                })}
                disabled={selected.size === 0 || deleting}
                className="flex items-center gap-1.5 rounded-lg border border-error/30 bg-error/10 px-3 py-1 text-xs font-semibold text-error transition hover:bg-error hover:text-white disabled:cursor-not-allowed disabled:opacity-30 dark:border-error/20 dark:bg-error/10"
              >
                <TrashIcon className="size-3.5" />
                {selected.size > 0 ? `Delete Selected (${selected.size})` : 'Delete Selected'}
              </button>
            </div>
            <span className="text-xs text-gray-400">Page {page} of {totalPages}</span>
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
                      disabled={items.length === 0}
                      title="Select all on this page"
                      className="cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-40"
                    />
                  </th>
                  {['Stage', 'Lead Name', 'Lead Email', 'Campaign', 'Sender', 'Scheduled At', 'Days Since Last', 'Status'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-semibold uppercase tracking-wider text-gray-400 dark:text-dark-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-dark-700/50">
                {loading && items.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                      <ArrowPathIcon className="mx-auto mb-2 size-5 animate-spin" />
                      Loading…
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                      No pending follow-ups match the current filters.
                    </td>
                  </tr>
                ) : items.map((row, i) => {
                  const key = rowKey(row);
                  const isSelected = selected.has(key);
                  return (
                    <tr
                      key={`${row.lead_email}-${i}`}
                      className={`hover:bg-gray-50/50 dark:hover:bg-dark-800/30 ${isSelected ? 'bg-error-50/40 dark:bg-error-900/10' : row.fu_status === 'Overdue' ? 'bg-error-50/30 dark:bg-error-900/10' : ''}`}
                    >
                      <td className="px-4 py-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(key)}
                          className="cursor-pointer accent-primary"
                        />
                      </td>
                      <td className="px-4 py-2.5 font-medium text-gray-700 dark:text-dark-200">
                        {stageLabel(row.followup_stage)}
                      </td>
                      <td className="max-w-[120px] truncate px-4 py-2.5 text-gray-700 dark:text-dark-200" title={row.lead_name}>
                        {row.lead_name || '—'}
                      </td>
                      <td className="max-w-[160px] truncate px-4 py-2.5 text-gray-600 dark:text-dark-300" title={row.lead_email}>
                        {row.lead_email}
                      </td>
                      <td className="max-w-[120px] truncate px-4 py-2.5 text-gray-600 dark:text-dark-300" title={row.campaign_name}>
                        {row.campaign_name || '—'}
                      </td>
                      <td className="max-w-[140px] truncate px-4 py-2.5 text-gray-600 dark:text-dark-300" title={row.sender_email}>
                        {row.sender_email || '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-gray-500 dark:text-dark-400">
                        {fmt(row.scheduled_time)}
                      </td>
                      <td className="px-4 py-2.5 text-center text-gray-600 dark:text-dark-300">
                        {row.days_since_last_email != null ? `${row.days_since_last_email}d` : '—'}
                      </td>
                      <td className="px-4 py-2.5">{statusBadge(row.fu_status)}</td>
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
