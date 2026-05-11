```jsx
import { Input } from "components/ui";

const Append = () => {
  return (
    <div className="max-w-xl">
      <label htmlFor="appendAddon">Append Addon</label>
      <div className="mt-1.5 flex -space-x-px ">
        <Input
          id="appendAddon"
          placeholder="Username"
          classNames={{
            root: "flex-1",
            input:
              "relative hover:z-1 focus:z-1 ltr:rounded-r-none rtl:rounded-l-none",
          }}
        />
        <div className="flex items-center justify-center border border-gray-300 px-3.5 dark:border-dark-450 ltr:rounded-r-lg rtl:rounded-l-lg">
          <span className="leading-none">@site.com</span>
        </div>
      </div>
    </div>
  );
};

export { Append };
```