// Import Dependencies
import {
  HeartIcon,
  CreditCardIcon,
  HandThumbUpIcon,
  SpeakerWaveIcon,
  TrashIcon,
  ArrowsUpDownIcon,
  EllipsisVerticalIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { StarIcon, BeakerIcon, HomeIcon } from "@heroicons/react/24/solid";
import { FaPaperPlane } from "react-icons/fa";


// Local Imports
import { Button } from "components/ui";

// ----------------------------------------------------------------------

const OnlyIcon = () => {
  return (
    <div className="inline-space">
      <Button color="secondary" isIcon className="size-9 rounded-full">
        <HeartIcon className="size-5" />
      </Button>

      <Button color="primary" isIcon className="size-9 rounded-full">
        <StarIcon className="size-5" />
      </Button>

      <Button
        color="info"
        variant="soft"
        isIcon
        className="size-9 rounded-full"
      >
        <CreditCardIcon className="size-5" />
      </Button>

      <Button color="success" isGlow isIcon className="size-9">
        <HandThumbUpIcon className="size-5" />
      </Button>

      <Button color="primary" variant="outlined" isIcon className="size-9">
        <SpeakerWaveIcon className="size-5" />
      </Button>

      <Button color="warning" isIcon className="size-9 rounded-full">
        <BeakerIcon className="size-5" />
      </Button>

      <Button color="error" variant="soft" isIcon className="size-9">
        <TrashIcon className="size-5" />
      </Button>

      <Button isGlow isIcon className="size-9 rounded-full">
        <HomeIcon className="size-5" />
      </Button>

      <Button color="primary" isIcon className="mask is-hexagon size-9">
        <ArrowsUpDownIcon className="size-5" />
      </Button>

      <Button color="info" isIcon className="mask is-squircle size-9">
        <FaPaperPlane className="size-4" />
      </Button>

      <Button variant="outlined" isIcon className="size-9 rounded-full">
        <EllipsisVerticalIcon className="size-5 stroke-2" />
      </Button>

      <Button variant="flat" isIcon className="size-9 rounded-full">
        <EllipsisHorizontalIcon className="size-5 stroke-2" />
      </Button>
    </div>
  );
};

export { OnlyIcon };
