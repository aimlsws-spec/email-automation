```jsx
import { TextEditor } from "components/shared/form/TextEditor";
import { htmlToDelta } from "utils/quillUtils";

const html = `<p>Only <em>italic</em> is allowed. <strong>Bold</strong> is not.</p>`;

const ConvertHtmlToDelta = () => {
  return (
    <div className="max-w-xl">
      <TextEditor
        defaultValue={htmlToDelta(html)}
        placeholder="Enter your content here..."
      />
    </div>
  );
};

export { ConvertHtmlToDelta };
```