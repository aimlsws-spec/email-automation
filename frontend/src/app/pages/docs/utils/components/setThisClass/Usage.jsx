import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Usage() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`import { setThisClass } from "utils/setThisClass";

console.log(setThisClass('primary')); // Output: 'this:primary'
console.log(setThisClass('unknown')); // Throws an error: "Color 'unknown' not found in the color map."`}</SyntaxHighlighter>
    </div>
  );
}
