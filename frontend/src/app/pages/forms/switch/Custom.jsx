import { Switch } from "components/ui";

const Custom = () => {
  return (
    <div className="flex flex-wrap gap-5">
      <Switch
        unstyled
        defaultChecked
        label="Custom"
        className="bg-gray-300 before:bg-gray-50 checked:bg-gray-500 checked:before:bg-white dark:bg-dark-900 dark:before:bg-dark-300 dark:checked:bg-dark-400 dark:checked:before:bg-white"
      />
      <Switch
        unstyled
        defaultChecked
        label="Custom"
        className="this:primary border border-gray-400/70 before:bg-gray-300 checked:border-this checked:bg-this checked:before:bg-white dark:border-dark-400 dark:before:bg-dark-300 dark:checked:border-this-light dark:checked:bg-this-light dark:checked:before:bg-white"
      />
    </div>
  );
};

export { Custom };
