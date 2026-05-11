import { SyntaxHighlighter } from "components/shared/SyntaxHighlighter";

export function Basic() {
  return (
    <div>
      <SyntaxHighlighter language="jsx">{`const posts = [
  {
    uid: "1",
    cover: "/images/objects/object-6.jpg",
    category: "Frameworks",
    title: "What is Tailwind CSS?",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet, provident quasi recusandae repudiandae rerum temporibus!",
    author_avatar: "/images/avatar/avatar-10.jpg",
    author_name: "John Doe",
    created_at: "June 23, 2021",
  },
  {
    uid: "2",
    cover: "/images/objects/object-3.jpg",
    category: "Frameworks",
    title: "Tailwind CSS Card Example",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est repellat nisi corrupti. Lorem, ipsum.",
    author_avatar: "/images/avatar/avatar-2.jpg",
    author_name: "Konnor Guzman",
    created_at: "May 25, 2021",
  },
  {
    uid: "3",
    cover: "/images/objects/object-4.jpg",
    category: "Programming Language",
    title: "What is PHP?",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet, provident quasi recusandae repudiandae rerum temporibus!",
    author_avatar: "/images/avatar/avatar-1.jpg",
    author_name: "Travis Fuller",
    created_at: "March 14, 2022",
  },
  {
    uid: "4",
    cover: "/images/objects/object-7.jpg",
    category: "UI/UX",
    title: "Top Design Systems",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem quibusdam, ipsam in eveniet quod voluptatum!",
    author_avatar: "/images/avatar/avatar-20.jpg",
    author_name: "Alfredo Elliott",
    created_at: "June 20, 2022",
  },
  {
    uid: "5",
    cover: "/images/objects/object-5.jpg",
    category: "UI/UX",
    title: "313 Pattern and Color ideas",
    description:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptates impedit odio consectetur! Voluptatem ipsa nulla excepturi voluptatibus.",
    author_avatar: "/images/avatar/avatar-19.jpg",
    author_name: "Derrick Simmons",
    created_at: "December 27, 2021",
  },
  {
    uid: "6",
    cover: "/images/objects/object-5.jpg",
    category: "Programming Language",
    title: "NodeJS Design Patterns",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Alias rerum aliquam maiores dolorum itaque?",
    author_avatar: "/images/avatar/avatar-11.jpg",
    author_name: "Katrina West",
    created_at: "November 9, 2021",
  },
  {
    uid: "7",
    cover: "/images/objects/object-2.jpg",
    category: "Frameworks",
    title: "What is Tailwind CSS?",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet, provident quasi recusandae repudiandae rerum temporibus!",
    author_avatar: "/images/avatar/avatar-10.jpg",
    author_name: "John Doe",
    created_at: "June 23, 2021",
  },
  {
    uid: "8",
    cover: "/images/objects/object-16.jpg",
    category: "Frameworks",
    title: "Tailwind CSS Card Example",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est repellat nisi corrupti. Lorem, ipsum.",
    author_avatar: "/images/avatar/avatar-2.jpg",
    author_name: "Konnor Guzman",
    created_at: "May 25, 2021",
  },
];


export default function BlogCard1() {
  const {
    result: filteredPosts,
    query,
    setQuery,
  } = useFuse(posts, {
    keys: ["category", "title", "author_name"],
    threshold: 0.2,
    matchAllOnEmptyQuery: true,
  });

  return (
    <Page title="Blog Card 1">
      <div className="transition-content w-full">
        <Input
          classNames={{
            input: "h-9 rounded-full text-xs-plus",
            root: "max-sm:hidden",
          }}
          value={query || ""}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Posts ..."
          className=""
          prefix={<MagnifyingGlassIcon className="size-4.5" />}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
          {filteredPosts.map(({ item: post, refIndex }) => (
            <PostCard
              key={refIndex}
              cover={post.cover}
              category={post.category}
              title={post.title}
              description={post.description}
              author_avatar={post.author_avatar}
              author_name={post.author_name}
              created_at={post.created_at}
              query={query}
            />
          ))}
        </div>
      </div>
    </Page>
  );
}

`}</SyntaxHighlighter>
    </div>
  );
}
