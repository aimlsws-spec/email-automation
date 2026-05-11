// Import Dependencies
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

// Local Imports
import { Textarea, Input, Button } from "components/ui";

// ----------------------------------------------------------------------

const Prepend = () => {
  return (
    <div className="max-w-xl">
      <div className="rounded-lg border border-gray-300 transition-colors focus-within:border-primary-600! hover:border-gray-400 dark:border-dark-450 dark:focus-within:border-primary-500! dark:hover:border-dark-400">
        <div className="flex justify-between">
          <Input
            placeholder="Post title"
            unstyled
            className="bg-transparent px-3 py-2 text-base placeholder:font-light placeholder:text-gray-600 dark:placeholder:text-dark-200"
            classNames={{
              root: "w-full",
            }}
          />
          <div className="p-2">
            <Button variant="flat" isIcon className="size-8 rounded-full">
              <EllipsisHorizontalIcon className="size-5" />
            </Button>
          </div>
        </div>

        <Textarea
          rows="6"
          placeholder="Post Content"
          unstyled
          className="bg-transparent px-3 pb-2 placeholder:font-light placeholder:text-gray-600 dark:placeholder:text-dark-200"
        />
      </div>
    </div>
  );
};

export { Prepend };
