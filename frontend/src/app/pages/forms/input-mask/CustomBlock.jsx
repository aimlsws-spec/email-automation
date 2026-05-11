// Import Dependencies
import Cleave from "cleave.js/react";

// Local Imports
import { Input } from "components/ui";

// ----------------------------------------------------------------------

const CustomBlock = () => {
  return (
    <div className="max-w-xl">
      <Input
        placeholder="xxx.xx_xxx-xxx"
        component={Cleave}
        options={{
          delimiters: [".", "_", "-"],
          blocks: [3, 2, 3, 3],
          uppercase: true,
        }}
      />
    </div>
  );
};

export { CustomBlock };
