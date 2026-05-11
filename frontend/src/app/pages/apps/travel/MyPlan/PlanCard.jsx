// Import Dependencies
import PropTypes from "prop-types";

// Local Imports
import { CalendarIcon } from "@heroicons/react/24/outline";
import { Avatar, Card } from "components/ui";

// ----------------------------------------------------------------------

export function PlanCard({ name, image, dateRange, members }) {
  return (
    <Card className="flex gap-4 p-2">
      <img
        className="size-18 rounded-lg object-cover object-center"
        src={image}
        alt={name}
      />
      <div>
        <a
          href="##"
          className="font-medium text-gray-700 hover:text-primary-600 focus:text-primary-600 dark:text-dark-100 dark:hover:text-primary-400 dark:focus:text-primary-400"
        >
          {name}
        </a>
        <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs">
          <CalendarIcon className="size-3.5 text-gray-400 dark:text-dark-300" />
          <span className="truncate">{dateRange}</span>
        </p>
        <div className="mt-2.5 flex flex-wrap -space-x-1.5 ">
          {members.map((member) => (
            <Avatar
              key={member.uid}
              size={6}
              src={member.avatar}
              classNames={{
                root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                display: "text-tiny-plus ring-3 ring-white dark:ring-dark-700",
              }}
              name={member.name}
              initialColor="auto"
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

PlanCard.propTypes = {
  name: PropTypes.string,
  image: PropTypes.string,
  dateRange: PropTypes.string,
  members: PropTypes.array,
};
