// Import Dependencies
import { MinusCircleIcon } from "@heroicons/react/20/solid";
import { FaCheckCircle, FaHistory, FaSpinner } from "react-icons/fa";

// Local Imports
import { Avatar, Card, Progress } from "components/ui";

// ----------------------------------------------------------------------

export function Statistic() {
  return (
    <Card className="px-4 pb-4 sm:px-5">
      <div className="flex h-14 items-center justify-between py-3">
        <h2 className="truncate text-sm-plus font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Statistic
        </h2>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar
            size={10}
            initialColor="warning"
            initialVariant="soft"
            classNames={{
              display: "mask is-squircle rounded-none",
            }}
          >
            <FaHistory className="size-5" />
          </Avatar>
          <div className="grow leading-none">
            <div className="flex justify-between">
              <p className="font-medium">Pending</p>
              <p className="text-warning dark:text-warning-light">50%</p>
            </div>
            <Progress
              classNames={{
                root: "mt-3 h-1.5",
              }}
              color="warning"
              variant="soft"
              value={50}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Avatar
            size={10}
            initialColor="primary"
            initialVariant="soft"
            classNames={{
              display: "mask is-squircle rounded-none",
            }}
          >
            <FaSpinner className="size-5" />
          </Avatar>
          <div className="grow leading-none">
            <div className="flex justify-between">
              <p className="font-medium">In Progress</p>
              <p className="text-primary-600 dark:text-primary-400">75%</p>
            </div>
            <Progress
              classNames={{
                root: "mt-3 h-1.5",
              }}
              color="primary"
              variant="soft"
              value={75}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Avatar
            size={10}
            initialColor="success"
            initialVariant="soft"
            classNames={{
              display: "mask is-squircle rounded-none",
            }}
          >
            <FaCheckCircle className="size-5" />
          </Avatar>
          <div className="grow leading-none">
            <div className="flex justify-between">
              <p className="font-medium">Pending</p>
              <p className="text-success dark:text-success-light">25%</p>
            </div>
            <Progress
              classNames={{
                root: "mt-3 h-1.5",
              }}
              color="success"
              variant="soft"
              value={25}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Avatar
            size={10}
            initialColor="warning"
            initialVariant="soft"
            classNames={{
              display: "mask is-squircle rounded-none",
            }}
          >
            <MinusCircleIcon className="size-5" />
          </Avatar>
          <div className="grow leading-none">
            <div className="flex justify-between">
              <p className="font-medium">Cancelled</p>
              <p className="text-error dark:text-error-light">17%</p>
            </div>
            <Progress
              classNames={{
                root: "mt-3 h-1.5",
              }}
              color="error"
              variant="soft"
              value={17}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
