```jsx
// Import Dependencies
import { useRef } from "react";

// Local Imports
import { useBoxSize } from "hooks";

// ----------------------------------------------------------------------

export function Basic() {
  const boxRef = useRef();
  const { width, height } = useBoxSize({ ref: boxRef });

  return (
    <div>
      <div
        ref={boxRef}
        className="size-16 resize overflow-auto rounded bg-primary-500"
      ></div>
      <div className="mt-4">
        <div className="text-sm">Width: {width}</div>
        <div className="text-sm">Height: {height}</div>
      </div>
    </div>
  );
}
```