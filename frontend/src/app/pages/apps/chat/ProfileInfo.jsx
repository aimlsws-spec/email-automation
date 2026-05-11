// Import Dependencies
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import {
  ChevronRightIcon,
  DocumentChartBarIcon,
  EnvelopeIcon,
  PhoneIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

// Local Imports
import { Avatar, AvatarDot, Button, Switch } from "components/ui";
import { useBreakpointsContext } from "app/contexts/breakpoint/context";
import { LanguageSelector } from "components/template/LaguageSelector";
import { useId } from "hooks";
import { useChatContext } from "./Chat.context";
import { useThemeContext } from "app/contexts/theme/context";

// ----------------------------------------------------------------------

const images = [
  {
    id: "1",
    src: "/images/foods/food-4.jpg",
  },
  {
    id: "2",
    src: "/images/objects/object-2.jpg",
  },
  {
    id: "3",
    src: "/images/foods/food-11.jpg",
  },
  {
    id: "4",
    src: "/images/foods/food-9.jpg",
  },
  {
    id: "5",
    src: "/images/objects/object-3.jpg",
  },
  {
    id: "6",
    src: "/images/objects/object-4.jpg",
  },
  {
    id: "7",
    src: "/images/foods/food-7.jpg",
  },
  {
    id: "8",
    src: "/images/objects/object-5.jpg",
  },
  {
    id: "9",
    src: "/images/objects/object-6.jpg",
  },
  {
    id: "10",
    src: "/images/objects/object-7.jpg",
  },
  {
    id: "11",
    src: "/images/objects/object-8.jpg",
  },
  {
    id: "12",
    src: "/images/objects/object-9.jpg",
  },
];

export function ProfileInfo() {
  const { showProfile, currentChat, setShowProfile } = useChatContext();
  const { smAndDown } = useBreakpointsContext();
  const { cardSkin } = useThemeContext();
  const notificationId = useId();

  if (!currentChat) return null;

  return (
    <Transition appear show={showProfile} as={Fragment}>
      <div className="relative z-100">
        {smAndDown && (
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              onClick={() => setShowProfile(false)}
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity dark:bg-black/40"
            />
          </TransitionChild>
        )}

        <TransitionChild
          as={Fragment}
          enter="ease-out transform-gpu transition-transform duration-200"
          enterFrom="ltr:translate-x-full rtl:-translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in transform-gpu transition-transform duration-200"
          leaveFrom="translate-x-0"
          leaveTo="itr:translate-x-full rtl:-translate-x-full"
        >
          <div
            className={clsx(
              cardSkin === "bordered" ? "dark:bg-dark-900" : "dark:bg-dark-750",
              "fixed top-0 flex h-full w-full transform-gpu flex-col border-gray-200 bg-white transition-transform duration-200 dark:border-dark-600 sm:w-80 ltr:right-0 ltr:border-l rtl:left-0 rtl:border-r",
            )}
          >
            <div className="flex h-[60px] min-w-0 items-center justify-between p-4">
              <h3 className="truncate text-base font-medium text-gray-800 dark:text-dark-100">
                Chat Info
              </h3>
              <div className="flex gap-1 ltr:-mr-1.5 rtl:-ml-1.5">
                <LanguageSelector />
                <Button
                  onClick={() => setShowProfile(false)}
                  variant="flat"
                  isIcon
                  className="size-9 rounded-full"
                >
                  <ChevronRightIcon className="size-5 rtl:rotate-180" />
                </Button>
              </div>
            </div>

            <div className="flex grow flex-col px-4">
              <div className="mt-5 flex flex-col items-center">
                <Avatar
                  size={20}
                  name={currentChat.profile.name}
                  src={currentChat.profile.avatar}
                  initialColor="auto"
                  classNames={{
                    display: "text-2xl",
                  }}
                  indicator={
                    currentChat.isOnline ? (
                      <AvatarDot
                        isPing={currentChat.isImportant}
                        color={currentChat.isMuted ? "neutral" : "primary"}
                        className="right-2 size-4"
                      />
                    ) : undefined
                  }
                ></Avatar>
                <h3 className="mt-4 text-lg font-medium text-gray-800 dark:text-dark-100">
                  {currentChat.profile.name}
                </h3>
                <p>Frontend Developer</p>
              </div>

              <div className="mt-2 flex justify-center gap-1.5">
                <Button variant="flat" isIcon className="size-10 rounded-full">
                  <PhoneIcon className="size-5" />
                </Button>
                <Button variant="flat" isIcon className="size-10 rounded-full">
                  <VideoCameraIcon className="size-5" />
                </Button>
                <Button variant="flat" isIcon className="size-10 rounded-full">
                  <EnvelopeIcon className="size-5" />
                </Button>
              </div>

              <TabGroup as="div" className="mt-4">
                <div className="hide-scrollbar overflow-x-auto">
                  <div className="w-max min-w-full">
                    <TabList className="flex">
                      <Tab
                        className={({ selected }) =>
                          clsx(
                            "shrink-0 space-x-2 whitespace-nowrap border-b-2 px-3 py-2 font-medium ",
                            selected
                              ? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400"
                              : "border-transparent hover:text-gray-800 focus:text-gray-800 dark:hover:text-dark-100 dark:focus:text-dark-100",
                          )
                        }
                        as={Button}
                        unstyled
                      >
                        Images
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          clsx(
                            "shrink-0 space-x-2 whitespace-nowrap border-b-2 px-3 py-2 font-medium ",
                            selected
                              ? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400"
                              : "border-transparent hover:text-gray-800 focus:text-gray-800 dark:hover:text-dark-100 dark:focus:text-dark-100",
                          )
                        }
                        as={Button}
                        unstyled
                      >
                        Files
                      </Tab>
                    </TabList>
                  </div>
                </div>
                <TabPanels className="mt-5">
                  <TabPanel>
                    {({ selected }) => (
                      <Transition
                        appear
                        show={selected}
                        enter="transition-all duration-500 easy-in-out"
                        enterFrom="opacity-0 [transform:translate3d(1rem,0,0)]"
                        enterTo="opacity-100 [transform:translate3d(0,0,0)]"
                      >
                        <div className="grid grid-cols-4 gap-2">
                          {images.map((image) => (
                            <img
                              className="aspect-square rounded-lg object-cover object-center"
                              key={image.id}
                              src={image.src}
                              alt={"image" + image.id}
                            />
                          ))}
                        </div>
                      </Transition>
                    )}
                  </TabPanel>

                  <TabPanel>
                    {({ selected }) => (
                      <Transition
                        appear
                        show={selected}
                        enter="transition-all duration-500 easy-in-out"
                        enterFrom="opacity-0 [transform:translate3d(1rem,0,0)]"
                        enterTo="opacity-100 [transform:translate3d(0,0,0)]"
                      >
                        <div className="flex flex-col space-y-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar
                              size={11}
                              initialColor="secondary"
                              classNames={{
                                display: "rounded-lg",
                              }}
                            >
                              <DocumentChartBarIcon className="size-6" />
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-800 dark:text-dark-100">
                                Final.fig
                              </p>
                              <div className="flex text-xs text-gray-400 dark:text-dark-300">
                                <span>45 MB</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Avatar
                              size={11}
                              initialColor="info"
                              classNames={{
                                display: "rounded-lg",
                              }}
                            >
                              <DocumentChartBarIcon className="size-6" />
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-800 dark:text-dark-100">
                                Report.docs
                              </p>
                              <div className="flex text-xs text-gray-400 dark:text-dark-300">
                                <span>3.5 MB</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Avatar
                              size={11}
                              initialColor="warning"
                              classNames={{
                                display: "rounded-lg",
                              }}
                            >
                              <DocumentChartBarIcon className="size-6" />
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-800 dark:text-dark-100">
                                Thebook.pdf
                              </p>
                              <div className="flex text-xs text-gray-400 dark:text-dark-300">
                                <span>14 MB</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Transition>
                    )}
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </div>

            <div className="flex h-12 shrink-0 items-center justify-between border-t border-gray-150 px-4 py-1 dark:border-dark-600">
              <label
                htmlFor={notificationId}
                className="font-medium text-gray-800 dark:text-dark-100"
              >
                Notification
              </label>
              <Switch id={notificationId} defaultChecked />
            </div>
          </div>
        </TransitionChild>
      </div>
    </Transition>
  );
}
