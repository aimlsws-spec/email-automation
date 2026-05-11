```jsx
// Import Dependencies
import { useState } from "react";

// Local Imports
import { StyledSwitch } from "components/shared/form/StyledSwitch";

// ----------------------------------------------------------------------

const Loading = () => {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const LoadingChange = (value) => {
    setLoading(true);
    setTimeout(() => {
      setChecked(value);
      setLoading(false);
    }, 1500);
  };

  return (
    <StyledSwitch
      checked={checked}
      onChange={LoadingChange}
      loading={loading}
      srText="Use Settings"
    />
  );
};

export { Loading };
```