// Import Dependencies
import clsx from "clsx";

// Local Imports
import { Avatar, Card } from "components/ui";

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
];

export function Transactions() {
  return (
    <Card className="px-4 pb-4 sm:px-5">
      <div className="flex h-14 min-w-0 items-center justify-between py-3">
        <h2 className="font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Transactions
        </h2>
        <a
          href="##"
          className="border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary-600 outline-hidden transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
        >
          View All
        </a>
      </div>
      <div className="space-y-4">
        {payments.map((payment) => (
          <div
            key={payment.uid}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <Avatar
                size={10}
                src={payment.avatar}
                name={payment.name}
                initialColor="auto"
              />

              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {payment.name}
                </span>
                <span className="text-xs text-gray-400 dark:text-dark-300">
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
    </Card>
  );
}
