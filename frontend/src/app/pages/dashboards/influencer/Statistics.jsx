// Import Dependencies
import { FaBug, FaEye, FaThumbsUp, FaUser } from "react-icons/fa";

// Local Imports
import { Avatar, Card } from "components/ui";

// ----------------------------------------------------------------------

export function Statistics() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
      <Card className="flex justify-between p-4">
        <div>
          <p className="text-xs-plus uppercase">New Followers</p>
          <div className="mt-8 flex items-baseline gap-1">
            <p className="text-2xl font-semibold text-gray-800 dark:text-dark-100">
              1.3k
            </p>
            <p className="text-xs text-success dark:text-success-lighter">
              +21%
            </p>
          </div>
        </div>
        <Avatar
          size={10}
          classNames={{ display: "mask is-squircle rounded-none" }}
          initialColor="warning"
          initialVariant="soft"
        >
          <FaUser className="size-5" />
        </Avatar>
        <div className="absolute bottom-0 right-0 overflow-hidden rounded-lg">
          <FaUser className="size-12 translate-x-1/4 translate-y-1/4 opacity-20" />
        </div>
      </Card>

      <Card className="flex justify-between p-4">
        <div>
          <p className="text-xs-plus uppercase">VIEWS</p>
          <div className="mt-8 flex items-baseline gap-1">
            <p className="text-2xl font-semibold text-gray-800 dark:text-dark-100">
              30.6m
            </p>
            <p className="text-xs text-success dark:text-success-lighter">
              +4%
            </p>
          </div>
        </div>
        <Avatar
          size={10}
          initialColor="info"
          initialVariant="soft"
          classNames={{
            display: "mask is-squircle rounded-none",
          }}
        >
          <FaEye className="size-5" />
        </Avatar>
        <div className="absolute bottom-0 right-0 overflow-hidden rounded-lg">
          <FaEye className="size-12 translate-x-1/4 translate-y-1/4 opacity-20" />
        </div>
      </Card>

      <Card className="flex justify-between p-4">
        <div>
          <p className="text-xs-plus uppercase">Likes</p>
          <div className="mt-8 flex items-baseline gap-1">
            <p className="text-2xl font-semibold text-gray-800 dark:text-dark-100">
              4.3M
            </p>
            <p className="text-xs text-success dark:text-success-lighter">
              +8%
            </p>
          </div>
        </div>
        <Avatar
          size={10}
          initialColor="success"
          initialVariant="soft"
          classNames={{
            display: "mask is-squircle rounded-none",
          }}
        >
          <FaThumbsUp className="size-5" />
        </Avatar>
        <div className="absolute bottom-0 right-0 overflow-hidden rounded-lg">
          <FaThumbsUp className="size-12 translate-x-1/4 translate-y-1/4 opacity-20" />
        </div>
      </Card>

      <Card className="flex justify-between p-4">
        <div>
          <p className="text-xs-plus uppercase">Reports</p>
          <div className="mt-8 flex items-baseline gap-1">
            <p className="text-2xl font-semibold text-gray-800 dark:text-dark-100">
              236
            </p>
            <p className="text-xs text-error dark:text-error-lighter">-2%</p>
          </div>
        </div>
        <Avatar
          size={10}
          initialColor="error"
          initialVariant="soft"
          classNames={{ display: "mask is-squircle rounded-none" }}
        >
          <FaBug className="size-5" />
        </Avatar>
        <div className="absolute bottom-0 right-0 overflow-hidden rounded-lg">
          <FaBug className="size-12 translate-x-1/4 translate-y-1/4 opacity-20" />
        </div>
      </Card>
    </div>
  );
}
