// Import Dependencies
import PropTypes from "prop-types";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";

// Local Imports
import { Card, Progress } from "components/ui";

// ----------------------------------------------------------------------

const levels = {
  beginner: {
    label: "Beginner",
    color: "secondary",
  },
  intermediate: {
    label: "Intermediate",
    color: "warning",
  },
  advanced: {
    label: "Advanced",
    color: "primary",
  },
};

export function CourseCard({ title, teacher, level, progress }) {
  return (
    <Card
      className={clsx(
        `this:${levels[level].color}`,
        "flex h-full w-72 shrink-0 flex-col justify-between rounded-xl border-this p-4 dark:border-this-light ltr:border-l-4 rtl:border-r-4",
      )}
    >
      <div>
        <p className="line-clamp-2 font-medium tracking-wide text-gray-800 dark:text-dark-100">
          {title}
        </p>
        <a
          href="##"
          className="mt-0.5 text-xs-plus text-gray-400 hover:text-gray-800 dark:text-dark-300 dark:hover:text-dark-100"
        >
          {teacher}
        </a>
      </div>

      <div className="mt-6">
        <div className="text-end text-this dark:text-this-lighter">
          {progress}%{" "}
        </div>
        <Progress
          classNames={{
            root: "mt-1 h-1",
          }}
          value={progress}
          color={levels[level].color}
        />

        <div className="mt-2 flex items-center justify-between text-this dark:text-this-lighter">
          <p className="font-medium">{levels[level].label}</p>
          <a href="##" className="hover:opacity-80">
            <ArrowLongRightIcon className="size-5 rtl:rotate-180" />
          </a>
        </div>
      </div>
    </Card>
  );
}

CourseCard.propTypes = {
  title: PropTypes.string,
  teacher: PropTypes.string,
  level: PropTypes.oneOf(["beginner", "intermediate", "advanced"]).isRequired,
  progress: PropTypes.number,
};
