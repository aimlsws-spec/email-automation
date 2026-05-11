```jsx
import { TextEditor } from "components/shared/form/TextEditor";

const Error = () => {
  return (
    <div className="max-w-xl">
      <TextEditor
        placeholder="Enter your content here..."
        error="Something went wrong"
      />
    </div>
  );
};

export { Error };
```