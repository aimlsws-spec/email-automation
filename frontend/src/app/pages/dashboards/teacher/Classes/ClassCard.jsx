// Import Dependencies
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import PropTypes from "prop-types";

// Local Imports
import { Avatar, Button, Card, Tag } from "components/ui";

// ----------------------------------------------------------------------

export function ClassCard({ image, name, category, time, color, students }) {
  return (
    <Card className="flex overflow-hidden">
      <div
        className={clsx(
          `this:${color}`,
          "h-full w-1 bg-this dark:bg-this-light",
        )}
      />
      <div className="flex flex-1 flex-col justify-between p-4 sm:px-5">
        <div>
          <img
            className="size-12 rounded-lg object-cover object-center"
            src={image}
            alt={name}
          />
          <h3 className="mt-3 line-clamp-2 font-medium text-gray-800 dark:text-dark-100">
            {name}
          </h3>
          <p className="text-xs-plus">{time}</p>
          <div className="mt-2">
            <Tag href="#" color={color}>
              {category}
            </Tag>
          </div>
        </div>
        <div className="mt-10 flex justify-between">
          <div className="flex -space-x-2 ">
            {students.map((student) => (
              <Avatar
                size={7}
                key={student.uid}
                name={student.name}
                src={student.avatar}
                classNames={{
                  root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                  display: "text-xs ring-2 ring-white dark:ring-dark-700",
                }}
              />
            ))}
          </div>
          <Button className="size-7 rounded-full" isIcon>
            <ArrowUpRightIcon className="size-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

ClassCard.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
  category: PropTypes.string,
  time: PropTypes.string,
  color: PropTypes.string,
  students: PropTypes.array,
};
