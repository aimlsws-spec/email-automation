// Import Dependencies
import { useEffect, useState } from "react";
import {
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  NoSymbolIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Card } from "components/ui";
import { fetchFollowUpAnalytics } from "services/api";

// ----------------------------------------------------------------------

function SummaryCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border border-gray-150 dark:border-dark-600 p-3`}>
      <div className={`rounded-xl p-2 ${bg}`}>
        <Icon className={`size-5 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-black tracking-tight leading-none text-gray-800 dark:text-dark-100">
          {value ?? 0}
        </p>
        <p className="mt-1 text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-dark-400 truncate">
          {label}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ lead }) {
  if (lead.has_replied) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success-100 dark:bg-success-900/30 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-success">
        <CheckCircleIcon className="size-3" /> Replied
      </span>
    );
  }
  if (lead.is_bounced) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-error-100 dark:bg-error-900/30 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-error">
        <NoSymbolIcon className="size-3" /> Bounced
      </span>
    );
  }
  if (lead.next_follow_up_at && new Date(lead.next_follow_up_at) > new Date()) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-warning-100 dark:bg-warning-900/30 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-warning-600">
        <ClockIcon className="size-3" /> Scheduled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-info-100 dark:bg-info-900/30 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-info">
      <ArrowPathIcon className="size-3" /> Active
    </span>
  );
}

function StepDots({ step, max = 6 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={`size-2 rounded-full ${
            i < step
              ? "bg-primary-500"
              : "bg-gray-200 dark:bg-dark-600"
          }`}
        />
      ))}
      <span className="ml-1 text-[9px] font-black text-gray-400 dark:text-dark-400">
        {step}/{max}
      </span>
    </div>
  );
}

function formatDate(val) {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "2-digit" });
}

// ----------------------------------------------------------------------

export function FollowUpAnalyticsTable() {
  const [data, setData] = useState({ leads: [], summary: {} });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | replied | active | scheduled

  useEffect(() => {
    const load = () => {
      fetchFollowUpAnalytics()
        .then(setData)
        .catch(() => setData({ leads: [], summary: {} }))
        .finally(() => setLoading(false));
    };
    load();
    const id = setInterval(load, 10000);
    window.addEventListener("dashboard_refresh", load);
    return () => {
      clearInterval(id);
      window.removeEventListener("dashboard_refresh", load);
    };
  }, []);

  const { leads, summary } = data;

  const filtered = leads.filter((l) => {
    if (filter === "replied") return l.has_replied;
    if (filter === "active") return !l.has_replied && !l.is_bounced;
    if (filter === "scheduled")
      return !l.has_replied && !l.is_bounced && l.next_follow_up_at && new Date(l.next_follow_up_at) > new Date();
    return true;
  });

  const FILTERS = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "scheduled", label: "Scheduled" },
    { key: "replied", label: "Replied" },
  ];

  return (
    <Card className="border border-gray-100 dark:border-dark-700">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 border-b border-gray-100 dark:border-dark-800">
        <h2 className="font-bold tracking-tight text-gray-800 dark:text-dark-100 uppercase text-xs">
          Follow-up Analytics
        </h2>
        <div className="flex items-center gap-1">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-widest transition-colors ${
                filter === key
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 dark:bg-dark-700 text-gray-500 dark:text-dark-400 hover:bg-gray-200 dark:hover:bg-dark-600"
              }`}
            >
              {label}
            </button>
          ))}
          {loading && <div className="ml-2 size-2 rounded-full bg-primary-500 animate-pulse" />}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 px-4 py-4 sm:grid-cols-5 sm:px-6">
        <SummaryCard
          icon={ArrowPathIcon}
          label="Total Follow-ups Sent"
          value={summary.total_followup_emails_sent}
          color="text-primary-600 dark:text-primary-400"
          bg="bg-primary-100 dark:bg-primary-900/30"
        />
        <SummaryCard
          icon={ChatBubbleLeftRightIcon}
          label="Replied After Follow-up"
          value={summary.total_replied}
          color="text-success dark:text-success-lighter"
          bg="bg-success-100 dark:bg-success-900/30"
        />
        <SummaryCard
          icon={ClockIcon}
          label="Pending Follow-ups"
          value={summary.pending_followups}
          color="text-warning-600 dark:text-warning-400"
          bg="bg-warning-100 dark:bg-warning-900/30"
        />
        <SummaryCard
          icon={ArrowPathIcon}
          label="Active Sequences"
          value={summary.active_sequences}
          color="text-info dark:text-info-light"
          bg="bg-info-100 dark:bg-info-900/30"
        />
        <SummaryCard
          icon={NoSymbolIcon}
          label="Leads w/ Follow-ups"
          value={summary.total_with_followups}
          color="text-secondary dark:text-secondary-lighter"
          bg="bg-secondary-100 dark:bg-secondary-900/30"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-4 pb-4 sm:px-6">
        {filtered.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-xs font-bold text-gray-400 dark:text-dark-400 uppercase tracking-widest">
              No follow-up data yet
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-dark-700">
                {["Lead", "Company", "Status", "Follow-up Step", "Emails Sent", "Last Sent", "Next Due", "Sender"].map((h) => (
                  <th
                    key={h}
                    className="pb-2 pr-4 text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-dark-400 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr
                  key={lead.email}
                  className={`border-b border-gray-50 dark:border-dark-800 transition-colors hover:bg-gray-50 dark:hover:bg-dark-800/50 ${
                    lead.has_replied ? "opacity-60" : ""
                  }`}
                >
                  <td className="py-2.5 pr-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-gray-800 dark:text-dark-100 truncate max-w-[140px]">
                        {lead.name || "—"}
                      </span>
                      <span className="text-[9px] text-gray-400 dark:text-dark-400 truncate max-w-[140px]">
                        {lead.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4 text-gray-600 dark:text-dark-300 truncate max-w-[120px]">
                    {lead.company || "—"}
                  </td>
                  <td className="py-2.5 pr-4">
                    <StatusBadge lead={lead} />
                    {lead.has_replied && (
                      <span className="ml-1 inline-flex items-center gap-0.5 rounded-full bg-error-100 dark:bg-error-900/30 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-error">
                        <NoSymbolIcon className="size-2.5" /> No more follow-ups
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 pr-4">
                    <StepDots step={lead.follow_up_step ?? 0} />
                  </td>
                  <td className="py-2.5 pr-4 font-black text-gray-800 dark:text-dark-100">
                    {lead.follow_up_count ?? 0}
                  </td>
                  <td className="py-2.5 pr-4 text-gray-500 dark:text-dark-400 whitespace-nowrap">
                    {formatDate(lead.last_sent_at)}
                  </td>
                  <td className="py-2.5 pr-4 whitespace-nowrap">
                    {lead.has_replied ? (
                      <span className="text-[9px] font-black text-success">
                        Replied {formatDate(lead.reply_detected_at)}
                      </span>
                    ) : (
                      <span className={`text-[9px] font-black ${
                        lead.next_follow_up_at && new Date(lead.next_follow_up_at) <= new Date()
                          ? "text-error"
                          : "text-gray-500 dark:text-dark-400"
                      }`}>
                        {formatDate(lead.next_follow_up_at)}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 text-gray-400 dark:text-dark-400 truncate max-w-[140px] text-[9px]">
                    {lead.sender_email || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}
