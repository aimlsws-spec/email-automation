// Local Imports
import { Avatar, Box, Tag } from "components/ui";

// ----------------------------------------------------------------------

export function PrimaryCard() {
  return (
    <Box className="rounded-lg bg-primary-600 p-4 dark:bg-primary-500">
      <div className="flex items-center gap-3">
        <Avatar size={10} src="/images/avatar/avatar-20.jpg" />
        <div>
          <p className="font-medium text-white">John Doe</p>
          <p className="text-xs text-white/80">55 min ago</p>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-xs-plus text-white/90">
          Lorem ipsum dolor sit amet, consectetur.
        </p>
      </div>
      <Tag
        className="mt-3 rounded-full border border-white px-2.5 py-1 text-xs text-white hover:opacity-80"
        component="button"
        unstyled
      >
        Tag 1
      </Tag>
    </Box>
  );
}
