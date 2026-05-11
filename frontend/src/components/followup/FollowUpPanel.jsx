import { useEffect, useState, useCallback } from "react";
import {
  ClockIcon,
  XCircleIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  ArrowPathIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";

// ─── Schedule definition (mirrors backend) ──────────────────────────────────
const SCHEDULE = [
  { stage: 1, day: 1,  template: "FOLLOW UP (VIRALKAR)" },
  { stage: 2, day: 3,  template: "FOLLOW UP 2 (VIRALKAR)" },
  { stage: 3, day: 7,  template: "FOLLOW UP (VIRALKAR)" },
  { stage: 4, day: 11, template: "FOLLOW UP 2 (VIRALKAR)" },
  { stage: 5, day: 15, template: "FOLLOW UP (VIRALKAR)" },
  { stage: 6, day: 20, template: "FOLLOW UP 2 (VIRALKAR)" },
  { stage: 7, day: 25, template: "FOLLOW UP (VIRALKAR)" },
];

// ─── Status badge ────────────────────────────────────────────────────────────
function StatusBadge({ lead }) {
  if (!lead) return null;
  if (lead.has_replied)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success-100 px-2 py-0.5 text-xs font-semibold text-success dark:bg-success-900/30">
        <CheckCircleSolid className="size-3" /> Replied
      </span>
    );
  if (lead.is_bounced)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-error-100 px-2 py-0.5 text-xs font-semibold text-error dark:bg-error-900/30">
        <XCircleIcon className="size-3" /> Bounced
      </span>
    );
  if (lead.unsubscribed)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500 dark:bg-dark-700">
        <NoSymbolIcon className="size-3" /> Unsubscribed
      </span>
    );
  if (lead.followup_enabled === 0)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-warning-100 px-2 py-0.5 text-xs font-semibold text-warning-700 dark:bg-warning-900/30">
        <PauseCircleIcon className="size-3" /> Paused
      </span>
    );
  if (lead.next_follow_up_at)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-900/30">
        <ClockIcon className="size-3" /> Active
      </span>
    );
  return null;
}

// ─── Timeline entry ──────────────────────────────────────────────────────────
function TimelineEntry({ entry, isLast }) {
  const isSent    = entry.status === "sent";
  const isStopped = entry.status === "stopped";
  const isFailed  = entry.status === "failed";

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={`flex size-7 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold
            ${isSent ? "bg-success" : isStopped ? "bg-gray-400" : isFailed ? "bg-error" : "bg-primary-500"}`}
        >
          {isSent ? "✓" : isStopped ? "■" : isFailed ? "✗" : entry.followup_stage}
        </div>
        {!isLast && <div className="mt-1 w-px flex-1 bg-gray-200 dark:bg-dark-600" />}
      </div>
      <div className="pb-4">
        <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
          {isStopped
            ? `Stopped — ${entry.stopped_reason || "unknown"}`
            : isFailed
            ? `Failed — ${entry.stopped_reason || "error"}`
            : `Stage ${entry.followup_stage} — ${entry.template_used || "Follow-up"}`}
        </p>
        <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-400">
          {entry.sent_at ? new Date(entry.sent_at).toLocaleString() : "—"}
        </p>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export function FollowUpPanel({ campaignId = null }) {
  const [analytics, setAnalytics]   = useState(null);
  const [loading, setLoading]       = useState(true);
  const [actionEmail, setActionEmail] = useState("");
  const [timeline, setTimeline]     = useState(null);
  const [timelineEmail, setTimelineEmail] = useState("");
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [actionMsg, setActionMsg]   = useState("");

  // ── Global automation status ──────────────────────────────────────────────
  const [autoEnabled, setAutoEnabled] = useState(null); // null = loading
  const [autoLoading, setAutoLoading] = useState(false);

  const fetchAutoStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/followup/automation/status");
      const data = await res.json();
      if (data.success) {
        setAutoEnabled(data.enabled);
      } else {
        console.error("[AUTO] status API error:", data.error);
        setAutoEnabled("error");
      }
    } catch (err) {
      console.error("[AUTO] status fetch failed:", err);
      setAutoEnabled("error");
    }
  }, []);

  useEffect(() => { fetchAutoStatus(); }, [fetchAutoStatus]);

  async function handleAutoToggle(pause) {
    setAutoLoading(true);
    try {
      const res = await fetch(
        pause ? "/api/followup/automation/pause" : "/api/followup/automation/resume",
        { method: "POST" }
      );
      const data = await res.json();
      if (data.success) setAutoEnabled(data.enabled);
    } catch (err) {
      console.error("[AUTO] toggle failed:", err);
    } finally {
      setAutoLoading(false);
    }
  }

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const url = campaignId
        ? `/api/followup/analytics/v2?campaignId=${campaignId}`
        : "/api/followup/analytics/v2";
      const res  = await fetch(url);
      const data = await res.json();
      if (data.success) setAnalytics(data);
    } catch (err) {
      console.error("FollowUpPanel fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  async function fetchTimeline(email) {
    if (!email) return;
    setTimelineLoading(true);
    setTimeline(null);
    try {
      const res  = await fetch(`/api/followup/timeline/${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success) setTimeline(data);
    } catch (err) {
      console.error("Timeline fetch error:", err);
    } finally {
      setTimelineLoading(false);
    }
  }

  async function doAction(endpoint, email) {
    try {
      const res  = await fetch(endpoint, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json();
      setActionMsg(data.message || (data.success ? "Done" : data.error || "Error"));
      fetchAnalytics();
      if (timelineEmail === email) fetchTimeline(email);
    } catch (err) {
      setActionMsg(err.message);
    }
    setTimeout(() => setActionMsg(""), 3000);
  }

  const totals = analytics?.totals || {};

  return (
    <div className="space-y-6">
      {/* ── Global automation status + controls ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 dark:border-dark-600 dark:bg-dark-800">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold text-gray-700 dark:text-dark-200">
            Automation
          </span>
          {autoEnabled === null ? (
            <span className="text-xs text-gray-400 dark:text-dark-400">Loading…</span>
          ) : autoEnabled === "error" ? (
            <span className="text-xs text-error dark:text-error-400">Status Unavailable</span>
          ) : (
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              autoEnabled
                ? "bg-success-100 text-success dark:bg-success-900/30"
                : "bg-warning-100 text-warning-700 dark:bg-warning-900/30"
            }`}>
              <span className={`size-1.5 rounded-full ${autoEnabled ? "bg-success" : "bg-warning-500"}`} />
              {autoEnabled ? "RUNNING" : "PAUSED"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {autoEnabled === true && (
            <button
              onClick={() => handleAutoToggle(true)}
              disabled={autoLoading}
              className="flex items-center gap-1.5 rounded-lg border border-warning-300 bg-warning-50 px-3 py-1.5 text-xs font-semibold text-warning-700 hover:bg-warning-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-warning-700 dark:bg-warning-900/20 dark:text-warning-400"
            >
              <PauseCircleIcon className="size-4" /> Pause Automation
            </button>
          )}
          {autoEnabled === false && (
            <button
              onClick={() => handleAutoToggle(false)}
              disabled={autoLoading}
              className="flex items-center gap-1.5 rounded-lg border border-success-300 bg-success-50 px-3 py-1.5 text-xs font-semibold text-success hover:bg-success-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-success-700 dark:bg-success-900/20"
            >
              <PlayCircleIcon className="size-4" /> Resume Automation
            </button>
          )}
        </div>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "In Sequence",  value: totals.in_sequence      ?? "—", color: "text-primary-600" },
          { label: "Replied",      value: totals.replied           ?? "—", color: "text-success" },
          { label: "Pending",      value: totals.pending           ?? "—", color: "text-warning-600" },
          { label: "Unsubscribed", value: totals.unsubscribed      ?? "—", color: "text-gray-500" },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-dark-600 dark:bg-dark-800">
            <p className="text-xs text-gray-500 dark:text-dark-400">{label}</p>
            <p className={`mt-1 text-2xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── 30-day schedule preview ── */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-dark-600 dark:bg-dark-800">
        <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-dark-400">
          30-Day Automated Schedule
        </h4>
        <div className="flex flex-wrap gap-2">
          {SCHEDULE.map((s) => (
            <div
              key={s.stage}
              className="flex flex-col items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-center dark:border-dark-600 dark:bg-dark-700"
            >
              <span className="text-[10px] font-bold uppercase text-gray-400 dark:text-dark-400">
                Day {s.day}
              </span>
              <span className="mt-0.5 text-xs font-semibold text-gray-700 dark:text-dark-200">
                Stage {s.stage}
              </span>
              <span className="mt-0.5 max-w-[90px] truncate text-[10px] text-primary-600 dark:text-primary-400">
                {s.template.replace(" (VIRALKAR)", "")}
              </span>
            </div>
          ))}
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 dark:border-dark-600 dark:bg-dark-700">
            <span className="text-[10px] font-bold uppercase text-gray-400">Day 30</span>
            <span className="mt-0.5 text-xs font-semibold text-error">STOP</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-400 dark:text-dark-400">
          Alternates between both templates automatically. Stops on reply, unsubscribe, or bounce.
          All emails stay in the same thread with <code className="rounded bg-gray-100 px-1 dark:bg-dark-700">Re:</code> prefix.
        </p>
      </div>

      {/* ── Stage analytics ── */}
      {analytics?.stageSummary?.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-dark-600 dark:bg-dark-800">
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-dark-400">
            Performance by Stage
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-dark-600">
                  <th className="pb-2 text-left text-xs font-semibold text-gray-500">Stage</th>
                  <th className="pb-2 text-left text-xs font-semibold text-gray-500">Template</th>
                  <th className="pb-2 text-right text-xs font-semibold text-gray-500">Sent</th>
                  <th className="pb-2 text-right text-xs font-semibold text-gray-500">Replies</th>
                  <th className="pb-2 text-right text-xs font-semibold text-gray-500">Rate</th>
                </tr>
              </thead>
              <tbody>
                {analytics.stageSummary.map((row) => (
                  <tr key={row.followup_stage} className="border-b border-gray-50 dark:border-dark-700">
                    <td className="py-2 font-medium text-gray-700 dark:text-dark-200">
                      Stage {row.followup_stage}
                    </td>
                    <td className="py-2 text-xs text-gray-500 dark:text-dark-400">
                      {(row.template_used || "").replace(" (VIRALKAR)", "")}
                    </td>
                    <td className="py-2 text-right text-gray-700 dark:text-dark-200">{row.total_sent}</td>
                    <td className="py-2 text-right text-success">{row.replies_after}</td>
                    <td className="py-2 text-right font-semibold text-primary-600">
                      {row.reply_rate ?? 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Per-lead controls ── */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-dark-600 dark:bg-dark-800">
        <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-dark-400">
          Lead Follow-Up Controls
        </h4>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={actionEmail}
            onChange={(e) => setActionEmail(e.target.value)}
            placeholder="lead@example.com"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-dark-500 dark:bg-dark-700 dark:text-dark-100"
          />
          <button
            onClick={() => doAction("/api/followup/pause", actionEmail.trim())}
            disabled={!actionEmail.trim()}
            className="flex items-center gap-1.5 rounded-lg border border-warning-300 bg-warning-50 px-3 py-2 text-xs font-semibold text-warning-700 hover:bg-warning-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-warning-700 dark:bg-warning-900/20 dark:text-warning-400"
          >
            <PauseCircleIcon className="size-4" /> Pause
          </button>
          <button
            onClick={() => doAction("/api/followup/resume", actionEmail.trim())}
            disabled={!actionEmail.trim()}
            className="flex items-center gap-1.5 rounded-lg border border-success-300 bg-success-50 px-3 py-2 text-xs font-semibold text-success hover:bg-success-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-success-700 dark:bg-success-900/20"
          >
            <PlayCircleIcon className="size-4" /> Resume
          </button>
          <button
            onClick={() => doAction("/api/followup/stop", actionEmail.trim())}
            disabled={!actionEmail.trim()}
            className="flex items-center gap-1.5 rounded-lg border border-error-300 bg-error-50 px-3 py-2 text-xs font-semibold text-error hover:bg-error-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-error-700 dark:bg-error-900/20"
          >
            <XCircleIcon className="size-4" /> Stop
          </button>
          <button
            onClick={() => { const e = actionEmail.trim(); setTimelineEmail(e); fetchTimeline(e); }}
            disabled={!actionEmail.trim()}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-dark-500 dark:bg-dark-700 dark:text-dark-200"
          >
            <ClockIcon className="size-4" /> Timeline
          </button>
        </div>
        {actionMsg && (
          <p className="mt-2 text-xs font-medium text-primary-600 dark:text-primary-400">{actionMsg}</p>
        )}
      </div>

      {/* ── Timeline viewer ── */}
      {(timelineLoading || timeline) && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-dark-600 dark:bg-dark-800">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-dark-400">
              Timeline — {timelineEmail}
            </h4>
            {timeline?.lead && (
              <div className="flex items-center gap-2">
                <StatusBadge lead={timeline.lead} />
                {timeline.nextFollowUp && (
                  <span className="text-xs text-gray-400 dark:text-dark-400">
                    Next: Stage {timeline.nextFollowUp.stage} on{" "}
                    {timeline.nextFollowUp.scheduledAt
                      ? new Date(timeline.nextFollowUp.scheduledAt).toLocaleDateString()
                      : "TBD"}
                  </span>
                )}
              </div>
            )}
          </div>

          {timelineLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <ArrowPathIcon className="size-4 animate-spin" /> Loading...
            </div>
          ) : timeline?.timeline?.length === 0 ? (
            <p className="text-sm text-gray-400">No follow-up activity yet for this lead.</p>
          ) : (
            <div className="mt-2">
              {timeline?.timeline?.map((entry, i) => (
                <TimelineEntry
                  key={i}
                  entry={entry}
                  isLast={i === timeline.timeline.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Refresh ── */}
      <div className="flex items-center justify-between">
        <button
          onClick={fetchAnalytics}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-dark-200"
        >
          <ArrowPathIcon className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh analytics
        </button>
        <p className="text-xs text-gray-400 dark:text-dark-400">
          Scheduler runs every 10 min · Max 30 days · 7 stages
        </p>
      </div>
    </div>
  );
}
