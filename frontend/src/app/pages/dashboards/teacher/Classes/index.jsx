// Local Imports
import { ClassCard } from "./ClassCard";

// ----------------------------------------------------------------------

const classes = [
  {
    uid: 1,
    image: "/images/technology/sales-presentation-sm.jpg",
    name: "Basic English",
    category: "Language",
    time: "Mon. 08:00 - 09:00",
    color: "primary",
    students: [
      {
        uid: "5",
        name: "Katrina West",
        avatar: "/images/avatar/avatar-11.jpg",
      },
      {
        uid: "6",
        name: "Henry Curtis",
        avatar: "/images/avatar/avatar-4.jpg",
      },
      {
        uid: "7",
        name: "Raul Bradley",
        avatar: "/images/avatar/avatar-5.jpg",
      },
    ],
  },
  {
    uid: 2,
    image: "/images/technology/design-sm.jpg",
    name: "Learn UI/UX Design",
    category: "UI/UX Design",
    time: "Tue. 10:00 - 11:30",
    color: "info",
    students: [
      {
        uid: "8",
        name: "Samantha Shelton",
        avatar: null,
      },
      {
        uid: "9",
        name: "Corey Evans",
        avatar: "/images/avatar/avatar-6.jpg",
      },
      {
        uid: "10",
        name: "Lance Tucker",
        avatar: null,
      },
    ],
  },
  {
    uid: 3,
    image: "/images/technology/dashboard.jpg",
    name: "Basic of digital marketing",
    category: "Marketing",
    time: "Wed. 09:00 - 11:00",
    color: "secondary",
    students: [
      {
        uid: "6",
        name: "Henry Curtis",
        avatar: "/images/avatar/avatar-4.jpg",
      },
      {
        uid: "7",
        name: "Raul Bradley",
        avatar: "/images/avatar/avatar-5.jpg",
      },
      {
        uid: "8",
        name: "Samantha Shelton",
        avatar: null,
      },
    ],
  },
];

export function Classes() {
  return (
    <div className="mt-4 sm:mt-5 lg:mt-6">
      <div className="flex h-8 min-w-0 items-center justify-between">
        <h2 className="truncate text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Week 2 Classes
        </h2>
        <a
          href="##"
          className="border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary-600 outline-hidden transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
        >
          View All
        </a>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
        {classes.map((item) => (
          <ClassCard
            key={item.uid}
            name={item.name}
            image={item.image}
            time={item.time}
            category={item.category}
            color={item.color}
            students={item.students}
          />
        ))}
      </div>
    </div>
  );
}
