// Import Dependencies
import { useState } from "react";

// Local Imports
import { Textarea } from "components/ui";

// ----------------------------------------------------------------------

const getTextLength = (text) => [...text].length;

const Controlled = () => {
  const [value, setValue] = useState("The text");

  return (
    <div className="max-w-xl">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter text"
        rows="5"
        maxLength={100}
      />

      <p className="mt-1 text-end text-xs text-gray-400 dark:text-dark-300">
        {getTextLength(value)}/100
      </p>
    </div>
  );
};

export { Controlled };
