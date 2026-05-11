// Local Imports
import Writer from "assets/illustrations/writer.svg?react";
import { useThemeContext } from "app/contexts/theme/context";
import { AuthorCard } from "./AuthorCard";

// ----------------------------------------------------------------------

const authors = [
  {
    uid: "1",
    cover: "/images/objects/object-2.jpg",
    avatar: "/images/avatar/avatar-4.jpg",
    color: "primary",
    socialLinks: {
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
    },
    name: "Konnor Guzman",
    location: "USA, Washington DC",
    chartData: [1765, 2357, 4215, 3971, 3841, 4221],
    postsCount: "24",
    follows: [
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
    uid: "2",
    cover: "/images/objects/object-13.jpg",
    avatar: "/images/avatar/avatar-19.jpg",
    color: "secondary",
    socialLinks: {
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
    },
    name: "Travis Fuller",
    location: "UK, London",
    chartData: [2357, 4215, 1765, 4221, 3841, 5665],
    postsCount: "11",
    follows: [
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
    uid: "3",
    cover: "/images/objects/object-17.jpg",
    avatar: "/images/avatar/avatar-18.jpg",
    color: "success",
    socialLinks: {
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
    },
    name: "Alfredo Elliott",
    location: "Australia, Sydney",
    chartData: [6153, 7020, 5659, 3422, 5439, 6081],
    postsCount: "171",
    follows: [
      {
        uid: "11",
        name: "Anthony Jensen",
        avatar: "/images/avatar/avatar-1.jpg",
      },
      {
        uid: "12",
        name: "Anthony Jensen",
        avatar: "/images/avatar/avatar-2.jpg",
      },
    ],
  },
  {
    uid: "4",
    cover: "/images/objects/object-16.jpg",
    avatar: "/images/avatar/avatar-12.jpg",
    color: "error",
    socialLinks: {
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
    },
    name: "Derrick Simmons",
    location: "Austria, Vienna",
    chartData: [1499, 2303, 2857, 1791, 2194, 1351],
    postsCount: "67",
    follows: [
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
    uid: "5",
    cover: "/images/objects/object-14.jpg",
    avatar: "/images/avatar/avatar-11.jpg",
    color: "warning",
    socialLinks: {
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
    },
    name: "Samantha Shelton",
    location: "Germany, Berlin",
    chartData: [1765, 2357, 4215, 3971, 3841, 4221],
    postsCount: "36",
    follows: [
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
];

export function TopAuthors() {
  const { primaryColorScheme: primary, darkColorScheme: dark } =
    useThemeContext();

  return (
    <div className="mt-4 sm:mt-5 lg:mt-6">
      <div className="transition-content flex h-8 w-full items-center justify-between px-(--margin-x)">
        <h2 className="text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Top Authors
        </h2>
        <a
          href="##"
          className="border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary-600 outline-hidden transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
        >
          View All
        </a>
      </div>
      <div className="mt-3 grid grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
        <div className="transition-content mt-4 hidden pl-(--margin-x) lg:col-span-3 lg:flex">
          <div className="flex items-center justify-center px-3">
            <Writer
              className="w-full"
              style={{ "--primary": primary[500], "--dark": dark[600] }}
            />
          </div>
        </div>
        <div className="hide-scrollbar col-span-12 flex space-x-4 overflow-x-auto px-(--margin-x)  lg:col-span-9 lg:pl-0">
          {authors.map((author) => (
            <AuthorCard
              key={author.uid}
              avatar={author.avatar}
              cover={author.cover}
              color={author.color}
              socialLinks={author.socialLinks}
              name={author.name}
              chartData={author.chartData}
              location={author.location}
              postsCount={author.postsCount}
              follows={author.follows}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
