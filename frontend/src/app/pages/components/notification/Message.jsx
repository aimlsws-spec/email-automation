// Import Dependencies
import PropTypes from "prop-types";
import { toast } from "sonner";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Avatar, AvatarDot, Button } from "components/ui";

// ----------------------------------------------------------------------

const MessageNotification = ({ index }) => (
  <div className="flex w-72 space-x-4 rounded-lg bg-dark-600 px-4 pb-2 pt-4 ">
    <div className="flex items-start">
      <Avatar
        src="/images/avatar/avatar-5.jpg"
        indicator={<AvatarDot color="success" className="right-0" />}
      />
    </div>
    <div className="min-w-0">
      <div className="-mt-2 flex items-center justify-between">
        <h5 className="truncate font-medium tracking-wide text-dark-100 ltr:mr-2 rtl:ml-2">
          Message Header
        </h5>
        <Button
          onClick={() => toast.dismiss(index)}
          className="size-6 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
          variant="flat"
          isIcon
        >
          <XMarkIcon className="size-4 text-dark-100" />
        </Button>
      </div>
      <p className="leading-snug text-dark-200">
        Lorem ipsum dolor sit amet, consectetur
      </p>
      <div className="text-end">
        <button className="mt-1 text-xs font-medium text-primary-400 outline-hidden transition-colors duration-300 hover:text-primary-400/70 focus:text-primary-400/70">
          SHOW
        </button>
      </div>
    </div>
  </div>
);

export function Message() {
  return (
    <div className="max-w-xl">
      <Button
        onClick={() =>
          toast.custom((t) => <MessageNotification index={t} />, {
            className: "ltr:right-0 rtl:left-0",
          })
        }
      >
        Message
      </Button>
    </div>
  );
}

MessageNotification.propTypes = {
  index: PropTypes.number,
};
