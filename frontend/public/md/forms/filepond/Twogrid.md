```jsx
import { FilePond } from "components/shared/form/Filepond";

const Twogrid = () => {
  return (
    <div className="max-w-xl">
      <FilePond allowMultiple grid={2} />
    </div>
  );
};

export { Twogrid };
```