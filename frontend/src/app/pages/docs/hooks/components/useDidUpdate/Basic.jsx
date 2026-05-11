import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Basic() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`import { useDidUpdate } from "hooks";

function Demo() {
  useDidUpdate(
    () => console.log("Won't be called when mounted"),
    [dependency1, dependency2],
  );
}
`}</SyntaxHighlighter>
    </div>
  );
}
