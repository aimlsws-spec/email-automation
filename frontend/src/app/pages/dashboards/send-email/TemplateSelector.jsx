import { useEffect, useState } from "react";
import { PlusIcon, TrashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { fetchTemplates, deleteTemplate } from "services/api";

// ----------------------------------------------------------------------

export function TemplateSelector({ selectedId, onSelect, onNew, refreshTrigger }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchTemplates();
      setTemplates(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [refreshTrigger]);

  async function handleDelete(e, id) {
    e.stopPropagation();
    if (!confirm("Delete this template?")) return;
    await deleteTemplate(id);
    if (selectedId === id) onSelect(null);
    load();
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-dark-400">
          Saved Templates
        </label>
        <div className="flex items-center gap-1">
          <button
            onClick={load}
            title="Refresh"
            className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-dark-200"
          >
            <ArrowPathIcon className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={onNew}
            className="flex items-center gap-1 rounded-lg bg-primary-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-primary-700"
          >
            <PlusIcon className="size-3" /> New
          </button>
        </div>
      </div>

      {templates.length === 0 && !loading ? (
        <p className="rounded-lg bg-gray-50 px-3 py-2.5 text-xs text-gray-400 dark:bg-dark-800 dark:text-dark-400">
          No templates yet. Click <strong>New</strong> to create one.
        </p>
      ) : (
        <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 dark:border-dark-600">
          {templates.map((t) => (
            <div
              key={t.id}
              onClick={() => onSelect(t.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelect(t.id)}
              className={`group flex w-full cursor-pointer items-center justify-between px-3 py-2.5 text-left text-sm transition-colors border-b border-gray-100 last:border-0 dark:border-dark-700 ${
                selectedId === t.id
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                  : "hover:bg-gray-50 text-gray-700 dark:text-dark-200 dark:hover:bg-dark-700"
              }`}
            >
              <span className="truncate font-medium">{t.name}</span>
              <button
                onClick={(e) => handleDelete(e, t.id)}
                className="ml-2 shrink-0 rounded p-0.5 text-gray-300 opacity-0 transition-opacity hover:text-error group-hover:opacity-100 dark:text-dark-500"
                title="Delete template"
              >
                <TrashIcon className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
