```jsx
import { Swap, SwapOff, SwapOn } from "components/ui";

const Disabled = () => {
  return (
    <Swap defaultValue="on" disabled>
      <SwapOn className="text-2xl">On</SwapOn>
      <SwapOff className="text-2xl">Off</SwapOff>
    </Swap>
  );
};

export { Disabled };
```