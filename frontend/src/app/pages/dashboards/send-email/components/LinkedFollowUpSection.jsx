import { useState, useEffect, useCallback, useRef } from "react";
import {
  PlusIcon,
  TrashIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  BoltIcon,
  ClockIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { fetchFollowupTemplates, saveFollowupTemplate, deleteFollowupTemplate } from "services/api";
import { TemplatePreview } from "../TemplatePreview";

// Maximum follow-up stages allowed per campaign template
const MAX_STAGES = 3;

const EMPTY_FORM = {
  subject: "",
  body: "",
  delay_value: 1,
  delay_unit: "days",
};

const DELAY_UNIT_LABELS = { days: "day(s)", hours: "hour(s)" };

// ─── Stage colour tag ─────────────────────────────────────────────────────────

function StageTag({ stage }) {
  const colors = [
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  ];
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${colors[(stage - 1) % colors.length]}`}>
      Stage {stage}
    </span>
  );
}

// ─── Preview modal (for saved stage rows) ────────────────────────────────────

function PreviewModal({ stage, subject, body, onClose }) {
  // Close on Escape key
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex w-full max-w-3xl flex-col rounded-xl bg-white shadow-2xl dark:bg-dark-800"
           style={{ maxHeight: "90vh" }}>
        {/* Modal header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-dark-600">
          <div className="flex items-center gap-2">
            <EyeIcon className="size-4 text-primary-500" />
            <span className="text-sm font-semibold text-gray-800 dark:text-dark-100">
              Follow-Up Preview
            </span>
            <StageTag stage={stage} />
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-dark-700 dark:hover:text-dark-200"
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>

        {/* Subject bar */}
        <div className="shrink-0 border-b border-gray-100 bg-gray-50 px-5 py-3 dark:border-dark-700 dark:bg-dark-900">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-dark-500">Subject</span>
          <p className="mt-0.5 text-sm font-medium text-gray-800 dark:text-dark-100">{subject || "(no subject)"}</p>
        </div>

        {/* Preview body — reuses TemplatePreview exactly */}
        <div className="flex-1 overflow-auto p-5" style={{ minHeight: "400px" }}>
          <TemplatePreview html={body} templateType="html" />
        </div>
      </div>
    </div>
  );
}

// ─── Inline form (add / edit) with live side-by-side preview ─────────────────

function StageForm({ stage, initial, onSave, onCancel, saving }) {
  const [form,        setForm]        = useState(initial || EMPTY_FORM);
  const [err,         setErr]         = useState("");
  const [showPreview, setShowPreview] = useState(false);

  function set(key) {
    return (e) => setForm((p) => ({ ...p, [key]: e.target.value }));
  }

  async function handleSave() {
    if (!form.subject.trim()) { setErr("Subject is required."); return; }
    if (!form.body.trim())    { setErr("Body is required.");    return; }
    setErr("");
    await onSave(form);
  }

  return (
    <div className="mt-3 rounded-lg border border-primary-200 bg-primary-50 p-4 dark:border-primary-800 dark:bg-primary-900/10">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-primary-700 dark:text-primary-400">
          {initial?.id ? "Edit" : "Add"} Follow-Up — Stage {stage}
        </p>
        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-semibold transition-colors ${
            showPreview
              ? "border-primary-500 bg-primary-600 text-white"
              : "border-gray-300 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700 dark:border-dark-500 dark:bg-dark-800 dark:text-dark-400 dark:hover:text-dark-200"
          }`}
        >
          <EyeIcon className="size-3.5" />
          {showPreview ? "Hide Preview" : "Preview"}
        </button>
      </div>

      {/* Two-column layout when preview is on, single column otherwise */}
      <div className={showPreview ? "grid grid-cols-2 gap-5" : undefined}>
        {/* ── Left: form fields ── */}
        <div className="space-y-3">
          {/* Delay */}
          <div className="flex items-center gap-2">
            <ClockIcon className="size-4 shrink-0 text-gray-400" />
            <span className="text-xs text-gray-500 dark:text-dark-400">Send after</span>
            <input
              type="number"
              min={1}
              value={form.delay_value}
              onChange={set("delay_value")}
              className="w-16 rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-500 dark:bg-dark-800 dark:text-dark-100"
            />
            <select
              value={form.delay_unit}
              onChange={set("delay_unit")}
              className="rounded border border-gray-300 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-500 dark:bg-dark-800 dark:text-dark-100"
            >
              <option value="days">days</option>
              <option value="hours">hours</option>
            </select>
            <span className="text-xs text-gray-400">after previous email</span>
          </div>

          {/* Subject */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-dark-300">
              Subject
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={set("subject")}
              placeholder="e.g. Re: Quick follow-up on {{company}}"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-500 dark:bg-dark-800 dark:text-dark-100"
            />
            <p className="mt-1 text-[10px] text-gray-400">
              Variables:{" "}
              <code className="rounded bg-gray-100 px-1 dark:bg-dark-700">{"{{customerName}}"}</code>{" "}
              <code className="rounded bg-gray-100 px-1 dark:bg-dark-700">{"{{company}}"}</code>
            </p>
          </div>

          {/* Body */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600 dark:text-dark-300">
              Body (HTML or plain text)
            </label>
            <textarea
              value={form.body}
              onChange={set("body")}
              rows={showPreview ? 14 : 8}
              placeholder={"Hi {{customerName}},\n\nJust following up on my previous email..."}
              className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-xs leading-relaxed focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-500 dark:bg-dark-900 dark:text-dark-100"
            />
          </div>

          {err && <p className="text-xs font-semibold text-error">{err}</p>}

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
            >
              <CheckIcon className="size-3.5" />
              {saving ? "Saving…" : "Save Stage"}
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-dark-500 dark:bg-dark-800 dark:text-dark-300"
            >
              <XMarkIcon className="size-3.5" />
              Cancel
            </button>
          </div>
        </div>

        {/* ── Right: live preview (only when toggled on) ── */}
        {showPreview && (
          <div className="flex flex-col">
            {/* Subject preview header */}
            <div className="mb-2 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-dark-600 dark:bg-dark-800">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-dark-500">
                Subject Preview
              </p>
              <p className="mt-0.5 truncate text-xs font-medium text-gray-700 dark:text-dark-200">
                {form.subject || <span className="italic text-gray-400">(no subject yet)</span>}
              </p>
            </div>
            {/* Body preview — directly reuses TemplatePreview */}
            <div className="flex-1 rounded-lg border border-gray-200 bg-white p-3 dark:border-dark-600 dark:bg-dark-800"
                 style={{ minHeight: "340px" }}>
              <TemplatePreview html={form.body} templateType="html" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Collapsed row (saved stage) ─────────────────────────────────────────────

function StageRow({ tpl, onEdit, onDelete, onPreview, deleting }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-dark-600 dark:bg-dark-800">
      <StageTag stage={tpl.followup_stage} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-gray-800 dark:text-dark-100">{tpl.subject}</p>
        <p className="mt-0.5 text-[10px] text-gray-400 dark:text-dark-500">
          <ClockIcon className="mb-0.5 mr-0.5 inline size-3" />
          {tpl.delay_value} {DELAY_UNIT_LABELS[tpl.delay_unit] || tpl.delay_unit} after previous
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          title="Preview"
          onClick={onPreview}
          className="rounded p-1 text-gray-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400"
        >
          <EyeIcon className="size-3.5" />
        </button>
        <button
          title="Edit"
          onClick={onEdit}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-dark-700 dark:hover:text-dark-200"
        >
          <PencilSquareIcon className="size-3.5" />
        </button>
        <button
          title="Delete"
          onClick={onDelete}
          disabled={deleting}
          className="rounded p-1 text-gray-400 hover:bg-error-50 hover:text-error dark:hover:bg-error-900/20 disabled:opacity-50"
        >
          <TrashIcon className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function LinkedFollowUpSection({ templateId }) {
  const [stages,      setStages]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [editingId,   setEditingId]   = useState(null);   // row id or "new"
  const [saving,      setSaving]      = useState(false);
  const [deletingId,  setDeletingId]  = useState(null);
  const [apiErr,      setApiErr]      = useState("");
  const [previewTpl,  setPreviewTpl]  = useState(null);   // tpl object to show in modal
  // Prevent concurrent / duplicate fetches (React StrictMode double-fires effects)
  const fetchingRef = useRef(false);

  const load = useCallback(async () => {
    if (!templateId) return;
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    try {
      const data = await fetchFollowupTemplates(templateId);
      setStages(data || []);
      setApiErr("");
    } catch {
      // fetchFollowupTemplates already swallows network errors gracefully;
      // this catch is a safety net for unexpected throws.
      setApiErr("Failed to load follow-up stages.");
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [templateId]);

  useEffect(() => { load(); }, [load]);

  const nextStage  = stages.length + 1;
  const canAddMore = stages.length < MAX_STAGES;
  const isAddingNew = editingId === "new";

  async function handleSave(form) {
    setSaving(true);
    setApiErr("");
    try {
      if (editingId === "new") {
        await saveFollowupTemplate({
          campaign_template_id: templateId,
          followup_stage: nextStage,
          ...form,
        });
      } else {
        await saveFollowupTemplate({ id: editingId, ...form });
      }
      setEditingId(null);
      await load();
    } catch (err) {
      setApiErr(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this follow-up stage?")) return;
    setDeletingId(id);
    setApiErr("");
    try {
      await deleteFollowupTemplate(id);
      await load();
    } catch (err) {
      setApiErr(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (!templateId) return null;

  return (
    <div className="mt-6 border-t border-gray-200 pt-6 dark:border-dark-600">
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BoltIcon className="size-4 text-primary-500" />
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-dark-200">
            Linked Follow-Up Templates
          </h4>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:bg-dark-700 dark:text-dark-400">
            {stages.length} / {MAX_STAGES}
          </span>
        </div>
        {canAddMore && !isAddingNew && (
          <button
            onClick={() => setEditingId("new")}
            className="flex items-center gap-1.5 rounded-lg border border-primary-300 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-100 dark:border-primary-700 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/40"
          >
            <PlusIcon className="size-3.5" />
            Add Follow-Up {nextStage}
          </button>
        )}
      </div>

      <p className="mb-4 text-[11px] text-gray-400 dark:text-dark-500">
        Follow-ups are sent automatically after the initial email. Each stage uses its own
        subject &amp; body and respects the reply/unsubscribe stop conditions.
      </p>

      {apiErr && (
        <p className="mb-3 rounded-lg bg-error-50 px-3 py-2 text-xs font-semibold text-error dark:bg-error-900/20">
          {apiErr}
        </p>
      )}

      {loading ? (
        <p className="text-xs text-gray-400">Loading…</p>
      ) : (
        <div className="space-y-2">
          {stages.map((tpl) =>
            editingId === tpl.id ? (
              <div key={tpl.id}>
                <StageRow
                  tpl={tpl}
                  onEdit={() => {}}
                  onPreview={() => setPreviewTpl(tpl)}
                  onDelete={() => handleDelete(tpl.id)}
                  deleting={deletingId === tpl.id}
                />
                <StageForm
                  stage={tpl.followup_stage}
                  initial={tpl}
                  onSave={handleSave}
                  onCancel={() => setEditingId(null)}
                  saving={saving}
                />
              </div>
            ) : (
              <StageRow
                key={tpl.id}
                tpl={tpl}
                onEdit={() => setEditingId(tpl.id)}
                onPreview={() => setPreviewTpl(tpl)}
                onDelete={() => handleDelete(tpl.id)}
                deleting={deletingId === tpl.id}
              />
            )
          )}

          {isAddingNew && (
            <StageForm
              stage={nextStage}
              initial={null}
              onSave={handleSave}
              onCancel={() => setEditingId(null)}
              saving={saving}
            />
          )}

          {stages.length === 0 && !isAddingNew && (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-6 text-center dark:border-dark-600 dark:bg-dark-800">
              <p className="text-xs text-gray-400 dark:text-dark-500">
                No follow-up stages configured yet.
              </p>
              <button
                onClick={() => setEditingId("new")}
                className="mt-2 text-xs font-semibold text-primary-600 hover:underline dark:text-primary-400"
              >
                + Add Follow-Up Stage 1
              </button>
            </div>
          )}

          {stages.length === MAX_STAGES && !isAddingNew && (
            <p className="text-[10px] text-gray-400 dark:text-dark-500">
              Maximum {MAX_STAGES} follow-up stages reached.
            </p>
          )}
        </div>
      )}

      {/* Preview modal — rendered via portal at component root */}
      {previewTpl && (
        <PreviewModal
          stage={previewTpl.followup_stage}
          subject={previewTpl.subject}
          body={previewTpl.body}
          onClose={() => setPreviewTpl(null)}
        />
      )}
    </div>
  );
}
