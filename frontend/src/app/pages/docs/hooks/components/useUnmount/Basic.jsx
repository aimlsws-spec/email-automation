import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Basic() {
  return (
    <SyntaxHighlighter language="jsx">{`import { useUnmount } from 'hooks'

export default function Component() {
  useUnmount(() => {
    // Cleanup logic here
  })

  return <div>Hello world</div>
}`}</SyntaxHighlighter>
  );
}
