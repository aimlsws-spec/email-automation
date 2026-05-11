// Import Dependencies
import PropTypes from "prop-types";
import { useTimer } from "react-timer-hook";

// Local Imports
import { Digit } from "./Digit";

// ----------------------------------------------------------------------

export function Deadline({ expirySeconds }) {
  const time = new Date();
  time.setSeconds(time.getSeconds() + expirySeconds);

  const { seconds, minutes, hours } = useTimer({ expiryTimestamp: time });

  return (
    <div className="mt-6">
      <p className="font-medium">Action End in</p>
      <div className="mt-3 grid grid-cols-3 gap-3 text-center text-4xl font-semibold text-primary-600 dark:text-primary-400">
        <Digit value={hours} />
        <Digit value={minutes} />
        <Digit value={seconds} />
      </div>
      <div className="mt-2 grid grid-cols-3 gap-3 text-center text-xs-plus">
        <p>hours</p>
        <p>minutes</p>
        <p>seconds</p>
      </div>
    </div>
  );
}

Deadline.propTypes = {
  expirySeconds: PropTypes.number,
};
