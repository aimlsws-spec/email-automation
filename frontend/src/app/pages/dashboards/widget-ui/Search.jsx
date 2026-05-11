// Import Dependencies
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Button, Card, Input, Tag } from "components/ui";

// ----------------------------------------------------------------------

export function Search() {
  return (
    <Card className="p-4">
      <div className="flex -space-x-px ">
        <Input
          placeholder="Search..."
          classNames={{
            root: "flex-1",
            input:
              "relative hover:z-1 focus:z-1 ltr:rounded-r-none rtl:rounded-l-none",
          }}
        />
        <Button
          color="primary"
          className="px-3 ltr:rounded-l-none rtl:rounded-r-none"
        >
          <MagnifyingGlassIcon className="size-5" />
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        <Tag
          component="button"
          color="info"
          variant="soft"
          className="rounded-full"
        >
          Icon
        </Tag>
        <Tag
          component="button"
          color="info"
          variant="soft"
          className="rounded-full"
        >
          UI/UX
        </Tag>
        <Tag
          component="button"
          color="info"
          variant="soft"
          className="rounded-full"
        >
          Tailwind
        </Tag>
      </div>
    </Card>
  );
}
