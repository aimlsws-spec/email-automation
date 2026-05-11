import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function IsTokenValid() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`import { isTokenValid } from "utils/jwt";
      
if (isTokenValid("your_jwt_token_here")) {
  setSession("your_jwt_token_here");
} else {
  console.log("Token is invalid or expired.");
}`}</SyntaxHighlighter>
    </div>
  );
}
