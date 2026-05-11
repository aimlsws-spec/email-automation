// Import Dependencies
import { useState } from "react";

// Local Imports
import { FilePond } from "components/shared/form/Filepond";

// ----------------------------------------------------------------------

const Basic = () => {
  const [state, setState] = useState({
    files: [],
  });

  console.log(state.files);

  return (
    <div className="max-w-xl">
      <FilePond
        onupdatefiles={(fileItems) => {
          setState({
            files: fileItems.map((fileItem) => fileItem.file),
          });
        }}
      />
    </div>
  );
};

export { Basic };
