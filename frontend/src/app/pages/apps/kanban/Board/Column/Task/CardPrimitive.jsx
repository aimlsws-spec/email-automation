// Import Dependencies
import PropTypes from "prop-types";
import clsx from "clsx";
import dayjs from "dayjs";
import {
  HiOutlineCalendar,
  HiOutlineChatAlt,
  HiOutlineTag,
} from "react-icons/hi";

// Local Imports
import { Avatar, Badge, Box } from "components/ui";
import { formatNumber } from "utils/formatNumber";
import { useLocaleContext } from "app/contexts/locale/context";

// ----------------------------------------------------------------------

export function CardPrimitive({ data }) {
  const {
    title,
    color,
    cover,
    dueDate,
    labels,
    members,
    attachmentsCount,
    commentsCount,
  } = data;
  const { locale } = useLocaleContext();

  return (
    <Box
      className={clsx(
        "flex flex-col rounded-lg",
        color !== "neutral" &&
          `this:${color} bg-this/10 dark:bg-this-lighter/10`,
      )}
    >
      {cover && (
        <div className="relative h-44 w-full p-1">
          <img
            src={cover}
            alt={title}
            className="pointer-events-none h-full w-full rounded-md object-cover object-center"
          />
        </div>
      )}
      <div className="px-2.5 pb-2 pt-1.5">
        <h3
          className={clsx(
            "line-clamp-2 font-medium tracking-wide",
            color === "neutral"
              ? "text-gray-800 dark:text-dark-100"
              : `this:${color} text-this dark:text-this-lighter`,
          )}
        >
          {title}
        </h3>

        {(dueDate || (labels && labels.length > 0)) && (
          <div className="flex flex-wrap gap-1 pt-2">
            {dueDate && (
              <Badge
                color={color}
                variant={color === "neutral" ? "filled" : "soft"}
                className="gap-1"
              >
                <HiOutlineCalendar className="size-3.5" />
                <span>{dayjs(dueDate).locale(locale).format("MMM D")}</span>
              </Badge>
            )}

            {labels &&
              labels.length > 0 &&
              labels.map((label) => (
                <Badge
                  key={label.id}
                  color={label.color}
                  variant={label.color === "neutral" ? "filled" : "soft"}
                >
                  {label.text}
                </Badge>
              ))}
          </div>
        )}

        {members?.length > 0 ||
        (attachmentsCount && attachmentsCount > 0) ||
        (commentsCount && commentsCount > 0) ? (
          <div className="flex items-end justify-between gap-1 pt-4">
            <div className="min-w-0">
              {members?.length > 0 && members.length === 1 ? (
                <div className="flex min-w-0 items-center gap-2">
                  <Avatar
                    size={6}
                    name={members[0].name}
                    src={members[0].avatar}
                    classNames={{ display: "text-tiny-plus" }}
                    initialColor="auto"
                  />

                  <p className="truncate">{members[0].name}</p>
                </div>
              ) : (
                <div className="flex -space-x-1 ">
                  {members.map((member) => (
                    <Avatar
                      key={member.uid}
                      data-tooltip
                      data-tooltip-content={member.name}
                      size={5}
                      classNames={{
                        root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                        display:
                          "text-tiny ring-1 ring-white dark:ring-dark-700",
                      }}
                      src={member.avatar}
                      name={member.name}
                      initialColor="auto"
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-dark-300">
              {attachmentsCount && attachmentsCount > 0 ? (
                <div className="flex items-center gap-0.5">
                  <HiOutlineTag className="size-3.5" />
                  <span>{formatNumber(attachmentsCount)}</span>
                </div>
              ) : undefined}
              {commentsCount && commentsCount > 0 ? (
                <div className="flex items-center gap-0.5">
                  <HiOutlineChatAlt className="size-3.5" />
                  <span>{formatNumber(commentsCount)}</span>
                </div>
              ) : undefined}
            </div>
          </div>
        ) : null}
      </div>
    </Box>
  );
}

CardPrimitive.propTypes = {
  data: PropTypes.object,
  columnData: PropTypes.object,
};
