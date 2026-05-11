// Import Dependencies
import { PlusIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Button, Upload } from "components/ui";
import { FileItemSquare } from "components/shared/form/FileItemSquare";
import { useListState } from "hooks";

// ----------------------------------------------------------------------

const Multiple = () => {
  const [files, { remove, append }] = useListState();

  return (
    <div className="flex flex-wrap gap-3">
      {files.map((file, index) => (
        <FileItemSquare
          handleRemove={() => remove(index)}
          file={file}
          key={index}
        />
      ))}
      <Upload onChange={(files) => append(...files)} multiple>
        {({ ...props }) => (
          <Button
            {...props}
            unstyled
            className="size-20 shrink-0 space-x-2 rounded-lg border-2 border-current p-0 text-gray-300 hover:text-primary-600  dark:text-dark-450 dark:hover:text-primary-500"
          >
            <PlusIcon className="size-6 stroke-2" />
          </Button>
        )}
      </Upload>
    </div>
  );
};

export { Multiple };
