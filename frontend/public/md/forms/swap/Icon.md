```jsx
// Import Dependencies
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/20/solid";

// Local Imports
import { Swap, SwapOff, SwapOn } from "components/ui";

// ----------------------------------------------------------------------

const Icon = () => {
  return (
    <Swap defaultValue="on">
      <SwapOn>
        <SpeakerWaveIcon className="size-8" />
      </SwapOn>
      <SwapOff>
        <SpeakerXMarkIcon className="size-8" />
      </SwapOff>
    </Swap>
  );
};

export { Icon };
```