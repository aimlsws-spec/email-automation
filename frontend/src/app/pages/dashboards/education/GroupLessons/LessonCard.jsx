// Import Dependencies
import PropTypes from "prop-types";
import { ArrowUpRightIcon, CalendarIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Avatar, Button, Card } from "components/ui";

// ----------------------------------------------------------------------

export function LessonCard({ name, description, date, students }) {
  return (
    <Card className="p-4">
      <h5 className="line-clamp-2 font-medium text-gray-800 dark:text-dark-100">
        {name}
      </h5>
      <p className="mt-1 line-clamp-2 text-xs-plus">{description}</p>
      <div className="mt-4 flex -space-x-2 ">
        {students.map((student) => (
          <Avatar
            key={student.uid}
            size={7}
            classNames={{
              root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
              display: "text-xs ring-2 ring-white dark:ring-dark-700",
            }}
            name={student.name}
            src={student.avatar}
            initialColor="auto"
          />
        ))}
      </div>

      <div className="mt-2 flex items-end justify-between">
        <div className="flex items-center gap-2 text-gray-400 dark:text-dark-300">
          <CalendarIcon className="size-4.5" />
          <span className="text-xs">{date}</span>
        </div>
        <Button className="size-7 rounded-full" isIcon>
          <ArrowUpRightIcon className="size-3.5" />
        </Button>
      </div>
    </Card>
  );
}

LessonCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  students: PropTypes.array,
};
