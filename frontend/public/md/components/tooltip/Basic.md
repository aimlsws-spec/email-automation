```jsx
import { Button } from "components/ui";

const Basic = () => {
  return (
    <div className="inline-space flex flex-wrap">
      <Button data-tooltip data-tooltip-content="I'm a tooltip">
        Default
      </Button>
      <Button
        color="success"
        data-tooltip
        data-tooltip-variant="success"
        data-tooltip-content="I'm a tooltip"
      >
        Success
      </Button>
      <Button
        color="warning"
        data-tooltip
        data-tooltip-variant="warning"
        data-tooltip-content="I'm a tooltip"
      >
        Warning
      </Button>
      <Button
        color="info"
        data-tooltip
        data-tooltip-variant="info"
        data-tooltip-content="I'm a tooltip"
      >
        Info
      </Button>
      <Button
        color="error"
        data-tooltip
        data-tooltip-variant="error"
        data-tooltip-content="I'm a tooltip"
      >
        Error
      </Button>
    </div>
  );
};

export { Basic };
```