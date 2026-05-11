// Import Dependencies
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  ChartBarIcon,
  ChatBubbleLeftEllipsisIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
  PhotoIcon,
  RectangleGroupIcon,
  VideoCameraIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment } from "react";

// Local Imports
import { Avatar, Button, Card } from "components/ui";

// ----------------------------------------------------------------------

const tags = [
  {
    uid: "1",
    Icon: PhotoIcon,
    color: "primary",
    tagname: "image",
    fileCount: "654",
    totalSize: "1.5 GB",
  },
  {
    uid: "2",
    Icon: VideoCameraIcon,
    color: "secondary",
    tagname: "video",
    fileCount: "135",
    totalSize: "14 GB",
  },
  {
    uid: "3",
    Icon: DocumentTextIcon,
    color: "info",
    tagname: "documents",
    fileCount: "5477",
    totalSize: "1.2 GB",
  },
  {
    uid: "4",
    Icon: ChartBarIcon,
    color: "success",
    tagname: "adminui",
    fileCount: "120",
    totalSize: "166 MB",
  },
  {
    uid: "5",
    Icon: ChatBubbleLeftEllipsisIcon,
    color: "warning",
    tagname: "chatui",
    fileCount: "14",
    totalSize: "69 MB",
  },
  {
    uid: "6",
    Icon: RectangleGroupIcon,
    color: "error",
    tagname: "uiux",
    fileCount: "136",
    totalSize: "2.6 MB",
  },
  {
    uid: "7",
    Icon: PhotoIcon,
    color: "primary",
    tagname: "image",
    fileCount: "654",
    totalSize: "1.5 GB",
  },
  {
    uid: "8",
    Icon: VideoCameraIcon,
    color: "secondary",
    tagname: "video",
    fileCount: "135",
    totalSize: "14 GB",
  },
  {
    uid: "9",
    Icon: DocumentTextIcon,
    color: "info",
    tagname: "documents",
    fileCount: "5477",
    totalSize: "1.2 GB",
  },
  {
    uid: "10",
    Icon: ChartBarIcon,
    color: "success",
    tagname: "adminui",
    fileCount: "120",
    totalSize: "166 MB",
  },
  {
    uid: "11",
    Icon: RectangleGroupIcon,
    color: "error",
    tagname: "uiux",
    fileCount: "136",
    totalSize: "2.6 MB",
  },
];

export function Tags() {
  return (
    <div className="col-span-12 lg:col-span-4 xl:col-span-3">
      <div className="flex min-w-0 items-center justify-between">
        <h2 className="truncate text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Tags
        </h2>
        <ActionMenu />
      </div>
      <Card className="mt-3 space-y-5 px-4 py-5 text-xs-plus">
        {tags.map((tag) => (
          <div key={tag.uid} className="flex items-center gap-3">
            <Avatar size={10} initialColor={tag.color}>
              <tag.Icon className="size-5" />
            </Avatar>
            <div>
              <a href="##" className="text-gray-800 dark:text-dark-100">
                #{tag.tagname}
              </a>
              <div className="mt-1 flex text-xs text-gray-400 dark:text-dark-300">
                <p>{tag.fileCount} Files</p>
                <div className="mx-2 my-1 w-px bg-gray-200 dark:bg-dark-500"></div>
                <p>{tag.totalSize}</p>
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function ActionMenu() {
  return (
    <Menu
      as="div"
      className="relative inline-block text-left ltr:-mr-1.5 rtl:-ml-1.5"
    >
      <MenuButton
        as={Button}
        variant="flat"
        isIcon
        className="size-8 rounded-full"
      >
        <EllipsisHorizontalIcon className="size-5" />
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out"
        enterFrom="opacity-0 translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-2"
      >
        <MenuItems className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0">
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                  focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                <span>Action</span>
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                  focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                <span>Another action</span>
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                  focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                <span>Other action</span>
              </button>
            )}
          </MenuItem>

          <hr className="mx-3 my-1.5 h-px border-gray-150 dark:border-dark-500" />

          <MenuItem>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center px-3 tracking-wide outline-hidden transition-colors",
                  focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                <span>Separated action</span>
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
