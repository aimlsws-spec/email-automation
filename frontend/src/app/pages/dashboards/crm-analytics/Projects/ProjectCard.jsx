// Import Dependencies
import PropTypes from "prop-types";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

// Local Imports
import { Avatar, Badge, Box, Button } from "components/ui";

// ----------------------------------------------------------------------

export function ProjectCard({
  name,
  description,
  color,
  category,
  progress,
  teamMembers,
  created_at,
}) {
  const progressParts = progress.toFixed(2).toString().split(".");
  return (
    <Box
      className={clsx(
        `this:${color}`,
        "flex flex-col justify-between border-4 border-transparent border-l-this px-4 dark:border-l-this-light",
      )}
    >
      <div>
        <p className="text-base font-medium text-gray-800 dark:text-dark-100">
          {name}
        </p>
        <p className="text-xs text-gray-400 dark:text-dark-300">
          {description}
        </p>
        <Badge color={color} variant="outlined" className="mt-2">
          {category}
        </Badge>
      </div>
      <div className="mt-8">
        <div>
          <p>
            <span className="text-2xl font-medium text-gray-800 dark:text-dark-100">
              %{progressParts[0]}.
            </span>
            <span className="text-xs">{progressParts[1]}</span>
          </p>
          <p className="mt-1 text-xs">{created_at}</p>
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between gap-2">
        <div className="flex -space-x-2.5 ">
          {teamMembers.map((member) => (
            <Avatar
              key={member.uid}
              src={member.avatar}
              name={member.name}
              size={7}
              classNames={{
                root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                display: "text-xs ring-2 ring-white dark:ring-dark-700",
              }}
              initialColor="auto"
            />
          ))}
        </div>

        <Button
          className="size-7 rounded-full ltr:-mr-1.5 rtl:-ml-1.5"
          isIcon
          variant="flat"
        >
          <Cog6ToothIcon className="size-5" />
        </Button>
      </div>
    </Box>
  );
}

ProjectCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  color: PropTypes.string,
  category: PropTypes.string,
  progress: PropTypes.number,
  teamMembers: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      avatar: PropTypes.string,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  created_at: PropTypes.string,
};
