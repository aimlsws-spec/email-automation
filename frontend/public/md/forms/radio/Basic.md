```jsx
import { Radio } from "components/ui";

const Basic = () => {
  return (
    <div className="max-w-xl">
      <div className="flex flex-wrap gap-5">
        <Radio defaultChecked label="Primary" name="basic" />
        <Radio color="secondary" label="Secondary" name="basic" />
        <Radio color="info" label="Info" name="basic" />
        <Radio color="warning" label="Warning" name="basic" />
        <Radio color="success" label="Success" name="basic" />
        <Radio color="error" label="Error" name="basic" />
      </div>
    </div>
  );
};

export { Basic };
```