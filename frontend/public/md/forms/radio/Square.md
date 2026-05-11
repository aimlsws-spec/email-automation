```jsx
import { Radio } from "components/ui";

const Square = () => {
  return (
    <div className="max-w-xl">
      <div className="flex flex-wrap gap-5">
        <Radio
          defaultChecked
          label="Primary"
          name="basic-square"
          className="rounded-md"
        />
        <Radio
          color="secondary"
          label="Secondary"
          name="basic-square"
          className="rounded-md"
        />
        <Radio
          color="info"
          label="Info"
          name="basic-square"
          className="rounded-md"
        />
        <Radio
          color="warning"
          label="Warning"
          name="basic-square"
          className="rounded-md"
        />
        <Radio
          color="success"
          label="Success"
          name="basic-square"
          className="rounded-md"
        />
        <Radio
          color="error"
          label="Error"
          name="basic-square"
          className="rounded-md"
        />
      </div>
    </div>
  );
};

export { Square };
```