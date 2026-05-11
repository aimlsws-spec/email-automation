import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Usage() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`import { isRouteActive } from "utils/isRouteActive";

console.log(isRouteActive("/docs/utils", "/docs/utils/getMultipleRandom")) // true`}</SyntaxHighlighter>
    </div>
  );
}
