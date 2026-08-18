import { useEffect, useState, useCallback, useRef } from 'react';
import {
  ArrowPathIcon,
  ShieldExclamationIcon,
  NoSymbolIcon,
  CheckCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Card } from 'components/ui';
import { Page } from 'components/shared/Page';
import { fetchSuppressions, addSuppression, deleteSuppression } from 'services/api';

// ─── helpers ──────────────────────────────────────────────────────────────────

function fmt(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString();
}

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

// ─── Modal ───────────────────────────────────────────────────────────────────

function ConfirmModal({ message, onConfirm, onCancel, confirmText = 'Confirm', confirmColor = 'bg-error' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-80 max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-dark-600 dark:bg-dark-800">
        <h3 className="text-sm font-bold text-gray-800 dark:text-dark-100">Confirmation</h3>
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
            className={`rounded-lg ${confirmColor} px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddModal({ onConfirm, onCancel }) {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isValid = email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function handleSubmit() {
    if (!isValid || saving) return;
    setSaving(true);
    setError('');
    try {
      await onConfirm(email.trim(), reason.trim());
    } catch (err) {
      setError(err.message || 'Failed to add suppression');
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div
        className="w-96 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-dark-600 dark:bg-dark-800"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-sm font-bold text-gray-800 dark:text-dark-100">Add to Suppression List</h3>
        <p className="mt-2 text-xs text-gray-500 dark:text-dark-400">
          Manually suppress an email address to block all future outbound emails across campaigns.
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-dark-200">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              autoFocus
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-dark-600 dark:bg-dark-700 dark:text-dark-100"
              placeholder="e.g. invalid@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-dark-200">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-dark-600 dark:bg-dark-700 dark:text-dark-100"
              placeholder="e.g. Hard Bounce, Invalid, Requested"
            />
          </div>
          {error && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-dark-600 dark:bg-dark-700 dark:text-dark-200 dark:hover:bg-dark-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || saving}
            style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
            className="rounded-lg px-4 py-2 text-xs font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? 'Adding…' : 'Add Email'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const LIMIT = 50;

export default function Suppressions() {
  const [stats, setStats] = useState({});
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // filters
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  const [isAdding, setIsAdding] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  const timerRef = useRef(null);

  const loadAll = useCallback(async (pg = page) => {
    setLoading(true);
    try {
      const res = await fetchSuppressions({
        page: pg,
        limit: LIMIT,
        search,
      });
      setItems(res.data || []);
      setTotal(res.total || 0);
      setStats(res.stats || {});
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadAll(page);
    timerRef.current = setInterval(() => loadAll(page), 30000);
    return () => clearInterval(timerRef.current);
  }, [loadAll, page]);

  function handleSearch(e) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  async function handleAddSuppression(email, reason) {
    await addSuppression(email, reason);
    setIsAdding(false);
    setToast(`${email} added to suppression list.`);
    setTimeout(() => setToast(null), 4000);
    await loadAll(page);
  }

  async function handleRevalidate(email) {
    setConfirm(null);
    try {
      await deleteSuppression(email);
      await loadAll(page);
    } catch (err) {
      alert(err.message);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <Page title="Global Suppressions">
      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
          confirmText="Revalidate"
          confirmColor="bg-success"
        />
      )}
      {isAdding && (
        <AddModal
          onConfirm={handleAddSuppression}
          onCancel={() => setIsAdding(false)}
        />
      )}
      
      {toast && (
        <div className="fixed bottom-5 right-5 z-[9999] flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-semibold text-green-700 shadow-lg dark:border-green-800/40 dark:bg-green-900/30 dark:text-green-300">
          <CheckCircleIcon className="size-4 shrink-0" />
          {toast}
        </div>
      )}
      <div className="transition-content px-(--margin-x) pb-8">
        {/* Header */}
        <div className="mt-4 flex items-center justify-between sm:mt-5 lg:mt-6">
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-dark-100">Global Suppression List</h1>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-400">
              Emails that are permanently blocked from receiving outbound messages.
              {lastUpdated && ` · Updated ${lastUpdated.toLocaleTimeString()}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadAll(page)}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:opacity-50 dark:border-dark-600 dark:bg-dark-800 dark:text-dark-300"
            >
              <ArrowPathIcon className={`size-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setIsAdding(true)}
              style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold shadow-sm transition hover:opacity-90"
            >
              <PlusIcon className="size-4" />
              Add Suppression
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          <StatCard
            label="Total Suppressed"
            value={stats.total_suppressed}
            sub="Globally blocked emails"
            Icon={NoSymbolIcon}
            colorClass="text-error dark:text-error-lighter"
          />
          <StatCard
            label="Hard Bounces"
            value={stats.total_hard_bounces}
            sub="Failed delivery due to invalid recipient"
            Icon={ShieldExclamationIcon}
            colorClass="text-warning dark:text-warning-lighter"
          />
          <StatCard
            label="Total Skipped Sends"
            value={stats.total_skipped}
            sub="Total sending attempts avoided"
            Icon={CheckCircleIcon}
            colorClass="text-success dark:text-success-lighter"
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
                  placeholder="Search email…"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="rounded-lg border border-gray-200 py-1.5 pl-7 pr-3 text-xs focus:border-primary focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-200"
                />
              </div>
              <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90">
                Search
              </button>
            </form>

            {search && (
              <button
                onClick={() => {
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
            <span className="text-xs font-semibold text-gray-600 dark:text-dark-300">
              {total.toLocaleString()} suppressed email(s)
            </span>
            <span className="text-xs text-gray-400">
              Page {page} of {totalPages}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-dark-800">
                  {['Email', 'Reason', 'Times Skipped', 'Last Skipped At', 'Added At', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-semibold uppercase tracking-wider text-gray-400 dark:text-dark-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-dark-700/50">
                {loading && items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      <ArrowPathIcon className="mx-auto mb-2 size-5 animate-spin" />
                      Loading…
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                      No suppressed emails match the current filters.
                    </td>
                  </tr>
                ) : items.map(row => (
                  <tr key={row.email} className="hover:bg-gray-50/50 dark:hover:bg-dark-800/30">
                    <td className="max-w-[200px] truncate px-4 py-2.5 font-semibold text-gray-700 dark:text-dark-200" title={row.email}>
                      {row.email}
                    </td>
                    <td className="max-w-[150px] truncate px-4 py-2.5 text-error dark:text-error-lighter" title={row.reason}>
                      {row.reason}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-gray-600 dark:text-dark-300">{row.skip_count}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-gray-500 dark:text-dark-400">{fmt(row.last_skipped_at)}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-gray-500 dark:text-dark-400">{fmt(row.added_at)}</td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => setConfirm({
                          message: `Are you sure you want to revalidate ${row.email}? It will be eligible to receive emails again.`,
                          onConfirm: () => handleRevalidate(row.email)
                        })}
                        className="rounded bg-success/10 px-2 py-1 text-xs font-semibold text-success hover:bg-success/20 dark:bg-success/20 dark:hover:bg-success/30"
                      >
                        Revalidate
                      </button>
                    </td>
                  </tr>
                ))}
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
