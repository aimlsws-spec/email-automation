import { useEffect, useState } from "react";
import { Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { CursorArrowRaysIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const PAGE_SIZE = 10;

function normalizeEmail(raw) {
  if (!raw) return raw;
  let s = raw;
  try { s = decodeURIComponent(s); } catch (e) { void e; }
  try { s = decodeURIComponent(s); } catch (e) { void e; }
  return s;
}

function getReadableLinkName(url) {
  if (!url) return '';
  try {
    const { pathname, hostname } = new URL(url);
    const segments = pathname.split('/').filter(Boolean);
    const slug = segments.length > 0 ? segments[segments.length - 1] : hostname;
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  } catch {
    return url;
  }
}

function formatClickedAt(ts) {
  if (!ts) return null;
  const d = new Date(ts);
  if (isNaN(d)) return null;
  return {
    date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
  };
}

export function LinkActivity() {
  const [activity, setActivity] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/analytics/link-activity");
        const json = await res.json();
        if (json.success) {
          const sorted = (json.data || []).sort(
            (a, b) => new Date(b.clicked_at) - new Date(a.clicked_at)
          );
          setActivity(sorted);
          setPage(1);
        }
      } catch (err) {
        console.error("Failed to load link activity:", err);
      }
    };
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const totalPages = Math.max(1, Math.ceil(activity.length / PAGE_SIZE));
  const visible = activity.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Card className="flex flex-col border border-gray-100 dark:border-dark-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-dark-800">
        <CursorArrowRaysIcon className="size-4 text-primary-500" />
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-dark-100">
          Link Activity
        </h2>
        <span className="ml-auto text-xs font-semibold text-gray-400">
          {activity.length} total
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="w-full text-left">
          <THead className="sticky top-0 z-10 bg-gray-50 dark:bg-dark-800 border-b border-gray-200 dark:border-dark-600">
            <Tr className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              <Th className="px-4 py-2.5">Lead / Campaign</Th>
              <Th className="px-4 py-2.5">URL</Th>
              <Th className="px-4 py-2.5 text-right">Clicked At</Th>
            </Tr>
          </THead>
          <TBody>
            {visible.map((item, i) => {
              const ts = formatClickedAt(item.clicked_at);
              return (
                <Tr key={i} className="border-b border-gray-50 dark:border-dark-800 last:border-0">
                  <Td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700 dark:text-dark-200 truncate max-w-[160px]" title={normalizeEmail(item.lead_email)}>
                        {normalizeEmail(item.lead_email)}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-primary-500/70">
                        {item.campaign_name || "N/A"}
                      </span>
                    </div>
                  </Td>
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
                  <Td className="px-4 py-3 text-right">
                    {ts ? (
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-medium text-gray-600 dark:text-dark-200 tabular-nums">{ts.date}</span>
                        <span className="text-[11px] text-gray-400 tabular-nums">{ts.time}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">N/A</span>
                    )}
                  </Td>
                </Tr>
              );
            })}
            {activity.length === 0 && (
              <Tr>
                <Td colSpan={3} className="px-4 py-8 text-center text-xs text-gray-400 italic">
                  No clicks tracked yet
                </Td>
              </Tr>
            )}
          </TBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 dark:border-dark-800">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-primary-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeftIcon className="size-3.5" /> Prev
          </button>
          <span className="text-xs text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-primary-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next <ChevronRightIcon className="size-3.5" />
          </button>
        </div>
      )}
    </Card>
  );
}
