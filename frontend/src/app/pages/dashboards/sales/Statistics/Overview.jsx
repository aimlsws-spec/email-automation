// Import Dependencies
import { useEffect, useState } from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CubeIcon,
  CurrencyDollarIcon,
  PresentationChartBarIcon,
  UsersIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Avatar, Card } from "components/ui";
import { fetchDashboard } from "services/api";

// ----------------------------------------------------------------------

export function Overview() {
  const [stats, setStats] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const load = () => fetchDashboard().then(data => setStats(data?.metrics || {})).catch(() => setStats({}));

  useEffect(() => {
    load();
    const intervalId = setInterval(load, 20000);
    window.addEventListener("dashboard_refresh", load);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("dashboard_refresh", load);
    };
  }, []);

  async function handleSyncReplies() {
    setSyncing(true);
    try {
      await fetch('/api/replies/sync', { method: 'POST' });
      await load();
    } catch (e) {
      console.error('Reply sync failed:', e);
    } finally {
      setSyncing(false);
    }
  }

  const todaySent = stats?.emailsSentToday ?? 0;
  const yesterdaySent = stats?.emailsSentYesterday ?? 0;
  
  let sentTrend = null;
  if (yesterdaySent > 0) {
    const diff = ((todaySent - yesterdaySent) / yesterdaySent) * 100;
    sentTrend = {
      value: Math.abs(Math.round(diff)),
      isPositive: diff > 0,
      isNegative: diff < 0
    };
  }

  const cards = [
    { 
      label: "Emails Sent Today", 
      value: todaySent, 
      subtext: `Total: ${stats?.emailsSentTotal ?? 0}`, 
      trend: sentTrend,
      color: "info", 
      Icon: PresentationChartBarIcon 
    },
    { 
      label: "Active Campaigns", 
      value: stats?.activeCampaigns ?? "—", 
      subtext: "Running now", 
      color: "success", 
      Icon: CubeIcon 
    },
    { 
      label: "Total Leads", 
      value: stats?.totalLeads ?? "—", 
      subtext: "Across all campaigns", 
      color: "warning", 
      Icon: UsersIcon 
    },
    { 
      label: "Reply Rate", 
      value: `${stats?.replyRate ?? 0}%`, 
      subtext: `Replies: ${stats?.replyCount ?? 0}`, 
      color: "secondary", 
      Icon: CurrencyDollarIcon 
    },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-dark-400">
          Reply Rate updates every 20s
        </span>
        <button
          onClick={handleSyncReplies}
          disabled={syncing}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:opacity-50 dark:border-dark-600 dark:bg-dark-800 dark:text-dark-300"
        >
          <ArrowPathIcon className={`size-3.5 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing replies...' : 'Sync Replies Now'}
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
      {cards.map(({ label, value, subtext, trend, color, Icon }) => (
        <Card key={label} className="flex justify-between p-5 border border-gray-100 dark:border-dark-700">
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
              <p className={`this:${color} mt-1 text-2xl font-black text-this dark:text-this-lighter`}>
                {value}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <p className="text-xs font-semibold uppercase text-gray-400 dark:text-dark-300">
                {subtext}
              </p>
              {trend && (trend.isPositive || trend.isNegative) && (
                <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                  trend.isPositive ? 'bg-success-100 text-success dark:bg-success-900/30' : 'bg-error-100 text-error dark:bg-error-900/30'
                }`}>
                  {trend.isPositive ? <ArrowUpIcon className="size-3" /> : <ArrowDownIcon className="size-3" />}
                  <span>{trend.value}%</span>
                </div>
              )}
            </div>
          </div>
          <Avatar
            size={12}
            classNames={{ display: "mask is-squircle rounded-none" }}
            initialVariant="soft"
            initialColor={color}
          >
            <Icon className="size-6" />
          </Avatar>
        </Card>
      ))}
      </div>
    </div>
  );
}
