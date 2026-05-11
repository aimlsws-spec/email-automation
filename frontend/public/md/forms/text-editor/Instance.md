```jsx
// Import Dependencies
import { useEffect, useRef, useState } from "react";

// Local Imports
import { TextEditor } from "components/shared/form/TextEditor";

// ----------------------------------------------------------------------

const Instance = () => {
  const [wordLength, setWordLength] = useState(0);
  const ref = useRef();

  useEffect(() => {
    const ql = ref.current?.getQuillInstance();

    const calc = () => {
      const trimmed = ql.getText().trim();
      setWordLength(trimmed.length > 0 ? trimmed.split(/\s+/).length : 0);
    };

    ql.on("text-change", calc);

    return () => ql.off("text-change", calc);
  }, []);

  return (
    <div className="max-w-xl">
      <TextEditor ref={ref} placeholder="Enter your content here..." />
      <p className="mt-1 text-end text-xs">{wordLength} Words</p>
    </div>
  );
};

export { Instance };
```