// Import Dependencies
import PropTypes from "prop-types";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

// Local Imports
import { Avatar, Badge, Button, Card } from "components/ui";

// ----------------------------------------------------------------------

export function MeetingCard({
  isActive,
  title,
  description,
  image,
  meetingDate,
  meetingRange,
  members,
}) {
  return (
    <Card
      {...{ skin: isActive ? "none" : undefined }}
      className={clsx(
        "flex flex-col p-4 sm:p-5",
        isActive && "bg-primary-600 dark:bg-primary-500",
      )}
    >
      <div className="grow">
        <div className="flex items-center gap-3">
          <img
            className="size-10 shrink-0 rounded-lg object-cover"
            src={image}
            alt={title}
          />
          <div className="min-w-0">
            <h3
              className={clsx(
                "truncate text-base font-medium",
                isActive ? "text-white" : "text-gray-800 dark:text-dark-100",
              )}
            >
              {title}
            </h3>
            <p
              className={clsx(
                "mt-0.5 truncate text-xs",
                isActive && "text-white/90",
              )}
            >
              {description}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <p className={clsx("text-xs-plus", isActive && "text-white/90")}>
          {meetingDate}
        </p>
        <p
          className={clsx(
            "text-xl font-medium",
            isActive ? "text-white" : "text-gray-800 dark:text-dark-100",
          )}
        >
          {meetingRange}
        </p>
        <Badge
          unstyled={isActive}
          variant={isActive ? undefined : "soft"}
          color="primary"
          className={clsx(
            "mt-3 rounded-full px-2 py-1.5 text-xs leading-none",
            isActive && "bg-black/20 text-white",
          )}
        >
          {members.length} Members
        </Badge>
      </div>
      <div className="mt-5 flex items-center justify-between gap-2">
        <div className="flex -space-x-2 ">
          {members.length > 3
            ? members
                .slice(0, 3)
                .map((member) => (
                  <Avatar
                    size={8}
                    key={member.uid}
                    name={member.name}
                    src={member.avatar}
                    classNames={{ display: "text-xs-plus ring-1 ring-white/10" }}
                    initialColor="auto"
                  />
                ))
            : members.map((member) => (
                <Avatar
                  size={8}
                  key={member.uid}
                  name={member.name}
                  src={member.avatar}
                  initialColor="auto"
                />
              ))}

          {members.length > 3 && (
            <Avatar
              size={8}
              classNames={{ display: "text-xs-plus ring-1 ring-white/10" }}
            >
              +{members.length - 3}
            </Avatar>
          )}
        </div>

        <Button className="size-8 rounded-full" isIcon>
          <ArrowUpRightIcon className="size-4" />
        </Button>
      </div>
    </Card>
  );
}

MeetingCard.propTypes = {
  isActive: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  meetingDate: PropTypes.string,
  meetingRange: PropTypes.string,
  members: PropTypes.array,
};
