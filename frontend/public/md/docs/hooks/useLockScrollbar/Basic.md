```jsx
// Import Dependencies
import { useState } from "react"; 

// Local Imports
import { Button } from "components/ui";
import { useLockScrollbar } from "hooks";

// ----------------------------------------------------------------------

export function Basic() {
  const [state, setState] = useState(false);

  useLockScrollbar(state);

  return (
    <div>
      <Button onClick={() => setState((val) => !val)}>
        {state ? "Unlock" : "Lock"} Scrollbar
      </Button>
    </div>
  );
}
```