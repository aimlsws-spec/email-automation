// Import Dependencies
import PropTypes from "prop-types";
import { ClockIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Card } from "components/ui";

// ----------------------------------------------------------------------

export function CourseCard({ name, cover, author, time, studentsCount }) {
  return (
    <Card className="flex justify-between gap-2 p-2.5">
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <a
            href="##"
            className="line-clamp-2 font-medium text-gray-700 outline-hidden transition-colors hover:text-primary-600 focus:text-primary-600 dark:text-dark-100 dark:hover:text-primary-400 dark:focus:text-primary-400"
          >
            {name}
          </a>
          <a
            href="##"
            className="text-xs text-gray-400 hover:text-gray-800 dark:text-dark-300 dark:hover:text-dark-100"
          >
            {author}
          </a>
        </div>
        <div className="flex min-w-0 items-center space-x-2 text-xs ">
          <div className="flex shrink-0 items-center space-x-1 ">
            <ClockIcon className="size-4.5 text-gray-400 dark:text-dark-300" />
            <p>{time}</p>
          </div>
          <div className="mx-2 my-1 w-px self-stretch bg-dark-200 dark:bg-gray-500"></div>
          <span className="truncate">{studentsCount} Students </span>
        </div>
      </div>
      <img className="size-24 rounded-lg object-cover" src={cover} alt={name} />
    </Card>
  );
}

CourseCard.propTypes = {
  name: PropTypes.string,
  cover: PropTypes.string,
  author: PropTypes.string,
  time: PropTypes.string,
  studentsCount: PropTypes.string,
};
