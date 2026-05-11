```jsx
// Import Dependencies
import { useState } from "react";

// Local Imports
import { Button } from "components/ui";
import { useIsomorphicEffect } from "hooks";
import {
  injectStyles,
  insertStylesToHead,
  makeStyleTag,
  removeStylesFromHead,
} from "utils/dom/injectStylesToHead";

// ----------------------------------------------------------------------

const css = `
.custom-inject-style {
    animation: customScaleRotate 3s infinite ease-in-out, customColorChange 3s infinite linear;
}
@keyframes customScaleRotate {
    0% {
        transform: scale(1) rotate(0deg);
    }
    25% {
        transform: scale(1.2) rotate(45deg);
    }
    50% {
        transform: scale(1) rotate(90deg);
    }
    75% {
        transform: scale(1.2) rotate(135deg);
    }
    100% {
        transform: scale(1) rotate(180deg);
    }
}
@keyframes customColorChange {
    0% {
        background-color: #3498db;
    }
    25% {
        background-color: #e74c3c;
    }
    50% {
        background-color: #2ecc71;
    }
    75% {
        background-color: #f1c40f;
    }
    100% {
        background-color: #3498db;
    }
}            
`;

export function Usage() {
  const [append, setAppend] = useState(false);

  useIsomorphicEffect(() => {
    if (!append) return;

    const sheet = makeStyleTag();

    injectStyles(sheet, css);
    insertStylesToHead(sheet);

    return () => removeStylesFromHead(sheet);
  }, [append]);

  return (
    <div>
      <div className="custom-inject-style size-24 rounded-lg bg-primary-500" />
      <Button onClick={() => setAppend((val) => !val)} className="mt-4">
        {append ? "Remove" : "Inject"}
      </Button>
    </div>
  );
}
```