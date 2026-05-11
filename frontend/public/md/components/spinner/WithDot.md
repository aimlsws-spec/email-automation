```jsx
import { Spinner } from "components/ui";

const WithDot = () => {
  return (
    <div className="inline-space flex flex-wrap">
      <Spinner variant="innerDot" />
      <Spinner color="primary" variant="innerDot" />
      <Spinner color="secondary" variant="innerDot" />
      <Spinner color="info" variant="innerDot" />
      <Spinner color="success" variant="innerDot" />
      <Spinner color="warning" variant="innerDot" />
      <Spinner color="error" variant="innerDot" />
    </div>
  );
};

export { WithDot };
```