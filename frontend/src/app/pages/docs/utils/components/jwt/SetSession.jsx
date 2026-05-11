import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function SetSession() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`import { setSession } from "utils/jwt";

setSession("your_jwt_token_here");`}</SyntaxHighlighter>
    </div>
  );
}
