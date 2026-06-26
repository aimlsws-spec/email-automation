import { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  CloudArrowUpIcon,
  CodeBracketIcon,
  DocumentTextIcon,
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

export function TemplateEditor({ templateId, onSaved, onChange, onTypeChange }) {
  const [name,      setName]      = useState("");
  const [content,   setContent]   = useState("");
  const [typeMode,  setTypeMode]  = useState("text"); // "text" | "html"
  const [status,    setStatus]    = useState(null);   // null | 'saving' | 'saved' | 'error'
  const [errorMsg,  setErrorMsg]  = useState("");
  const [isNew,     setIsNew]     = useState(true);

  // Load template when templateId changes
  useEffect(() => {
    if (!templateId) {
      setName("");
      setContent("");
      setTypeMode("text");
      setIsNew(true);
      setStatus(null);
      onChange("", "text");
      onTypeChange?.("text");
      return;
    }
    fetchTemplate(templateId).then((t) => {
      if (!t) return;
      const loadedType = t.template_type === "html" ? "html" : "text";
      setName(t.name || "");
      setContent(t.html_content || "");
      setTypeMode(loadedType);
      setIsNew(false);
      setStatus(null);
      onChange(t.html_content || "", loadedType);
      onTypeChange?.(loadedType);
    });
  }, [templateId]); // eslint-disable-line

  function handleContentChange(e) {
    const val = e.target.value;
    setContent(val);
    onChange(val, typeMode);
    setStatus(null);
  }

  function handleTypeChange(newType) {
    setTypeMode(newType);
    onChange(content, newType);
    onTypeChange?.(newType);
    setStatus(null);
  }

  function insertVariable(v) {
    const ta = document.getElementById("template-content-editor");
    if (!ta) return;
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    const next  = content.slice(0, start) + v + content.slice(end);
    setContent(next);
    onChange(next, typeMode);
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = start + v.length;
      ta.focus();
    });
  }

  async function handleSave() {
    if (!name.trim())    { setStatus("error"); setErrorMsg("Template name is required.");    return; }
    if (!content.trim()) { setStatus("error"); setErrorMsg("Content cannot be empty.");      return; }
    setStatus("saving");
    setErrorMsg("");
    try {
      const saved = await saveTemplate({
        id: isNew ? undefined : templateId,
        name: name.trim(),
        html_content: content,
        template_type: typeMode,
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

  const isHtml = typeMode === "html";

  return (
    <div className="flex flex-col gap-3">
      {/* Template name */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-dark-400">
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

      {/* Template type toggle */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-dark-400">
          Template Type
        </label>
        <div className="flex items-center gap-2">
          {[
            { key: "text", Icon: DocumentTextIcon, label: "Simple Text" },
            { key: "html", Icon: CodeBracketIcon,  label: "HTML" },
          ].map(({ key, Icon, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleTypeChange(key)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                typeMode === key
                  ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-900/20 dark:text-primary-300"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:border-dark-600 dark:bg-dark-800 dark:text-dark-400 dark:hover:text-dark-200"
              }`}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
          <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
            isHtml
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          }`}>
            {isHtml ? "HTML" : "TEXT"}
          </span>
        </div>
        {!isHtml && (
          <p className="mt-1.5 text-[10px] text-gray-400 dark:text-dark-500">
            Plain text — no HTML tags, line breaks preserved exactly as typed.
          </p>
        )}
      </div>

      {/* Variable chips */}
      <div>
        <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-dark-400">
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

      {/* Content textarea */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-dark-400">
          {isHtml ? "HTML Content" : "Text Content"}
        </label>
        <textarea
          id="template-content-editor"
          value={content}
          onChange={handleContentChange}
          spellCheck={!isHtml}
          rows={18}
          className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-xs leading-relaxed focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-dark-500 dark:bg-dark-900 dark:text-dark-100 resize-y ${
            isHtml ? "font-mono text-gray-800" : "font-sans text-gray-800"
          }`}
          placeholder={
            isHtml
              ? "Paste or write your HTML email here..."
              : "Write plain text email content...\n\nHi {{customerName}},\n\nYour message here."
          }
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
