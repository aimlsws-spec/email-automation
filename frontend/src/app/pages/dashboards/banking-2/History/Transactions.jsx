// Import Dependencies
import clsx from "clsx";

// Local Imports
import { Avatar } from "components/ui";

// ----------------------------------------------------------------------

const payments = [
  {
    uid: "1",
    name: "Konnor Guzman",
    avatar: "/images/avatar/avatar-20.jpg",
    time: "Dec 21, 2021 - 08:05",
    amount: 660.22,
  },
  {
    uid: "2",
    name: "Henry Curtis",
    avatar: "/images/avatar/avatar-18.jpg",
    time: "Dec 19, 2021 - 11:55",
    amount: -33.63,
  },
  {
    uid: "3",
    name: "Derrick Simmons",
    avatar: null,
    time: "Dec 16, 2021 - 14:45",
    amount: 674.63,
  },
  {
    uid: "4",
    name: "Kartina West",
    avatar: "/images/avatar/avatar-5.jpg",
    time: "Dec 13, 2021 - 11:30",
    amount: 547.63,
  },
  {
    uid: "5",
    name: "Samantha Shelton",
    avatar: "/images/avatar/avatar-11.jpg",
    time: "Dec 10, 2021 - 09:41",
    amount: -736.24,
  },
  {
    uid: "6",
    name: "Robert Nolan",
    avatar: null,
    time: "Dec 09, 2021 - 19:36",
    amount: 369.6,
  },
];

export function Transactions() {
  return (
    <div className="col-span-12 space-y-4 rounded-lg bg-gray-50 p-3 dark:bg-surface-3 sm:col-span-6 xl:col-span-5">
      {payments.map((payment) => (
        <div
          key={payment.uid}
          className="flex items-center justify-between gap-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <Avatar
              size={10}
              name={payment.name}
              src={payment.avatar}
              initialColor="auto"
            />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-gray-800 dark:text-dark-100">
                {payment.name}
              </span>
              <span className="truncate text-xs text-gray-400 dark:text-dark-300">
                {payment.time}
              </span>
            </div>
          </div>
          <span
            className={clsx(
              `this:${payment.amount > 0 ? "success" : "error"}`,
              "text-sm font-medium text-this dark:text-this-lighter",
            )}
          >
            ${Math.abs(payment.amount).toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
}
