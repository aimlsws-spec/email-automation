// Local Imports
import { Badge } from "components/ui";

// ----------------------------------------------------------------------

export function Title() {
  return (
    <div className="flex min-w-0 items-center gap-2 pt-3">
      <h3 className="text-base font-medium text-gray-800 dark:text-dark-100 md:text-lg">
        Action Required: Confirmation Needed for Your Order
      </h3>
      <Badge variant="outlined" color="info" className="rounded-full">
        Personal
      </Badge>
    </div>
  );
}
