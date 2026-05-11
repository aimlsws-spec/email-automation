```jsx
import { Progress } from "components/ui";

const ProgressSizes = () => {
  return (
    <div className="max-w-2xl space-y-4">
      <Progress value={33} className="h-1" />
      <Progress value={33} />
      <Progress value={33} className="h-4" />
      <Progress value={33} className="h-6" />
    </div>
  );
};

export { ProgressSizes };
```