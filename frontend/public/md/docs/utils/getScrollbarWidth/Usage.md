```jsx
import { getScrollbarWidth } from "utils/dom/getScrollbarWidth";

export function Usage() {
  const scrollbarWidth = getScrollbarWidth();

  return (
    <div>
      The scrollbar width: <span className="font-bold">{scrollbarWidth}px</span>
    </div>
  );
}
```