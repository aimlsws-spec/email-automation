```jsx
import { Radio } from "components/ui";

const Disabled = () => {
  return (
    <div className="inline-space max-w-xl">
      <Radio disabled defaultChecked label="Selected" />
      <Radio disabled label="Unselected" />
    </div>
  );
};

export { Disabled };
```