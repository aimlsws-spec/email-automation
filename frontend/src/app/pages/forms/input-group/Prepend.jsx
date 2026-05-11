import { Input } from "components/ui";

const Prepend = () => {
  return (
    <div className="max-w-xl">
      <label htmlFor="prependAddon">Prepend Addon</label>
      <div className="mt-1.5 flex -space-x-px ">
        <div className="flex items-center justify-center border border-gray-300 px-3.5 dark:border-dark-450 ltr:rounded-l-lg rtl:rounded-r-lg">
          <span className="leading-none">@</span>
        </div>
        <Input
          id="prependAddon"
          placeholder="Username"
          classNames={{
            root: "flex-1",
            input:
              "relative hover:z-1 focus:z-1 ltr:rounded-l-none rtl:rounded-r-none",
          }}
        />
      </div>
    </div>
  );
};

export { Prepend };
