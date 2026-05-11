import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Basic() {
  return (
    <SyntaxHighlighter language="jsx">{`import { useUncontrolled } from 'hooks';

function Demo() {
  const [_value, handleChange] = useUncontrolled({
    value: 10,
    defaultValue: 5,
    finalValue: 20,
    onChange: (val) => console.log(val > 10),
  });
}`}</SyntaxHighlighter>
  );
}
