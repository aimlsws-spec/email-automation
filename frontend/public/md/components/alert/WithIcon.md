```jsx
// Import Dependencies
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import {
  BellAlertIcon,
  HeartIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

// ----------------------------------------------------------------------

const WithIcon = () => {
  return (
    <div className="max-w-2xl space-y-4">
      <div
        role="alert"
        className="flex items-center space-x-3 rounded-lg bg-gray-200 px-4 py-4 text-gray-800 dark:bg-dark-500 dark:text-dark-100 sm:px-5 "
      >
        <InformationCircleIcon className="size-6" />
        <span className="flex-1">This is simple alert</span>
      </div>
      <div
        role="alert"
        className="this:primary flex items-center space-x-3 rounded-lg bg-this px-4 py-4 text-white sm:px-5 "
      >
        <BellAlertIcon className="size-6" />
        <span className="flex-1">This is simple alert</span>
      </div>
      <div
        role="alert"
        className="this:secondary flex items-center space-x-3 rounded-lg bg-this px-4 py-4 text-white sm:px-5 "
      >
        <HeartIcon className="size-6" />
        <span className="flex-1">This is simple alert</span>
      </div>
      <div
        role="alert"
        className="this:info flex items-center space-x-3 rounded-lg bg-this px-4 py-4 text-white sm:px-5 "
      >
        <ExclamationCircleIcon className="size-7" />
        <span className="flex-1">This is simple alert</span>
      </div>
      <div
        role="alert"
        className="this:success flex items-center space-x-3 rounded-lg bg-this px-4 py-4 text-white sm:px-5 "
      >
        <CheckCircleIcon className="size-7" />
        <span className="flex-1">This is simple alert</span>
      </div>
      <div
        role="alert"
        className="this:warning flex items-center space-x-3 rounded-lg bg-this px-4 py-4 text-white sm:px-5 "
      >
        <ExclamationCircleIcon className="size-7" />
        <span className="flex-1">This is simple alert</span>
      </div>
      <div
        role="alert"
        className="this:error flex items-center space-x-3 rounded-lg bg-this px-4 py-4 text-white sm:px-5 "
      >
        <XCircleIcon className="size-7" />
        <span className="flex-1">This is simple alert</span>
      </div>
    </div>
  );
};

export { WithIcon };
```