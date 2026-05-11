```jsx
import { Input } from "components/ui";

const InputError = () => {
  return (
    <div className="max-w-xl">
      <Input placeholder="Enter Username" error="This is error text" />
    </div>
  );
};

export { InputError };
```