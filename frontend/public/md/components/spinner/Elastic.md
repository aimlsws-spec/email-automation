```jsx
import { Spinner } from "components/ui";

const Elastic = () => {
  return (
    <div className="inline-space flex flex-wrap">
      <Spinner isElastic />
      <Spinner color="primary" isElastic />
      <Spinner color="secondary" isElastic />
      <Spinner color="info" isElastic />
      <Spinner color="success" isElastic />
      <Spinner color="warning" isElastic />
      <Spinner color="error" isElastic />
    </div>
  );
};

export { Elastic };
```