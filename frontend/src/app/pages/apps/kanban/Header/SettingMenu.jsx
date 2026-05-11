// Import Dependencies
import { useCallback, useState } from "react";
import {
  Cog6ToothIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import clsx from "clsx";

// Local Imports
import { Button } from "components/ui";
import { useDisclosure } from "hooks";
import { ConfirmModal } from "components/shared/ConfirmModal";
import { useBoardContext } from "../Board.context";
import { EditBoard } from "../Modals/EditBoard";

// ----------------------------------------------------------------------

const confirmDeleteMessages = {
  pending: {
    description:
      "Are you sure you want to delete this board? Once deleted, it cannot be restored.",
  },
  success: {
    title: "Board Deleted",
  },
};

const deletePromise = () =>
  new Promise((resolve) => setTimeout(() => resolve(), 1000));

export function SettingMenu() {
  const { currentBoard, deleteBoard } = useBoardContext();

  const [isOpenEditModal, editModalActions] = useDisclosure(false);

  const [isOpenDeleteModal, deleteModalActions] = useDisclosure(false);

  const [confirmDeleteLoading, setConfirmDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  const openDeleteModal = () => {
    deleteModalActions.open();
    setDeleteError(false);
    setDeleteSuccess(false);
  };

  const handleDeleteBoard = useCallback(() => {
    setConfirmDeleteLoading(true);
    deletePromise()
      .then(() => {
        deleteBoard(currentBoard.id);
        setDeleteSuccess(true);
        setConfirmDeleteLoading(false);
      })
      .catch(() => {
        setDeleteError(true);
        setConfirmDeleteLoading(false);
      });
  }, [currentBoard.id, deleteBoard]);

  const deleteState = deleteError
    ? "error"
    : deleteSuccess
      ? "success"
      : "pending";

  return (
    <>
      <Menu as="div" className="relative inline-block text-start">
        <MenuButton
          as={Button}
          isIcon
          className="size-6 rounded-full md:size-8"
          variant="flat"
        >
          <Cog6ToothIcon className="size-4 md:size-4.5" />
        </MenuButton>

        <Transition
          as={MenuItems}
          enter="transition ease-out"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
          className="absolute z-100 mt-1.5 min-w-[11rem] rounded-lg border border-gray-300 bg-white py-1 font-medium shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0"
        >
          <MenuItem onClick={editModalActions.open}>
            {({ focus }) => (
              <button
                className={clsx(
                  "flex h-9 w-full items-center space-x-3 px-3 tracking-wide outline-hidden transition-colors ",
                  focus &&
                    "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-dark-100",
                )}
              >
                <PencilIcon className="size-4.5 stroke-1" />
                <span>Edit Board</span>
              </button>
            )}
          </MenuItem>

          <MenuItem onClick={openDeleteModal}>
            {({ focus }) => (
              <button
                className={clsx(
                  "this:error flex h-9 w-full items-center space-x-3 px-3 tracking-wide text-this outline-hidden transition-colors dark:text-this-light ",
                  focus && "bg-this/10 dark:bg-this-light/10",
                )}
              >
                <TrashIcon className="size-4.5 stroke-1" />
                <span>Delete Board</span>
              </button>
            )}
          </MenuItem>
        </Transition>
      </Menu>

      <ConfirmModal
        show={isOpenDeleteModal}
        onClose={deleteModalActions.close}
        messages={confirmDeleteMessages}
        onOk={handleDeleteBoard}
        confirmLoading={confirmDeleteLoading}
        state={deleteState}
      />

      <EditBoard isOpen={isOpenEditModal} close={editModalActions.close} />
    </>
  );
}
