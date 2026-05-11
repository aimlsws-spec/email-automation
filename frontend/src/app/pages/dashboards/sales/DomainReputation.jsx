import { useEffect, useState } from 'react';

async function fetchDomainStats() {
  const res = await fetch('/api/domains/stats', { cache: 'no-store' });
  if (!res.ok) throw new Error(`Server returned ${res.status}`);
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json'))
    throw new Error('Backend not reachable — check server is running on port 4000');
  const json = await res.json();
  return json.data || [];
}

const STATUS_CONFIG = {
  healthy: { color: 'bg-green-500',  text: 'text-green-600',  label: 'Healthy',  bar: 'bg-green-500'  },
  warming: { color: 'bg-yellow-400', text: 'text-yellow-600', label: 'Warming',  bar: 'bg-yellow-400' },
  risky:   { color: 'bg-red-500',    text: 'text-red-600',    label: 'Risky',    bar: 'bg-red-500'    },
};

function ScoreBar({ score, status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.warming;
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className={`font-semibold ${cfg.text}`}>{score}/100</span>
        <span className={`font-medium ${cfg.text}`}>{cfg.label}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${cfg.bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`text-sm font-bold ${color}`}>{value}%</span>
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    </div>
  );
}

export function DomainReputation() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await fetchDomainStats();
        if (!cancelled) setDomains(data);
      } catch (e) {
        if (!cancelled) {
          // 404 = backend not restarted yet; suppress noisy error
          if (e.message.includes('404')) {
            setDomains([]);
          } else {
            setError(e.message);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 60000); // refresh every 60s
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return (
    <div className="card">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          Domain Reputation
        </h2>
        <span className="text-xs text-gray-400">Live</span>
      </div>

      <div className="px-4 pb-4 space-y-4">
        {loading && (
          <p className="text-xs text-gray-400 text-center py-4">Loading…</p>
        )}
        {error && (
          <p className="text-xs text-red-500 text-center py-4">{error}</p>
        )}
        {!loading && !error && domains.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">
            No domain data yet. Send some emails first.
          </p>
        )}

        {domains.map((d) => {
          const cfg = STATUS_CONFIG[d.status] || STATUS_CONFIG.warming;
          return (
            <div
              key={d.domain}
              className="rounded-xl border border-gray-100 dark:border-gray-700 p-3 space-y-2"
            >
              {/* Domain name + status dot */}
              <div className="flex items-center gap-2">
                <span className={`inline-block h-2 w-2 rounded-full ${cfg.color}`} />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                  {d.domain}
                </span>
                <span className="ml-auto text-xs text-gray-400">
                  {d.daily_sent} sent today
                </span>
              </div>

              {/* Score bar */}
              <ScoreBar score={d.reputation_score} status={d.status} />

              {/* Rate pills */}
              <div className="flex justify-around pt-1">
                <StatPill label="Reply"   value={d.reply_rate}  color="text-green-600" />
                <StatPill label="Bounce"  value={d.bounce_rate} color="text-red-500"   />
                <StatPill label="Spam"    value={d.spam_rate}   color="text-orange-500"/>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-blue-600">{d.total_sent}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Total Sent</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
