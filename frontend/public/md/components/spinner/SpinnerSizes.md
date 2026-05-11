```jsx
import { Spinner } from "components/ui";

const SpinnerSizes = () => {
  return (
    <div className="inline-space">
      <Spinner color="primary" className="size-3 border" />
      <Spinner color="primary" className="size-5 border-2" />
      <Spinner color="primary" />
      <Spinner color="primary" className="size-10" />
      <Spinner color="primary" className="size-12 border-4" />
      <Spinner color="primary" className="size-14 border-4" />
      <Spinner color="primary" className="size-16 border-4" />
    </div>
  );
};

export { SpinnerSizes };
```