// Import Dependencies
import { useEffect, useState } from "react";
import {
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  ClockIcon,
  XCircleIcon,
  CursorArrowRaysIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Card } from "components/ui";
import { fetchAutomationStats } from "services/api";

// ----------------------------------------------------------------------

const STATS_CONFIG = [
  { key: "emails_sent_today",    label: "Emails Sent Today",    Icon: EnvelopeIcon,              color: "text-primary-600 dark:text-primary-400",  bg: "bg-primary-100 dark:bg-primary-900/30" },
  { key: "replies_today",        label: "Replies Today",        Icon: ChatBubbleLeftRightIcon,   color: "text-success dark:text-success-lighter",  bg: "bg-success-100 dark:bg-success-900/30" },
  { key: "clicks_today",         label: "Clicks Today",         Icon: CursorArrowRaysIcon,       color: "text-secondary dark:text-secondary-lighter", bg: "bg-secondary-100 dark:bg-secondary-900/30" },
  { key: "followups_sent",       label: "Follow-ups Sent",      Icon: ArrowPathIcon,             color: "text-info dark:text-info-light",          bg: "bg-info-100 dark:bg-info-900/30" },
  { key: "pending_followups",    label: "Pending Follow-ups",   Icon: ClockIcon,                 color: "text-warning-600 dark:text-warning-400",  bg: "bg-warning-100 dark:bg-warning-900/30" },
  { key: "failed_today",         label: "Failed Today",         Icon: XCircleIcon,               color: "text-error dark:text-error-light",        bg: "bg-error-100 dark:bg-error-900/30" },
];

export function AutomationOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      fetchAutomationStats()
        .then(setData)
        .catch(() => setData(null))
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
    <Card className="pb-4 border border-gray-100 dark:border-dark-700">
      <div className="flex h-14 min-w-0 items-center px-4 py-3 sm:px-5 border-b border-gray-100 dark:border-dark-800 mb-4">
        <h2 className="truncate font-bold tracking-tight text-gray-800 dark:text-dark-100 uppercase text-xs">
          Automation Overview
        </h2>
        {loading && <div className="ml-auto size-2 rounded-full bg-primary-500 animate-pulse" />}
      </div>
      <div className="grid grid-cols-2 gap-3 px-4 sm:px-5">
        {STATS_CONFIG.map(({ key, label, Icon, color, bg }) => {
          const value = data ? (data[key] ?? 0) : 0;
          const isMuted = value === 0;

          return (
            <div key={key} className={`flex items-center gap-3 rounded-xl border border-gray-150 p-3 dark:border-dark-600 transition-all ${loading && !data ? 'opacity-50' : 'opacity-100 hover:border-primary-200 dark:hover:border-primary-900/30'}`}>
              <div className={`rounded-xl p-2 ${isMuted ? 'bg-gray-50 dark:bg-dark-800' : bg}`}>
                <Icon className={`size-5 ${isMuted ? 'text-gray-300 dark:text-dark-500' : color}`} />
              </div>
              <div className="min-w-0">
                <p className={`text-xl font-black tracking-tight leading-none ${isMuted ? 'text-gray-300 dark:text-dark-500' : 'text-gray-800 dark:text-dark-100'}`}>
                  {loading && !data ? "..." : value}
                </p>
                <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-dark-400 truncate">{label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
