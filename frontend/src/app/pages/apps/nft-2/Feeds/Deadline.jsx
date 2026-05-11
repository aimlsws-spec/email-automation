// Import Dependencies
import PropTypes from "prop-types";
import { useTimer } from "react-timer-hook";

// ----------------------------------------------------------------------

export function Deadline({ expirySeconds }) {
  const time = new Date();
  time.setSeconds(time.getSeconds() + expirySeconds);

  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp: time,
  });

  return (
    <div>
      <p className="text-xs text-gray-400 dark:text-dark-300">Ending in</p>
      <div className="text-base font-medium text-gray-800 dark:text-dark-100">
        {days > 0 && `${days}d`} {hours ? hours : "00"}h{" "}
        {minutes ? minutes : "00"}m {days <= 0 && `${seconds ? seconds : 0}s`}
      </div>
    </div>
  );
}

Deadline.propTypes = {
  expirySeconds: PropTypes.number,
};
