// Import Dependencies
import { FaBluetoothB } from "react-icons/fa6";
import { CheckIcon } from "@heroicons/react/24/outline";

// ----------------------------------------------------------------------

export function Footer() {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="flex h-11 w-7 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white dark:bg-primary-500">
        <FaBluetoothB className="size-5" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-800 dark:text-dark-100">
            Card reader
          </p>
          <div className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-success text-white">
            <CheckIcon className="size-3 stroke-2" />
          </div>
        </div>
        <p className="text-xs text-gray-400 dark:text-dark-300">
          Device are connected
        </p>
      </div>
    </div>
  );
}
