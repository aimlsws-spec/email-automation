import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Page } from "components/shared/Page";
import { Card, Button } from "components/ui";
import { fetchCampaign } from "services/api";
import { LeadsTable } from "components/LeadsTable";
import { 
  ArrowLeftIcon, 
  EnvelopeIcon, 
  ClockIcon, 
  XCircleIcon,
  CheckCircleIcon,
  PaperAirplaneIcon
} from "@heroicons/react/24/outline";

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function CampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fuLoading, setFuLoading] = useState(false);
  const [fuMessage, setFuMessage] = useState(null);

  const handleSendFollowUpNow = async () => {
    if (!window.confirm('Are you sure you want to send follow-ups to all eligible leads?')) return;
    setFuLoading(true);
    setFuMessage(null);
    try {
      const res = await fetch(`${API}/api/campaigns/${id}/followup/send-now`, { method: 'POST' });
      const data = await res.json();
      setFuMessage({ ok: res.ok, text: data.message || data.error });
      if (res.ok) fetchCampaign(id).then(setCampaign).catch(console.error);
    } catch {
      setFuMessage({ ok: false, text: 'Request failed' });
    } finally {
      setFuLoading(false);
      setTimeout(() => setFuMessage(null), 5000);
    }
  };

  useEffect(() => {
    const load = () => {
      fetchCampaign(id)
        .then(setCampaign)
        .catch(console.error)
        .finally(() => setLoading(false));
    };
    load();
    // Trigger a reply sync on mount so replied status is fresh
    fetch(`${API}/api/replies/sync`, { method: 'POST' }).catch(() => {});
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <Page title="Campaign Details"><div className="p-8">Loading...</div></Page>;
  if (!campaign) return <Page title="Campaign Details"><div className="p-8 text-error">Campaign not found</div></Page>;

  const summary = campaign?.summary || { total: 0, sent: 0, pending: 0, failed: 0, replied: 0, completed: 0 };
  const isCompleted = summary.total > 0 && summary.pending === 0;

  const totalLeads = parseInt(summary.total) || 0;
  const sentLeads = parseInt(summary.sent) || 0;
  const repliedLeads = parseInt(summary.replied) || 0;
  // completed counts: Sent + Delivered + Replied + Completed + FollowupCompleted (OR has_replied=1)
  const completedLeads = parseInt(summary.completed) || Math.min(sentLeads + repliedLeads, totalLeads);
  const calculatedProgress = totalLeads > 0 ? Math.round((completedLeads / totalLeads) * 100) : 0;

  console.log('[PROGRESS_DEBUG]', {
    totalLeads,
    sentLeads,
    repliedLeads,
    completedLeads,
    calculatedProgress
  });

  const progress = calculatedProgress;

  const replyRate = summary.sent > 0
    ? parseFloat((parseInt(summary.replied || 0) / summary.sent * 100).toFixed(1))
    : 0;

  const stats = [
    { label: "Total Leads", value: summary.total, icon: EnvelopeIcon, color: "text-primary-500", bg: "bg-primary-100/50" },
    { label: "Sent", value: summary.sent, icon: CheckCircleIcon, color: "text-success", bg: "bg-success-100/50" },
    { label: "Replied", value: parseInt(summary.replied || 0), icon: CheckCircleIcon, color: "text-green-600", bg: "bg-green-100/50", extra: replyRate > 0 ? `${replyRate}%` : null },
    { label: "Pending", value: summary.pending, icon: ClockIcon, color: "text-warning-500", bg: "bg-warning-100/50" },
    { label: "Failed", value: summary.failed, icon: XCircleIcon, color: "text-error", bg: "bg-error-100/50" },
  ];

  return (
    <Page title={`Campaign: ${campaign.name}`}>
      <div className="transition-content overflow-hidden px-(--margin-x) pb-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="flat" onClick={() => navigate("/dashboards/email-analytics")} className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-primary-600 hover:bg-primary-50 transition-colors">
              <ArrowLeftIcon className="size-5" />
              <span>Back to Campaigns</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-100">{campaign.name}</h1>
              <p className="text-sm text-gray-400">Campaign ID: #{id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {fuMessage && (
              <span className={`text-sm font-medium ${fuMessage.ok ? 'text-success' : 'text-error'}`}>
                {fuMessage.text}
              </span>
            )}
            <Button
              onClick={handleSendFollowUpNow}
              disabled={fuLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors rounded-lg"
            >
              <PaperAirplaneIcon className="size-4" />
              {fuLoading ? 'Queuing...' : 'Send Follow-up Now'}
            </Button>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase w-fit ${
              isCompleted ? 'bg-success-100 text-success' : 'bg-primary-100 text-primary-600'
            }`}>
              {isCompleted ? 'COMPLETED' : 'RUNNING'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 sm:gap-5 lg:gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-5 flex items-center gap-4 border border-gray-100 dark:border-dark-700">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="size-6" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">{stat.label}</p>
                <p className="text-2xl font-black text-gray-800 dark:text-dark-100 leading-none">{stat.value}</p>
                {stat.extra && <p className="text-xs font-semibold text-green-600 mt-0.5">{stat.extra} rate</p>}
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-6 p-6 border border-gray-100 dark:border-dark-700">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-dark-100">Delivery Progress</h3>
              <p className="text-sm text-gray-400">Real-time status of lead processing</p>
            </div>
            <span className="text-2xl font-black text-primary-500">{progress}%</span>
          </div>
          <div className="h-4 w-full bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden shadow-inner border border-gray-200/50 dark:border-dark-600">
            <div 
              className={`h-full transition-all duration-1000 ease-out shadow-sm ${isCompleted ? 'bg-success' : 'bg-primary-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-gray-100 dark:border-dark-600 pt-6">
             <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1.5">Active Sender</p>
                <p className="font-semibold text-gray-700 dark:text-dark-200 bg-gray-50 dark:bg-dark-800 p-2 rounded border border-gray-100 dark:border-dark-700 truncate" title={summary.active_sender}>
                  {summary.active_sender || 'Auto Rotation'}
                </p>
             </div>
             <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1.5">Subject Line</p>
                <p className="font-semibold text-gray-700 dark:text-dark-200 bg-gray-50 dark:bg-dark-800 p-2 rounded border border-gray-100 dark:border-dark-700 truncate" title={campaign.subject}>
                  {campaign.subject || '—'}
                </p>
             </div>
             <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1.5">Created Date</p>
                <p className="font-semibold text-gray-700 dark:text-dark-200 bg-gray-50 dark:bg-dark-800 p-2 rounded border border-gray-100 dark:border-dark-700">
                  {summary.created_at ? new Date(summary.created_at).toLocaleString() : '—'}
                </p>
             </div>
          </div>
        </Card>

        <div className="mt-8">
          <LeadsTable campaignId={id} />
        </div>
      </div>
    </Page>
  );
}
