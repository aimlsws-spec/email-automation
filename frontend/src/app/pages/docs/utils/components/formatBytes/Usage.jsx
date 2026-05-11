import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Usage() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`import { formatBytes } from "utils/formatBytes";
      
console.log(formatBytes(1048576));                  // "1.05 MB" (default base 1000, precision 2)
console.log(formatBytes(1048576, 1024));            // "1.00 MB" (binary units with base 1024)
console.log(formatBytes(1048576, 1024, 3));         // "1.000 MB" (binary units, precision 3)
console.log(formatBytes(123456789, 1000, 1));       // "123.5 MB" (decimal units, precision 1)
`}</SyntaxHighlighter>
    </div>
  );
}
