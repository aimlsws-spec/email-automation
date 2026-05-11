// Local Imports
import { Page } from "components/shared/Page";
import { Toolbar } from "./Toolbar";
import { UserCard } from "./UserCard";
import { useFuse } from "hooks";

// ----------------------------------------------------------------------

const users = [
  {
    uid: "1",
    name: "Konnor Guzman",
    avatar: "/images/avatar/avatar-20.jpg",
    position: "Senior Developer",
    team: [
      {
        uid: "1",
        name: "Travis Fuller",
        avatar: "/images/avatar/avatar-1.jpg",
      },
      {
        uid: "2",
        name: "John Doe",
        avatar: null,
      },
      {
        uid: "3",
        name: "Caleb Nolan",
        avatar: "/images/avatar/avatar-10.jpg",
      },
    ],
  },
  {
    uid: "2",
    name: "Travis Fuller",
    avatar: "/images/avatar/avatar-19.jpg",
    position: "Web Developer",
    team: [
      {
        uid: "1",
        name: "Julie Morgan",
        avatar: null,
      },
      {
        uid: "2",
        name: "John Doe",
        avatar: "/images/avatar/avatar-13.jpg",
      },
      {
        uid: "3",
        name: "Alfredo Elliott",
        avatar: "/images/avatar/avatar-10.jpg",
      },
    ],
  },
  {
    uid: "3",
    name: "Alfredo Elliott",
    avatar: "/images/avatar/avatar-18.jpg",
    position: "UI/UX designer",
    team: [
      {
        uid: "1",
        name: "Megan Fox",
        avatar: "/images/avatar/avatar-20.jpg",
      },
      {
        uid: "2",
        name: "Selena Gomez",
        avatar: "/images/avatar/avatar-17.jpg",
      },
    ],
  },
  {
    uid: "4",
    name: "Derrick Simmons",
    avatar: null,
    position: "React Developer",
    team: [
      {
        uid: "1",
        name: "Leonardo DiCaprio",
        avatar: "/images/avatar/avatar-5.jpg",
      },
      {
        uid: "2",
        name: "Lynda Headey",
        avatar: null,
      },
      {
        uid: "3",
        name: "Majid Yahyaei",
        avatar: null,
      },
    ],
  },
  {
    uid: "5",
    name: "Katrina West",
    avatar: "/images/avatar/avatar-11.jpg",
    position: "Android Developer",
    team: [
      {
        uid: "1",
        name: "Barak Obama",
        avatar: "/images/avatar/avatar-20.jpg",
      },
      {
        uid: "2",
        name: "Donald Trump",
        avatar: "/images/avatar/avatar-19.jpg",
      },
      {
        uid: "3",
        name: "Selena Gomez",
        avatar: null,
      },
    ],
  },
  {
    uid: "6",
    name: "Henry Curtis",
    avatar: "/images/avatar/avatar-4.jpg",
    position: "Full Stack Developer",
    team: [
      {
        uid: "1",
        name: "Adam Sandler",
        avatar: "/images/avatar/avatar-3.jpg",
      },
      {
        uid: "2",
        name: "Emilia Clarke",
        avatar: "/images/avatar/avatar-19.jpg",
      },
    ],
  },
  {
    uid: "7",
    name: "Raul Bradley",
    avatar: "/images/avatar/avatar-5.jpg",
    position: "Laravel Developer",
    team: [
      {
        uid: "1",
        name: "Travis Fuller",
        avatar: "/images/avatar/avatar-1.jpg",
      },
      {
        uid: "2",
        name: "John Doe",
        avatar: null,
      },
      {
        uid: "3",
        name: "Caleb Nolan",
        avatar: "/images/avatar/avatar-10.jpg",
      },
    ],
  },
  {
    uid: "8",
    name: "Samantha Shelton",
    avatar: null,
    position: "Backend Developer",
    team: [
      {
        uid: "1",
        name: "Julie Morgan",
        avatar: null,
      },
      {
        uid: "2",
        name: "John Doe",
        avatar: "/images/avatar/avatar-13.jpg",
      },
      {
        uid: "3",
        name: "Alfredo Elliott",
        avatar: "/images/avatar/avatar-10.jpg",
      },
    ],
  },
  {
    uid: "9",
    name: "Corey Evans",
    avatar: "/images/avatar/avatar-6.jpg",
    position: "Frontend Developer",
    team: [
      {
        uid: "1",
        name: "Megan Fox",
        avatar: "/images/avatar/avatar-20.jpg",
      },
      {
        uid: "2",
        name: "Selena Gomez",
        avatar: "/images/avatar/avatar-17.jpg",
      },
    ],
  },
  {
    uid: "10",
    name: "Lance Tucker",
    avatar: null,
    position: "NodeJS Developer",
    team: [
      {
        uid: "1",
        name: "Leonardo DiCaprio",
        avatar: "/images/avatar/avatar-5.jpg",
      },
      {
        uid: "2",
        name: "Lynda Headey",
        avatar: null,
      },
      {
        uid: "3",
        name: "Majid Yahyaei",
        avatar: null,
      },
    ],
  },
  {
    uid: "11",
    name: "Anthony Jensen",
    avatar: "/images/avatar/avatar-1.jpg",
    position: "UI/UX Designer",
    team: [
      {
        uid: "1",
        name: "Barak Obama",
        avatar: "/images/avatar/avatar-20.jpg",
      },
      {
        uid: "2",
        name: "Donald Trump",
        avatar: "/images/avatar/avatar-19.jpg",
      },
      {
        uid: "3",
        name: "Selena Gomez",
        avatar: null,
      },
    ],
  },
  {
    uid: "12",
    name: "Anthony Jensen",
    avatar: "/images/avatar/avatar-2.jpg",
    position: "Backend Developer",
    team: [
      {
        uid: "1",
        name: "Adam Sandler",
        avatar: "/images/avatar/avatar-3.jpg",
      },
      {
        uid: "2",
        name: "Emilia Clarke",
        avatar: "/images/avatar/avatar-19.jpg",
      },
    ],
  },
];

export default function UsersCard6() {
  const {
    result: filteredUsers,
    query,
    setQuery,
  } = useFuse(users, {
    keys: ["name", "position"],
    threshold: 0.2,
    matchAllOnEmptyQuery: true,
  });

  return (
    <Page title="Users Card 6">
      <div className="transition-content w-full px-(--margin-x) pb-8">
        <Toolbar setQuery={setQuery} query={query} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
          {filteredUsers.map(({ item: user, refIndex }) => (
            <UserCard
              key={refIndex}
              name={user.name}
              avatar={user.avatar}
              position={user.position}
              team={user.team}
              query={query}
            />
          ))}
        </div>
      </div>
    </Page>
  );
}
