import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeftIcon, ArrowPathIcon, PauseIcon, PlayIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Card } from 'components/ui';
import { Page } from 'components/shared/Page';
import {
  fetchAutoCampaign,
  fetchAutoCampaignProgress,
  pauseAutoCampaign,
  resumeAutoCampaign,
  deleteAutoCampaign,
} from 'services/api';

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-dark-700">
      <p className="text-lg font-black text-gray-800 dark:text-dark-100">{value ?? 0}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
    </div>
  );
}

export default function AutoCampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [senders, setSenders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const timerRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [c, s] = await Promise.all([fetchAutoCampaign(id), fetchAutoCampaignProgress(id)]);
      setCampaign(c);
      setSenders(s || []);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
    timerRef.current = setInterval(load, 30000);
    return () => clearInterval(timerRef.current);
  }, [load]);

  async function handlePauseResume() {
    if (!campaign) return;
    setBusy(true);
    try {
      if (campaign.status === 'Running') await pauseAutoCampaign(id);
      else if (campaign.status === 'Paused') await resumeAutoCampaign(id);
      await load();
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete campaign "${campaign?.campaign_name}"? Already-sent emails and leads are unaffected — this only stops future scheduling.`)) return;
    setBusy(true);
    try {
      await deleteAutoCampaign(id);
      navigate('/dashboards/auto-campaigns');
    } catch (err) {
      alert(err.message);
      setBusy(false);
    }
  }

  if (!campaign && loading) {
    return (
      <Page title="Campaign">
        <div className="p-8 text-center text-gray-400"><ArrowPathIcon className="mx-auto mb-2 size-5 animate-spin" />Loading…</div>
      </Page>
    );
  }
  if (!campaign) {
    return (
      <Page title="Campaign">
        <div className="p-8 text-center text-gray-400">Campaign not found.</div>
      </Page>
    );
  }

  const stats = campaign.stats || {};

  return (
    <Page title={campaign.campaign_name}>
      <div className="transition-content overflow-hidden px-(--margin-x) pb-8">
        <button
          onClick={() => navigate('/dashboards/auto-campaigns')}
          className="mt-4 flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-700 dark:text-dark-400 dark:hover:text-dark-200"
        >
          <ArrowLeftIcon className="size-3.5" /> Back to campaigns
        </button>

        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-dark-100">{campaign.campaign_name}</h1>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-400">
              Status: <span className="font-semibold">{campaign.status}</span> · Schedule: {campaign.schedule_type || '—'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:border-dark-600 dark:bg-dark-800 dark:text-dark-300"
            >
              <ArrowPathIcon className={`size-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            {(campaign.status === 'Running' || campaign.status === 'Paused') && (
              <button
                onClick={handlePauseResume}
                disabled={busy}
                className="flex items-center gap-1.5 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs font-semibold text-warning hover:bg-warning hover:text-white disabled:opacity-50"
              >
                {campaign.status === 'Running' ? <><PauseIcon className="size-4" /> Pause</> : <><PlayIcon className="size-4" /> Resume</>}
              </button>
            )}
            {campaign.status !== 'Running' && (
              <button
                onClick={handleDelete}
                disabled={busy}
                className="flex items-center gap-1.5 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-xs font-semibold text-error hover:bg-error hover:text-white disabled:opacity-50"
              >
                <TrashIcon className="size-4" /> Delete
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <StatCard label="Total Leads" value={stats.total_leads} />
          <StatCard label="Valid" value={stats.valid_leads} />
          <StatCard label="Invalid" value={stats.invalid_leads} />
          <StatCard label="Duplicate" value={stats.duplicate_leads} />
          <StatCard label="Imported" value={stats.imported_leads} />
        </div>

        <Card className="mt-6 overflow-hidden border border-gray-100 dark:border-dark-700">
          <div className="border-b border-gray-100 px-5 py-3 dark:border-dark-700">
            <span className="text-xs font-semibold text-gray-600 dark:text-dark-300">Per-sender progress</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-dark-800">
                  {['Sender', 'Batch size', 'Batches sent', 'Next eligible', 'Pending', 'In-flight', 'Sent', 'Replied', 'Suppressed', 'Failed'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-semibold uppercase tracking-wider text-gray-400 dark:text-dark-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-dark-700/50">
                {senders.length === 0 ? (
                  <tr><td colSpan={10} className="px-4 py-8 text-center text-gray-400">No senders assigned yet — start the campaign to assign senders.</td></tr>
                ) : senders.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-2.5 font-medium text-gray-700 dark:text-dark-200">{s.sender_email}</td>
                    <td className="px-4 py-2.5 text-gray-600 dark:text-dark-300">{s.batch_size}</td>
                    <td className="px-4 py-2.5 text-gray-600 dark:text-dark-300">{s.last_batch_no}</td>
                    <td className="px-4 py-2.5 text-gray-500 dark:text-dark-400">{s.next_eligible_date ? new Date(s.next_eligible_date).toLocaleDateString() : 'Now'}</td>
                    <td className="px-4 py-2.5 text-gray-600 dark:text-dark-300">{s.pending}</td>
                    <td className="px-4 py-2.5 text-info">{s.in_flight}</td>
                    <td className="px-4 py-2.5 text-success">{s.sent}</td>
                    <td className="px-4 py-2.5 text-primary-600">{s.replied}</td>
                    <td className="px-4 py-2.5 text-warning">{s.suppressed}</td>
                    <td className="px-4 py-2.5 text-error">{s.failed}</td>
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
