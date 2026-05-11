import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Usage() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`import { useRef } from "react";
import { unRef } from "utils/dom/unRef";
      
export function Demo() {
  const ref = useRef(null);
  console.log("element: ", unRef(ref));

  return null;
}`}</SyntaxHighlighter>
    </div>
  );
}
