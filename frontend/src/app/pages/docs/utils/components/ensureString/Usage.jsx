import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Usage() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`import { ensureString } from "utils/ensureString";

console.log(ensureString(null));         // ""
console.log(ensureString(undefined));   // ""
console.log(ensureString(123));         // "123"
console.log(ensureString(true));        // "true"
console.log(ensureString("Hello"));     // "Hello"
console.log(ensureString({}));          // "[object Object]"
`}</SyntaxHighlighter>
    </div>
  );
}
