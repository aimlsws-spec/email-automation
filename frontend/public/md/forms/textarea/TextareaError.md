```jsx
import { Textarea } from "components/ui";

const TextareaError = () => {
  return (
    <div className="max-w-xl">
      <Textarea
        placeholder="Enter text"
        label="With Error"
        error="This is error message"
        rows="5"
      />
    </div>
  );
};

export { TextareaError };
```