```jsx
// Import Dependencies
import { useRef, useState } from "react";
import { CloudArrowUpIcon } from "@heroicons/react/24/solid";

// Local Imports
import { Upload, Button } from "components/ui";

// ----------------------------------------------------------------------

const Reset = () => {
  const [file, setFile] = useState();
  const uploadRef = useRef();

  return (
    <div className="max-w-xl">
      <div className="flex space-x-2 ">
        <Upload onChange={setFile} ref={uploadRef}>
          {({ ...props }) => (
            <Button
              color="primary"
              {...props}
              className="space-x-2 "
            >
              <CloudArrowUpIcon className="size-5" />
              <span>Choose File</span>
            </Button>
          )}
        </Upload>

        <Button
          disabled={!file}
          onClick={() => {
            uploadRef.current.value = "";
            setFile();
          }}
        >
          Reset
        </Button>
      </div>
      {file && (
        <div>
          File name : <span className="font-medium">{file.name}</span>
        </div>
      )}
    </div>
  );
};

export { Reset };
```