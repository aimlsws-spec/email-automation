// Import Dependencies
import { BookmarkIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Avatar, Button, Card } from "components/ui";

// ----------------------------------------------------------------------

const news = [
  {
    id: 1,
    title: "What is Tailwind CSS?",
    cover: "/images/objects/object-18.jpg",
    readTime: "2 min",
    link: "#",
    author: {
      uid: "1",
      name: "John D.",
      avatar: "/images/avatar/avatar-1.jpg",
    },
  },
  {
    id: 2,
    title: "Tailwind CSS Card Example",
    cover: "/images/objects/object-2.jpg",
    readTime: "5 min",
    link: "#",
    author: {
      uid: "2",
      name: "Travis F.",
      avatar: "/images/avatar/avatar-20.jpg",
    },
  },
  {
    id: 3,
    title: "10 Tips for Making a Good Camera Even Better",
    cover: "/images/objects/object-16.jpg",
    readTime: "3 min",
    link: "#",
    author: {
      uid: "3",
      name: "Alfredo E.",
      avatar: "/images/avatar/avatar-19.jpg",
    },
  },
];

export function News() {
  return (
    <div className="mt-4">
      <h2 className="line-clamp-1 px-3 text-xs-plus font-medium tracking-wide text-gray-800 dark:text-dark-100">
        Latest News
      </h2>
      <div className="mt-3 space-y-3 px-2">
        {news.map((item) => (
          <Card skin="bordered" key={item.id} className="p-2.5">
            <div className="flex gap-2">
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div className="line-clamp-2">
                  <a
                    href={item.link}
                    className="font-medium text-gray-700 hover:text-primary-600 focus:text-primary-600 dark:text-dark-100 dark:hover:text-primary-400 dark:focus:text-primary-400"
                  >
                    {item.title}
                  </a>
                </div>
                <div className="flex min-w-0 items-center justify-between gap-2">
                  <div className="flex w-full min-w-0 items-center gap-2">
                    <Avatar
                      size={7}
                      src={item.author.avatar}
                      name={item.author.name}
                      initialColor="auto"
                      className="text-xs"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">
                        {item.author.name}
                      </p>
                      <p className="truncate text-tiny-plus text-dark-400 dark:text-dark-300">
                        {item.readTime} read
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <Button
                      isIcon
                      variant="flat"
                      className="size-7 rounded-full"
                    >
                      <HandThumbUpIcon className="size-4" />
                    </Button>
                    <Button
                      isIcon
                      variant="flat"
                      className="size-7 rounded-full"
                    >
                      <BookmarkIcon className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <img
                className="size-20 rounded-lg object-cover object-center"
                src={item.cover}
                alt={item.title}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
