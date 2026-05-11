// Local Imports
import { AuthorCard } from "./AuthorCard";

// ----------------------------------------------------------------------

const authors = [
  {
    uid: "1",
    name: "Travis Fuller",
    avatar: "/images/avatar/avatar-5.jpg",
    messages: 2,
    mails: 4,
    posts: "2348",
    views: "3.45k",
    followers: "78",
    awards: [
      {
        uid: 1,
        label: "Award level 1",
        image: "/images/awards/award-19.svg",
      },
      {
        uid: 2,
        label: "Award level 2",
        image: "/images/awards/award-2.svg",
      },
      {
        uid: 3,
        label: "Award level 3",
        image: "/images/awards/award-5.svg",
      },
    ],
  },
  {
    uid: "2",
    name: "Konnor Guzman",
    avatar: "/images/avatar/avatar-18.jpg",
    messages: null,
    mails: 2,
    posts: "2.34k",
    views: "93.3k",
    followers: "566",
    awards: [
      {
        uid: 1,
        label: "Award level 1",
        image: "/images/awards/award-1.svg",
      },
      {
        uid: 2,
        label: "Award level 2",
        image: "/images/awards/award-6.svg",
      },
      {
        uid: 3,
        label: "Award level 3",
        image: "/images/awards/award-9.svg",
      },
    ],
  },
  {
    uid: "3",
    name: "Alfredo Elliott",
    avatar: "/images/avatar/avatar-6.jpg",
    messages: 4,
    mails: null,
    posts: "361",
    views: "37.2k",
    followers: "823",
    awards: [
      {
        uid: 1,
        label: "Award level 1",
        image: "/images/awards/award-14.svg",
      },
      {
        uid: 2,
        label: "Award level 2",
        image: "/images/awards/award-13.svg",
      },
    ],
  },
  {
    uid: "4",
    name: "Samantha Shelton",
    avatar: "/images/avatar/avatar-11.jpg",
    messages: null,
    mails: 2,
    posts: "18",
    views: "364.4k",
    followers: "54.2k",
    awards: [
      {
        uid: 1,
        label: "Award level 1",
        image: "/images/awards/award-15.svg",
      },
      {
        uid: 2,
        label: "Award level 2",
        image: "/images/awards/award-13.svg",
      },
    ],
  },
  {
    uid: "5",
    name: "Derrick Simmons",
    avatar: "/images/avatar/avatar-19.jpg",
    messages: null,
    mails: null,
    posts: "80",
    views: "1.3M",
    followers: "52k",
    awards: [
      {
        uid: 1,
        label: "Award level 1",
        image: "/images/awards/award-15.svg",
      },
      {
        uid: 2,
        label: "Award level 2",
        image: "/images/awards/award-5.svg",
      },
      {
        uid: 3,
        label: "Award level 3",
        image: "/images/awards/award-25.svg",
      },
    ],
  },
  {
    uid: "6",
    name: "Katrina West",
    avatar: null,
    messages: null,
    mails: 1,
    posts: "35",
    views: "2.2M",
    followers: "80k",
    awards: [
      {
        uid: 1,
        label: "Award level 1",
        image: "/images/awards/award-1.svg",
      },
      {
        uid: 2,
        label: "Award level 2",
        image: "/images/awards/award-24.svg",
      },
      {
        uid: 3,
        label: "Award level 3",
        image: "/images/awards/award-30.svg",
      },
    ],
  },
];

export function FeaturedAuthors() {
  return (
    <div className="transition-content mt-4 pl-(--margin-x) sm:mt-5 lg:mt-6">
      <div className="rounded-l-lg bg-info/10 pb-1 pt-4 dark:bg-dark-800">
        <h2 className="truncate px-4 text-base font-medium tracking-wide text-gray-800 dark:text-dark-100 sm:px-5">
          Featured Authors
        </h2>
        <div
          className="custom-scrollbar mt-4 flex space-x-4 overflow-x-auto px-4 pb-4 sm:px-5 "
          style={{ "--margin-scroll": "1.25rem" }}
        >
          {authors.map((author) => (
            <AuthorCard key={author.uid} {...author} />
          ))}
        </div>
      </div>
    </div>
  );
}
