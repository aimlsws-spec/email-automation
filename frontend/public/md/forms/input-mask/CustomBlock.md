```jsx
// Import Dependencies
import Cleave from "cleave.js/react";

// Local Imports
import { Input } from "components/ui";

// ----------------------------------------------------------------------

const DateTime = () => {
  return (
    <div className="max-w-xl">
      <Input
        placeholder="Enter Date"
        component={Cleave}
        options={{
          date: true,
          delimiter: "-",
          datePattern: ["m", "d", "Y"],
        }}
      />

      {/* Time */}
      <Input
        classNames={{
          root: "mt-4",
        }}
        placeholder="Enter Time"
        component={Cleave}
        options={{
          time: true,
          timePattern: ["h", "m", "s"],
        }}
      />
    </div>
  );
};

export { DateTime };
```