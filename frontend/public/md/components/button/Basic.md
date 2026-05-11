```jsx
import { Button } from "components/ui";

const Basic = () => {
  return (
    <div className="inline-space">
      <Button>Default</Button>
      <Button color="primary">Primary</Button>
      <Button color="secondary">Secondary</Button>
      <Button color="info">Info</Button>
      <Button color="success">Success</Button>
      <Button color="warning">Warning</Button>
      <Button color="error">Error</Button>
    </div>
  );
};

export { Basic };
```