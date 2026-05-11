// Local Imports
import PropTypes  from "prop-types";

// Import Dependencies
import { Card } from "components/ui";

// ----------------------------------------------------------------------

export function ProductCard({ image, name, category, price }) {
  return (
    <Card className="group p-2 transition-transform hover:scale-105">
      <img className="rounded-lg" src={image} alt={name} />
      <div className="pt-2">
        <p className="truncate font-medium text-gray-800 dark:text-dark-100">
          {name}
        </p>
        <p className="truncate text-xs text-gray-400 dark:text-dark-300">
          {category}
        </p>
        <p className="text-end font-medium text-primary-600 dark:text-primary-400">
          ${price}
        </p>
      </div>
      <div className="absolute inset-0 cursor-pointer rounded-lg bg-black/10 opacity-0 transition-colors group-hover:opacity-100" />
    </Card>
  );
}

ProductCard.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
  category: PropTypes.string,
  price: PropTypes.string,
};
