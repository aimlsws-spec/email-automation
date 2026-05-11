```jsx
import { Spinner } from "components/ui";

const SoftColorElastic = () => {
  return (
    <div className="inline-space flex flex-wrap">
      <Spinner variant="soft" isElastic />
      <Spinner color="primary" variant="soft" isElastic />
      <Spinner color="secondary" variant="soft" isElastic />
      <Spinner color="info" variant="soft" isElastic />
      <Spinner color="success" variant="soft" isElastic />
      <Spinner color="warning" variant="soft" isElastic />
      <Spinner color="error" variant="soft" isElastic />
    </div>
  );
};

export { SoftColorElastic };
```