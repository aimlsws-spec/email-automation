// Import Dependencies
import {
  ChatBubbleBottomCenterTextIcon,
  EllipsisHorizontalIcon,
  PhoneIcon,
} from "@heroicons/react/20/solid";

// Local Imports
import { Avatar, Button, Card } from "components/ui";

// ----------------------------------------------------------------------

export function Contact() {
  return (
    <Card className="px-4 pb-2 pt-4">
      <div className="flex min-w-0 gap-3">
        <Avatar size={10} src="/images/avatar/avatar-6.jpg" />
        <div>
          <h3 className="truncate font-medium text-gray-800 dark:text-dark-100">
            Konnor Guzman
          </h3>
          <p className="mt-0.5 truncate text-xs">Web Developer</p>
        </div>
      </div>
      <p className="mt-2 text-xs-plus">Lorem ipsum dolor sit amet, consectetur.</p>
      <div className="mt-2 flex justify-end ltr:-mr-2 rtl:-ml-2">
        <Button variant="flat" isIcon className="size-7 rounded-full">
          <PhoneIcon className="size-4" />
        </Button>
        <Button variant="flat" isIcon className="size-7 rounded-full">
          <ChatBubbleBottomCenterTextIcon className="size-4" />
        </Button>
        <Button variant="flat" isIcon className="size-7 rounded-full">
          <EllipsisHorizontalIcon className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
