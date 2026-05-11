import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { Page } from "components/shared/Page";
import { TemplateTab } from "./components/TemplateTab";
import { CampaignTab } from "./components/CampaignTab";
import { SenderTab } from "./components/SenderTab";
// ----------------------------------------------------------------------

const TABS = ["Template", "Campaign", "Sender"];

export default function SendEmail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // ── Shared template state ──────────────────────────────────────────────
  const [templateHtml, setTemplateHtml] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  // ── Shared campaign state ──────────────────────────────────────────────
  const [campaignData, setCampaignData] = useState({
    name: "",
    subject: "",
    sendingMode: "gmail",
    gmailAccounts: [],
    smtpSender: "",
    domainAccounts: [],
  });

  // ── Sender data (fetched, passed to SenderTab for display) ────────────
  const [senders, setSenders] = useState([]);
  const [senderStats, setSenderStats] = useState([]);
  const [globalStats, setGlobalStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // ── Upload state ───────────────────────────────────────────────────────
  const [pendingCount, setPendingCount] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadedCampaignId, setUploadedCampaignId] = useState(null);

  // ── Send state ─────────────────────────────────────────────────────────
  const [bulkStatus, setBulkStatus] = useState(null);
  const [bulkMessage, setBulkMessage] = useState("");

  // ── Data fetching ──────────────────────────────────────────────────────
  const fetchSenders = useCallback(async () => {
    try {
      setLoadingStats(true);
      const [statsRes, sendersRes] = await Promise.all([
        fetch("/api/senders/stats"),
        fetch("/api/senders"),
      ]);
      const statsData = await statsRes.json();
      const sendersData = await sendersRes.json();

      if (statsData.success) {
        const accounts = statsData.data.accounts || [];
        const mapped = accounts.map((a) => ({
          ...a,
          daily_sent_count: a.sent_today,
          usage_percent:
            a.daily_limit > 0
              ? Math.round((a.sent_today / a.daily_limit) * 100)
              : 0,
        }));
        setSenderStats(mapped);
        setGlobalStats({
          daily_global_limit: statsData.data.dailyCapacity,
          daily_total_sent: statsData.data.sentToday,
        });
        // Keep gmailAccounts in sync with active senders
        const activeGmail = mapped
          .filter((s) => (s.type === "gmail" || !s.type) && s.status === "active")
          .map((s) => s.email);
        setCampaignData((prev) => ({ ...prev, gmailAccounts: activeGmail }));
      }

      if (sendersData.success) {
        setSenders(sendersData.data || []);
        const smtp = (sendersData.data || []).filter((s) => s.type === "smtp");
        setCampaignData((prev) => ({
          ...prev,
          // Only set smtpSender if not already set by user selection
          smtpSender: prev.smtpSender && smtp.some((s) => s.email === prev.smtpSender)
            ? prev.smtpSender
            : (smtp[0]?.email ?? ""),
          domainAccounts: smtp.map((s) => s.email),
        }));
      }
    } catch (err) {
      console.error("Failed to fetch senders:", err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchPendingCount = useCallback(async (campaignId = null) => {
    try {
      const url = campaignId
        ? `/api/leads/pending?campaignId=${campaignId}`
        : '/api/leads/pending';
      const res = await fetch(url);
      const data = await res.json();
      setPendingCount(data.count || 0);
    } catch (err) {
      console.error("Failed to fetch pending leads:", err);
    }
  }, []);

  useEffect(() => {
    fetchPendingCount();
    fetchSenders();
  }, [fetchPendingCount, fetchSenders]);

  // Refresh capacity when user returns from another tab (e.g. after OAuth)
  useEffect(() => {
    const onFocus = () => fetchSenders();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchSenders]);

  // ── Handlers ───────────────────────────────────────────────────────────
  async function handleUpload(file, fileBuffer) {
    if (!file || !fileBuffer) return;
    setUploadStatus("loading");
    setUploadResult(null);
    try {
      // Reconstruct a Blob from the pre-read ArrayBuffer so the browser
      // cannot invalidate the reference (fixes ERR_UPLOAD_FILE_CHANGED)
      const blob = new Blob([fileBuffer], { type: file.type || "application/octet-stream" });
      const formData = new FormData();
      formData.append("file", blob, file.name);
      formData.append("campaignName", campaignData.name);
      formData.append("subject", campaignData.subject);
      if (uploadedCampaignId) formData.append("campaignId", uploadedCampaignId);
      const res = await fetch("/api/upload-leads", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUploadStatus("success");
      setUploadResult(data);
      if (data.campaignId) {
        setUploadedCampaignId(data.campaignId);
        await fetchPendingCount(data.campaignId);
      } else {
        await fetchPendingCount();
      }
    } catch (err) {
      setUploadStatus("error");
      setUploadResult({ message: err.message });
    }
  }

  async function handleBulkSend() {
    if (pendingCount === 0) return;
    setBulkStatus("loading");
    setBulkMessage("");
    try {
      const { name, subject, sendingMode, gmailAccounts, smtpSender, domainAccounts } = campaignData;

      if (sendingMode === "domain" && domainAccounts.length === 0) {
        throw new Error(
          "No domain accounts configured. Go to the Sender tab and add an SMTP account."
        );
      }

      if (sendingMode === "gmail" && gmailAccounts.length === 0) {
        throw new Error(
          "No active Gmail accounts found. Go to the Sender tab to connect one."
        );
      }

      const payload = {
        campaignName: name,
        subject,
        sendingMode,
        campaignId: uploadedCampaignId || undefined,
        gmailAccounts: sendingMode === "gmail" ? gmailAccounts : undefined,
        domainAccounts: sendingMode === "domain" ? domainAccounts : undefined,
        senderEmail: sendingMode === "domain" ? smtpSender : undefined,
        templateHtml: templateHtml || undefined,
      };

      console.log("[SEND] payload campaignId:", uploadedCampaignId, "senderEmail:", smtpSender);

      const res = await fetch("/api/send-bulk-initial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error("Invalid server response (not JSON)");
      }

      if (!res.ok) throw new Error(data.error || data.message || "Bulk send failed");

      setBulkStatus("success");
      setBulkMessage(data.message || "Emails sent successfully");
      await fetchPendingCount();
      window.dispatchEvent(new Event("dashboard_refresh"));
      setTimeout(() => navigate("/dashboards/email-analytics"), 1500);
      await fetchSenders();
    } catch (err) {
      console.error("Bulk Send error:", err);
      setBulkStatus("error");
      setBulkMessage(err.message);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <Page title="Send Email">
      <div className="transition-content px-(--margin-x) pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 py-5 lg:py-6">
          <EnvelopeIcon className="size-6 text-primary-600 dark:text-primary-400" />
          <h2 className="text-xl font-medium text-gray-800 dark:text-dark-100">
            Send Email
          </h2>
        </div>

        {/* Tab bar */}
        <div className="mb-6 flex border-b border-gray-200 dark:border-dark-600">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`-mb-px border-b-2 px-5 py-2.5 text-sm font-medium transition-colors ${
                activeTab === i
                  ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-dark-400 dark:hover:text-dark-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        {activeTab === 0 && (
          <TemplateTab
            templateHtml={templateHtml}
            setTemplateHtml={setTemplateHtml}
            selectedTemplateId={selectedTemplateId}
            setSelectedTemplateId={setSelectedTemplateId}
          />
        )}

        {activeTab === 1 && (
          <CampaignTab
            campaignData={campaignData}
            setCampaignData={setCampaignData}
            pendingCount={pendingCount}
            uploadStatus={uploadStatus}
            uploadResult={uploadResult}
            bulkStatus={bulkStatus}
            bulkMessage={bulkMessage}
            onUpload={handleUpload}
            onSend={handleBulkSend}
            senderStats={senderStats}
            globalStats={globalStats}
          />
        )}

        {activeTab === 2 && (
          <SenderTab
            senders={senders}
            setSenders={setSenders}
            senderStats={senderStats}
            globalStats={globalStats}
            loadingStats={loadingStats}
            campaignData={campaignData}
            setCampaignData={setCampaignData}
            onRefresh={fetchSenders}
          />
        )}


      </div>
    </Page>
  );
}
