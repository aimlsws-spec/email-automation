// Local Imports
import { Progress } from "components/ui";

// ----------------------------------------------------------------------

export function Footer() {
  return (
    <div className="flex flex-col p-4">
      <div className="flex items-center justify-between">
        <p>
          <span className="font-medium text-gray-800 dark:text-dark-100">
            590GB{" "}
          </span>
          of 1TB
        </p>
        <a
          href="##"
          className="text-xs-plus font-medium text-primary-600 outline-hidden transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
        >
          Upgrade
        </a>
      </div>
      <Progress
        color="primary"
        classNames={{
          root: "mt-2 h-2",
        }}
        value={59}
      />
    </div>
  );
}
