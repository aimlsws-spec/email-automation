import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";

export function CampaignsTable() {
  const [campaigns, setCampaigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/campaigns/status");
        if (!res.ok) {
          console.error("API error loading campaigns");
          return;
        }

        let data = null;
        try {
          data = await res.json();
        } catch (err) {
          console.error("Invalid JSON response in campaigns table", err);
          return;
        }

        setCampaigns(data && data.success ? data.campaigns : []);
      } catch (err) {
        console.error("Failed to load campaigns:", err);
      }
    };
    load();
    const intervalId = setInterval(load, 5000);
    window.addEventListener("dashboard_refresh", load);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("dashboard_refresh", load);
    };
  }, []);

  const getStatusColor = (c) => {
    const failedRatio = c.total > 0 ? (c.failed / c.total) : 0;
    if (failedRatio > 0.3) return 'text-error bg-error-100 dark:bg-error-900/30 border border-error/20';

    switch (c.status?.toUpperCase()) {
      case 'RUNNING': return 'text-primary-600 bg-primary-100 dark:bg-primary-900/30';
      case 'COMPLETED': return 'text-success bg-success-100 dark:bg-success-900/30';
      case 'PAUSED': return 'text-warning-600 bg-warning-100 dark:bg-warning-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-dark-700';
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 0) return 'bg-gray-200 dark:bg-dark-600';
    if (progress <= 50) return 'bg-primary-500';
    if (progress < 100) return 'bg-warning-500';
    return 'bg-success';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Campaign Tracking
        </h2>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full text-left">
            <THead>
              <Tr className="bg-gray-200 dark:bg-dark-800 font-semibold uppercase text-[11px] text-gray-800 dark:text-dark-100">
                <Th className="px-4 py-3">Campaign Name</Th>
                <Th className="px-4 py-3 text-center">Status</Th>
                <Th className="px-4 py-3 text-center">Total</Th>
                <Th className="px-4 py-3 text-center text-success">Sent</Th>
                <Th className="px-4 py-3 text-center text-warning-600">Pending</Th>
                <Th className="px-4 py-3 text-center text-error">Failed</Th>
                <Th className="px-4 py-3 text-center">Progress Bar</Th>
                <Th className="px-4 py-3 text-center">Progress Text</Th>
                <Th className="px-4 py-3">Active Sender</Th>
                <Th className="px-4 py-3">Created At</Th>
              </Tr>
            </THead>
            <TBody>
              {campaigns.map((c) => {
                const total = c.total || 0;
                const sent = c.sent || 0;
                const failed = c.failed || 0;
                const pending = c.pending || 0;
                const progress = c.progress !== undefined ? c.progress : (total > 0 ? Math.round((sent / total) * 100) : 0);
                
                return (
                  <Tr 
                    key={c.id} 
                    className="border-b border-gray-150 dark:border-dark-600 text-sm hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/dashboards/email-analytics/campaign/${c.id}`)}
                  >
                    <Td className="px-4 py-3 font-medium group-hover:text-primary-600 transition-colors">{c.name}</Td>
                    <Td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${getStatusColor(c)}`}>
                        {total > 0 && (failed / total) > 0.3 ? 'FAILED-HEAVY' : (c.status || 'Unknown')}
                      </span>
                    </Td>
                    <Td className="px-4 py-3 text-center font-bold">
                      {total === 0 ? <span className="text-gray-400 font-normal">No Leads</span> : total}
                    </Td>
                    <Td className="px-4 py-3 text-center text-success font-bold">{sent}</Td>
                    <Td className="px-4 py-3 text-center text-warning-600 font-bold">{pending}</Td>
                    <Td className="px-4 py-3 text-center text-error font-bold">{failed}</Td>
                    <Td className="px-4 py-3 text-center min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="h-2 grow overflow-hidden rounded-full bg-gray-100 dark:bg-dark-700">
                          <div 
                            className={`h-full transition-all duration-500 ${getProgressColor(progress)}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold min-w-[25px]">{progress}%</span>
                      </div>
                    </Td>
                    <Td className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-dark-300">
                      {sent} / {total}
                    </Td>
                    <Td className="px-4 py-3 truncate max-w-[150px] text-xs" title={c.active_sender}>
                      {c.active_sender || 'Auto Rotation'}
                    </Td>
                    <Td className="px-4 py-3 text-[11px] text-gray-400">
                      {new Date(c.created_at).toLocaleDateString()}
                    </Td>
                  </Tr>
                );
              })}
              {campaigns.length === 0 && (
                <Tr>
                  <Td colSpan={10} className="px-4 py-12 text-center text-gray-400 font-medium">
                    No campaigns yet
                  </Td>
                </Tr>
              )}
            </TBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
