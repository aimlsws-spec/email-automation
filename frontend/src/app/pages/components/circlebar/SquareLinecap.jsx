// Import Dependencies
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

// Local Imports
import { Circlebar } from "components/ui";

// ----------------------------------------------------------------------

const SquareLinecap = () => {
  return (
    <div className="inline-space flex max-w-2xl flex-wrap">
      <Circlebar value={33} strokeLinecap="square">
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          33%
        </span>
      </Circlebar>
      <Circlebar color="primary" value={41} strokeLinecap="square">
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          41%
        </span>
      </Circlebar>
      <Circlebar color="secondary" value={50} strokeLinecap="square">
        <span className="text-lg font-medium text-gray-800 dark:text-dark-100">
          50%
        </span>
      </Circlebar>
      <Circlebar color="info" value={58} strokeLinecap="square">
        <ExclamationCircleIcon className="size-9 text-info-light" />
      </Circlebar>
      <Circlebar color="success" value={66} strokeLinecap="square">
        <CheckCircleIcon className="size-9 text-success-light" />
      </Circlebar>
      <Circlebar color="warning" value={75} strokeLinecap="square">
        <ExclamationCircleIcon className="size-9 text-warning-light" />
      </Circlebar>
      <Circlebar color="error" value={83} strokeLinecap="square">
        <XCircleIcon className="size-9 text-error-light" />
      </Circlebar>
    </div>
  );
};

export { SquareLinecap };
