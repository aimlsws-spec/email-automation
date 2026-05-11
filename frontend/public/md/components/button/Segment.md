```jsx
// Import Dependencies
import { RadioGroup, Radio } from "@headlessui/react";
import clsx from "clsx";
import {
  Bars3BottomLeftIcon,
  Bars3BottomRightIcon,
  Bars3CenterLeftIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Button } from "components/ui";
import { randomId } from "utils/randomId";

// ----------------------------------------------------------------------

const items = [
  {
    id: randomId(),
    icon: Bars3BottomRightIcon,
  },
  {
    id: randomId(),
    icon: Bars3BottomLeftIcon,
  },
  {
    id: randomId(),
    icon: Bars3CenterLeftIcon,
  },
  {
    id: randomId(),
    icon: Bars3Icon,
  },
];

const Segment = () => {
  return (
    <RadioGroup
      name="options"
      defaultValue={items[1].id}
      className="mt-4 flex flex-wrap -space-x-px "
    >
      {items.map((item) => (
        <Radio
          as={Button}
          unstyled
          key={item.id}
          value={item.id}
          className={({ checked }) =>
            clsx(
              "size-9 border border-gray-300 text-gray-800 dark:border-dark-450 dark:text-dark-100 ltr:first:rounded-l-lg ltr:last:rounded-r-lg rtl:first:rounded-r-lg rtl:last:rounded-l-lg",
              checked && "bg-gray-200 dark:bg-dark-500",
            )
          }
        >
          <item.icon className="size-5" />
        </Radio>
      ))}
    </RadioGroup>
  );
};

export { Segment };

```