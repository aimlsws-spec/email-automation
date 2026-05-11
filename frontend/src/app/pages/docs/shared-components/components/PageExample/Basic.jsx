import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Basic() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`// Local Imports
import { Page } from "components/shared/Page";

// ----------------------------------------------------------------------

export default function GettingStarted() {
  return (
    <Page title="Getting Started">
      <div className="transition-content px-(--margin-x) pb-6">
        {/* Your Content Here */}
      </div>
    </Page>
  );
}
`}</SyntaxHighlighter>
    </div>
  );
}
