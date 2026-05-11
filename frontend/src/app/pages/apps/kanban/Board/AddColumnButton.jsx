// Import Dependencies
import { PlusIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Button } from "components/ui";
import { AddColumn } from "../Modals/AddColumn";
import { useDisclosure } from "hooks";

// ----------------------------------------------------------------------

export function AddColumnButton() {
  const [isOpen, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button className="w-72 shrink-0 gap-2" onClick={open}>
        <PlusIcon className="size-4.5" />
        <span>Add New Column</span>
      </Button>

      <AddColumn isOpen={isOpen} close={close} />
    </>
  );
}
