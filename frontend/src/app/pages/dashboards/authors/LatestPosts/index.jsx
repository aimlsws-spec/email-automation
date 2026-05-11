// Local Imports
import { PostCard } from "./PostCard";

// ----------------------------------------------------------------------

const posts = [
  {
    uid: "5",
    cover: "/images/objects/object-5.jpg",
    created_at: "26 June, 2022",
    title: "Top Design Systems",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto assumenda.",
    author_name: "Katrina West",
    author_avatar: "/images/avatar/avatar-11.jpg",
  },
  {
    uid: "6",
    cover: "/images/objects/object-6.jpg",
    created_at: "12 June, 2022",
    title: "How Did We Get Here? The History of Music Told Through Tweets",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    author_name: "Henry Curtis",
    author_avatar: "/images/avatar/avatar-13.jpg",
  },
  {
    uid: "7",
    cover: "/images/objects/object-7.jpg",
    created_at: "30 June, 2022",
    title: "NodeJS Design Patterns",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    author_name: "Samantha Shelton",
    author_avatar: null,
  },
  {
    uid: "8",
    cover: "/images/objects/object-8.jpg",
    created_at: "03 July, 2022",
    title: "313 Pattern and Color ideas",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    author_name: "Konnor Guzman",
    author_avatar: "/images/avatar/avatar-1.jpg",
  },
  {
    uid: "9",
    cover: "/images/objects/object-9.jpg",
    created_at: "08 July, 2022",
    title: "25 Surprising Facts About Chair",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    author_name: "Selena Gomez",
    author_avatar: "/images/avatar/avatar-11.jpg",
  },
  {
    uid: "10",
    cover: "/images/objects/object-10.jpg",
    created_at: "10 June, 2022",
    title: "What is PHP?",
    description:
      "How Did We Get Here? The History of Music Told Through Tweets",
    author_name: "Travis Fuller",
    author_avatar: "/images/avatar/avatar-19.jpg",
  },
  {
    uid: "11",
    cover: "/images/objects/object-11.jpg",
    created_at: "11 September, 2022",
    title: "Food: A Simple Definition",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi necessitatibus repellat voluptatibus?",
    author_name: "John Doe",
    author_avatar: "/images/avatar/avatar-10.jpg",
  },
  {
    uid: "12",
    cover: "/images/objects/object-12.jpg",
    created_at: "25 May, 2022",
    title: "Tailwind CSS Card Example",
    description:
      "Lorem ipsum dolor sit amet, consectetur. Lorem ipsum dolor on the sit.",
    author_name: "Konnor Guzman",
    author_avatar: "/images/avatar/avatar-20.jpg",
  },
];

export function LatestPosts() {
  return (
    <div className="transition-content mt-4 w-full px-(--margin-x) pb-8 sm:mt-5 lg:mt-6">
      <div className="flex h-8 items-center justify-between">
        <h2 className="text-base font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Latest Posts
        </h2>
        <a
          href="##"
          className="border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary-600 outline-hidden transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
        >
          View All
        </a>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
        {posts.map((post) => (
          <PostCard
            key={post.uid}
            cover={post.cover}
            created_at={post.created_at}
            title={post.title}
            description={post.description}
            author_name={post.author_name}
            author_avatar={post.author_avatar}
          />
        ))}
      </div>
    </div>
  );
}
