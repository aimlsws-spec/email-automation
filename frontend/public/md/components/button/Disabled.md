```jsx
import { Button } from "components/ui";

const Disabled = () => {
  return (
    <div className="inline-space">
      <Button disabled>Neutral</Button>
      <Button color="primary" disabled>
        Primary
      </Button>
      <Button color="secondary" disabled>
        Secondary
      </Button>
      <Button color="info" disabled>
        Info
      </Button>
      <Button color="success" disabled>
        Success
      </Button>
      <Button color="warning" disabled>
        Warning
      </Button>
      <Button color="error" disabled>
        Error
      </Button>
    </div>
  );
};

export { Disabled };
```