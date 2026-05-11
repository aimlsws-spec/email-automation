// Local Imports
import KanbanIllustration from "assets/illustrations/kanban.svg?react";
import { useThemeContext } from "app/contexts/theme/context";
import { useDisclosure } from "hooks";
import { AddBoard } from "../Modals/AddBoard";
import { Button } from "components/ui";

// ----------------------------------------------------------------------

export function NoBoardsFound() {
  const { primaryColorScheme } = useThemeContext();
  const [isOpenModal, { open, close }] = useDisclosure(false);

  return (
    <>
      <div className="grid h-full place-content-center place-items-center p-4 text-center">
        <KanbanIllustration
          className="h-auto w-full max-w-xs"
          style={{
            "--primary": primaryColorScheme[500],
          }}
        />
        <div className="max-w-xl">
          <p className="mt-6 text-xl font-semibold text-gray-800 dark:text-dark-50 lg:mt-10">
            Build Your Board
          </p>
          <p className="text-balance pt-2">
            Create a new board to get started. You can always add new columns
            later. You can create as many boards as you want.
          </p>
          <div className="mt-6">
            <Button onClick={open} color="primary" className="h-11 text-base">
              Create New Board
            </Button>
          </div>
        </div>
      </div>

      <AddBoard isOpen={isOpenModal} close={close} />
    </>
  );
}
