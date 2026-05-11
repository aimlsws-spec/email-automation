```jsx
import { Badge } from "components/ui";

const Rounded = () => {
  return (
    <div className="inline-space">
      <Badge className="rounded-full">Neutral</Badge>
      <Badge color="primary" className="rounded-full">
        Primary
      </Badge>
      <Badge color="secondary" className="rounded-full">
        Secondary
      </Badge>
      <Badge color="info" className="rounded-full">
        Info
      </Badge>
      <Badge color="success" className="rounded-full">
        Success
      </Badge>
      <Badge color="warning" className="rounded-full">
        Warning
      </Badge>
      <Badge color="error" className="rounded-full">
        Error
      </Badge>
    </div>
  );
};

export { Rounded };
```