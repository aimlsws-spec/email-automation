// Import Dependencies
import PropTypes from "prop-types";

// Local Imports
import { Card } from "components/ui";

// ----------------------------------------------------------------------

export function AwardCard({ image, label, description }) {
  return (
    <Card className="flex min-w-0 items-center space-x-3 p-4 ">
      <div>
        <img className="size-10" src={image} alt={label} />
      </div>
      <div>
        <p className="text-base font-medium text-gray-700 dark:text-gray-100">
          {label}
        </p>
        <p className="truncate text-xs text-gray-400 dark:text-dark-300">
          {description}
        </p>
      </div>
    </Card>
  );
}

AwardCard.propTypes = {
  image: PropTypes.string,
  label: PropTypes.string,
  description: PropTypes.string,
};
