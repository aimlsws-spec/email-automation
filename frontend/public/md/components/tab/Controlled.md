```jsx
// Import Dependencies
import { useState } from "react";
import clsx from "clsx";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import {
  HomeIcon,
  EnvelopeIcon,
  UserIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Button, Tag } from "components/ui";
import { randomId } from "utils/randomId";

// ----------------------------------------------------------------------

const tabs = [
  {
    id: randomId(),
    title: "Home",
    icon: HomeIcon,
    content: (
      <div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
          elementum finibus arcu vitae scelerisque. Etiam rutrum blandit
          condimentum. Maecenas condimentum massa vitae quam interdum, et
          lacinia urna tempor
        </p>

        <div className="space-x-2 pt-3 ">
          <Tag href="#">Tag 1</Tag>
          <Tag href="#">Tag 2</Tag>
        </div>
        <p className="pt-3 text-xs text-gray-400 dark:text-dark-300">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
          dolore non atque?
        </p>
      </div>
    ),
  },
  {
    id: randomId(),
    title: "Profile",
    icon: UserIcon,
    content: (
      <div>
        <p>
          Pellentesque pulvinar, sapien eget fermentum sodales, felis lacus
          viverra magna, id pulvinar odio metus non enim. Ut id augue interdum,
          ultrices felis eu, tincidunt libero.
        </p>
        <div className="space-x-2 pt-3 ">
          <Tag href="#">Tag 1</Tag>
          <Tag href="#">Tag 2</Tag>
        </div>
        <p className="pt-3 text-xs text-gray-400 dark:text-dark-300">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
          dolore non atque?
        </p>
      </div>
    ),
  },
  {
    id: randomId(),
    title: "Messages",
    icon: EnvelopeIcon,
    content: (
      <div>
        <p>
          Cras iaculis ipsum quis lectus faucibus, in mattis nulla molestie.
          Vestibulum vel tristique libero. Morbi vulputate odio at viverra
          sodales. Curabitur accumsan justo eu libero porta ultrices vitae eu
          leo.
        </p>

        <div className="space-x-2 pt-3 ">
          <Tag href="#">Tag 1</Tag>
          <Tag href="#">Tag 2</Tag>
        </div>
        <p className="pt-3 text-xs text-gray-400 dark:text-dark-300">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
          dolore non atque?
        </p>
      </div>
    ),
  },
  {
    id: randomId(),
    title: "Setting",
    icon: Cog6ToothIcon,
    content: (
      <div>
        <p>
          Etiam nec ante eget lacus vulputate egestas non iaculis tellus.
          Suspendisse tempus ex in tortor venenatis malesuada. Aenean consequat
          dui vitae nibh lobortis condimentum. Duis vel risus est.
        </p>

        <div className="space-x-2 pt-3 ">
          <Tag href="#">Tag 1</Tag>
          <Tag href="#">Tag 2</Tag>
        </div>
        <p className="pt-3 text-xs text-gray-400 dark:text-dark-300">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
          dolore non atque?
        </p>
      </div>
    ),
  },
];

const Controlled = () => {
  const [selectedIndex, setSelectedIndex] = useState(2);

  return (
    <div className="max-w-xl">
      <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <div className="hide-scrollbar overflow-x-auto">
          <div className="w-max min-w-full border-b-2 border-gray-150 dark:border-dark-500">
            <TabList className="-mb-0.5 flex">
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  className={({ selected }) =>
                    clsx(
                      "shrink-0 space-x-2 whitespace-nowrap border-b-2 px-3 py-2 font-medium ",
                      selected
                        ? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400"
                        : "border-transparent hover:text-gray-800 focus:text-gray-800 dark:hover:text-dark-100 dark:focus:text-dark-100"
                    )
                  }
                  as={Button}
                  unstyled
                >
                  <tab.icon className="size-4.5" />
                  <span>{tab.title}</span>
                </Tab>
              ))}
            </TabList>
          </div>
        </div>
        <TabPanels className="mt-3">
          {tabs.map((tab) => (
            <TabPanel key={tab.id}>{tab.content}</TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export { Controlled };
```