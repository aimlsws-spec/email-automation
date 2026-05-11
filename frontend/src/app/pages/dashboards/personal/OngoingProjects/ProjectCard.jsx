// Import Dependencies
import clsx from "clsx";
import PropTypes from "prop-types";

// Local Imports
import { Card, Progress } from "components/ui";

// ----------------------------------------------------------------------

export function ProjectCard({
  name,
  image,
  updated_at,
  deadline,
  isActive,
  progress,
  color,
}) {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-3">
        <img
          className="size-10 rounded-lg object-cover object-center"
          src={image}
          alt={name}
        />
        <div className="min-w-0 flex-1">
          <div className="flex justify-between">
            <p className="truncate font-medium text-gray-800 dark:text-dark-100">
              {name}
            </p>
          </div>
          <div className="mt-0.5 flex text-xs text-gray-400 dark:text-dark-300">
            <p>{updated_at}</p>
            <div className="mx-2 my-1 hidden w-px bg-gray-200 dark:bg-dark-500 sm:flex"></div>
            <p className="hidden sm:flex">Deadline: {deadline}</p>
          </div>
        </div>
      </div>
      <p
        className={clsx(
          `this:${color}`,
          "-mt-3 text-end text-xs font-medium text-this dark:text-this-lighter",
        )}
      >
        {progress}%
      </p>

      <Progress
        value={progress}
        color={color}
        isActive={isActive}
        classNames={{
          root: "mt-2 h-1.5",
        }}
      />
    </Card>
  );
}

ProjectCard.propTypes = {
  name: PropTypes.string,
  image: PropTypes.string,
  updated_at: PropTypes.string,
  deadline: PropTypes.string,
  isActive: PropTypes.bool,
  progress: PropTypes.number,
  color: PropTypes.string,
};
