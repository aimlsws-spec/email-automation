```jsx
// Import Dependencies
import TextareaAutosize from "react-textarea-autosize";

// Local Imports
import { Textarea } from "components/ui";

// ----------------------------------------------------------------------

const Polymorphic = () => {
  return (
    <div className="max-w-xl">
      <Textarea
        placeholder="Enter text"
        label="Autosize Textarea"
        component={TextareaAutosize}
        minRows={4}
      />
      <Textarea
        classNames={{
          root: "mt-4",
        }}
        placeholder="Enter text"
        label="Autosize textarea with max rows"
        unstyled
        className="rounded-lg bg-gray-150 px-3 py-2 placeholder:font-light placeholder:text-gray-600 dark:placeholder:text-dark-200 focus:ring focus:ring-primary-500/50 dark:bg-dark-900"
        component={TextareaAutosize}
        minRows={4}
        maxRows={12}
      />
    </div>
  );
};

export { Polymorphic };
```