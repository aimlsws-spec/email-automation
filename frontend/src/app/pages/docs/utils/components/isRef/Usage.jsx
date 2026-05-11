import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Usage() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`import { useRef } from "react";
import { isRef } from "utils/dom/isRef";
      
export function Demo() {
  const ref = useRef(null);
  console.log("isRef", isRef(ref));

  return null;
}`}</SyntaxHighlighter>
    </div>
  );
}
