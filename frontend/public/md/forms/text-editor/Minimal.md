```jsx
import { TextEditor } from "components/shared/form/TextEditor";

const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { header: 1 },
      { background: [] },
    ],
  ],
};

const Minimal = () => {
  return (
    <div className="max-w-xl">
      <TextEditor placeholder="Enter your content..." modules={modules} />
    </div>
  );
};

export { Minimal };
```