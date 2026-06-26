import { useEffect, useState, useCallback, useRef } from "react";
import { Page } from "components/shared/Page";
import { Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import {
  UserGroupIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  EyeIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

// ─── Constants ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;
const STATUSES = ["New", "Contacted", "Converted", "Closed"];

const STATUS_STYLES = {
  New:        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Contacted:  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Converted:  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Closed:     "bg-gray-100 text-gray-500 dark:bg-dark-700 dark:text-gray-400",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  if (isNaN(d)) return "—";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${STATUS_STYLES[status] ?? STATUS_STYLES.New}`}>
      {status}
    </span>
  );
}

// ─── Stats row ───────────────────────────────────────────────────────────────

function StatsRow({ stats }) {
  const getCount = (name) =>
    Number(stats.byStatus?.find((s) => s.lead_status === name)?.count ?? 0);

  const cards = [
    { label: "Total Leads",  value: stats.total ?? 0,        color: "text-primary-600" },
    { label: "New",          value: getCount("New"),          color: "text-blue-600" },
    { label: "Converted",    value: getCount("Converted"),    color: "text-green-600" },
    { label: "Closed",       value: getCount("Closed"),       color: "text-gray-500" },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map(({ label, value, color }) => (
        <Card key={label} className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
          <p className={`mt-1 text-2xl font-black tabular-nums ${color}`}>{value}</p>
        </Card>
      ))}
    </div>
  );
}

// ─── Reply modal ─────────────────────────────────────────────────────────────

function ReplyModal({ lead, onClose, onStatusChange, updatingId }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-dark-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-start gap-3 px-5 py-4 border-b border-gray-100 dark:border-dark-700 shrink-0">
          <UserGroupIcon className="size-5 text-primary-500 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-dark-100 break-all">
              {lead.sender_email}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {lead.campaign_name || "Unknown Campaign"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors shrink-0"
          >
            <XMarkIcon className="size-4" />
          </button>
        </div>

        {/* Modal body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {[
              { label: "Subject",    value: lead.subject },
              { label: "Reply Date", value: formatDate(lead.reply_date) },
              { label: "Mailbox",    value: lead.mailbox },
              { label: "Status",     value: <StatusBadge status={lead.lead_status} /> },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
                <div className="mt-0.5 text-xs text-gray-700 dark:text-dark-200">{value || "—"}</div>
              </div>
            ))}
          </div>

          {/* Reply snippet */}
          {lead.reply_message ? (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Reply Message
              </p>
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-3 text-xs text-gray-700 dark:text-dark-200 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {lead.reply_message}
              </div>
            </div>
          ) : (
            <div className="text-[10px] text-gray-400 italic">No reply snippet captured.</div>
          )}

          {/* Status update buttons */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Update Status
            </p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={updatingId === lead.id}
                  onClick={() => onStatusChange(lead.id, s)}
                  className={`px-3 py-1 text-[10px] font-semibold rounded-full transition-colors ${
                    lead.lead_status === s
                      ? STATUS_STYLES[s]
                      : "bg-gray-100 text-gray-500 dark:bg-dark-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-600"
                  } disabled:opacity-50`}
                >
                  {lead.lead_status === s && <CheckCircleIcon className="inline size-3 mr-1" />}
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LeadsPage() {
  const [leads,        setLeads]        = useState([]);
  const [stats,        setStats]        = useState({ total: 0, byStatus: [], byCampaign: [] });
  const [campaigns,    setCampaigns]    = useState([]);
  const [page,         setPage]         = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [exporting,    setExporting]    = useState(false);
  const [search,       setSearch]       = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [updatingId,   setUpdatingId]   = useState(null);

  const searchTimeout = useRef(null);

  // Load stats
  const loadStats = useCallback(() => {
    fetch("/api/reply-leads/stats")
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d); })
      .catch(() => {});
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  // Load campaigns for filter dropdown
  useEffect(() => {
    fetch("/api/campaigns")
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d) ? d : d?.campaigns ?? [];
        setCampaigns(list);
      })
      .catch(() => {});
  }, []);

  // Load leads
  const loadLeads = useCallback(async (currentPage, currentSearch, currentCampaign, currentStatus, { silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", currentPage);
      params.set("limit", PAGE_SIZE);
      if (currentSearch)   params.set("search",   currentSearch);
      if (currentCampaign) params.set("campaign",  currentCampaign);
      if (currentStatus)   params.set("status",    currentStatus);

      const res  = await fetch(`/api/reply-leads?${params}`);
      const data = await res.json();
      if (data.success) {
        setLeads(data.rows ?? []);
        setTotalPages(data.totalPages ?? 1);
        setTotal(data.total ?? 0);
      }
    } catch (err) {
      console.error("Failed to load leads:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Reload when filters/page change
  useEffect(() => {
    loadLeads(page, debouncedSearch, campaignFilter, statusFilter);
  }, [page, debouncedSearch, campaignFilter, statusFilter, loadLeads]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      loadStats();
      loadLeads(page, debouncedSearch, campaignFilter, statusFilter, { silent: true });
    }, 5000);
    return () => clearInterval(intervalId);
  }, [page, debouncedSearch, campaignFilter, statusFilter, loadStats, loadLeads]);

  // Debounced search
  const handleSearchChange = (value) => {
    setSearch(value);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
      loadLeads(1, value, campaignFilter, statusFilter);
    }, 350);
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setCampaignFilter("");
    setStatusFilter("");
    setPage(1);
  };

  const hasFilters = search || campaignFilter || statusFilter;

  // Export
  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (search)         params.set("search",   search);
      if (campaignFilter) params.set("campaign",  campaignFilter);
      if (statusFilter)   params.set("status",    statusFilter);

      const res  = await fetch(`/api/reply-leads/export?${params}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  // Status update
  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await fetch(`/api/reply-leads/${id}/status`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status }),
      });
      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, lead_status: status } : l))
      );
      if (selectedLead?.id === id) {
        setSelectedLead((prev) => ({ ...prev, lead_status: status }));
      }
      loadStats();
    } finally {
      setUpdatingId(null);
    }
  };

  // Pagination page numbers
  const pageNumbers = (() => {
    const max  = Math.min(5, totalPages);
    const start = Math.max(1, Math.min(page - 2, totalPages - max + 1));
    return Array.from({ length: max }, (_, i) => start + i);
  })();

  return (
    <Page title="Leads">
      <div className="transition-content overflow-hidden px-(--margin-x) pb-8">
        {/* Stats row */}
        <StatsRow stats={stats} />

        {/* Main table card */}
        <div className="mt-6">
          <Card className="flex flex-col border border-gray-100 dark:border-dark-700 overflow-hidden">
            {/* Tier 1 — identity + primary action */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-dark-800">
              <UserGroupIcon className="size-4 text-primary-500 shrink-0" />
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-dark-100">
                Reply Leads
              </h2>
              <span className="text-xs text-gray-400">· {total} total</span>

              <div className="ml-auto flex items-center gap-2">
                {/* Refresh */}
                <button
                  onClick={() => { loadStats(); loadLeads(page, search, campaignFilter, statusFilter); }}
                  title="Refresh"
                  className="flex items-center justify-center size-9 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  <ArrowPathIcon className="size-4" />
                </button>

                {/* Export */}
                <button
                  onClick={handleExport}
                  disabled={exporting || total === 0}
                  className="flex items-center gap-1.5 h-9 px-3 text-xs font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  <ArrowDownTrayIcon className="size-3.5" />
                  {exporting ? "Exporting…" : "Export CSV"}
                </button>
              </div>
            </div>

            {/* Tier 2 — filter toolbar */}
            <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-dark-800/50 border-b border-gray-100 dark:border-dark-800">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search email, subject…"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="h-9 pl-9 pr-3 text-xs border border-gray-200 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-800 dark:text-dark-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-400 w-52"
                />
              </div>

              {/* Status filter */}
              <select
                value={statusFilter}
                onChange={handleFilterChange(setStatusFilter)}
                className="h-9 px-2 text-xs border border-gray-200 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-800 dark:text-dark-100 focus:outline-none focus:ring-1 focus:ring-primary-400"
              >
                <option value="">All Status</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>

              {/* Campaign filter */}
              {campaigns.length > 0 && (
                <select
                  value={campaignFilter}
                  onChange={handleFilterChange(setCampaignFilter)}
                  className="h-9 px-2 text-xs border border-gray-200 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-800 dark:text-dark-100 focus:outline-none focus:ring-1 focus:ring-primary-400 max-w-[160px]"
                >
                  <option value="">All Campaigns</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}

              {/* Clear filters */}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  title="Clear filters"
                  className="flex items-center gap-1 h-9 px-2.5 text-xs font-medium rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <XMarkIcon className="size-4" />
                  Clear
                </button>
              )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table className="w-full text-left">
                <THead className="sticky top-0 z-10 bg-gray-50 dark:bg-dark-800 border-b border-gray-200 dark:border-dark-600">
                  <Tr className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    <Th className="px-4 py-2.5 w-8">#</Th>
                    <Th className="px-4 py-2.5">Sender Email</Th>
                    <Th className="px-4 py-2.5">Campaign</Th>
                    <Th className="px-4 py-2.5">Subject</Th>
                    <Th className="px-4 py-2.5">Reply Date</Th>
                    <Th className="px-4 py-2.5">Mailbox</Th>
                    <Th className="px-4 py-2.5">Status</Th>
                    <Th className="px-4 py-2.5 text-right">View</Th>
                  </Tr>
                </THead>
                <TBody>
                  {loading ? (
                    <Tr>
                      <Td colSpan={8} className="px-4 py-10 text-center text-xs text-gray-400">
                        Loading leads…
                      </Td>
                    </Tr>
                  ) : leads.length === 0 ? (
                    <Tr>
                      <Td colSpan={8} className="px-4 py-14 text-center">
                        <UserGroupIcon className="size-8 text-gray-200 dark:text-dark-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-400">No leads found</p>
                        <p className="text-[10px] text-gray-300 dark:text-dark-500 mt-1">
                          Leads are created automatically when recipients reply to campaigns
                        </p>
                      </Td>
                    </Tr>
                  ) : (
                    leads.map((lead, i) => (
                      <Tr
                        key={lead.id}
                        className="border-b border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-800/60 cursor-pointer transition-colors"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <Td className="px-4 py-3 text-xs text-gray-400 tabular-nums">
                          {(page - 1) * PAGE_SIZE + i + 1}
                        </Td>
                        <Td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-dark-100 max-w-[180px] truncate">
                          {lead.sender_email}
                        </Td>
                        <Td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 max-w-[140px] truncate">
                          {lead.campaign_name || "—"}
                        </Td>
                        <Td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                          {lead.subject || "—"}
                        </Td>
                        <Td className="px-4 py-3 text-xs text-gray-500 tabular-nums whitespace-nowrap">
                          {formatDate(lead.reply_date)}
                        </Td>
                        <Td className="px-4 py-3 text-xs text-gray-500 max-w-[130px] truncate">
                          {lead.mailbox || "—"}
                        </Td>
                        <Td className="px-4 py-3">
                          <StatusBadge status={lead.lead_status ?? "New"} />
                        </Td>
                        <Td className="px-4 py-3 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }}
                            title="View reply"
                            className="p-1 rounded text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                          >
                            <EyeIcon className="size-4" />
                          </button>
                        </Td>
                      </Tr>
                    ))
                  )}
                </TBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-dark-800">
                <span className="text-[10px] text-gray-400">
                  Page {page} of {totalPages} · {total} leads
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="p-1 rounded disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                  >
                    <ChevronLeftIcon className="size-4 text-gray-500" />
                  </button>
                  {pageNumbers.map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-6 h-6 text-[10px] font-medium rounded transition-colors ${
                        n === page
                          ? "bg-primary-600 text-white"
                          : "hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="p-1 rounded disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                  >
                    <ChevronRightIcon className="size-4 text-gray-500" />
                  </button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Per-campaign breakdown */}
        {stats.byCampaign?.length > 0 && (
          <div className="mt-6">
            <Card className="p-4 border border-gray-100 dark:border-dark-700">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-4">
                Leads by Campaign
              </h3>
              <div className="grid grid-cols-1 gap-x-8 gap-y-3 lg:grid-cols-2">
                {[...stats.byCampaign]
                  .sort((a, b) => b.count - a.count)
                  .map((c) => {
                    const maxCount = Math.max(
                      ...stats.byCampaign.map((x) => x.count),
                      1,
                    );
                    const pct = Math.round((c.count / maxCount) * 100);
                    return (
                      <div
                        key={c.campaign_name}
                        className="flex items-center gap-3"
                      >
                        <span
                          className="w-44 shrink-0 truncate text-sm text-gray-700 dark:text-dark-200"
                          title={c.campaign_name}
                        >
                          {c.campaign_name || "Unknown"}
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-dark-700">
                          <div
                            className="h-full rounded-full bg-primary-500 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-6 shrink-0 text-right text-xs font-semibold tabular-nums text-gray-500">
                          {c.count}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Reply detail modal */}
      {selectedLead && (
        <ReplyModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={handleStatusChange}
          updatingId={updatingId}
        />
      )}
    </Page>
  );
}
