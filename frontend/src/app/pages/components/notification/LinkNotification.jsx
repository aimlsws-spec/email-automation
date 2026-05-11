// Import Dependencies
import PropTypes from "prop-types";
import { toast } from "sonner";
import { ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

const Notification = ({ index, to, ...rest }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(to)}
      role="alert"
      className="this:info group relative flex cursor-pointer items-center space-x-2 rounded-lg bg-this p-2 text-white "
      {...rest}
    >
      <img
        src="/images/objects/object-19.jpg"
        className="size-10 rounded-lg object-cover object-center"
        alt="object"
      />
      <div className="flex-1">
        <h3 className="leading-tight">New Product Added</h3>
        <p className="mt-0.5 text-xs text-white/90">
          <span className="font-semibold">@thevendor</span> added new product
        </p>
      </div>
      <div>
        <ChevronRightIcon className="size-4" />
      </div>

      <Button
        onClick={(e) => {
          e.stopPropagation();
          toast.dismiss(index);
        }}
        isIcon
        className="absolute -right-1.5 -top-1.5 size-4.5 rounded-full opacity-0 sm:group-hover:opacity-100"
      >
        <XMarkIcon className="size-3 stroke-2" />
      </Button>
    </div>
  );
};

export function LinkNotification() {
  return (
    <div className="max-w-xl">
      <Button
        onClick={() =>
          toast.custom((t) => <Notification index={t} to="/components/feedback/notification" />, {
            duration: 2000,
            className: "w-full",
          })
        }
      >
        LinkNotification
      </Button>
    </div>
  );
}

Notification.propTypes = {
  index: PropTypes.number,
  to: PropTypes.string,
};
