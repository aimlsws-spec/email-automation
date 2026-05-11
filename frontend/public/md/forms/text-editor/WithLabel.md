```jsx
import { TextEditor } from "components/shared/form/TextEditor";

const WithLabel = () => {
  return (
    <div className="max-w-xl">
      <TextEditor
        label="Enter Content Here"
        placeholder="Enter your content here..."
      />
    </div>
  );
};

export { WithLabel };
```