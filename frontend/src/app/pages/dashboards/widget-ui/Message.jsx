// Local Imports
import CreativeSVG from "assets/illustrations/creativedesign-char.svg?react";
import { Avatar, Card } from "components/ui";

// ----------------------------------------------------------------------

export function Message() {
  return (
    <Card className="flex flex-row gap-x-4 p-3">
      <div className="w-12 shrink-0">
        <CreativeSVG className="w-full" />
      </div>
      <div>
        <p className="text-sm-plus font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Design Updated
        </p>
        <p className="mt-2 text-xs-plus">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </p>
        <div className="mt-3 flex flex-wrap -space-x-2 ">
          <Avatar
            size={7}
            classNames={{
              root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
              display: "rounded-xl ring-3 ring-white dark:ring-dark-700",
            }}
            src="/images/avatar/avatar-1.jpg"
          />

          <Avatar
            size={7}
            className=""
            classNames={{
              root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
              display: "rounded-xl text-xs-plus ring-3 ring-white dark:ring-dark-700",
            }}
            name="John Doe"
            initialColor="info"
          />

          <Avatar
            size={7}
            classNames={{
              root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
              display: "rounded-xl text-xs-plus ring-3 ring-white dark:ring-dark-700",
            }}
            src="/images/avatar/avatar-18.jpg"
          />
        </div>
      </div>
    </Card>
  );
}
