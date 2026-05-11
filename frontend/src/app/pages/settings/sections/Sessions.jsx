// Import Dependencies
import { FaAndroid, FaApple } from "react-icons/fa";
import { TbDeviceLaptop } from "react-icons/tb";

// Local Imports
import { Avatar, Button, Input } from "components/ui";

// ----------------------------------------------------------------------

const sessions = [
  {
    id: 1,
    name: "IPhone X",
    browser: "Safari 12",
    location: "London, UK",
    lastView: "5/12/2023",
    icon: FaApple,
  },
  {
    id: 2,
    name: "Xiaomi Redmi Note 9",
    browser: "Google Chrome 110",
    location: "London, UK",
    lastView: "4/20/2023",
    icon: FaAndroid,
  },
  {
    id: 3,
    name: "Samsung Galaxy S22",
    browser: "Google Chrome 110",
    location: "London, UK",
    lastView: "4/19/2023",
    icon: FaAndroid,
  },
  {
    id: 4,
    name: "Samsung Galaxy S22",
    browser: "Mozilla Firefox 88",
    location: "London, UK",
    lastView: "11/10/2022",
    icon: FaAndroid,
  },
];

export default function Sessions() {
  return (
    <div className="w-full max-w-3xl 2xl:max-w-5xl">
      <h5 className="text-lg font-medium text-gray-800 dark:text-dark-50">
        Active Sessions & Password
      </h5>
      <p className="mt-0.5 text-balance text-sm">
        Active sessions and update password section. You can terminate them by
        clicking on the remove button.
      </p>
      <div className="my-5 h-px bg-gray-200 dark:bg-dark-500" />

      <div>
        <p className="text-base font-medium text-gray-800 dark:text-dark-100">
          Password Reset
        </p>
        <p className="mt-0.5 text-balance text-sm">
          Update your password here. Enter your current and new password.
        </p>
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <p className="my-auto font-medium">Current Password:</p>
            <Input
              type="password"
              classNames={{ root: "mt-1.5 flex-1 md:col-span-2 md:mt-0" }}
              placeholder="********"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            <p className="my-auto font-medium">New Password:</p>
            <Input
              type="password"
              classNames={{ root: "mt-1.5 flex-1 md:col-span-2 md:mt-0" }}
              placeholder="********"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            <p className="my-auto font-medium">Confirm Password:</p>
            <Input
              type="password"
              classNames={{ root: "mt-1.5 flex-1 md:col-span-2 md:mt-0" }}
              placeholder="********"
            />
          </div>
        </div>
        <div className="text-end mt-4">
          <Button>
            Update password
          </Button>
        </div>
      </div>

      <div className="my-6 h-px bg-gray-200 dark:bg-dark-500" />

      <div>
        <p className="text-base font-medium text-gray-800 dark:text-dark-100">
          Active Sessions
        </p>
        <p className="mt-0.5 text-balance text-sm">
          List of active sessions. You can terminate them by clicking on the
          remove button.
        </p>
        <p className="mt-4 font-medium">Current Session</p>
        <div className="mt-2 flex items-start gap-3 rounded-lg border-gray-200 dark:border-dark-500 sm:border sm:p-4">
          <Avatar size={12} initialColor="primary">
            <TbDeviceLaptop className="size-6" />
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
              Macbook Pro 15 Retina (M1)
            </p>
            <p>Google Chrome 116</p>
            <div className="mt-1 flex text-xs text-gray-400 dark:text-dark-300">
              <p>New York, USA</p>
              <div className="mx-2 my-0.5 w-px bg-gray-200 dark:bg-dark-500"></div>
              <p>Online</p>
            </div>
          </div>
        </div>
        <p className="mt-6 font-medium">Other Active Sessions</p>
        <div className="flex flex-col space-y-4 divide-y divide-gray-200 dark:divide-dark-500">
          {sessions.map((session) => (
            <div
              className="flex items-start justify-between pt-4"
              key={session.id}
            >
              <div className="flex items-start gap-3">
                <Avatar size={12}>
                  <session.icon className="size-6" />
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {session.name}
                  </p>
                  <p>{session.browser}</p>
                  <div className="mt-1 flex text-xs text-gray-400 dark:text-dark-300">
                    <p>{session.location}</p>
                    <div className="mx-2 my-0.5 w-px bg-gray-200 dark:bg-dark-500"></div>
                    <p>{session.lastView}</p>
                  </div>
                </div>
              </div>
              <button className="text-error hover:opacity-90 dark:text-error-light">
                Terminate
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
