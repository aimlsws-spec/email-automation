// Import Dependencies
import PropTypes from "prop-types";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Avatar, Button, Card } from "components/ui";

// ----------------------------------------------------------------------

export function AuthorCard({
  name,
  avatar,
  messages,
  mails,
  posts,
  views,
  followers,
  awards,
}) {
  return (
    <Card skin="shadow" className="w-72 shrink-0 space-y-9 p-4 sm:p-5">
      <div className="flex justify-between gap-2">
        <div className="flex items-center gap-3">
          <Avatar
            size={10}
            name={name}
            src={avatar}
            initialColor="auto"
            classNames={{
              display: "mask is-squircle rounded-none",
            }}
          />
          <div>
            <p className="font-medium text-gray-800 dark:text-dark-100">
              {name}
            </p>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-300">
              Writer
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Button className="size-7" color="primary" variant="soft" isIcon>
              <ChatBubbleOvalLeftEllipsisIcon className="size-4" />
            </Button>
            {messages && (
              <div className="pointer-events-none absolute right-0 top-0 -m-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary-600 px-1 text-tiny font-medium leading-none text-white dark:bg-primary-500">
                {messages}
              </div>
            )}
          </div>
          <div className="relative">
            <Button className="size-7" color="primary" variant="soft" isIcon>
              <EnvelopeIcon className="size-4" />
            </Button>
            {mails && (
              <div className="pointer-events-none absolute right-0 top-0 -m-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary-600 px-1 text-tiny font-medium leading-none text-white dark:bg-primary-500">
                {mails}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-2">
        <div>
          <p className="text-xs-plus">Posts</p>
          <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
            {posts}
          </p>
        </div>
        <div>
          <p className="text-xs-plus">Views</p>
          <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
            {views}
          </p>
        </div>
        <div>
          <p className="text-xs-plus">Followers</p>
          <p className="text-xl font-semibold text-gray-800 dark:text-dark-100">
            {followers}
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          {awards.map((award) => (
            <img
              data-tooltip
              data-tooltip-content={award.label}
              key={award.uid}
              className="size-6"
              src={award.image}
              alt={award.label}
            />
          ))}
        </div>
        <Button
          variant="flat"
          isIcon
          className="size-8 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
        >
          <Cog6ToothIcon className="size-5" />
        </Button>
      </div>
    </Card>
  );
}

AuthorCard.propTypes = {
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  messages: PropTypes.number,
  mails: PropTypes.number,
  posts: PropTypes.string,
  views: PropTypes.string,
  followers: PropTypes.string,
  awards: PropTypes.array,
};
