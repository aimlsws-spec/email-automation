import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Usage() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`import { range } from "utils/range";
      
console.log(range(1, 5)); // Output: [1, 2, 3, 4, 5]
console.log(range(10, 10)); // Output: [10]
console.log(range(5, 2)); // Throws an error: "Invalid step size"`}</SyntaxHighlighter>
    </div>
  );
}
