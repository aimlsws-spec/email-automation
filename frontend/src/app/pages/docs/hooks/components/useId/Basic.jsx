import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Basic() {
  return (
    <SyntaxHighlighter language="jsx">{`import { useId } from 'hooks';

function Input({ id }: { id?: string }) {
  const uuid = useId(id);

  return (
    <>
      <label htmlFor={uuid}>Input label</label>
      <input type="text" id={uuid} />
    </>
  );
}

// input and label will have id 'my-id'
const withId = <Input id="my-id" />;

// input and label will have random id 'tl-fZMoF'
const withoutId = <Input />;`}</SyntaxHighlighter>
  );
}
