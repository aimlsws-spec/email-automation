import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Usage() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`import { randomId } from "utils/randomId";

console.log(randomId()); // Example output: tl-abc123xyz-7g8hk`}</SyntaxHighlighter>
    </div>
  );
}
