// Local Imports
import { Avatar, Button, Card } from "components/ui";

// ----------------------------------------------------------------------

const artists = [
  {
    uid: "1",
    name: "Travis Fuller",
    avatar: "/images/avatar/avatar-20.jpg",
    itemsCount: "1649",
  },
  {
    uid: "2",
    name: "Katrina West",
    avatar: "/images/avatar/avatar-11.jpg",
    itemsCount: "691",
  },
  {
    uid: "3",
    name: "Henry Curtis",
    avatar: "/images/avatar/avatar-19.jpg",
    itemsCount: "329",
  },
  {
    uid: "4",
    name: "Lance Tucker",
    avatar: null,
    itemsCount: "762",
  },
  {
    uid: "5",
    name: "Mores Clarke",
    avatar: "/images/avatar/avatar-5.jpg",
    itemsCount: "695",
  },
];

export function TopArtists() {
  return (
    <Card className="px-4 pb-4">
      <div className="flex h-14 min-w-0 items-center justify-between py-3">
        <h2 className="font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Top Artists
        </h2>
        <a
          href="##"
          className="border-b border-dotted border-current pb-0.5 text-xs-plus font-medium text-primary-600 outline-hidden transition-colors duration-300 hover:text-primary-600/70 focus:text-primary-600/70 dark:text-primary-400 dark:hover:text-primary-400/70 dark:focus:text-primary-400/70"
        >
          View All
        </a>
      </div>
      <div className="space-y-4">
        {artists.map((artist) => (
          <div
            key={artist.uid}
            className="flex min-w-0 items-center justify-between gap-2"
          >
            <div className="flex min-w-0 items-center gap-2">
              <Avatar
                size={10}
                src={artist.avatar}
                name={artist.name}
                initialColor="auto"
              />
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium text-gray-800 dark:text-dark-100">
                  {artist.name}
                </span>
                <span className="mt-0.5 truncate text-xs text-gray-400 dark:text-dark-300">
                  {artist.itemsCount} items
                </span>
              </div>
            </div>
            <Button color="primary" className="h-7 rounded-full px-2.5 text-xs">
              Follow
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
