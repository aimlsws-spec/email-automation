// Import Dependencies
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import {
  FunnelIcon,
  LockClosedIcon,
  StarIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

// Local Imports
import { Avatar, Button, Input } from "components/ui";
import { useBoardContext } from "../Board.context";
import { SettingMenu } from "./SettingMenu";

// ----------------------------------------------------------------------

export function Header() {
  const { currentBoard } = useBoardContext();

  if (!currentBoard) {
    return null;
  }

  return (
    <div className="transition-content flex items-center justify-between gap-2 px-(--margin-x) shrink-0 h-12 sm:pt-5">
      <div className="flex min-w-0 items-center gap-1">
        <h3 className="truncate text-lg font-medium text-gray-800 dark:text-dark-50">
          {currentBoard.name}
        </h3>
        {currentBoard.isPrivate && (
          <Button
            isIcon
            className="size-8 max-sm:hidden"
            variant="flat"
            color="error"
          >
            <LockClosedIcon className="size-4.5 stroke-2" />
          </Button>
        )}
      </div>
      <div className="flex gap-4">
        <Input
          classNames={{
            root: "w-full max-w-[16rem] max-sm:hidden",
            input: "h-8 text-xs",
          }}
          placeholder="Search in Boards..."
          prefix={<MagnifyingGlassIcon className="size-4.5" />}
        />
        <div className="flex gap-1">
          <div className="flex -space-x-2 max-sm:hidden ">
            <Avatar
              size={8}
              classNames={{
                root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                display: "text-xs ring-3 ring-white dark:ring-dark-700",
              }}
              src="/images/avatar/avatar-20.jpg"
            />

            <Avatar
              size={8}
              classNames={{
                root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                display: "text-xs ring-3 ring-white dark:ring-dark-700",
              }}
              src="/images/avatar/avatar-19.jpg"
            />

            <Avatar
              size={8}
              classNames={{
                root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                display: "text-xs ring-3 ring-white dark:ring-dark-700",
              }}
              src="/images/avatar/avatar-10.jpg"
            />

            <Avatar
              size={8}
              classNames={{
                root: "origin-bottom transition-transform hover:z-10 hover:scale-125",
                display: "text-xs ring-3 ring-white dark:ring-dark-700",
              }}
              initialColor="success"
            >
              +5
            </Avatar>
          </div>
          <Button
            isIcon
            className="size-6 rounded-full sm:hidden md:size-8"
            variant="flat"
          >
            <UsersIcon className="size-4 md:size-4.5" />
          </Button>
          <Button
            isIcon
            className="size-6 rounded-full md:size-8"
            variant="flat"
            color="info"
          >
            <UserPlusIcon className="size-4 md:size-4.5" />
          </Button>
          <div className="my-1 w-px bg-gray-200 dark:bg-dark-500" />
          <div className="flex">
            <Button
              isIcon
              className="size-6 rounded-full sm:hidden md:size-8"
              variant="flat"
            >
              <MagnifyingGlassIcon className="size-4 md:size-4.5" />
            </Button>
            <Button
              isIcon
              className="size-6 rounded-full md:size-8"
              variant="flat"
            >
              <FunnelIcon className="size-4 md:size-4.5" />
            </Button>
            <Button
              isIcon
              className="size-6 rounded-full md:size-8"
              variant="flat"
            >
              <StarIcon className="size-4 md:size-4.5" />
            </Button>
            <SettingMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
