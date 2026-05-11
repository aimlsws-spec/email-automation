import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Usage() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`import { isDeltaNotEmpty } from "utils/quillUtils";

// Example Delta object
const delta = {
    ops: [
        { insert: "Hello, Quill!\n" },
        { insert: { image: "https://example.com/image.jpg" } },
    ],
};

const emptyDelta = { ops: [] };

console.log("Is Delta not empty?", isDeltaNotEmpty(delta)); // Output: true
console.log("Is Empty Delta not empty?", isDeltaNotEmpty(emptyDelta)); // Output: false
`}</SyntaxHighlighter>
    </div>
  );
}
