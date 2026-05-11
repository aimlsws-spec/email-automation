import { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";
import { saveTemplate, fetchTemplate } from "services/api";

// ----------------------------------------------------------------------

const VARIABLES = [
  { label: "{{customerName}}", title: "Lead name" },
  { label: "{{agentName}}", title: "Sender name" },
  { label: "{{company}}", title: "Lead company" },
  { label: "{{unsubscribe}}", title: "Unsubscribe ID" },
];

// ----------------------------------------------------------------------

export function TemplateEditor({ templateId, onSaved, onChange }) {
  const [name, setName] = useState("");
  const [html, setHtml] = useState("");
  const [status, setStatus] = useState(null); // null | 'saving' | 'saved' | 'error'
  const [errorMsg, setErrorMsg] = useState("");
  const [isNew, setIsNew] = useState(true);

  // Load template when templateId changes
  useEffect(() => {
    if (!templateId) {
      setName("");
      setHtml("");
      setIsNew(true);
      setStatus(null);
      onChange("");
      return;
    }
    fetchTemplate(templateId).then((t) => {
      if (!t) return;
      setName(t.name || '');
      setHtml(t.html_content || "");
      setIsNew(false);
      setStatus(null);
      onChange(t.html_content || "");
    });
  }, [templateId]); // eslint-disable-line

  function handleHtmlChange(e) {
    const val = e.target.value;
    setHtml(val);
    onChange(val);
    setStatus(null);
  }

  function insertVariable(v) {
    const ta = document.getElementById("template-html-editor");
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const next = html.slice(0, start) + v + html.slice(end);
    setHtml(next);
    onChange(next);
    // Restore cursor after inserted text
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = start + v.length;
      ta.focus();
    });
  }

  async function handleSave() {
    if (!name.trim()) { setStatus("error"); setErrorMsg("Template name is required."); return; }
    if (!html.trim()) { setStatus("error"); setErrorMsg("HTML content cannot be empty."); return; }
    setStatus("saving");
    setErrorMsg("");
    try {
      const saved = await saveTemplate({
        id: isNew ? undefined : templateId,
        name: name.trim(),
        html_content: html,
      });
      setIsNew(false);
      setStatus("saved");
      onSaved(saved);
      setTimeout(() => setStatus(null), 2500);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Template name */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-dark-400">
          Template Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setStatus(null); }}
          placeholder="e.g. Q4 Outreach Template"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-500 dark:bg-dark-800 dark:text-dark-100"
        />
      </div>

      {/* Variable chips */}
      <div>
        <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-dark-400">
          Insert Variable
        </p>
        <div className="flex flex-wrap gap-1.5">
          {VARIABLES.map((v) => (
            <button
              key={v.label}
              title={v.title}
              onClick={() => insertVariable(v.label)}
              className="rounded-full border border-primary-200 bg-primary-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-primary-700 hover:bg-primary-100 dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-300"
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* HTML textarea */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-dark-400">
          HTML Content
        </label>
        <textarea
          id="template-html-editor"
          value={html}
          onChange={handleHtmlChange}
          spellCheck={false}
          rows={18}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 font-mono text-xs leading-relaxed text-gray-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-500 dark:bg-dark-900 dark:text-dark-100 resize-y"
          placeholder="Paste or write your HTML email here..."
        />
      </div>

      {/* Save button + status */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
        >
          <CloudArrowUpIcon className="size-4" />
          {status === "saving" ? "Saving..." : isNew ? "Save Template" : "Update Template"}
        </button>

        {status === "saved" && (
          <span className="flex items-center gap-1 text-xs font-semibold text-success">
            <CheckCircleIcon className="size-4" /> Saved
          </span>
        )}
        {status === "error" && (
          <span className="flex items-center gap-1 text-xs font-semibold text-error">
            <ExclamationCircleIcon className="size-4" /> {errorMsg}
          </span>
        )}
      </div>
    </div>
  );
}
