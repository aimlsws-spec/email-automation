```jsx
import { Progress } from "components/ui";

const Basic = () => {
  return (
    <div className="max-w-2xl space-y-4">
      <Progress value={33} />
      <Progress color="primary" value={41} />
      <Progress color="secondary" value={50} />
      <Progress color="info" value={58} />
      <Progress color="success" value={66} />
      <Progress color="warning" value={75} />
      <Progress color="error" value={83} />
    </div>
  );
};

export { Basic };
```