// Import Dependencies
import {
  FaMicrophoneSlash,
  FaPhoneAlt,
  FaVoicemail,
  FaVolumeUp,
} from "react-icons/fa";
import { UserIcon } from "@heroicons/react/24/outline";
import { PiDotsNineBold } from "react-icons/pi";

// Local Imports
import { Avatar, Button, Card } from "components/ui";

// ----------------------------------------------------------------------

export function Speaking() {
  return (
    <Card className="flex flex-col items-center p-4 sm:p-5 lg:p-7">
      <Avatar
        size={16}
        src="/images/avatar/avatar-19.jpg"
        classNames={{
          display: "mask is-squircle rounded-none",
        }}
      />

      <h3 className="mt-3 text-base font-medium text-gray-800 dark:text-dark-100">
        Travis Fuller
      </h3>
      <p className="text-gray-400 dark:text-dark-300">00:01</p>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <Button isIcon variant="flat" className="size-9 rounded-full">
          <UserIcon className="size-5" />
        </Button>
        <Button isIcon variant="flat" className="size-9 rounded-full">
          <FaMicrophoneSlash className="size-5" />
        </Button>
        <Button isIcon variant="flat" className="size-9 rounded-full">
          <FaVoicemail className="size-5" />
        </Button>
        <Button isIcon variant="flat" className="size-9 rounded-full">
          <FaVolumeUp className="size-5" />
        </Button>
        <Button color="error" className="size-9 rounded-full" isIcon>
          <FaPhoneAlt className="rotate-[135deg]" />
        </Button>
        <Button isIcon variant="flat" className="size-9 rounded-full">
          <PiDotsNineBold className="size-5" />
        </Button>
      </div>
    </Card>
  );
}
