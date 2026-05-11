// Import Dependencies
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

// Local Imports
import { Input, Button } from "components/ui";
import { useDisclosure } from "hooks";

// ----------------------------------------------------------------------

const Password = () => {
  const [show, { toggle }] = useDisclosure();

  return (
    <div className="max-w-xl">
      <Input
        label="Label input"
        type={show ? "text" : "password"}
        placeholder="Enter Password"
        prefix={<LockClosedIcon className="size-4.5" />}
        suffix={
          <Button
            variant="flat"
            className="pointer-events-auto size-6 shrink-0 rounded-full p-0"
            onClick={toggle}
          >
            {show ? (
              <EyeSlashIcon className="size-4.5 text-gray-500 dark:text-dark-200" />
            ) : (
              <EyeIcon className="size-4.5 text-gray-500 dark:text-dark-200" />
            )}
          </Button>
        }
      />
    </div>
  );
};

export { Password };
