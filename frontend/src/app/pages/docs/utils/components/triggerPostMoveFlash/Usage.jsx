import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Usage() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`import { triggerPostMoveFlash } from "utils/dom/triggerPostMoveFlash";

function Demo() {
  useEffect(() => {
    const { outcome } = lastMoved;

    if (outcome.type === "column-reorder") {
      const { columnId } = outcome;

      const entry = registry.getColumn(columnId);
      triggerPostMoveFlash(entry.element);
      return;
    }
  }, []);
}`}</SyntaxHighlighter>
    </div>
  );
}
