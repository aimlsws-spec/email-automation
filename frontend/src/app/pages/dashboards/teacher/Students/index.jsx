// Local Imports
import { StudentCard } from "./StudentCard";

// ----------------------------------------------------------------------

const students = [
  {
    uid: "1",
    name: "Travis Fuller",
    messagesCount: 4,
    avatar: "/images/avatar/avatar-20.jpg",
    isOnline: true,
    progress: 64,
  },
  {
    uid: "2",
    name: "Konnor Guzman",
    messagesCount: null,
    avatar: "/images/avatar/avatar-19.jpg",
    isOnline: false,
    progress: 78,
  },
  {
    uid: "3",
    name: "Alfredo Elliott",
    messagesCount: 3,
    avatar: "/images/avatar/avatar-18.jpg",
    isOnline: false,
    progress: 43,
  },
  {
    uid: "4",
    name: "Derrick Simmons",
    messagesCount: null,
    avatar: null,
    isOnline: true,
    progress: 39,
  },
];

export function Students() {
  return (
    <div className="sm:col-span-2 lg:col-span-1">
      <div className="flex h-8 items-center justify-between">
        <h2 className="font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Students
        </h2>
        <a
          href="##"
          className="border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary-600 outline-hidden transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
        >
          View All
        </a>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-5 lg:grid-cols-1">
        {students.map((student) => (
          <StudentCard
            key={student.uid}
            name={student.name}
            avatar={student.avatar}
            isOnline={student.isOnline}
            progress={student.progress}
            messagesCount={student.messagesCount}
          />
        ))}
      </div>
    </div>
  );
}
