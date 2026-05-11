// Import Dependencies
import { useState } from "react";

// Local Imports
import { Range } from "components/ui";

// ----------------------------------------------------------------------

const Controlled = () => {
  const [value, setValue] = useState(50);

  return (
    <div className="max-w-xl">
      <div className="flex justify-between">
        <span>0</span>
        <span>100</span>
      </div>
      <Range
        className="mt-1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <p className="mt-2">
        Value: <span>{value}</span>
      </p>
    </div>
  );
};

export { Controlled };
