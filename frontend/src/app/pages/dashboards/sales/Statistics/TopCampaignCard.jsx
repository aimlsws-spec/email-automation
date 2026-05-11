// Import Dependencies
import { useEffect, useState } from "react";
import { TrophyIcon, ChartBarIcon, ChatBubbleLeftRightIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Card } from "components/ui";
import { fetchTopCampaignSingle } from "services/api";

// ----------------------------------------------------------------------

export function TopCampaignCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      fetchTopCampaignSingle()
        .then((res) => setData(res?.campaign || null))
        .catch(console.error)
        .finally(() => setLoading(false));
    };
    load();
    const intervalId = setInterval(load, 10000);
    window.addEventListener("dashboard_refresh", load);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("dashboard_refresh", load);
    };
  }, []);

  if (loading && !data) {
    return (
      <Card className="flex flex-col p-5 border border-gray-100 dark:border-dark-700 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 dark:bg-dark-600 rounded mb-4" />
        <div className="h-8 w-48 bg-gray-200 dark:bg-dark-600 rounded mb-6" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-gray-200 dark:bg-dark-600 rounded" />
          <div className="h-12 bg-gray-200 dark:bg-dark-600 rounded" />
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 border border-gray-100 dark:border-dark-700 text-center">
        <div className="p-3 bg-gray-50 dark:bg-dark-800 rounded-full mb-3">
          <TrophyIcon className="size-6 text-gray-300" />
        </div>
        <p className="text-sm font-bold text-gray-400 dark:text-dark-400">No campaigns yet</p>
      </Card>
    );
  }

  return (
    <Card className="relative flex flex-col p-5 border border-primary-100 dark:border-primary-900/30 overflow-hidden">
      {/* Badge */}
      <div className="absolute top-0 right-0">
         <div className="bg-primary-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-lg flex items-center gap-1 shadow-lg">
           <TrophyIcon className="size-3" />
           Top Performer
         </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Most Successful Campaign</p>
        <h3 className="text-lg font-black text-gray-800 dark:text-dark-100 truncate pr-20" title={data.name}>
          {data.name}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-primary-50 dark:bg-primary-900/10 rounded-xl border border-primary-100/50 dark:border-primary-900/20">
          <div className="flex items-center gap-1.5 mb-1 text-primary-600 dark:text-primary-400">
            <ChartBarIcon className="size-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Reply Rate</span>
          </div>
          <p className="text-xl font-black text-primary-700 dark:text-primary-300">
            {data.reply_rate}%
          </p>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-dark-800 rounded-xl border border-gray-100 dark:border-dark-700">
          <div className="flex items-center gap-1.5 mb-1 text-gray-500">
            <ChatBubbleLeftRightIcon className="size-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Replies</span>
          </div>
          <p className="text-xl font-black text-gray-800 dark:text-dark-100">
            {data.replies}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600">
            <EnvelopeIcon className="size-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-dark-400 uppercase">Total Volume</p>
            <p className="text-xs font-black text-gray-800 dark:text-dark-100">{data.sent} Emails</p>
          </div>
        </div>
        
        <div className="h-8 w-24">
           {/* Visual indicator of success - simple progress line */}
           <div className="h-1.5 w-full bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden mt-4">
              <div 
                className="h-full bg-primary-500 rounded-full transition-all duration-1000"
                style={{ width: `${data.reply_rate}%` }}
              />
           </div>
        </div>
      </div>
    </Card>
  );
}
