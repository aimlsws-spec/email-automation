```jsx
import { Button } from "components/ui";

const Default = () => {
  return (
    <Button
      data-tooltip
      data-tooltip-content={`I'm a tooltip`}
    >
      Default
    </Button>
  );
};

export { Default };
```