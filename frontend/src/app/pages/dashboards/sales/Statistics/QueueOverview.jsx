import { useEffect, useState, useCallback } from 'react';
import {
  QueueListIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { Avatar, Card } from 'components/ui';
import { fetchQueueStats } from 'services/api';

// ----------------------------------------------------------------------

export function QueueOverview() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchQueueStats()
      .then(data => {
        setStats(data);
        setLastUpdated(new Date());
      })
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, [load]);

  const s = stats || {};

  const cards = [
    {
      label:   'Pending Email Queue',
      value:   s.pendingEmails ?? '—',
      sub1:    `${s.pendingSenders ?? 0} sender(s)`,
      sub2:    s.oldestQueued
                 ? `Oldest: ${new Date(s.oldestQueued).toLocaleTimeString()}`
                 : 'No pending jobs',
      color:   'warning',
      Icon:    QueueListIcon,
    },
    {
      label:   'Processing Queue',
      value:   s.processingEmails ?? '—',
      sub1:    `${s.activeCampaigns ?? 0} active campaign(s)`,
      sub2:    s.nextScheduled
                 ? `Next: ${new Date(s.nextScheduled).toLocaleTimeString()}`
                 : 'No scheduled',
      color:   'info',
      Icon:    ArrowPathIcon,
    },
    {
      label:   'Follow-up Queue',
      value:   s.pendingFollowups ?? '—',
      sub1:    `Today: ${s.dueTodayFollowups ?? 0}`,
      sub2:    `Overdue: ${s.overdueFollowups ?? 0}`,
      color:   'success',
      Icon:    ClockIcon,
    },
    {
      label:   'Failed Queue',
      value:   s.failedEmails ?? '—',
      sub1:    `Follow-ups failed: ${s.failedFollowups ?? 0}`,
      sub2:    `Retry eligible: ${s.retryPending ?? 0}`,
      color:   'error',
      Icon:    ExclamationTriangleIcon,
    },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-dark-400">
          Queue Status
        </span>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-400 dark:text-dark-400">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:opacity-50 dark:border-dark-600 dark:bg-dark-800 dark:text-dark-300"
          >
            <ArrowPathIcon className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {cards.map(({ label, value, sub1, sub2, color, Icon }) => (
          <Card key={label} className={`flex justify-between p-5 border ${color === 'error' && value > 0 ? 'border-error-200 dark:border-error-800/50' : 'border-gray-100 dark:border-dark-700'}`}>
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
                <p className={`this:${color} mt-1 text-2xl font-black text-this dark:text-this-lighter`}>
                  {value}
                </p>
              </div>
              <div className="mt-4 space-y-0.5">
                <p className="text-xs font-semibold uppercase text-gray-400 dark:text-dark-300">{sub1}</p>
                <p className="text-xs text-gray-400 dark:text-dark-400">{sub2}</p>
              </div>
            </div>
            <Avatar
              size={12}
              classNames={{ display: 'mask is-squircle rounded-none' }}
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
