```jsx
import { Select } from "components/ui";

const Custom = () => {
  return (
    <div className="max-w-xl">
      <Select
        label="Select Location"
        data={["Canada", "USA", "Germany", "Japan"]}
        className="rounded-full"
      />
      <Select
        classNames={{
          root: "mt-4",
          select:
            "rounded-lg bg-gray-150 px-3 py-2 ring-primary-500/50 focus:ring dark:bg-dark-900",
        }}
        label="Select Location"
        data={["Canada", "USA", "Germany", "Japan"]}
        unstyled
      />
    </div>
  );
};

export { Custom };
```