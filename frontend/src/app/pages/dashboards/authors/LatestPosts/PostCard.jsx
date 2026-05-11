// Import Dependencies
import PropTypes from "prop-types";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Avatar, Box, Card } from "components/ui";

// ----------------------------------------------------------------------

export function PostCard({
  cover,
  created_at,
  title,
  description,
  author_name,
  author_avatar,
}) {
  return (
    <Box className="flex flex-col">
      <img
        className="h-44 w-full rounded-2xl object-cover object-center"
        src={cover}
        alt={title}
      />
      <Card
        skin="shadow"
        className="-mt-8 flex min-w-0 grow flex-col rounded-2xl p-4"
      >
        <div className="truncate">
          <a
            href="##"
            className="text-sm-plus font-medium text-gray-700 hover:text-primary-600 focus:text-primary-600 dark:text-dark-100 dark:hover:text-primary-400 dark:focus:text-primary-400"
          >
            {title}
          </a>
        </div>
        <p className="mt-2 line-clamp-3 grow">{description}</p>
        <div className="mt-4 flex items-center justify-between gap-1.5">
          <a
            href="##"
            className="flex min-w-0 items-center space-x-2 text-xs hover:text-gray-800 dark:hover:text-dark-100 "
          >
            <Avatar
              size={6}
              src={author_avatar}
              name={author_name}
              color="auto"
              classNames={{ display: "text-xs" }}
            />
            <span className="truncate">{author_name}</span>
          </a>
          <div className="flex shrink-0 items-center space-x-1.5 text-xs text-gray-400 dark:text-dark-300 ">
            <CalendarDaysIcon className="size-4" />
            <span>{created_at}</span>
          </div>
        </div>
      </Card>
    </Box>
  );
}

PostCard.propTypes = {
  cover: PropTypes.string,
  created_at: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  author_name: PropTypes.string,
  author_avatar: PropTypes.string,
};
