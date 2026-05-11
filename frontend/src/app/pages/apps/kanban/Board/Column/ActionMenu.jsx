// Import Dependencies
import PropTypes from "prop-types";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useCallback, useState } from "react";

// Local Imports
import { Button } from "components/ui";
import { useBoardContext } from "../../Board.context";
import { useDisclosure } from "hooks";
import { ConfirmModal } from "components/shared/ConfirmModal";
import { EditColumn } from "../../Modals/EditColumn";

// ----------------------------------------------------------------------

const confirmDeleteMessages = {
  pending: {
    description:
      "Are you sure you want to delete this column? Once deleted, it cannot be restored.",
  },
  success: {
    title: "Column Deleted",
  },
};

const deletePromise = () =>
  new Promise((resolve) => setTimeout(() => resolve(), 1000));

export function ActionMenu({ columnId }) {
  const { deleteColumn } = useBoardContext();

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

  const handleDeleteColumn = useCallback(() => {
    setConfirmDeleteLoading(true);
    deletePromise()
      .then(() => {
        deleteColumn(columnId);
        setDeleteSuccess(true);
        setConfirmDeleteLoading(false);
      })
      .catch(() => {
        setDeleteError(true);
        setConfirmDeleteLoading(false);
      });
  }, [columnId, deleteColumn]);

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
          variant="flat"
          className="size-8 shrink-0 rounded-full p-0"
        >
          <EllipsisHorizontalIcon className="size-4.5 stroke-2" />
        </MenuButton>
        <Transition
          as={MenuItems}
          enter="transition ease-out"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
          className="absolute z-100 mt-1.5 min-w-[10rem] rounded-lg border border-gray-300 bg-white py-1 shadow-lg shadow-gray-200/50 outline-hidden focus-visible:outline-hidden dark:border-dark-500 dark:bg-dark-700 dark:shadow-none ltr:right-0 rtl:left-0"
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
                <span>Edit Column</span>
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
                <span>Delete Column</span>
              </button>
            )}
          </MenuItem>
        </Transition>
      </Menu>

      <ConfirmModal
        show={isOpenDeleteModal}
        onClose={deleteModalActions.close}
        messages={confirmDeleteMessages}
        onOk={handleDeleteColumn}
        confirmLoading={confirmDeleteLoading}
        state={deleteState}
      />

      <EditColumn
        columnId={columnId}
        isOpen={isOpenEditModal}
        close={editModalActions.close}
      />
    </>
  );
}

ActionMenu.propTypes = {
  columnId: PropTypes.string.isRequired,
};
