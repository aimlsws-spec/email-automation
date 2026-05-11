```jsx
// Import Dependencies
import Cleave from "cleave.js/react";

// Local Imports
import { Input } from "components/ui";

// ----------------------------------------------------------------------

const Prefix = () => {
  return (
    <div className="max-w-xl">
      <Input
        placeholder="4444 4444 4444 4444"
        component={Cleave}
        options={{
          prefix: "Prefix",
          delimiter: "-",
          blocks: [6, 4, 4, 7],
        }}
      />
    </div>
  );
};

export { Prefix };
```