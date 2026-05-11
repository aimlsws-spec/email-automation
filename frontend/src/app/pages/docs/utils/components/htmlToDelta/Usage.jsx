import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Usage() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`import { htmlToDelta } from "utils/quillUtils";

// Example HTML string
const htmlString = "<h1>Hello, Quill!</h1><p>This is a test content.</p>";

try {
    const delta = htmlToDelta(htmlString);
    console.log("Delta representation of the HTML:", delta);
} catch (error) {
    console.error("Error converting HTML to Delta:", error.message);
}`}</SyntaxHighlighter>
    </div>
  );
}
