import { useState } from "react";
import { Card } from "components/ui";
import { TemplateSelector } from "../TemplateSelector";
import { TemplateEditor } from "../TemplateEditor";
import { TemplatePreview } from "../TemplatePreview";
import { LinkedFollowUpSection } from "./LinkedFollowUpSection";

// ----------------------------------------------------------------------

export function TemplateTab({
  templateHtml,
  setTemplateHtml,
  templateType,
  setTemplateType,
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
          onChange={(content, type) => {
            setTemplateHtml(content);
            if (type !== undefined) setTemplateType(type);
          }}
          onTypeChange={setTemplateType}
          onSaved={(saved) => {
            setSelectedTemplateId(saved.id);
            setTemplateHtml(saved.html_content);
            setTemplateType(saved.template_type === "html" ? "html" : "text");
            setRefreshTrigger((t) => t + 1);
          }}
        />
      </Card>

      {/* Right: live preview */}
      <Card className="col-span-12 p-5 lg:col-span-5" style={{ minHeight: "640px" }}>
        <TemplatePreview html={templateHtml} templateType={templateType} />
      </Card>

      {/* Linked follow-up templates — shown once a template is saved/selected */}
      {selectedTemplateId && (
        <Card className="col-span-12 p-5">
          <LinkedFollowUpSection templateId={selectedTemplateId} />
        </Card>
      )}
    </div>
  );
}
