import { useEffect, useState } from 'react';
import { XMarkIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import {
  createAutoCampaign,
  importAutoCampaignLeads,
  startAutoCampaign,
  fetchSenders,
  fetchTemplates,
} from 'services/api';

// ─── 4-step wizard: name → upload sheet → per-sender subject/template → start ──
// Each sender gets its OWN subject + template (not one shared across the whole
// campaign) — the existing follow-up system schedules a lead's follow-up
// sequence off that sender's shadow campaign's initial_template_id, so mixing
// senders under one template would break sender-specific follow-up chains.

const STEP_NAME = 1;
const STEP_UPLOAD = 2;
const STEP_CONFIGURE = 3;
const STEP_DONE = 4;

export default function CreateCampaignWizard({ onClose, onStarted }) {
  const [step, setStep] = useState(STEP_NAME);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [campaignId, setCampaignId] = useState(null);
  const [campaignName, setCampaignName] = useState('');
  const [description, setDescription] = useState('');

  const [file, setFile] = useState(null);
  const [importSummary, setImportSummary] = useState(null);

  const [senders, setSenders] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedSenders, setSelectedSenders] = useState(new Set());
  const [senderSubjects, setSenderSubjects] = useState({});   // email -> subject
  const [senderTemplates, setSenderTemplates] = useState({}); // email -> templateId
  const [fromName, setFromName] = useState('');

  const [bulkSubject, setBulkSubject] = useState('');
  const [bulkTemplateId, setBulkTemplateId] = useState('');

  useEffect(() => {
    if (step === STEP_CONFIGURE) {
      (async () => {
        const [senderData, templateData] = await Promise.all([fetchSenders(), fetchTemplates()]);
        const accounts = (senderData?.accounts || []).filter((a) => a.status === 'active');
        setSenders(accounts);
        setSelectedSenders(new Set(accounts.map((a) => a.email)));
        setTemplates(templateData || []);
      })();
    }
  }, [step]);

  async function handleCreateAndProceed(e) {
    e.preventDefault();
    if (!campaignName.trim()) return;
    setBusy(true);
    setError('');
    try {
      const campaign = await createAutoCampaign({ campaignName: campaignName.trim(), description, scheduleType: 'alternate_day' });
      setCampaignId(campaign.id);
      setStep(STEP_UPLOAD);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const summary = await importAutoCampaignLeads(campaignId, file);
      setImportSummary(summary);
      setStep(STEP_CONFIGURE);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function toggleSender(email) {
    setSelectedSenders((prev) => {
      const next = new Set(prev);
      next.has(email) ? next.delete(email) : next.add(email);
      return next;
    });
  }

  function applyBulkToAll() {
    if (!bulkSubject.trim() && !bulkTemplateId) return;
    setSenderSubjects((prev) => {
      const next = { ...prev };
      senders.forEach((s) => { if (bulkSubject.trim()) next[s.email] = bulkSubject; });
      return next;
    });
    setSenderTemplates((prev) => {
      const next = { ...prev };
      senders.forEach((s) => { if (bulkTemplateId) next[s.email] = bulkTemplateId; });
      return next;
    });
  }

  const selectedList = senders.filter((s) => selectedSenders.has(s.email));
  const readyToStart =
    selectedList.length > 0 &&
    selectedList.every((s) => senderSubjects[s.email]?.trim() && senderTemplates[s.email]);

  async function handleStart(e) {
    e.preventDefault();
    if (!readyToStart) return;
    setBusy(true);
    setError('');
    try {
      await startAutoCampaign(campaignId, {
        senders: selectedList.map((s) => ({
          senderEmail: s.email,
          templateId: Number(senderTemplates[s.email]),
          subject: senderSubjects[s.email].trim(),
          fromName: fromName.trim() || undefined,
        })),
        scheduleType: 'alternate_day',
      });
      setStep(STEP_DONE);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl dark:border-dark-600 dark:bg-dark-800">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-dark-700">
          <h3 className="text-sm font-bold text-gray-800 dark:text-dark-100">New Auto-Pilot Campaign</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700">
            <XMarkIcon className="size-5" />
          </button>
        </div>

        <div className="px-5 py-4">
          {error && (
            <div className="mb-4 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-xs font-semibold text-error">
              {error}
            </div>
          )}

          {step === STEP_NAME && (
            <form onSubmit={handleCreateAndProceed} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-dark-300">Campaign name</label>
                <input
                  autoFocus
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Q3 Master List"
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-200"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-dark-300">Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-200"
                />
              </div>
              <button
                type="submit"
                disabled={busy || !campaignName.trim()}
                className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
              >
                {busy ? 'Creating…' : 'Next: Upload sheet'}
              </button>
            </form>
          )}

          {step === STEP_UPLOAD && (
            <form onSubmit={handleUpload} className="space-y-4">
              <p className="text-xs text-gray-500 dark:text-dark-400">
                Upload the full lead sheet — thousands of rows are fine. We&apos;ll validate, de-dupe, and check for
                emails already active in another campaign before anything gets sent.
              </p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-xs text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-600 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white dark:text-dark-300"
              />
              <button
                type="submit"
                disabled={busy || !file}
                className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
              >
                {busy ? <><ArrowPathIcon className="mr-1.5 inline size-4 animate-spin" />Importing…</> : 'Import leads'}
              </button>
            </form>
          )}

          {step === STEP_CONFIGURE && (
            <form onSubmit={handleStart} className="space-y-4">
              {importSummary && (
                <div className="grid grid-cols-4 gap-2 rounded-lg bg-gray-50 p-3 text-center text-xs dark:bg-dark-700">
                  <div><p className="font-black text-gray-800 dark:text-dark-100">{importSummary.totalLeads}</p><p className="text-gray-400">Total</p></div>
                  <div><p className="font-black text-success">{importSummary.validLeads}</p><p className="text-gray-400">Valid</p></div>
                  <div><p className="font-black text-warning">{importSummary.duplicateLeads}</p><p className="text-gray-400">Duplicate</p></div>
                  <div><p className="font-black text-error">{importSummary.invalidLeads}</p><p className="text-gray-400">Invalid</p></div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-dark-300">From name (optional, applies to all senders)</label>
                <input
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-600 focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-200"
                />
              </div>

              <div className="rounded-lg border border-gray-200 p-3 dark:border-dark-600">
                <p className="mb-2 text-xs font-semibold text-gray-600 dark:text-dark-300">
                  Quick-fill (optional) — set a default subject/template, then apply it to every sender below and tweak individual rows as needed.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={bulkSubject}
                    onChange={(e) => setBulkSubject(e.target.value)}
                    placeholder="e.g. Quick question about {{company}}"
                    className="min-w-[200px] flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-primary-600 focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-200"
                  />
                  <select
                    value={bulkTemplateId}
                    onChange={(e) => setBulkTemplateId(e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:border-primary-600 focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-200"
                  >
                    <option value="">Template…</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={applyBulkToAll}
                    disabled={!bulkSubject.trim() && !bulkTemplateId}
                    className="rounded-lg border border-primary-600 px-3 py-1.5 text-xs font-semibold text-primary-600 hover:bg-primary-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Apply to all
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-600 dark:text-dark-300">
                    Senders ({selectedSenders.size} selected — each sends 200 every other day, its own subject + template)
                  </label>
                  <button
                    type="button"
                    onClick={() => setSelectedSenders(new Set(senders.map((s) => s.email)))}
                    className="text-[11px] font-semibold text-primary-600 hover:underline"
                  >
                    Select all
                  </button>
                </div>
                <div className="mt-1 max-h-72 overflow-y-auto rounded-lg border border-gray-200 dark:border-dark-600">
                  {senders.length === 0 ? (
                    <p className="p-3 text-xs text-gray-400">No active sender accounts found.</p>
                  ) : senders.map((s) => {
                    const isSelected = selectedSenders.has(s.email);
                    const missing = isSelected && (!senderSubjects[s.email]?.trim() || !senderTemplates[s.email]);
                    return (
                      <div key={s.email} className={`border-b border-gray-50 px-3 py-2 last:border-0 dark:border-dark-700 ${missing ? 'bg-warning-50/40 dark:bg-warning-900/10' : ''}`}>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSender(s.email)}
                            className="accent-primary-600"
                          />
                          <span className="text-xs font-medium text-gray-700 dark:text-dark-200">{s.email}</span>
                          <span className="ml-auto text-[10px] uppercase text-gray-400">{s.type}</span>
                        </div>
                        {isSelected && (
                          <div className="mt-1.5 flex flex-wrap items-center gap-2 pl-6">
                            <input
                              value={senderSubjects[s.email] || ''}
                              onChange={(e) => setSenderSubjects((prev) => ({ ...prev, [s.email]: e.target.value }))}
                              placeholder="Subject for this sender"
                              className="min-w-[180px] flex-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs focus:border-primary-600 focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-200"
                            />
                            <select
                              value={senderTemplates[s.email] || ''}
                              onChange={(e) => setSenderTemplates((prev) => ({ ...prev, [s.email]: e.target.value }))}
                              className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs focus:border-primary-600 focus:outline-none dark:border-dark-600 dark:bg-dark-800 dark:text-dark-200"
                            >
                              <option value="">Template…</option>
                              {templates.map((t) => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={busy || !readyToStart}
                className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
              >
                {busy ? 'Starting…' : `Start campaign across ${selectedSenders.size} sender(s)`}
              </button>
            </form>
          )}

          {step === STEP_DONE && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircleIcon className="size-12 text-success" />
              <p className="text-sm font-bold text-gray-800 dark:text-dark-100">Campaign started</p>
              <p className="text-xs text-gray-500 dark:text-dark-400">
                The first batch will be released automatically on the next scheduler run (within 30 minutes).
              </p>
              <button
                onClick={() => onStarted(campaignId)}
                className="mt-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
              >
                View campaign
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
