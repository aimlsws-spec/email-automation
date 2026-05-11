```jsx
import { Button } from "components/ui";

const Outlined = () => {
  return (
    <div className="inline-space">
      <Button variant="outlined">Neutral</Button>
      <Button color="primary" variant="outlined">
        Primary
      </Button>
      <Button color="secondary" variant="outlined">
        Secondary
      </Button>
      <Button color="info" variant="outlined">
        Info
      </Button>
      <Button color="success" variant="outlined">
        Success
      </Button>
      <Button color="warning" variant="outlined">
        Warning
      </Button>
      <Button color="error" variant="outlined">
        Error
      </Button>
    </div>
  );
};

export { Outlined };

```