import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Card } from 'components/ui';
import { Page } from 'components/shared/Page';
import { fetchAutoCampaigns } from 'services/api';
import CreateCampaignWizard from './CreateCampaignWizard';

const STATUS_STYLES = {
  Draft: 'bg-gray-100 text-gray-600 dark:bg-dark-700 dark:text-dark-300',
  Importing: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-300',
  Ready: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-300',
  Running: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
  Paused: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-300',
  Completed: 'bg-gray-100 text-gray-500 dark:bg-dark-700 dark:text-dark-400',
  Cancelled: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-300',
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_STYLES[status] || STATUS_STYLES.Draft}`}>
      {status}
    </span>
  );
}

function fmt(dt) {
  if (!dt) return '—';
  return new Date(dt).toLocaleString();
}

export default function AutoCampaigns() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showWizard, setShowWizard] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items } = await fetchAutoCampaigns({ limit: 50 });
      setItems(items || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <Page title="Auto-Pilot Campaigns">
      {showWizard && (
        <CreateCampaignWizard
          onClose={() => setShowWizard(false)}
          onStarted={(id) => { setShowWizard(false); navigate(`/dashboards/auto-campaigns/${id}`); }}
        />
      )}

      <div className="transition-content overflow-hidden px-(--margin-x) pb-8">
        <div className="mt-4 flex items-center justify-between sm:mt-5 lg:mt-6">
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-dark-100">Auto-Pilot Campaigns</h1>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-400">
              Upload a master lead sheet once — it&apos;s split across your sender accounts and drips out
              automatically (200/sender, every other day per sender).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:opacity-50 dark:border-dark-600 dark:bg-dark-800 dark:text-dark-300"
            >
              <ArrowPathIcon className={`size-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowWizard(true)}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-700"
            >
              <PlusIcon className="size-4" />
              New Campaign
            </button>
          </div>
        </div>

        <Card className="mt-5 overflow-hidden border border-gray-100 dark:border-dark-700">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-dark-800">
                  {['Campaign', 'Status', 'Leads (valid/total)', 'Schedule', 'Created', ''].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-semibold uppercase tracking-wider text-gray-400 dark:text-dark-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-dark-700/50">
                {loading && items.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400"><ArrowPathIcon className="mx-auto mb-2 size-5 animate-spin" />Loading…</td></tr>
                ) : items.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No auto-pilot campaigns yet — create one to get started.</td></tr>
                ) : items.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/dashboards/auto-campaigns/${c.id}`)}
                    className="cursor-pointer hover:bg-gray-50/50 dark:hover:bg-dark-800/30"
                  >
                    <td className="max-w-[220px] truncate px-4 py-2.5 font-medium text-gray-700 dark:text-dark-200" title={c.campaign_name}>
                      {c.campaign_name}
                    </td>
                    <td className="px-4 py-2.5"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-2.5 text-gray-600 dark:text-dark-300">
                      {c.valid_leads ?? 0} / {c.total_leads ?? 0}
                    </td>
                    <td className="px-4 py-2.5 text-gray-500 dark:text-dark-400">{c.schedule_type || '—'}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-gray-500 dark:text-dark-400">{fmt(c.created_at)}</td>
                    <td className="px-4 py-2.5 text-right text-primary-600">View →</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </Page>
  );
}
