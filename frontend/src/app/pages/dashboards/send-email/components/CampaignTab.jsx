import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowUpTrayIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { Card, Button } from "components/ui";

// ----------------------------------------------------------------------

export function CampaignTab({
  campaignData,
  setCampaignData,
  pendingCount,
  uploadStatus,
  uploadResult,
  bulkStatus,
  bulkMessage,
  onUpload,
  onSend,
  globalStats,
}) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [fileBuffer, setFileBuffer] = useState(null);
  const [followUpEnabled, setFollowUpEnabled] = useState(true);

  const { name, subject, sendingMode, smtpSender } = campaignData;
  const set = (key) => (e) =>
    setCampaignData((prev) => ({ ...prev, [key]: e.target.value }));

  const DAILY_CAP = 300;
  const sentToday = globalStats?.daily_total_sent ?? 0;
  const dailyCapacity = globalStats?.daily_global_limit ?? DAILY_CAP;
  const remaining = Math.max(0, dailyCapacity - sentToday);
  const capReached = remaining <= 0 && sentToday > 0;
  const usagePct = dailyCapacity > 0 ? Math.min(100, Math.round((sentToday / dailyCapacity) * 100)) : 0;

  // Live subject preview — resolves {{name}} with a sample name
  const PREVIEW_NAME = 'Prena';
  function previewSubject(raw) {
    if (!raw) return '';
    let s = raw;
    if (/\{\{\s*name\s*\}\}/.test(s)) {
      s = s.replace(/\{\{\s*name\s*\}\}/g, PREVIEW_NAME);
    }
    return s.replace(/\{\{[^}]*\}\}/g, '').replace(/\s{2,}/g, ' ').trim();
  }
  const subjectPreview = previewSubject(subject);

  function handleFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setFileBuffer(null);
    const reader = new FileReader();
    reader.onload = (evt) => setFileBuffer(evt.target.result);
    reader.onerror = () => setFileBuffer(null);
    reader.readAsArrayBuffer(f);
  }

  const canUpload = file && fileBuffer && uploadStatus !== "loading" && name && subject;
  const canSend =
    pendingCount > 0 &&
    bulkStatus !== "loading" &&
    !capReached &&
    name &&
    subject &&
    (sendingMode !== "domain" || smtpSender);

  return (
    <div className="grid grid-cols-12 gap-5">
      {/* Main form */}
      <Card className="col-span-12 p-5 lg:col-span-8">
        <h3 className="mb-5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-dark-400">
          Campaign Setup
        </h3>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-800 dark:text-dark-100">
              Campaign Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={set("name")}
              placeholder="e.g. Q4 Outreach – Tech Leads"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-dark-500 dark:bg-dark-800 dark:text-dark-100"
            />
          </div>

          {/* Automated Follow-Up Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-dark-600 dark:bg-dark-800">
            <div className="flex items-center gap-2">
              <BoltIcon className="size-4 text-primary-500" />
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">Automated Follow-Ups</p>
                <p className="text-xs text-gray-400 dark:text-dark-400">7 stages over 30 days · stops on reply/unsubscribe</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFollowUpEnabled((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                followUpEnabled ? "bg-primary-600" : "bg-gray-300 dark:bg-dark-500"
              }`}
            >
              <span className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow transition duration-200 ${
                followUpEnabled ? "translate-x-5" : "translate-x-0"
              }`} />
            </button>
          </div>

          {followUpEnabled && (
            <div className="rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 dark:border-primary-800 dark:bg-primary-900/20">
              <p className="mb-2 text-xs font-semibold text-primary-700 dark:text-primary-400">Schedule Preview</p>
              <div className="flex flex-wrap gap-1.5">
                {[{day:1,t:"FU1"},{day:3,t:"FU2"},{day:7,t:"FU1"},{day:11,t:"FU2"},{day:15,t:"FU1"},{day:20,t:"FU2"},{day:25,t:"FU1"}].map(({day,t}) => (
                  <span key={day} className="rounded bg-primary-100 px-2 py-0.5 text-[10px] font-semibold text-primary-700 dark:bg-primary-800/40 dark:text-primary-300">
                    Day {day} · {t}
                  </span>
                ))}
                <span className="rounded bg-error-100 px-2 py-0.5 text-[10px] font-semibold text-error dark:bg-error-900/30">Day 30 · STOP</span>
              </div>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-800 dark:text-dark-100">
              Email Subject <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={set("subject")}
              placeholder="e.g. {{name}}, quick question about {{company}}"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-dark-500 dark:bg-dark-800 dark:text-dark-100"
            />
            <p className="mt-1 text-xs text-gray-400 dark:text-dark-400">
              {"Optional variables: "}
              <code className="rounded bg-gray-100 px-1 dark:bg-dark-700">{"{{name}}"}</code>
              {" — replaced with lead's first name, or removed gracefully if missing."}
            </p>
            {subject && /\{\{\s*name\s*\}\}/.test(subject) && (
              <p className="mt-1.5 text-xs text-gray-500 dark:text-dark-400">
                Preview:{" "}
                <span className="font-medium text-gray-700 dark:text-dark-200">
                  &ldquo;{subjectPreview}&rdquo;
                </span>
              </p>
            )}
          </div>

          <div>
            <h4 className="mb-1.5 text-sm font-medium text-gray-800 dark:text-dark-100">
              Import Leads (CSV / Excel)
            </h4>
            <p className="mb-3 text-xs text-gray-400 dark:text-dark-300">
              Required columns:{" "}
              <code className="rounded bg-gray-100 px-1 dark:bg-dark-700">email</code>,{" "}
              <code className="rounded bg-gray-100 px-1 dark:bg-dark-700">name</code>,{" "}
              <code className="rounded bg-gray-100 px-1 dark:bg-dark-700">company</code>
            </p>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-8 transition-colors hover:border-primary-400 hover:bg-primary-50 dark:border-dark-500 dark:bg-dark-800 dark:hover:border-primary-500"
            >
              <DocumentTextIcon className="size-10 text-gray-400 dark:text-dark-400" />
              {file ? (
                <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                  {file.name}
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-dark-300">
                  Click to select a CSV or Excel file
                </p>
              )}
              <p className="text-xs text-gray-400 dark:text-dark-400">
                .csv, .xlsx, .xls — max 5 MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {uploadResult && (
              <div
                className={`mt-3 rounded-lg p-3 text-sm ${
                  uploadStatus === "success"
                    ? "bg-success-50 text-success dark:bg-success-900/20"
                    : "bg-error-50 text-error dark:bg-error-900/20"
                }`}
              >
                {uploadResult.message}
                {uploadStatus === "success" && (
                  <div className="mt-1 flex gap-4 text-xs opacity-80">
                    <span>Total: {uploadResult.total}</span>
                    <span>Valid: {uploadResult.valid}</span>
                    <span>Inserted: {uploadResult.inserted}</span>
                    <span>Skipped: {uploadResult.skipped}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            color="primary"
            variant="outlined"
            disabled={!canUpload}
            className="gap-2"
            onClick={() => onUpload(file, fileBuffer)}
          >
            <ArrowUpTrayIcon className="size-4" />
            {uploadStatus === "loading" ? "Uploading..." : "Upload Sheet"}
          </Button>

          <Button
            color="primary"
            disabled={!canSend}
            className="gap-2"
            onClick={onSend}
          >
            <PaperAirplaneIcon className="size-4" />
            {bulkStatus === "loading"
              ? "Sending..."
              : pendingCount > 0
              ? `Start Campaign (${pendingCount} leads)`
              : "No Pending Leads"}
          </Button>

          <Button
            variant="flat"
            onClick={() => navigate("/dashboards/email-analytics")}
          >
            Back to Dashboard
          </Button>
        </div>

        {bulkMessage && (
          <p
            className={`mt-3 text-sm font-medium ${
              bulkStatus === "success" ? "text-success" : "text-error"
            }`}
          >
            {bulkMessage}
          </p>
        )}
      </Card>

      {/* Summary sidebar */}
      <Card className="col-span-12 p-5 lg:col-span-4">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-dark-400">
          Campaign Summary
        </h3>

        {/* Daily quota stats */}
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-dark-600 dark:bg-dark-800">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-dark-400">
            Daily Quota
          </p>
          <div className="mb-2 flex items-end justify-between">
            <span className="text-lg font-black text-gray-800 dark:text-dark-100">
              {sentToday}
              <span className="text-sm font-normal text-gray-400"> / {dailyCapacity}</span>
            </span>
            <span className={`text-xs font-semibold ${capReached ? "text-error" : "text-success"}`}>
              {capReached ? "Limit reached" : `${remaining} remaining`}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-dark-600">
            <div
              className={`h-full rounded-full transition-all ${capReached ? "bg-error" : usagePct > 80 ? "bg-warning" : "bg-success"}`}
              style={{ width: `${usagePct}%` }}
            />
          </div>
          <div className="mt-1.5 flex gap-3 text-[10px] text-gray-400">
            <span>Randomized delay active</span>
            <span>·</span>
            <span>Batch sending active</span>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Pending Leads</span>
            <span
              className={`font-semibold ${
                pendingCount > 0 ? "text-primary-600" : "text-gray-400"
              }`}
            >
              {pendingCount}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="shrink-0 text-gray-500">Campaign</span>
            <span
              className="truncate font-medium text-gray-700 dark:text-dark-200"
              title={name}
            >
              {name || "—"}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="shrink-0 text-gray-500">Subject</span>
            <span
              className="truncate font-medium text-gray-700 dark:text-dark-200"
              title={subject}
            >
              {subject || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Mode</span>
            <span className="font-medium capitalize text-gray-700 dark:text-dark-200">
              {sendingMode}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="shrink-0 text-gray-500">Sender</span>
            {sendingMode === "domain" ? (
              smtpSender ? (
                <span className="truncate font-medium text-success" title={smtpSender}>
                  {smtpSender}
                </span>
              ) : (
                <span className="font-medium text-error">Not selected — go to Sender tab</span>
              )
            ) : (
              <span className="font-medium text-gray-700 dark:text-dark-200">Auto rotation</span>
            )}
          </div>
        </div>

        <div className="mt-5">
          {capReached ? (
            <p className="rounded-lg bg-error-50 px-3 py-2.5 text-xs font-semibold text-error dark:bg-error-900/20">
              ⚠️ Daily limit of {dailyCapacity} reached. Sending paused until midnight reset.
            </p>
          ) : !name || !subject ? (
            <p className="rounded-lg bg-warning-50 px-3 py-2.5 text-xs text-warning-700 dark:bg-warning-900/20 dark:text-warning-400">
              Fill in Campaign Name and Subject to enable sending.
            </p>
          ) : sendingMode === "domain" && !smtpSender ? (
            <p className="rounded-lg bg-error-50 px-3 py-2.5 text-xs text-error dark:bg-error-900/20">
              Go to the <strong>Sender</strong> tab and select a domain SMTP account.
            </p>
          ) : pendingCount === 0 ? (
            <p className="rounded-lg bg-gray-50 px-3 py-2.5 text-xs text-gray-500 dark:bg-dark-800 dark:text-dark-400">
              Upload a leads sheet first, then click Start Campaign.
            </p>
          ) : (
            <p className="rounded-lg bg-success-50 px-3 py-2.5 text-xs text-success dark:bg-success-900/20">
              ✓ Ready — {pendingCount} lead{pendingCount !== 1 ? "s" : ""} via {sendingMode === "domain" ? smtpSender : "Gmail rotation"}.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
