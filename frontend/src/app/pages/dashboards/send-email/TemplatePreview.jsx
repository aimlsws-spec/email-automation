import { useMemo, useState } from "react";
import {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";

// ----------------------------------------------------------------------

const SAMPLE = {
  customerName: "John",
  agentName: "Seawind Team",
  company: "Acme Corp",
  unsubscribe: "sample%40example.com",
  email: "sample@example.com",
  inquiryId: "sample%40example.com",
  FirstName: "John",
};

function stripScripts(html) {
  return String(html || "")
    // Remove full <script>...</script> blocks (any attributes, multiline body)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    // Remove self-closing / unclosed <script .../> or <script src="..."> with no body
    .replace(/<script\b[^>]*\/?>/gi, "");
}

function injectSampleVars(content) {
  return stripScripts(content)
    .replace(/\{\{\s*customerName\s*\}\}/g, SAMPLE.customerName)
    .replace(/\{\{\s*FirstName\s*\}\}/g, SAMPLE.FirstName)
    .replace(/\{\{\s*agentName\s*\}\}/g, SAMPLE.agentName)
    .replace(/\{\{\s*company\s*(?:\|[^}]*)?\}\}/g, SAMPLE.company)
    .replace(/\{\{\s*unsubscribe\s*\}\}/g, SAMPLE.unsubscribe)
    .replace(/\{\{\s*inquiryId\s*\}\}/g, SAMPLE.inquiryId)
    .replace(/\{\{\s*email\s*\}\}/g, SAMPLE.email);
}

// ----------------------------------------------------------------------

export function TemplatePreview({ html, templateType }) {
  const [mode, setMode] = useState("desktop"); // 'desktop' | 'mobile'

  const isText = templateType === "text";
  const rendered = useMemo(() => injectSampleVars(html), [html]);

  const iframeWidth = mode === "mobile" ? "375px" : "100%";

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-dark-400">
          Live Preview
        </p>
        {/* Device toggle — only relevant for HTML mode */}
        {!isText && (
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-0.5 dark:border-dark-600">
            {[
              { key: "desktop", Icon: ComputerDesktopIcon, label: "Desktop" },
              { key: "mobile",  Icon: DevicePhoneMobileIcon, label: "Mobile" },
            ].map(({ key, Icon, label }) => (
              <button
                key={key}
                title={label}
                onClick={() => setMode(key)}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  mode === key
                    ? "bg-primary-600 text-white"
                    : "text-gray-500 hover:text-gray-700 dark:text-dark-400 dark:hover:text-dark-200"
                }`}
              >
                <Icon className="size-3.5" />
                {label}
              </button>
            ))}
          </div>
        )}
        {isText && (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            Plain Text
          </span>
        )}
      </div>

      {/* Preview area */}
      <div className="flex flex-1 justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-dark-600 dark:bg-dark-800">
        {isText ? (
          /* Plain-text preview — <pre> with exact whitespace */
          <div className="h-full w-full overflow-auto p-5">
            {rendered ? (
              <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-gray-800 dark:text-dark-100">
                {rendered}
              </pre>
            ) : (
              <p className="text-center text-xs text-gray-400 pt-10">
                Start typing plain text to see a live preview...
              </p>
            )}
          </div>
        ) : (
          /* HTML preview — sandboxed iframe */
          <div
            className="h-full overflow-auto transition-all duration-300"
            style={{ width: iframeWidth }}
          >
            <iframe
              key={mode}
              srcDoc={
                rendered ||
                '<p style="font-family:sans-serif;padding:24px;color:#9ca3af;text-align:center">Start typing HTML to see a live preview...</p>'
              }
              title="Email Preview"
              sandbox="allow-same-origin"
              className="h-full w-full border-0"
              style={{ minHeight: "520px" }}
            />
          </div>
        )}
      </div>

      {/* Variable legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {Object.entries(SAMPLE).slice(0, 4).map(([k, v]) => (
          <span key={k} className="text-[10px] text-gray-400 dark:text-dark-500">
            <span className="font-mono text-primary-500">{`{{${k}}}`}</span>
            {" → "}
            <span className="font-semibold text-gray-600 dark:text-dark-300">{v}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
