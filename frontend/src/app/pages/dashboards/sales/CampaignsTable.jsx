import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, Table, THead, TBody, Th, Tr, Td } from "components/ui";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteCampaign } from "services/api";

const PAGE_SIZE = 10;

function ConfirmModal({ campaignName, isRunning, onConfirm, onCancel }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
      onCancel();
    } catch (err) {
      console.error('Confirm action failed:', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-80 max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-dark-600 dark:bg-dark-800">
        <h3 className="text-sm font-bold text-gray-800 dark:text-dark-100">
          {isRunning ? 'Stop & Delete Campaign' : 'Delete Campaign'}
        </h3>
        <p className="mt-2 text-xs text-gray-600 dark:text-dark-300">
          {isRunning && (
            <span className="mb-2 block rounded-lg bg-warning-50 px-3 py-2 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400">
              ⚠ This campaign is currently running. Execution will be stopped immediately.
            </span>
          )}
          Permanently delete <span className="font-semibold text-gray-800 dark:text-dark-100">&ldquo;{campaignName}&rdquo;</span>?
          This will also remove all leads and queued emails for this campaign.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-dark-600 dark:text-dark-300 dark:hover:bg-dark-700"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="rounded-lg bg-error px-3 py-1.5 text-xs font-semibold text-white hover:bg-error/90 disabled:opacity-50"
          >
            {isProcessing ? (isRunning ? 'Stopping...' : 'Deleting...') : (isRunning ? 'Stop & Delete' : 'Delete')}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CampaignsTable() {
  const [campaigns, setCampaigns] = useState([]);
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState(null); // { id, name }
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/campaigns/status");
        if (!res.ok) return;
        const data = await res.json().catch(() => null);
        if (data?.success) {
          setCampaigns(data.campaigns);
          setPage(1);
        }
      } catch (err) {
        console.error("Failed to load campaigns:", err);
      }
    };
    load();
    const intervalId = setInterval(load, 5000);
    window.addEventListener("dashboard_refresh", load);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("dashboard_refresh", load);
    };
  }, []);

  const getStatusColor = (c) => {
    const failedRatio = c.total > 0 ? (c.failed / c.total) : 0;
    if (failedRatio > 0.3) return 'text-error bg-error-100 dark:bg-error-900/30 border border-error/20';
    switch (c.status?.toUpperCase()) {
      case 'RUNNING':   return 'text-primary-600 bg-primary-100 dark:bg-primary-900/30';
      case 'COMPLETED': return 'text-success bg-success-100 dark:bg-success-900/30';
      case 'PAUSED':    return 'text-warning-600 bg-warning-100 dark:bg-warning-900/30';
      default:          return 'text-gray-600 bg-gray-100 dark:bg-dark-700';
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 0)    return 'bg-gray-200 dark:bg-dark-600';
    if (progress <= 50)    return 'bg-primary-500';
    if (progress < 100)    return 'bg-warning-500';
    return 'bg-success';
  };

  async function handleDeleteConfirmed() {
    if (!confirm) return;
    const { id } = confirm;
    setConfirm(null);
    try {
      const result = await deleteCampaign(id);
      console.log('Delete campaign result:', result);
      if (result?.success) {
        setCampaigns(prev => prev.filter(c => c.id !== id));
        window.dispatchEvent(new Event('dashboard_refresh'));
      } else {
        console.error('Delete failed:', result);
        alert(`Failed to delete campaign: ${result?.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Failed to delete campaign:", err);
      alert(`Failed to delete campaign: ${err.message}`);
    }
  }

  const totalPages = Math.max(1, Math.ceil(campaigns.length / PAGE_SIZE));
  const visible = campaigns.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      {confirm && (
        <ConfirmModal
          campaignName={confirm.name}
          isRunning={confirm.isRunning}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-dark-100">
          Campaign Tracking
        </h2>
        <span className="text-xs text-gray-400">{campaigns.length} campaigns</span>
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full text-left">
            <THead className="bg-gray-50 dark:bg-dark-800 border-b border-gray-200 dark:border-dark-600">
              <Tr className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                <Th className="px-4 py-2.5">Campaign Name</Th>
                <Th className="px-4 py-2.5 text-center">Status</Th>
                <Th className="px-4 py-2.5 text-center">Total</Th>
                <Th className="px-4 py-2.5 text-center">Sent</Th>
                <Th className="px-4 py-2.5 text-center">Pending</Th>
                <Th className="px-4 py-2.5 text-center">Failed</Th>
                <Th className="px-4 py-2.5 text-center">Progress</Th>
                <Th className="px-4 py-2.5 text-center">Ratio</Th>
                <Th className="px-4 py-2.5">Active Sender</Th>
                <Th className="px-4 py-2.5">Created</Th>
                <Th className="px-4 py-2.5 text-center">Actions</Th>
              </Tr>
            </THead>
            <TBody>
              {visible.map((c) => {
                const total    = c.total    || 0;
                const sent     = c.sent     || 0;
                const failed   = c.failed   || 0;
                const pending  = c.pending  || 0;
                const progress = c.progress !== undefined
                  ? c.progress
                  : (total > 0 ? Math.round((sent / total) * 100) : 0);

                return (
                  <Tr
                    key={c.id}
                    className="border-b border-gray-100 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-800/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/dashboards/email-analytics/campaign/${c.id}`)}
                  >
                    <Td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-dark-200 group-hover:text-primary-600 transition-colors">
                      {c.name}
                    </Td>
                    <Td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase ${getStatusColor(c)}`}>
                        {total > 0 && (failed / total) > 0.3 ? 'FAILED-HEAVY' : (c.status || 'Unknown')}
                      </span>
                    </Td>
                    <Td className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-dark-200 tabular-nums">
                      {total === 0 ? <span className="text-gray-400 font-normal">No Leads</span> : total}
                    </Td>
                    <Td className="px-4 py-3 text-center text-sm font-semibold text-success tabular-nums">{sent}</Td>
                    <Td className="px-4 py-3 text-center text-sm font-semibold text-warning-600 tabular-nums">{pending}</Td>
                    <Td className="px-4 py-3 text-center text-sm font-semibold text-error tabular-nums">{failed}</Td>
                    <Td className="px-4 py-3 text-center min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="h-2 grow overflow-hidden rounded-full bg-gray-100 dark:bg-dark-700">
                          <div
                            className={`h-full transition-all duration-500 ${getProgressColor(progress)}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold min-w-[28px] text-gray-600 dark:text-dark-300 tabular-nums">
                          {progress}%
                        </span>
                      </div>
                    </Td>
                    <Td className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-dark-300 tabular-nums">
                      {sent} / {total}
                    </Td>
                    <Td className="px-4 py-3 text-sm text-gray-500 dark:text-dark-300 truncate max-w-[150px]" title={c.active_sender}>
                      {c.active_sender || 'Auto Rotation'}
                    </Td>
                    <Td className="px-4 py-3 text-xs text-gray-400 tabular-nums">
                      {new Date(c.created_at).toLocaleDateString()}
                    </Td>
                    <Td className="px-4 py-3 text-center" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setConfirm({ id: c.id, name: c.name, isRunning: c.status === 'RUNNING' })}
                        title="Delete campaign"
                        className="inline-flex items-center justify-center rounded-lg p-1.5 text-gray-400 hover:bg-error-50 hover:text-error dark:hover:bg-error-900/20 transition-colors"
                      >
                        <TrashIcon className="size-3.5" />
                      </button>
                    </Td>
                  </Tr>
                );
              })}
              {campaigns.length === 0 && (
                <Tr>
                  <Td colSpan={11} className="px-4 py-10 text-center text-xs text-gray-400 italic">
                    No campaigns yet
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
              Page {page} of {totalPages} · {campaigns.length} campaigns
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
    </div>
  );
}
