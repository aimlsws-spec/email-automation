// Import Dependencies
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

// Local Imports
import { Circlebar } from "components/ui";

// ----------------------------------------------------------------------

const Active = () => {
  return (
    <div className="inline-space flex max-w-2xl flex-wrap">
      <Circlebar value={33} isActive>
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          33%
        </span>
      </Circlebar>
      <Circlebar color="primary" value={41} isActive>
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          41%
        </span>
      </Circlebar>
      <Circlebar color="secondary" value={50} isActive>
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          50%
        </span>
      </Circlebar>
      <Circlebar color="info" value={58} isActive>
        <ExclamationCircleIcon className="size-9 text-info-light" />
      </Circlebar>
      <Circlebar color="success" value={66} isActive>
        <CheckCircleIcon className="size-9 text-success-light" />
      </Circlebar>
      <Circlebar color="warning" value={75} isActive>
        <ExclamationCircleIcon className="size-9 text-warning-light" />
      </Circlebar>
      <Circlebar color="error" value={83} isActive>
        <XCircleIcon className="size-9 text-error-light" />
      </Circlebar>
    </div>
  );
};

export { Active };
