import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Usage() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`import { getMultipleRandom } from "utils/getMultipleRandom";

console.log(getMultipleRandom([1, 2, 3, 4, 5], 2)); // e.g., [3, 5]
console.log(getMultipleRandom(['a', 'b', 'c', 'd'], 3)); // e.g., ['b', 'a', 'd']
console.log(getMultipleRandom([10, 20, 30, 40, 50], 0)); // []
console.log(getMultipleRandom([1, 2, 3], 3)); // [3, 1, 2] (all elements)`}</SyntaxHighlighter>
    </div>
  );
}
