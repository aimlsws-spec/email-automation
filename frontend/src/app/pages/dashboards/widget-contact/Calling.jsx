// Import Dependencies
import { FaPhoneAlt } from "react-icons/fa";

// Local Imports
import { Avatar, Button, Card } from "components/ui";

// ----------------------------------------------------------------------

export function Calling() {
  return (
    <Card className="flex flex-col items-center p-4 sm:p-5 lg:p-7">
      <Avatar
        size={16}
        src="/images/avatar/avatar-20.jpg"
        classNames={{ display: "mask is-squircle rounded-none" }}
      />

      <h3 className="mt-3 text-base font-medium text-gray-800 dark:text-dark-100">
        Konnor Guzman
      </h3>
      <p className="text-gray-400 dark:text-dark-300">is calling</p>
      <div className="mt-6 flex gap-6">
        <Button color="success" className="size-9 rounded-full" isIcon>
          <FaPhoneAlt />
        </Button>
        <Button color="error" className="size-9 rounded-full" isIcon>
          <FaPhoneAlt className="rotate-[135deg]" />
        </Button>
      </div>
    </Card>
  );
}
