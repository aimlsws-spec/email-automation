import { useEffect, useState } from "react";
import { Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { CursorArrowRaysIcon } from "@heroicons/react/24/outline";

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

// Returns { date: "04 May 2026", time: "02:42 PM" } or null for invalid/missing
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

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/analytics/link-activity");
        const json = await res.json();
        if (json.success) {
          // Sort by raw timestamp descending (not formatted string)
          const sorted = (json.data || []).sort(
            (a, b) => new Date(b.clicked_at) - new Date(a.clicked_at)
          );
          setActivity(sorted);
        }
      } catch (err) {
        console.error("Failed to load link activity:", err);
      }
    };
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="flex flex-col h-full border border-gray-100 dark:border-dark-700 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-dark-800">
        <CursorArrowRaysIcon className="size-4 text-primary-500" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-800 dark:text-dark-100">
          Link Activity
        </h2>
      </div>

      <div className="overflow-y-auto grow">
        <Table className="w-full text-left">
          <THead className="sticky top-0 bg-gray-50 dark:bg-dark-800 z-10">
            <Tr className="text-[10px] font-black uppercase text-gray-400">
              <Th className="px-4 py-2">Lead / Campaign</Th>
              <Th className="px-4 py-2">URL</Th>
              <Th className="px-4 py-2 text-right">Clicked At</Th>
            </Tr>
          </THead>
          <TBody>
            {activity.map((item, i) => {
              const ts = formatClickedAt(item.clicked_at);
              return (
                <Tr key={i} className="border-b border-gray-50 dark:border-dark-800 last:border-0">
                  <Td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-gray-700 dark:text-dark-200 truncate max-w-[120px]" title={item.lead_email}>
                        {item.lead_email}
                      </span>
                      <span className="text-[9px] font-black uppercase text-primary-500/70">
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
                      className="text-[11px] text-primary-500 hover:underline truncate max-w-[150px] block"
                    >
                      {getReadableLinkName(item.url)}
                    </a>
                  </Td>
                  <Td className="px-4 py-3 text-right">
                    {ts ? (
                      <div className="flex flex-col items-end">
                        <span className="text-[11px] font-medium text-gray-600 dark:text-dark-200">{ts.date}</span>
                        <span className="text-[10px] text-gray-400">{ts.time}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-400">N/A</span>
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
    </Card>
  );
}
