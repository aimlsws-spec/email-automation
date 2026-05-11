// Import Dependencies
import { InformationCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FaPhone } from "react-icons/fa";

// Local Imports
import { Button, Card, Switch } from "components/ui";

// ----------------------------------------------------------------------

export function ModuleToggle() {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex gap-x-4">
        <div>
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary-600/10 text-primary-600 dark:bg-primary-400/10 dark:text-primary-400">
            <FaPhone />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
            WebRTC Module
          </p>
          <p>Lorem ipsum dolor sit amet, consectetur</p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-1.5">
          <Button isIcon color="error" className="size-8 rounded-full">
            <TrashIcon className="size-4.5" />
          </Button>
          <Button isIcon className="size-8 rounded-full">
            <InformationCircleIcon className="size-4.5" />
          </Button>
        </div>
        <Switch defaultChecked />
      </div>
    </Card>
  );
}
