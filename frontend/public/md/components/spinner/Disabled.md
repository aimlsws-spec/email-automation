```jsx
import { Spinner } from "components/ui";

const Disabled = () => {
  return (
    <div>
      <div className="inline-space flex flex-wrap">
        <Spinner variant="soft" disabled />
        <Spinner variant="soft" color="primary" disabled />
        <Spinner variant="innerDot" disabled />
        <Spinner variant="innerDot" color="primary" disabled />
      </div>
    </div>
  );
};

export { Disabled };
```