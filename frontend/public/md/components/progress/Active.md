```jsx
import { Progress } from "components/ui";

const Active = () => {
  return (
    <div className="max-w-2xl space-y-4">
      <Progress value={33} isActive />
      <Progress color="primary" value={41} isActive />
      <Progress color="secondary" value={50} isActive />
      <Progress color="info" value={58} isActive />
      <Progress color="success" value={66} isActive />
      <Progress color="warning" value={75} isActive />
      <Progress color="error" value={83} isActive />
    </div>
  );
};

export { Active };
```