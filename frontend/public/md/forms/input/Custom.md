```jsx
import { Input } from "components/ui";

const Custom = () => {
  return (
    <div className="max-w-xl">
      <Input className="rounded-full" placeholder="Enter Username" />
      <Input
        unstyled
        classNames={{
          root: "mt-4",
          input:
            "rounded-lg bg-gray-150 px-3 py-2 placeholder:text-gray-400 focus:ring focus:ring-primary-500/50 dark:bg-dark-900 dark:placeholder:text-dark-200/70",
        }}
        placeholder="Enter Username"
      />
    </div>
  );
};

export { Custom };
```