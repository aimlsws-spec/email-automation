import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Usage() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`import { formatNumber } from "utils/formatNumber";

console.log(formatNumber(1234567890));           // "1.23B"
console.log(formatNumber(1500));                 // "1.5k"
console.log(formatNumber(987654321012));        // "987.65T"
console.log(formatNumber(500, 0));              // "500"
console.log(formatNumber(1234567890, 1));       // "1.2B"
console.log(formatNumber(123456789012345));     // "123456.79T"`}</SyntaxHighlighter>
    </div>
  );
}
