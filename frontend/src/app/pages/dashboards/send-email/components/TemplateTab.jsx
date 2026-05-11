import { useState } from "react";
import { Card } from "components/ui";
import { TemplateSelector } from "../TemplateSelector";
import { TemplateEditor } from "../TemplateEditor";
import { TemplatePreview } from "../TemplatePreview";

// ----------------------------------------------------------------------

export function TemplateTab({
  templateHtml,
  setTemplateHtml,
  selectedTemplateId,
  setSelectedTemplateId,
}) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="grid grid-cols-12 gap-5">
      {/* Left: selector + editor */}
      <Card className="col-span-12 flex flex-col gap-5 p-5 lg:col-span-7">
        <TemplateSelector
          selectedId={selectedTemplateId}
          onSelect={setSelectedTemplateId}
          onNew={() => setSelectedTemplateId(null)}
          refreshTrigger={refreshTrigger}
        />
        <TemplateEditor
          templateId={selectedTemplateId}
          onChange={setTemplateHtml}
          onSaved={(saved) => {
            setSelectedTemplateId(saved.id);
            setTemplateHtml(saved.html_content);
            setRefreshTrigger((t) => t + 1);
          }}
        />
      </Card>

      {/* Right: live preview */}
      <Card className="col-span-12 p-5 lg:col-span-5" style={{ minHeight: "640px" }}>
        <TemplatePreview html={templateHtml} />
      </Card>
    </div>
  );
}
