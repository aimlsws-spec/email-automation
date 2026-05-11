```jsx
import { Select } from "components/ui";

const WithLabel = () => {
  return (
    <div className="max-w-xl">
      <Select
        label="Select Product"
        defaultValue="Potato"
        data={["Apple", "Orange", "Potato", "Tomato"]}
      />
    </div>
  );
};

export { WithLabel };
```