```jsx
// Import Dependencies
import {
  FaUserEdit,
  FaImage,
  FaLeaf,
  FaProjectDiagram,
  FaHistory,
} from "react-icons/fa";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { ArrowUpRightIcon } from "@heroicons/react/20/solid";

// Local Imports
import { Avatar, Timeline, Tag, Button, TimelineItem } from "components/ui";

// ----------------------------------------------------------------------

export function Advanced() {
  return (
    <div className="max-w-sm">
      <Timeline pointSize="1.5rem">
        <TimelineItem
          title="User Photo Changed"
          time={new Date().setMinutes(new Date().getMinutes() - 12)}
          point={
            <div className="timeline-item-point this:secondary relative flex shrink-0 items-center justify-center rounded-full border border-current text-this dark:text-this-light">
              <FaUserEdit className="text-xs" />
            </div>
          }
        >
          <p> John Doe changed his avatar photo</p>
          <Avatar
            size={20}
            classNames={{
              root: "mt-2",
              display: "mask is-squircle rounded-none",
            }}
            src="/images/avatar/avatar-19.jpg"
          />
        </TimelineItem>
        <TimelineItem
          title="Image Gallery Added"
          time={new Date().setHours(new Date().getHours() - 2)}
          point={
            <div className="timeline-item-point this:primary relative flex shrink-0 items-center justify-center rounded-full border border-current text-this dark:text-this-light">
              <FaImage className="text-xs" />
            </div>
          }
        >
          <p>Mores Clarke added new image gallery</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <img
              className="rounded-lg"
              src="/images/objects/object-1.jpg"
              alt="gallery"
            />
            <img
              className="rounded-lg"
              src="/images/objects/object-2.jpg"
              alt="gallery"
            />
            <img
              className="rounded-lg"
              src="/images/objects/object-3.jpg"
              alt="gallery"
            />
            <img
              className="rounded-lg"
              src="/images/objects/object-4.jpg"
              alt="gallery"
            />
            <img
              className="rounded-lg"
              src="/images/objects/object-5.jpg"
              alt="gallery"
            />
            <img
              className="rounded-lg"
              src="/images/objects/object-6.jpg"
              alt="gallery"
            />
          </div>
          <div className="mt-4">
            <span className="font-medium text-gray-600 dark:text-dark-100">
              Category:
            </span>{" "}
            <a
              href="##"
              className="text-xs font-medium text-primary-600 outline-none transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
            >
              #Tag
            </a>{" "}
            <a
              href="##"
              className="text-xs font-medium text-primary-600 outline-none transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
            >
              #Gallery
            </a>
          </div>
        </TimelineItem>
        <TimelineItem
          title="Design Completed"
          time={new Date().setHours(new Date().getHours() - 3)}
          point={
            <div className="timeline-item-point this:success relative flex shrink-0 items-center justify-center rounded-full border border-current text-this dark:text-this-light">
              <FaLeaf className="text-xs" />
            </div>
          }
        >
          <p>Robert Nolan completed the design of the CRM application</p>
          <a
            href="##"
            className="mt-3 inline-flex space-x-1 font-medium text-primary-600 outline-none transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70 "
          >
            <DocumentArrowDownIcon className="size-5" />
            <span> Design-final.fig</span>
          </a>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Tag
              href="#"
              variant="soft"
              color="secondary"
              className="rounded-full border border-this-darker/40 dark:border-this-lighter/30"
            >
              UI/UX
            </Tag>
            <Tag
              href="#"
              variant="soft"
              color="info"
              className="rounded-full border border-this-darker/40 dark:border-this-lighter/30"
            >
              CRM
            </Tag>
            <Tag
              href="#"
              variant="soft"
              color="success"
              className="rounded-full border border-this-darker/40 dark:border-this-lighter/30"
            >
              Dashboard
            </Tag>
          </div>
        </TimelineItem>
        <TimelineItem
          title="ER Diagram"
          time={new Date().setDate(new Date().getDate() - 1)}
          point={
            <div className="timeline-item-point this:secondary relative flex shrink-0 items-center justify-center rounded-full border border-current text-this dark:text-this-light">
              <FaProjectDiagram className="text-xs" />
            </div>
          }
        >
          <p>Team completed the ER diagram app</p>
          <div className="mt-1">
            <p className="text-xs text-gray-400 dark:text-dark-300">Members:</p>
            <div className="mt-2 flex justify-between">
              <div className="flex flex-wrap -space-x-2">
                <Avatar
                  size={7}
                  src="/images/avatar/avatar-16.jpg"
                  classNames={{
                    root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                    display: "ring ring-white dark:ring-dark-700",
                  }}
                />
                <Avatar
                  size={7}
                  initialColor="info"
                  name="John Doe"
                  classNames={{
                    root: "origin-bottom text-xs transition-transform hover:z-10 hover:scale-125",
                    display: "ring ring-white dark:ring-dark-700",
                  }}
                />
                <Avatar
                  size={7}
                  src="/images/avatar/avatar-10.jpg"
                  classNames={{
                    root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                    display: "ring ring-white dark:ring-dark-700",
                  }}
                />
                <Avatar
                  size={7}
                  src="/images/avatar/avatar-8.jpg"
                  classNames={{
                    root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                    display: "ring ring-white dark:ring-dark-700",
                  }}
                />
                <Avatar
                  size={7}
                  src="/images/avatar/avatar-5.jpg"
                  classNames={{
                    root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                    display: "ring ring-white dark:ring-dark-700",
                  }}
                />
              </div>
              <Button className="size-7 rounded-full" isIcon>
                <ArrowUpRightIcon className="size-4.5" />
              </Button>
            </div>
          </div>
        </TimelineItem>
        <TimelineItem
          title="Weekly Report"
          time={new Date().setDate(new Date().getDate() - 2)}
          point={
            <div className="timeline-item-point this:error relative flex shrink-0 items-center justify-center rounded-full border border-current text-this dark:text-this-light">
              <FaHistory className="text-xs" />
            </div>
          }
        >
          <p className="mt-1">The weekly report was uploaded</p>
        </TimelineItem>
      </Timeline>
    </div>
  );
}

```