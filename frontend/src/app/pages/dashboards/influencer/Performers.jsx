// Local Imports
import { Avatar } from "components/ui";

// ----------------------------------------------------------------------

const performers = [
  {
    uid: 1,
    name: "Konnor Guzman",
    avatar: "/images/avatar/avatar-3.jpg",
    username: "@konnor721",
    activity: 25,
  },
  {
    uid: 2,
    name: "Alfredo Elliott",
    avatar: null,
    username: "@alfredoe",
    activity: 36,
  },
  {
    uid: 3,
    name: "Henry Curtis",
    avatar: "/images/avatar/avatar-19.jpg",
    username: "@henry2001",
    activity: 69,
  },
  {
    uid: 4,
    name: "Katrina West",
    avatar: "/images/avatar/avatar-11.jpg",
    username: "@katrina",
    activity: 49,
  },
  {
    uid: 5,
    name: "Lance Tucker",
    avatar: "/images/avatar/avatar-5.jpg",
    username: "@lancetucker",
    activity: 36,
  },
];

export function Performers() {
  return (
    <div>
      <div className="flex h-8 min-w-0 items-center justify-between">
        <h2 className="truncate font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Top Perfrormers
        </h2>

        <a
          href="##"
          className="border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary-600 outline-hidden transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
        >
          View All
        </a>
      </div>
      <table className="w-full">
        <tbody>
          {performers.map((performer) => (
            <tr key={performer.uid}>
              <td className="pt-4">
                <div className="flex items-center space-x-3 ">
                  <Avatar
                    size={9}
                    name={performer.name}
                    src={performer.avatar}
                    initialColor="auto"
                  />
                  <h3 className="truncate font-medium text-gray-800 dark:text-dark-100">
                    {performer.name}
                  </h3>
                </div>
              </td>
              <td className="px-2 pt-4">
                <a
                  href="##"
                  className="tracking-wide text-gray-400 hover:text-primary-600 focus:text-primary-600 dark:text-dark-300 dark:hover:text-primary-400 dark:focus:text-primary-400"
                >
                  {performer.username}
                </a>
              </td>
              <td className="pt-4">
                <p className="text-end font-medium text-gray-800 dark:text-dark-100">
                  {performer.activity}%
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
