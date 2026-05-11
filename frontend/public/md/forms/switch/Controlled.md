```jsx
// Import Dependencies
import { useState } from "react";

// Local Imports
import { Switch } from "components/ui";

// ----------------------------------------------------------------------

const Controlled = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Switch
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
      label={checked.toString()}
    />
  );
};

export { Controlled };
```