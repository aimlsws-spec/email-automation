import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";
import { useListState } from "hooks";

export function Basic() {
  useListState
  return (
    <SyntaxHighlighter language="jsx">{`import { useIsomorphicEffect } from '/hooks';

function Demo() {
  useIsomorphicEffect(() => {
    document.title = 'title';
  });

  return null;
}`}</SyntaxHighlighter>
  );
}
