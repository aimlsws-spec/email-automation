import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function MergeRefs() {
  return <SyntaxHighlighter language="jsx">{`import { useRef } from "react";
import { mergeRefs } from "hooks";

function Demo() {
  const myRef1 = useRef();
  const myRef2 = useRef();

  const mergedRef = mergeRefs(myRef1, myRef2);

  return <div ref={mergedRef} />;
}
`}</SyntaxHighlighter>;
}