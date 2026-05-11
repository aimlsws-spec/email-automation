// Local Imports
import { Avatar, Card } from "components/ui";

// ----------------------------------------------------------------------

export function HappyBirthday() {
  return (
    <Card className="flex items-center space-x-4 p-4 ">
      <div className="flex -space-x-2 ">
        <Avatar
          size={10}
          src="/images/avatar/avatar-5.jpg"
          classNames={{
            root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
            display: "ring-3 ring-white dark:ring-dark-700",
          }}
        />
        <Avatar
          size={10}
          src="/images/avatar/avatar-1.jpg"
          classNames={{
            root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
            display: "ring-3 ring-white dark:ring-dark-700",
          }}
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Happy Birthday
        </p>
        <div className="flex text-xs-plus">
          <a
            href="##"
            className="dark:text-accent-400 dark:hover:text-600 text-primary-400 hover:text-primary-600"
          >
            Konnor
          </a>
          <div className="mx-2 my-1 w-px bg-gray-200 dark:bg-dark-500"></div>
          <a
            href="##"
            className="dark:text-accent-400 dark:hover:text-600 text-primary-400 hover:text-primary-600"
          >
            John
          </a>
        </div>
      </div>
    </Card>
  );
}
