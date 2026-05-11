import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Usage() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`import { isServer } from "utils/isServer";
      
if (isServer) {
    console.log("The code is running on the server.");
} else {
    console.log("The code is running on the client.");
}`}</SyntaxHighlighter>
    </div>
  );
}
