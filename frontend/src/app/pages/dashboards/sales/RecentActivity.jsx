// Import Dependencies
import { useEffect, useState } from "react";

// Local Imports
import { Card, Timeline, TimelineItem } from "components/ui";
import { fetchActivityRecent } from "services/api";

// ----------------------------------------------------------------------

const colorMap = { 
  sent: "primary", 
  reply: "success", 
  failed: "error",
  followup: "info"
};

export function RecentActivity() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      fetchActivityRecent()
        .then((data) => setEvents(data || []))
        .catch(console.error)
        .finally(() => setLoading(false));
    };

    load();
    const intervalId = setInterval(load, 5000);
    window.addEventListener("dashboard_refresh", load);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("dashboard_refresh", load);
    };
  }, []);

  return (
    <Card className="col-span-12 flex flex-col rounded-xl shadow-sm md:col-span-1 border border-gray-100 dark:border-dark-700">
      <div className="flex h-14 min-w-0 items-center justify-between px-4 py-3 sm:px-6 border-b border-gray-100 dark:border-dark-800">
        <h2 className="min-w-0 font-semibold tracking-wide text-gray-800 dark:text-dark-100 uppercase text-xs">
          Recent Activity
        </h2>
        {loading && <div className="size-2 rounded-full bg-primary-500 animate-pulse" />}
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 scrollbar-hide" style={{ maxHeight: "360px" }}>
        {events.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
             <p className="text-xs font-semibold text-gray-400 dark:text-dark-400 uppercase tracking-wide">No recent activity</p>
          </div>
        ) : (
          <Timeline lineSpace="1.25rem">
            {events.map((item, i) => (
              <TimelineItem
                key={`${i}-${item.timestamp}`}
                title={item.campaign_name || "System Event"}
                time={new Date(item.timestamp).getTime()}
                color={colorMap[item.type] ?? "neutral"}
                isPing={i === 0 && item.type === 'reply'}
              >
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100 truncate max-w-[180px]">
                    {item.email}
                  </p>
                  <p className={`text-[11px] font-semibold uppercase tracking-wide ${
                    item.type === 'reply' ? 'text-success' : 
                    item.type === 'failed' ? 'text-error' : 
                    item.type === 'followup' ? 'text-info' : 'text-primary-600'
                  }`}>
                    {item.type}
                  </p>
                </div>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </div>
    </Card>
  );
}
