```jsx
import { Select } from "components/ui";

const Multiple = () => {
  return (
    <div className="max-w-xl">
      <Select
        label="Select Location"
        defaultValue={["USA"]}
        multiple
        data={["Canada", "USA", "Germany", "Japan"]}
      />
    </div>
  );
};

export { Multiple };
```