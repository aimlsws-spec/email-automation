```jsx
import { Select } from "components/ui";

const SelectSizes = () => {
  return (
    <div className="max-w-xl space-y-4">
      <Select
        label="Select Product"
        defaultValue="Potato"
        className="h-8 py-1 text-xs"
        data={["Apple", "Orange", "Potato", "Tomato"]}
      />
      <Select
        label="Select Product"
        defaultValue="Potato"
        data={["Apple", "Orange", "Potato", "Tomato"]}
      />
      <Select
        label="Select Product"
        defaultValue="Potato"
        className="h-12 text-base"
        data={["Apple", "Orange", "Potato", "Tomato"]}
      />
    </div>
  );
};

export { SelectSizes };
```