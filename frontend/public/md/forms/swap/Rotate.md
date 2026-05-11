```jsx
// Import Dependencies
import {
  MoonIcon,
  PencilIcon,
  SunIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

// Local Imports
import { Swap, SwapOff, SwapOn } from "components/ui";

// ----------------------------------------------------------------------

const Rotate = () => {
  return (
    <div className="flex space-x-2 ">
      <Swap defaultValue="on" effect="rotate">
        <SwapOn>
          <PencilIcon className="inline size-6" />
        </SwapOn>
        <SwapOff>
          <XMarkIcon className="inline size-6" />
        </SwapOff>
      </Swap>
      <Swap defaultValue="on" effect="rotate">
        <SwapOn>
          <SunIcon className="inline size-6" />
        </SwapOn>
        <SwapOff>
          <MoonIcon className="inline size-6" />
        </SwapOff>
      </Swap>
      <Swap defaultValue="on" effect="rotate">
        <SwapOn className="text-2xl">😇</SwapOn>
        <SwapOff className="text-2xl">🥵</SwapOff>
      </Swap>
    </div>
  );
};

export { Rotate };
```