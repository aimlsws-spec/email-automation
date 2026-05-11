// Import Dependencies
import { useState } from "react";

// Local Imports
import { Input } from "components/ui";

// ----------------------------------------------------------------------

const Controlled = () => {
  const [value, setValue] = useState("The text");

  return (
    <div className="max-w-xl">
      <Input
        placeholder="Enter Username"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <p className="mt-1">{value}</p>
    </div>
  );
};

export { Controlled };
