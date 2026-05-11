import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Basic() {
  return (
    <SyntaxHighlighter language="jsx">{`import { useRef } from "react";
import { useMergedRef } from "hooks";

function Demo() {
  const myRef1 = useRef();
  const myRef2 = useRef();

  const mergedRef = useMergedRef(myRef1, myRef2);

  return <div ref={mergedRef} />;
}
`}</SyntaxHighlighter>
  );
}