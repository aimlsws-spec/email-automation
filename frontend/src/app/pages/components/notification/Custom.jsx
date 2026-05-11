// Import Dependencies
import PropTypes from "prop-types";
import { toast } from "sonner";
import Marquee from "react-fast-marquee";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { BellAlertIcon } from "@heroicons/react/24/solid";

// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

const CustomNotification = ({ index }) => (
  <div
    role="alert"
    className="this:primary flex items-center space-x-2 rounded-lg bg-this px-4 py-4 text-white sm:px-5 "
  >
    <BellAlertIcon className="size-6" />
    <span className="flex-1">
      <Marquee pauseOnHover gradient={false}>
        I can be a React component, multiple React components, or just some
        text. I can be a React component, multiple React components, or just
        some text. I can be a React component, multiple React components, or
        just some text. I can be a React component, multiple React components,
        or just some text.
      </Marquee>
    </span>
    <div>
      <Button
        onClick={() => toast.dismiss(index)}
        unstyled
        className="size-6 shrink-0 rounded-full p-0 text-white hover:bg-white/30 focus:bg-white/30 ltr:-mr-1 rtl:-ml-1"
      >
        <XMarkIcon className="size-4" />
      </Button>
    </div>
  </div>
);

export function Custom() {
  return (
    <div className="max-w-xl">
      <Button
        onClick={() =>
          toast.custom((t) => <CustomNotification index={t} />, {
            duration: Infinity,
          })
        }
      >
        Default
      </Button>
    </div>
  );
}

CustomNotification.propTypes = {
  index: PropTypes.number,
};
