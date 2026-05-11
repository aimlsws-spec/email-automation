```jsx
import { Range } from "components/ui";

const RangeSizes = () => {
  return (
    <div className="max-w-xl space-y-8">
      <Range defaultValue={50} trackSize="3px" thumbSize="12px" />
      <Range defaultValue={50} />
      <Range defaultValue={50} trackSize="8px" thumbSize="24px" />
    </div>
  );
};

export { RangeSizes };
```