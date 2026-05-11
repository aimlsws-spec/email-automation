// Local Imports
import { AppointmentsRequestsCard } from "./AppointmentsRequestsCard";

const requests = [
  {
    uid: 1,
    name: "Travis Fuller",
    avatar: "/images/avatar/avatar-19.jpg",
    request: "Checkup",
    date: "Thu, 26 March",
    time: "08:00",
  },
  {
    uid: 2,
    name: "Alfredo Elliott",
    avatar: "/images/avatar/avatar-18.jpg",
    request: "Scaling",
    date: "Mon, 15 March",
    time: "09:00",
  },
  {
    uid: 3,
    name: "Derrick Simmons",
    avatar: null,
    request: "Checkup",
    date: "Wed, 14 March",
    time: "11:00",
  },
];

// ----------------------------------------------------------------------

export function AppointmentsRequestsList() {
  return (
    <div className="mt-4 sm:mt-5 lg:mt-6">
      <div className="flex h-8 items-center justify-between">
        <h2 className="text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Appointment request
        </h2>
        <a
          href="##"
          className="border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary-600 outline-hidden transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
        >
          View All
        </a>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
        {requests.map((request) => (
          <AppointmentsRequestsCard
            key={request.uid}
            name={request.name}
            avatar={request.avatar}
            request={request.request}
            date={request.date}
            time={request.time}
          />
        ))}
      </div>
    </div>
  );
}
