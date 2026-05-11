import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function AssignRef() {
  return (
    <SyntaxHighlighter language="jsx">{`import { useState } from 'react';
import { assignRef } from 'hooks';

function Demo({ handlersRef }) {
  const [value, setValue] = useState(0);

  const increment = () => setValue((v) => v + 1);
  const decrement = () => setValue((v) => v - 1);

  assignRef(handlersRef, { increment, decrement });

  return (
    <>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </>
  );
}`}</SyntaxHighlighter>
  );
}
