import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Usage() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`import { msToTime } from "utils/msToTime";

console.log(msToTime(3661000)); // "01:01:01" (1 hour, 1 minute, 1 second)
console.log(msToTime(123456));  // "00:02:03" (2 minutes, 3 seconds)
console.log(msToTime(60000));   // "00:01:00" (1 minute)
console.log(msToTime(30000));     // "00:00:30" (30 seconds)`}</SyntaxHighlighter>
    </div>
  );
}
