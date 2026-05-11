// Import Dependencies
import PropTypes from "prop-types";

// Local Imports
import { Box } from "components/ui";

// ----------------------------------------------------------------------

export function ChannelCard({ logo, name, username, impression }) {
  return (
    <Box className="flex w-36 shrink-0 flex-col items-center">
      <img className="z-10 size-10" src={logo} alt={name} />
      <Box className="-mt-5 flex w-full flex-col rounded-2xl bg-white px-3 py-5 text-center shadow-soft dark:bg-dark-700 dark:shadow-none">
        <p className="mt-3 text-base font-medium text-gray-800 dark:text-dark-100">
          {name}
        </p>
        <a
          href="##"
          className="mt-1 text-xs-plus tracking-wide text-gray-400 hover:text-primary-600 focus:text-primary-600 dark:text-dark-300 dark:hover:text-primary-400 dark:focus:text-primary-400"
        >
          {username}
        </a>
        <div className="mt-6 flex justify-center gap-1 text-gray-800 dark:text-dark-100">
          <p className="text-4xl font-medium">{impression}</p>
          <p className="mt-1 font-medium">%</p>
        </div>
      </Box>
    </Box>
  );
}

ChannelCard.propTypes = {
  logo: PropTypes.string,
  name: PropTypes.string,
  username: PropTypes.string,
  impression: PropTypes.string,
};
