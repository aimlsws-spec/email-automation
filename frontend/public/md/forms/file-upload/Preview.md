```jsx
// Import Dependencies
import { useRef, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

// Local Imports
import { Button, Upload } from "components/ui";
import { FileItemSquare } from "components/shared/form/FileItemSquare";

// ----------------------------------------------------------------------

const Preview = () => {
  const [file, setFile] = useState();
  const uploadRef = useRef();

  const handleRemove = (e) => {
    e.stopPropagation();
    uploadRef.current.value = "";
    setFile(null);
  };
  
  return (
    <div>
      <Upload onChange={setFile} ref={uploadRef} accept="image/*">
        {({ ...props }) =>
          file ? (
            <FileItemSquare
              handleRemove={handleRemove}
              file={file}
              {...props}
            />
          ) : (
            <Button
              unstyled
              className="size-20 shrink-0 space-x-2 rounded-lg border-2 border-current p-0 text-gray-300 hover:text-primary-600 dark:text-dark-450 dark:hover:text-primary-500 "
              {...props}
            >
              <PlusIcon className="size-6 stroke-2" />
            </Button>
          )
        }
      </Upload>
    </div>
  );
};

export { Preview };
```