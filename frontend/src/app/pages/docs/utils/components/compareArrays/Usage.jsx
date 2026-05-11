import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Usage() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`import { compareArrays } from "utils/compareArrays";

console.log(compareArrays([1, 2, 3], [1, 2, 3])); // true
console.log(compareArrays([1, [2, 3]], [1, [2, 3]])); // true
console.log(compareArrays([1, 2, 3], [1, 2])); // false
console.log(compareArrays([1, 2, 3], "not an array")); // Throws TypeError`}</SyntaxHighlighter>
    </div>
  );
}
