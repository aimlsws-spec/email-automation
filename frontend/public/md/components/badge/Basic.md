```jsx
import { Badge } from "components/ui";

const Basic = () => {
  return (
    <div className="inline-space">
      <Badge>Neutral</Badge>
      <Badge color="primary">Primary</Badge>
      <Badge color="secondary">Secondary</Badge>
      <Badge color="info">Info</Badge>
      <Badge color="success">Success</Badge>
      <Badge color="warning">Warning</Badge>
      <Badge color="error">Error</Badge>
    </div>
  );
};

export { Basic };

```