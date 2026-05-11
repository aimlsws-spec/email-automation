```jsx
import { Switch } from "components/ui";

const Disabled = () => {
  return (
    <div className="flex flex-wrap gap-5">
      <Switch disabled defaultChecked label="Default" />
      <Switch disabled label="Default" />
    </div>
  );
};

export { Disabled };
```