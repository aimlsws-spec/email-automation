// Import Dependencies
import { useRef, useState } from "react";

// Local Imports
import { Button } from "components/ui";
import { useEventListener } from "hooks";

// ----------------------------------------------------------------------

export function Basic() {
  const [value, setValue] = useState(1);
  const ref = useRef();

  const increment = () => {
    setValue((prev) => prev + 1);
  };

  useEventListener("click", increment, ref);

  return (
    <div>
      <Button ref={ref}>Increment</Button>
      <div className="mt-2">Value: {value}</div>
    </div>
  );
}
