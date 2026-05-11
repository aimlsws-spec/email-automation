// Import Dependencies
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

// Local Imports
import { Circlebar } from "components/ui";

// ----------------------------------------------------------------------

const SoftColor = () => {
  return (
    <div className="inline-space flex max-w-2xl flex-wrap">
      <Circlebar color="primary" variant="soft" value={41}>
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          41%
        </span>
      </Circlebar>
      <Circlebar color="secondary" variant="soft" value={50}>
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          50%
        </span>
      </Circlebar>
      <Circlebar color="info" variant="soft" value={58}>
        <ExclamationCircleIcon className="size-9 text-info-light" />
      </Circlebar>
      <Circlebar color="success" variant="soft" value={66}>
        <CheckCircleIcon className="size-9 text-success-light" />
      </Circlebar>
      <Circlebar color="warning" variant="soft" value={75}>
        <ExclamationCircleIcon className="size-9 text-warning-light" />
      </Circlebar>
      <Circlebar color="error" variant="soft" value={83}>
        <XCircleIcon className="size-9 text-error-light" />
      </Circlebar>
    </div>
  );
};

export { SoftColor };
