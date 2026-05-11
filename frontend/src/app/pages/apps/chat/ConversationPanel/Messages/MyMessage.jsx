// Import Dependencies
import PropTypes from "prop-types";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Local Imports
import { Avatar, Box } from "components/ui";
import { useLocaleContext } from "app/contexts/locale/context";
import { profile } from "../../data";

// ----------------------------------------------------------------------

dayjs.extend(relativeTime);

export function MyMessage(props) {
  const { message, i, isLastMessageOfGroup, isFirstMessageOfGroup } = props;
  const { locale } = useLocaleContext();
  const isLast = isLastMessageOfGroup(message, i);
  const isFirst = isFirstMessageOfGroup(message, i);

  const formattedTime = dayjs(message.createdAt).locale(locale).fromNow();

  return (
    <div
      data-my-message
      data-is-last-message-of-group={isLast}
      data-is-first-message-of-group={isFirst}
      className={clsx(
        "flex items-end justify-end gap-2.5 ltr:ml-4 sm:ltr:ml-10 rtl:mr-4 sm:rtl:mr-10",
        isLast ? "mb-4" : "mb-1.5",
      )}
    >
      <Box
        className={clsx(
          isLast && !isFirst && "ltr:rounded-tr rtl:rounded-tl",
          isFirst && !isLast && "ltr:rounded-br rtl:rounded-bl",
          !isFirst && !isLast && "ltr:rounded-r rtl:rounded-l",
          "flex max-w-lg flex-col items-end justify-end rounded-2xl bg-primary-500 p-3 text-white",
        )}
      >
        {message.content}
        <p className="-mb-2 mt-1 text-end text-tiny-plus text-white/90 ltr:ml-auto rtl:mr-auto">
          {formattedTime}
        </p>
      </Box>
      <div className="size-10 max-sm:hidden">
        {isLast && (
          <Avatar
            size={10}
            src={profile.avatar}
            name={profile.name}
            initialColor="auto"
          />
        )}
      </div>
    </div>
  );
}

MyMessage.propTypes = {
  message: PropTypes.object,
  i: PropTypes.number,
  isLastMessageOfGroup: PropTypes.func,
  isFirstMessageOfGroup: PropTypes.func,
};
