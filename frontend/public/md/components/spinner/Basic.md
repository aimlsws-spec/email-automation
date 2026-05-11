```jsx
import { Spinner } from "components/ui";

const Basic = () => {
  return (
    <div className="inline-space flex flex-wrap">
      <Spinner />
      <Spinner color="primary" />
      <Spinner color="secondary" />
      <Spinner color="info" />
      <Spinner color="success" />
      <Spinner color="warning" />
      <Spinner color="error" />
    </div>
  );
};

export { Basic };
```