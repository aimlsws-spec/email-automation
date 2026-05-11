import { Progress } from "components/ui";

const Custom = () => {
  return (
    <div className="max-w-2xl space-y-4">
      <Progress
        unstyled
        value={75}
        isActive
        classNames={{
          root: "h-4 bg-gray-150 dark:bg-dark-500",
          bar: "bg-linear-to-r from-secondary-light to-info",
        }}
      >
        <span className="px-3 text-xs text-white">75%</span>
      </Progress>

      <Progress
        unstyled
        value={75}
        isActive
        classNames={{
          root: "h-4 rounded-bl-none rounded-tr-none bg-lime-500/20",
          bar: "rounded-bl-none rounded-tr-none bg-lime-500",
        }}
      >
        <span className="px-3 text-xs text-white">75%</span>
      </Progress>
    </div>
  );
};

export { Custom };
