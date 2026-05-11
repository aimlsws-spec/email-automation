import { Swap, SwapOff, SwapOn } from "components/ui";

const Basic = () => {
  return (
    <Swap defaultValue="on">
      <SwapOn className="text-2xl">On</SwapOn>
      <SwapOff className="text-2xl">Off</SwapOff>
    </Swap>
  );
};

export { Basic };
