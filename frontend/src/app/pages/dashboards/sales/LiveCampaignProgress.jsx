import { useEffect, useState } from "react";
import { Card } from "components/ui";
import { PlayCircleIcon, CheckCircleIcon, UserIcon } from "@heroicons/react/24/outline";

export function LiveCampaignProgress() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/campaigns/status");
        if (!res.ok) {
          console.error("API error fetching campaign status");
          return;
        }
        
        let data = null;
        try {
          data = await res.json();
        } catch (err) {
          console.error("Invalid JSON response in campaign status", err);
          return;
        }

        setCampaigns(data && data.success ? data.campaigns : []);
      } catch (err) {
        console.error("Failed to fetch campaign status:", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  if (campaigns.length === 0) return null;

  // Show only the most recent running or most recent campaign
  const activeCampaign = campaigns.find(c => c.status === 'RUNNING') || campaigns[0];

  const sent = activeCampaign.sent || 0;
  const total = activeCampaign.total || 0;
  const progress = total > 0 ? Math.round((sent / total) * 100) : 0;
  const isCompleted = activeCampaign.status === 'COMPLETED';

  return (
    <div className="mb-6">
      <Card className="p-5 border-l-4 border-primary-500 shadow-sm overflow-hidden relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {isCompleted ? (
                <CheckCircleIcon className="size-5 text-success" />
              ) : (
                <PlayCircleIcon className="size-5 text-primary-500 animate-pulse" />
              )}
              <h3 className="text-lg font-bold truncate text-gray-800 dark:text-dark-100">
                {activeCampaign.name}
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                isCompleted ? 'bg-success-100 text-success dark:bg-success-900/30' : 'bg-primary-100 text-primary-500 dark:bg-primary-900/30'
              }`}>
                {activeCampaign.status}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-dark-300">
              <div className="flex items-center gap-1.5">
                <UserIcon className="size-4" />
                <span className="truncate max-w-[200px]" title={activeCampaign.active_sender}>
                   {activeCampaign.active_sender || 'Rotating...'}
                </span>
              </div>
              <div className="font-medium">
                {sent} / {total} Leads
              </div>
            </div>
          </div>

          <div className="w-full md:w-64">
             <div className="flex justify-between items-end mb-1.5">
                <span className="text-xs font-bold text-gray-600 dark:text-dark-200">Progress</span>
                <span className="text-xs font-bold text-primary-500">{progress}%</span>
             </div>
             <div className="h-2 w-full bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${isCompleted ? 'bg-success' : 'bg-primary-500'}`}
                  style={{ width: `${progress}%` }}
                />
             </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
