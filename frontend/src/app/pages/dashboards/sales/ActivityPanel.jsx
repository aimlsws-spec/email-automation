import { useEffect, useState } from "react";
import { Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import {
  CursorArrowRaysIcon,
  NoSymbolIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const PAGE_SIZE = 10;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizeEmail(raw) {
  if (!raw) return raw;
  let s = raw;
  try { s = decodeURIComponent(s); } catch (e) { void e; }
  try { s = decodeURIComponent(s); } catch (e) { void e; }
  return s;
}

function getReadableLinkName(url) {
  if (!url) return "";
  try {
    const { pathname, hostname } = new URL(url);
    const segments = pathname.split("/").filter(Boolean);
    const slug = segments.length > 0 ? segments[segments.length - 1] : hostname;
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } catch {
    return url;
  }
}

function formatTs(ts) {
  if (!ts) return null;
  const d = new Date(ts);
  if (isNaN(d)) return null;
  return {
    date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
  };
}

function LeadCell({ email, campaign, accent }) {
  return (
    <div className="flex flex-col">
      <span
        className="text-sm font-medium text-gray-700 dark:text-dark-200 truncate max-w-[220px]"
        title={normalizeEmail(email)}
      >
        {normalizeEmail(email)}
      </span>
      {campaign && (
        <span className={`text-[11px] font-semibold uppercase tracking-wide ${accent}`}>
          {campaign}
        </span>
      )}
    </div>
  );
}

function TimeCell({ ts }) {
  if (!ts) return <span className="text-xs text-gray-400">—</span>;
  return (
    <div className="flex flex-col items-end">
      <span className="text-xs font-medium text-gray-600 dark:text-dark-200 tabular-nums">{ts.date}</span>
      <span className="text-[11px] text-gray-400 tabular-nums">{ts.time}</span>
    </div>
  );
}

function Pagination({ page, totalPages, onPrev, onNext }) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-auto flex items-center justify-between px-4 py-2.5 border-t border-gray-100 dark:border-dark-800">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-primary-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeftIcon className="size-3.5" /> Prev
      </button>
      <span className="text-xs text-gray-400">Page {page} of {totalPages}</span>
      <button
        onClick={onNext}
        disabled={page === totalPages}
        className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-primary-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Next <ChevronRightIcon className="size-3.5" />
      </button>
    </div>
  );
}

// ─── Main panel ──────────────────────────────────────────────────────────────

export function ActivityPanel() {
  const [tab, setTab] = useState("clicks"); // "clicks" | "unsubscribes"
  const [clicks, setClicks] = useState([]);
  const [unsubs, setUnsubs] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, uRes] = await Promise.all([
          fetch("/api/analytics/link-activity").then((r) => r.json()),
          fetch("/api/analytics/unsubscribes").then((r) => r.json()),
        ]);
        const sortByClicked = (arr) =>
          (arr || []).sort((a, b) => new Date(b.clicked_at) - new Date(a.clicked_at));
        if (cRes.success) setClicks(sortByClicked(cRes.data));
        if (uRes.success) setUnsubs(sortByClicked(uRes.data));
      } catch (err) {
        console.error("Failed to load activity:", err);
      }
    };
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  // Reset to first page when switching tabs
  const switchTab = (next) => {
    setTab(next);
    setPage(1);
  };

  const rows = tab === "clicks" ? clicks : unsubs;
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tabs = [
    { key: "clicks", label: "Link Clicks", count: clicks.length, Icon: CursorArrowRaysIcon, color: "text-primary-500" },
    { key: "unsubscribes", label: "Unsubscribes", count: unsubs.length, Icon: NoSymbolIcon, color: "text-red-500" },
  ];

  return (
    <Card className="flex flex-col border border-gray-100 dark:border-dark-700 overflow-hidden">
      {/* Tab bar */}
      <div className="flex border-b border-gray-100 dark:border-dark-800">
        {tabs.map(({ key, label, count, Icon, color }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => switchTab(key)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide transition-colors border-b-2 -mb-px ${
                active
                  ? "border-primary-500 text-gray-800 dark:text-dark-100"
                  : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-dark-200"
              }`}
            >
              <Icon className={`size-4 ${active ? color : ""}`} />
              {label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                  active
                    ? "bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
                    : "bg-gray-100 text-gray-400 dark:bg-dark-700"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="w-full text-left">
          <THead className="sticky top-0 z-10 bg-gray-50 dark:bg-dark-800 border-b border-gray-200 dark:border-dark-600">
            <Tr className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              <Th className="px-4 py-2.5">Lead / Campaign</Th>
              {tab === "clicks" && <Th className="px-4 py-2.5">URL</Th>}
              <Th className="px-4 py-2.5 text-right">
                {tab === "clicks" ? "Clicked At" : "Unsubscribed At"}
              </Th>
            </Tr>
          </THead>
          <TBody>
            {visible.map((item, i) => {
              const ts = formatTs(item.clicked_at);
              return (
                <Tr key={i} className="border-b border-gray-50 dark:border-dark-800 last:border-0">
                  <Td className="px-4 py-3">
                    <LeadCell
                      email={item.lead_email}
                      campaign={item.campaign_name}
                      accent={tab === "clicks" ? "text-primary-500/70" : "text-red-500/70"}
                    />
                  </Td>
                  {tab === "clicks" && (
                    <Td className="px-4 py-3">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={item.url}
                        className="text-sm text-primary-500 hover:underline truncate max-w-[180px] block"
                      >
                        {getReadableLinkName(item.url)}
                      </a>
                    </Td>
                  )}
                  <Td className="px-4 py-3 text-right">
                    <TimeCell ts={ts} />
                  </Td>
                </Tr>
              );
            })}
            {rows.length === 0 && (
              <Tr>
                <Td
                  colSpan={tab === "clicks" ? 3 : 2}
                  className="px-4 py-10 text-center text-xs text-gray-400 italic"
                >
                  {tab === "clicks" ? "No clicks tracked yet" : "No unsubscribes yet"}
                </Td>
              </Tr>
            )}
          </TBody>
        </Table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />
    </Card>
  );
}
