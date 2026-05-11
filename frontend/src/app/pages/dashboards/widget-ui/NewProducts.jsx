// Local Imports
import { Avatar, Card } from "components/ui";

// Import Dependencies
import { FaGift } from "react-icons/fa";
// ----------------------------------------------------------------------

export function NewProduct() {
  return (
    <Card className="p-4">
      <div className="flex justify-between">
        <p className="text-base font-medium text-gray-800 dark:text-dark-100">
          New Products
        </p>
        <Avatar
          size={10}
          initialColor="warning"
          initialVariant="soft"
          classNames={{ display: "mask is-squircle rounded-none" }}
        >
          <FaGift className="size-5" />
        </Avatar>
      </div>
      <div className="flex items-baseline gap-1">
        <p className="text-2xl font-semibold text-gray-800 dark:text-dark-100">
          21
        </p>
        <p className="text-xs text-success">+21%</p>
      </div>
      <p className="text-xs-plus">Lorem ipsum dolor sit amet</p>
      <div className="absolute bottom-0 overflow-hidden rounded-lg ltr:right-0 rtl:left-0">
        <FaGift className="size-12 translate-x-1/4 translate-y-1/4 opacity-20" />
      </div>
    </Card>
  );
}
