// Import Dependencies
import { Switch } from "@headlessui/react";
import {
  BellAlertIcon,
  BellSlashIcon,
  WifiIcon,
  CloudIcon,
  Battery50Icon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";

// Local Imports
import { useListState } from "hooks";
import { randomId } from "utils/randomId";

// ----------------------------------------------------------------------

const items = [
  {
    key: randomId(),
    icon: { on: BellAlertIcon, off: BellSlashIcon },
    checked: true,
  },
  { key: randomId(), icon: { on: WifiIcon, off: WifiIcon }, checked: false },
  { key: randomId(), icon: { on: CloudIcon, off: CloudIcon }, checked: true },
  {
    key: randomId(),
    icon: { on: Battery50Icon, off: Battery50Icon },
    checked: true,
  },
  {
    key: randomId(),
    icon: { on: SpeakerWaveIcon, off: SpeakerXMarkIcon },
    checked: false,
  },
];

const HeadlessUiCustom = () => {
  const [list, handlers] = useListState(items);

  return (
    <div className="inline-space flex">
      {list.map((item, i) => {
        const Icon = item.checked ? item.icon.on : item.icon.off;
        return (
          <Switch
            key={item.key}
            checked={item.checked}
            onChange={(val) => handlers.setItemProp(i, "checked", val)}
            className={clsx(
              "flex size-12 items-center justify-center rounded-full transition-colors",
              item.checked
                ? "bg-primary-500 text-white"
                : "bg-gray-200 text-gray-600 dark:bg-dark-500 dark:text-dark-100"
            )}
          >
            <Icon className="size-5" />
          </Switch>
        );
      })}
    </div>
  );
};

export { HeadlessUiCustom };
