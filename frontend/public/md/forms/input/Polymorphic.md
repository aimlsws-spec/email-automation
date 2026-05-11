```jsx
// Import Dependencies
import Cleave from "cleave.js/react";

// Local Imports
import { Input } from "components/ui";

// ----------------------------------------------------------------------

const Polymorphic = () => {
  return (
    <div className="max-w-xl">
      <Input
        placeholder="4444 4444 4444 4444"
        component={Cleave}
        options={{ creditCard: true }}
      />
    </div>
  );
};

export { Polymorphic };
```