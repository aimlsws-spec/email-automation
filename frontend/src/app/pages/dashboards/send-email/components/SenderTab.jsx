import { useState } from "react";
import { CheckCircleIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { Card, Button } from "components/ui";

// ----------------------------------------------------------------------

export function SenderTab({
  senders,
  senderStats,
  globalStats,
  loadingStats,
  campaignData,
  setCampaignData,
  onRefresh,
}) {
  const { sendingMode, smtpSender } = campaignData;
  const setSendingMode = (val) =>
    setCampaignData((prev) => ({ ...prev, sendingMode: val }));
  const setSmtpSender = (val) =>
    setCampaignData((prev) => ({ ...prev, smtpSender: val }));

  const [smtpFormOpen, setSmtpFormOpen] = useState(false);
  const [smtpForm, setSmtpForm] = useState({
    email: "",
    smtp_host: "",
    smtp_port: "465",
    smtp_user: "",
    smtp_pass: "",
  });
  const [smtpFormStatus, setSmtpFormStatus] = useState(null);
  const [smtpFormMsg, setSmtpFormMsg] = useState("");

  const smtpSenders = senders.filter((s) => s.type === "smtp");
  const gmailSenders = senderStats.filter((s) => s.type === "gmail" || !s.type);

  // In domain mode show only SMTP/domain accounts; in gmail mode show only Gmail accounts
  const visibleStats = sendingMode === "domain"
    ? senderStats.filter((s) => s.type === "smtp")
    : senderStats.filter((s) => s.type === "gmail" || !s.type);

  const getBarColor = (pct) =>
    pct < 60 ? "bg-success" : pct < 85 ? "bg-warning" : "bg-error";

  function handleAddAccount() {
    if (sendingMode === "domain") {
      setSmtpForm({ email: "", smtp_host: "", smtp_port: "465", smtp_user: "", smtp_pass: "" });
      setSmtpFormStatus(null);
      setSmtpFormMsg("");
      setSmtpFormOpen(true);
    } else {
      const email = prompt("Enter the Gmail address to connect:");
      if (email?.includes("@")) {
        window.open(
          `${import.meta.env.VITE_API_BASE_URL}/auth/google/connect/${email}`,
          "_blank"
        );
      }
    }
  }

  async function handleSmtpFormSubmit(e) {
    e.preventDefault();
    const { email, smtp_host, smtp_port, smtp_user, smtp_pass } = smtpForm;
    if (!email || !smtp_host || !smtp_user || !smtp_pass) {
      setSmtpFormStatus("error");
      setSmtpFormMsg("All fields are required.");
      return;
    }
    setSmtpFormStatus("loading");
    setSmtpFormMsg("");
    try {
      const res = await fetch("/api/senders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "smtp", smtp_host, smtp_port, smtp_user, smtp_pass }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to add account");
      setSmtpFormStatus("success");
      setSmtpFormMsg("SMTP account added successfully!");
      await onRefresh();
      setTimeout(() => setSmtpFormOpen(false), 1200);
    } catch (err) {
      setSmtpFormStatus("error");
      setSmtpFormMsg(err.message);
    }
  }

  return (
    <>
      <div className="grid grid-cols-12 gap-5">
        {/* Mode selector */}
        <Card className="col-span-12 p-5 md:col-span-4">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-dark-400">
              Sending Mode
            </h4>
            <Button variant="flat" size="sm" className="gap-1.5" onClick={handleAddAccount}>
              <UserPlusIcon className="size-3.5" />
              {sendingMode === "domain" ? "Add SMTP" : "Add Gmail"}
            </Button>
          </div>

          <div className="space-y-2">
            {[
              {
                value: "gmail",
                label: "Mail Automation (Gmail)",
                desc: "Smart rotation across Gmail accounts",
              },
              {
                value: "domain",
                label: "Domain (SMTP)",
                desc: "Send from your own domain email",
              },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSendingMode(opt.value)}
                className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                  sendingMode === opt.value
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-gray-200 hover:border-gray-300 dark:border-dark-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`size-2.5 rounded-full ${
                      sendingMode === opt.value
                        ? "bg-primary-500"
                        : "bg-gray-300 dark:bg-dark-500"
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {opt.label}
                  </span>
                </div>
                <p className="mt-0.5 pl-4 text-[11px] text-gray-400">{opt.desc}</p>
              </button>
            ))}
          </div>

          {sendingMode === "domain" && (
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-dark-300">
                Sender Account
              </label>
              {smtpSenders.length > 0 ? (
                <select
                  value={smtpSender}
                  onChange={(e) => setSmtpSender(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-dark-500 dark:bg-dark-800 dark:text-dark-100"
                >
                  {smtpSenders.map((s) => (
                    <option key={s.email} value={s.email}>
                      {s.email}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="rounded-lg bg-warning-50 px-3 py-2 text-xs text-warning-700 dark:bg-warning-900/20 dark:text-warning-400">
                  No domain accounts. Click &ldquo;Add SMTP&rdquo; to configure one.
                </p>
              )}
            </div>
          )}

          {sendingMode === "gmail" && (
            <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-3 dark:border-dark-700">
              {gmailSenders.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-dark-300">
                    <CheckCircleIcon className="size-3.5 text-success" />
                    <span>
                      {gmailSenders.filter((s) => s.status === "active").length} active &middot; Smart
                      Rotation
                    </span>
                  </div>
                  {globalStats && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-dark-300">
                      <CheckCircleIcon className="size-3.5 text-success" />
                      <span>
                        Capacity: {globalStats.daily_total_sent} /{" "}
                        {globalStats.daily_global_limit} today
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <p className="rounded-lg bg-warning-50 px-3 py-2 text-xs text-warning-700 dark:bg-warning-900/20 dark:text-warning-400">
                  No Gmail accounts. Click &ldquo;Add Gmail&rdquo; to connect one.
                </p>
              )}
            </div>
          )}

          <Button
            variant="flat"
            size="sm"
            className="mt-4 w-full"
            disabled={loadingStats}
            onClick={onRefresh}
          >
            {loadingStats ? "Refreshing..." : "Refresh Capacity"}
          </Button>
        </Card>

        {/* Account usage bars */}
        <Card className="col-span-12 p-5 md:col-span-8">
          <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-dark-400">
            {sendingMode === "domain" ? "SMTP Account Usage" : "Gmail Account Usage"}
          </h4>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {visibleStats.map((s) => (
              <div key={s.email} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span
                    className="truncate font-medium text-gray-700 dark:text-dark-200"
                    title={s.email}
                  >
                    {s.email}
                  </span>
                  <span className="text-gray-500">
                    {s.daily_sent_count}/{s.daily_limit}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-dark-700">
                  <div
                    className={`h-full transition-all duration-300 ${getBarColor(s.usage_percent)}`}
                    style={{ width: `${s.usage_percent}%` }}
                  />
                </div>
              </div>
            ))}

            {visibleStats.length === 0 && loadingStats && (
              <p className="col-span-2 py-4 text-center text-xs text-gray-400">
                Loading...
              </p>
            )}
            {visibleStats.length === 0 && !loadingStats && (
              <p className="col-span-2 py-4 text-center text-xs text-gray-400">
                {sendingMode === "smtp"
                  ? "No SMTP accounts configured."
                  : "No Gmail accounts connected."}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* SMTP modal */}
      {smtpFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-dark-800">
            <h3 className="mb-4 text-sm font-bold text-gray-800 dark:text-dark-100">
              Add Domain SMTP Account
            </h3>
            <form onSubmit={handleSmtpFormSubmit} className="space-y-3">
              {[
                { id: "email",     label: "Sender Email",   placeholder: "hello@example.com",    type: "email"    },
                { id: "smtp_host", label: "SMTP Host",      placeholder: "mail.example.com",      type: "text"     },
                { id: "smtp_port", label: "SMTP Port",      placeholder: "465",                   type: "number"   },
                { id: "smtp_user", label: "SMTP Username",  placeholder: "same as email usually", type: "text"     },
                { id: "smtp_pass", label: "SMTP Password",  placeholder: "••••••••",              type: "password" },
              ].map((f) => (
                <div key={f.id}>
                  <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-dark-300">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={smtpForm[f.id]}
                    onChange={(e) =>
                      setSmtpForm((prev) => ({ ...prev, [f.id]: e.target.value }))
                    }
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-500 dark:bg-dark-700 dark:text-dark-100"
                  />
                </div>
              ))}

              {smtpFormMsg && (
                <p
                  className={`text-xs font-medium ${
                    smtpFormStatus === "success" ? "text-success" : "text-error"
                  }`}
                >
                  {smtpFormMsg}
                </p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={smtpFormStatus === "loading"}
                  className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
                >
                  {smtpFormStatus === "loading" ? "Saving..." : "Save Account"}
                </button>
                <button
                  type="button"
                  onClick={() => setSmtpFormOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-dark-500 dark:text-dark-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
