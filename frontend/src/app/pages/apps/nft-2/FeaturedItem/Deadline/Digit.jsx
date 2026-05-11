// Local Imports
import PropTypes from "prop-types";

// ----------------------------------------------------------------------

export function Digit({ value }) {
  const leftDigit = value >= 10 ? value.toString()[0] : "0";
  const rightDigit = value >= 10 ? value.toString()[1] : value.toString();

  return (
    <div className="grid grid-cols-2 gap-1">
      <div className="rounded-lg bg-primary-600/10 py-3 dark:bg-primary-400/10">
        {leftDigit}
      </div>
      <div className="rounded-lg bg-primary-600/10 py-3 dark:bg-primary-400/10">
        {rightDigit}
      </div>
    </div>
  );
}

Digit.propTypes = {
  value: PropTypes.number,
};
