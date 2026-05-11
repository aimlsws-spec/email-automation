// Import Dependencies
import { useRef, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PaperClipIcon } from "@heroicons/react/24/solid";

// Local Imports
import { Upload, Button, Input } from "components/ui";

// ----------------------------------------------------------------------

const InputView = () => {
  const [files, setFiles] = useState([]);
  const uploadRef = useRef();

  const filesList =
    files.length > 0
      ? files.map((file) => file.name).join(", ")
      : "Choose Files";

  return (
    <div className="max-w-xl">
      <Upload
        name="file"
        onChange={setFiles}
        multiple
        ref={uploadRef}
      >
        {({ ...props }) => (
          <>
            <Input
              component="button"
              prefix={<PaperClipIcon className="size-5" />}
              suffix={
                files.length > 0 && (
                  <Button
                    variant="flat"
                    className="pointer-events-auto size-5 shrink-0 rounded-full p-0"
                    onClick={() => {
                      uploadRef.current.value = "";
                      setFiles([]);
                    }}
                  >
                    <XMarkIcon className="size-4" />
                  </Button>
                )
              }
              title={filesList}
              className="cursor-pointer truncate text-start"
              {...props}
            >
              {filesList}
            </Input>
          </>
        )}
      </Upload>
    </div>
  );
};

export { InputView };
